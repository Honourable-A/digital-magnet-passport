// WebRTC session orchestration for both roles, ported from static/zkp_queue.html's
// initRecycler()/handleOffer() logic onto Supabase Realtime Broadcast signalling
// (see signal.ts) instead of the raw WebSocket relay.
//
// Session lifecycle notes (fixed after a live bug report — "Data channel error" /
// "WebRTC connection failed" showing up on the Manufacturer side even after a
// successful proof exchange):
//   - The Recycler used to close its RTCPeerConnection the instant it received
//     zkp_result, before even verifying it. That abrupt close is what made the
//     Manufacturer's connection look like a failure. Fixed: the Recycler now sends a
//     zkp_result_ack after processing the result, and never force-closes; the
//     Manufacturer is the one that closes, only after receiving that ack AND
//     completing ledger submission.
//   - The Manufacturer used to close the signalling channel the moment the data
//     channel opened. TURN/relay candidates typically finish gathering later than
//     host/STUN candidates, so any that arrived after that point were silently
//     dropped — if the initial (non-relay) path later broke, there was no fallback
//     candidate registered at all. Fixed: the signalling channel now stays open for
//     the life of the session.
//   - Every session now gets its own request_id, embedded in the room name and every
//     signalling/data-channel message, so a stale message from an earlier or
//     concurrent request between the same two peers can never be misapplied.
//   - Incoming ICE candidates are queued until setRemoteDescription() has completed
//     on that peer, instead of being attempted (and silently dropped on failure)
//     immediately.
import { closeSignalChannel, openSignalChannel, sendSignal } from "./signal";
import type { DataChannelMessage, DistributiveOmit, SignalMessage } from "./types";

// STUN-only will fail across restrictive NATs, some university networks, and VPNs.
// A TURN relay is the real fix for that, but requires an actual TURN service (e.g.
// Cloudflare Realtime/Calls, Twilio, metered.ca, or a self-hosted coturn) — not
// something that can be conjured without credentials. Wired up here so it activates
// automatically the moment those env vars are set, no further code changes needed.
const TURN_URL = process.env.NEXT_PUBLIC_TURN_URL;
const TURN_USERNAME = process.env.NEXT_PUBLIC_TURN_USERNAME;
const TURN_CREDENTIAL = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

export const ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    ...(TURN_URL
      ? [{ urls: TURN_URL, username: TURN_USERNAME, credential: TURN_CREDENTIAL }]
      : []),
  ],
};

export type StatusKind = "info" | "ok" | "warn" | "err";

function sendDataChannelMessage(dc: RTCDataChannel, msg: DataChannelMessage) {
  dc.send(JSON.stringify(msg));
}

function logState(tag: string, pc: RTCPeerConnection, dc?: RTCDataChannel | null) {
  console.debug(
    `[zkp-webrtc:${tag}] connectionState=${pc.connectionState} iceConnectionState=${pc.iceConnectionState} iceGatheringState=${pc.iceGatheringState} dataChannel.readyState=${dc?.readyState ?? "(none)"}`,
  );
}

// Buffers ICE candidates until the remote description has been set, then flushes —
// addIceCandidate() before that point either throws or silently no-ops depending on
// the browser, so candidates that arrive early must be held, not attempted.
class IceCandidateQueue {
  private queue: RTCIceCandidateInit[] = [];
  private remoteDescriptionSet = false;

  constructor(private pc: RTCPeerConnection) {}

  markRemoteDescriptionSet() {
    this.remoteDescriptionSet = true;
    const pending = this.queue;
    this.queue = [];
    for (const candidate of pending) {
      this.pc.addIceCandidate(candidate).catch(() => {
        // stray/duplicate candidate — safe to ignore
      });
    }
  }

  async add(candidate: RTCIceCandidateInit) {
    if (!this.remoteDescriptionSet) {
      this.queue.push(candidate);
      return;
    }
    try {
      await this.pc.addIceCandidate(candidate);
    } catch {
      // stray/duplicate candidate — safe to ignore
    }
  }
}

// -- RECYCLER (initiator) --------------------------------------------------------

export interface RecyclerSessionHandle {
  send: (msg: DistributiveOmit<DataChannelMessage, "request_id">) => void;
  // Suppresses further error/failure reporting from connection-state handlers —
  // call once the result has been processed and the ack sent, so the Manufacturer's
  // (or our own) subsequent, expected teardown isn't mistaken for a real failure.
  markComplete: () => void;
  close: () => void;
}

export function startRecyclerSession(opts: {
  myUid: string;
  myEmail: string;
  targetUid: string;
  request: Omit<Extract<DataChannelMessage, { type: "zkp_request" }>, "request_id">;
  onStatus: (text: string, kind: StatusKind) => void;
  onMessage: (msg: DataChannelMessage) => void;
}): RecyclerSessionHandle {
  const { myUid, myEmail, targetUid, request, onStatus, onMessage } = opts;
  const requestId = crypto.randomUUID();
  const pc = new RTCPeerConnection(ICE_CONFIG);
  const dc = pc.createDataChannel("zkp");
  const sessionRoom = `${myUid}-${targetUid}-${requestId}`;
  const iceQueue = new IceCandidateQueue(pc);

  let expectedClose = false;
  let pendingLocalCandidates: RTCIceCandidateInit[] = [];
  let answerReceived = false;

  const { channel: sessionChannel, ready: sessionReady } = openSignalChannel(
    sessionRoom,
    async (msg: SignalMessage) => {
      if (msg.request_id !== requestId) return; // stale/foreign message — ignore

      if (msg.type === "zkp_answer") {
        await pc.setRemoteDescription({ type: "answer", sdp: msg.sdp });
        iceQueue.markRemoteDescriptionSet();
        answerReceived = true;
        for (const candidate of pendingLocalCandidates) {
          sendSignal(sessionChannel, { type: "ice_candidate", candidate, request_id: requestId });
        }
        pendingLocalCandidates = [];
        onStatus("Establishing direct P2P connection...", "info");
      } else if (msg.type === "ice_candidate") {
        await iceQueue.add(msg.candidate);
      }
    },
  );

  pc.onicecandidate = (evt) => {
    if (!evt.candidate) return;
    const candidate = evt.candidate.toJSON();
    if (answerReceived) {
      sendSignal(sessionChannel, { type: "ice_candidate", candidate, request_id: requestId });
    } else {
      pendingLocalCandidates.push(candidate);
    }
  };

  pc.oniceconnectionstatechange = () => logState("recycler/ice", pc, dc);
  pc.onicegatheringstatechange = () => logState("recycler/gather", pc, dc);
  pc.onconnectionstatechange = () => {
    logState("recycler/conn", pc, dc);
    if (expectedClose) return;
    if (pc.connectionState === "failed") onStatus("WebRTC connection failed.", "err");
  };

  dc.onopen = () => {
    logState("recycler/dc-open", pc, dc);
    onStatus("Channel open — sending ZKP request...", "ok");
    sendDataChannelMessage(dc, { ...request, request_id: requestId });
    onStatus("Awaiting ZK proof from manufacturer...", "warn");
  };
  dc.onmessage = (evt) => {
    try {
      const msg = JSON.parse(evt.data) as DataChannelMessage;
      if (msg.request_id !== requestId) return; // stale/foreign message — ignore
      onMessage(msg);
    } catch {
      // ignore malformed frames
    }
  };
  dc.onerror = () => {
    logState("recycler/dc-error", pc, dc);
    if (!expectedClose) onStatus("Data channel error.", "err");
  };
  dc.onclose = () => {
    logState("recycler/dc-close", pc, dc);
    if (expectedClose) onStatus("Session complete.", "ok");
  };

  (async () => {
    await sessionReady;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const { channel: notifChannel, ready: notifReady } = openSignalChannel(targetUid, () => {});
    await notifReady;
    sendSignal(notifChannel, {
      type: "zkp_offer",
      recycler_uid: myUid,
      recycler_name: myEmail,
      sdp: offer.sdp!,
      request_id: requestId,
    });
    setTimeout(() => closeSignalChannel(notifChannel), 400);
    onStatus("Offer sent — waiting for manufacturer...", "warn");
  })();

  return {
    send: (msg) => sendDataChannelMessage(dc, { ...msg, request_id: requestId } as DataChannelMessage),
    markComplete: () => {
      expectedClose = true;
    },
    close: () => {
      expectedClose = true;
      try {
        dc.close();
      } catch {
        // already closed
      }
      try {
        pc.close();
      } catch {
        // already closed
      }
      closeSignalChannel(sessionChannel);
    },
  };
}

// -- MANUFACTURER (responder) -----------------------------------------------------

export interface IncomingOffer {
  recyclerUid: string;
  recyclerName: string;
  sdp: string;
  requestId: string;
}

export function listenForOffers(opts: {
  myUid: string;
  onOffer: (offer: IncomingOffer) => void;
}): { close: () => void } {
  const { channel } = openSignalChannel(opts.myUid, (msg) => {
    if (msg.type === "zkp_offer") {
      opts.onOffer({
        recyclerUid: msg.recycler_uid,
        recyclerName: msg.recycler_name,
        sdp: msg.sdp,
        requestId: msg.request_id,
      });
    }
  });
  return { close: () => closeSignalChannel(channel) };
}

export interface ManufacturerSession {
  send: (msg: DistributiveOmit<DataChannelMessage, "request_id">) => void;
  // Call once the ack has arrived AND ledger submission has completed — actually
  // tears down the connection. Safe to call multiple times / before both conditions
  // are met (it no-ops until markReady() has been called).
  close: () => void;
  markComplete: () => void;
}

export function acceptOffer(opts: {
  myUid: string;
  recyclerUid: string;
  offerSdp: string;
  requestId: string;
  onStatus: (text: string, kind: StatusKind) => void;
  onMessage: (msg: DataChannelMessage) => void;
  onChannelOpen: (session: ManufacturerSession) => void;
}) {
  const { myUid, recyclerUid, offerSdp, requestId, onStatus, onMessage, onChannelOpen } = opts;
  const pc = new RTCPeerConnection(ICE_CONFIG);
  const sessionRoom = `${recyclerUid}-${myUid}-${requestId}`;
  const iceQueue = new IceCandidateQueue(pc);

  let expectedClose = false;
  let pendingLocalCandidates: RTCIceCandidateInit[] = [];
  let wsReady = false;
  let answerSdp: string | null = null;

  const { channel: sessionChannel, ready: sessionReady } = openSignalChannel(
    sessionRoom,
    async (msg: SignalMessage) => {
      if (msg.request_id !== requestId) return; // stale/foreign message — ignore
      if (msg.type === "ice_candidate") {
        await iceQueue.add(msg.candidate);
      }
    },
  );

  function flushSignalling() {
    sendSignal(sessionChannel, { type: "zkp_answer", sdp: answerSdp!, request_id: requestId });
    for (const candidate of pendingLocalCandidates) {
      sendSignal(sessionChannel, { type: "ice_candidate", candidate, request_id: requestId });
    }
    pendingLocalCandidates = [];
  }

  sessionReady.then(() => {
    wsReady = true;
    if (answerSdp) flushSignalling();
  });

  pc.onicecandidate = (evt) => {
    if (!evt.candidate) return;
    const candidate = evt.candidate.toJSON();
    if (wsReady) sendSignal(sessionChannel, { type: "ice_candidate", candidate, request_id: requestId });
    else pendingLocalCandidates.push(candidate);
  };

  pc.oniceconnectionstatechange = () => logState("manufacturer/ice", pc);
  pc.onicegatheringstatechange = () => logState("manufacturer/gather", pc);
  pc.onconnectionstatechange = () => {
    logState("manufacturer/conn", pc);
    if (expectedClose) return;
    const state = pc.connectionState;
    if (state === "connected") onStatus("WebRTC connected — waiting for data channel...", "ok");
    if (state === "failed") onStatus("WebRTC connection failed.", "err");
  };

  pc.ondatachannel = (evt) => {
    const dc = evt.channel;

    // Note: the signalling channel deliberately stays open here (unlike earlier),
    // since TURN/relay candidates can still be gathering after the data channel
    // opens — closing signalling early meant those late candidates were dropped,
    // leaving no fallback path if the initial route later failed.
    dc.onopen = () => {
      logState("manufacturer/dc-open", pc, dc);
      onStatus("Channel open — waiting for ZKP request...", "ok");
      onChannelOpen({
        send: (msg) => sendDataChannelMessage(dc, { ...msg, request_id: requestId } as DataChannelMessage),
        markComplete: () => {
          expectedClose = true;
        },
        close: () => {
          expectedClose = true;
          try {
            dc.close();
          } catch {
            // already closed
          }
          try {
            pc.close();
          } catch {
            // already closed
          }
          closeSignalChannel(sessionChannel);
        },
      });
    };
    dc.onmessage = (evt2) => {
      try {
        const msg = JSON.parse(evt2.data) as DataChannelMessage;
        if (msg.request_id !== requestId) return; // stale/foreign message — ignore
        onMessage(msg);
      } catch {
        // ignore malformed frames
      }
    };
    dc.onerror = () => {
      logState("manufacturer/dc-error", pc, dc);
      if (!expectedClose) onStatus("Data channel error.", "err");
    };
    dc.onclose = () => {
      logState("manufacturer/dc-close", pc, dc);
      if (expectedClose) onStatus("Session complete.", "ok");
    };
  };

  (async () => {
    await pc.setRemoteDescription({ type: "offer", sdp: offerSdp });
    iceQueue.markRemoteDescriptionSet();
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    answerSdp = answer.sdp!;
    if (wsReady) flushSignalling();
  })();

  return {
    close: () => {
      expectedClose = true;
      try {
        pc.close();
      } catch {
        // already closed
      }
      closeSignalChannel(sessionChannel);
    },
  };
}
