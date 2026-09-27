// WebRTC session orchestration for both roles, ported from static/zkp_queue.html's
// initRecycler()/handleOffer() logic onto Supabase Realtime Broadcast signalling
// (see signal.ts) instead of the raw WebSocket relay.
import { closeSignalChannel, openSignalChannel, sendSignal } from "./signal";
import type { DataChannelMessage, SignalMessage } from "./types";

export const ICE_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export type StatusKind = "info" | "ok" | "warn" | "err";

function sendDataChannelMessage(dc: RTCDataChannel, msg: DataChannelMessage) {
  dc.send(JSON.stringify(msg));
}

// -- RECYCLER (initiator) --------------------------------------------------------

export interface RecyclerSessionHandle {
  close: () => void;
}

export function startRecyclerSession(opts: {
  myUid: string;
  myEmail: string;
  targetUid: string;
  request: DataChannelMessage;
  onStatus: (text: string, kind: StatusKind) => void;
  onMessage: (msg: DataChannelMessage) => void;
}): RecyclerSessionHandle {
  const { myUid, myEmail, targetUid, request, onStatus, onMessage } = opts;
  const pc = new RTCPeerConnection(ICE_CONFIG);
  const dc = pc.createDataChannel("zkp");
  const sessionRoom = `${myUid}-${targetUid}`;

  let pendingCandidates: RTCIceCandidateInit[] = [];
  let answerReceived = false;

  const { channel: sessionChannel, ready: sessionReady } = openSignalChannel(
    sessionRoom,
    async (msg: SignalMessage) => {
      if (msg.type === "zkp_answer") {
        await pc.setRemoteDescription({ type: "answer", sdp: msg.sdp });
        answerReceived = true;
        for (const candidate of pendingCandidates) {
          sendSignal(sessionChannel, { type: "ice_candidate", candidate });
        }
        pendingCandidates = [];
        onStatus("Establishing direct P2P connection...", "info");
      } else if (msg.type === "ice_candidate") {
        try {
          await pc.addIceCandidate(msg.candidate);
        } catch {
          // ignore stray/duplicate candidates
        }
      }
    },
  );

  pc.onicecandidate = (evt) => {
    if (!evt.candidate) return;
    const candidate = evt.candidate.toJSON();
    if (answerReceived) {
      sendSignal(sessionChannel, { type: "ice_candidate", candidate });
    } else {
      pendingCandidates.push(candidate);
    }
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === "failed") onStatus("WebRTC connection failed.", "err");
  };

  dc.onopen = () => {
    onStatus("Channel open — sending ZKP request...", "ok");
    sendDataChannelMessage(dc, request);
    onStatus("Awaiting ZK proof from manufacturer...", "warn");
  };
  dc.onmessage = (evt) => {
    try {
      onMessage(JSON.parse(evt.data));
    } catch {
      // ignore malformed frames
    }
  };
  dc.onerror = () => onStatus("Data channel error.", "err");

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
    });
    setTimeout(() => closeSignalChannel(notifChannel), 400);
    onStatus("Offer sent — waiting for manufacturer...", "warn");
  })();

  return {
    close: () => {
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
}

export function listenForOffers(opts: {
  myUid: string;
  onOffer: (offer: IncomingOffer) => void;
}): { close: () => void } {
  const { channel } = openSignalChannel(opts.myUid, (msg) => {
    if (msg.type === "zkp_offer") {
      opts.onOffer({ recyclerUid: msg.recycler_uid, recyclerName: msg.recycler_name, sdp: msg.sdp });
    }
  });
  return { close: () => closeSignalChannel(channel) };
}

export interface ManufacturerSession {
  send: (msg: DataChannelMessage) => void;
  close: () => void;
}

export function acceptOffer(opts: {
  myUid: string;
  recyclerUid: string;
  offerSdp: string;
  onStatus: (text: string, kind: StatusKind) => void;
  onMessage: (msg: DataChannelMessage) => void;
  onChannelOpen: (session: ManufacturerSession) => void;
}) {
  const { myUid, recyclerUid, offerSdp, onStatus, onMessage, onChannelOpen } = opts;
  const pc = new RTCPeerConnection(ICE_CONFIG);
  const sessionRoom = `${recyclerUid}-${myUid}`;

  let pendingCandidates: RTCIceCandidateInit[] = [];
  let wsReady = false;
  let answerSdp: string | null = null;

  const { channel: sessionChannel, ready: sessionReady } = openSignalChannel(
    sessionRoom,
    async (msg: SignalMessage) => {
      if (msg.type === "ice_candidate") {
        try {
          await pc.addIceCandidate(msg.candidate);
        } catch {
          // ignore stray/duplicate candidates
        }
      }
    },
  );

  function flushSignalling() {
    sendSignal(sessionChannel, { type: "zkp_answer", sdp: answerSdp! });
    for (const candidate of pendingCandidates) {
      sendSignal(sessionChannel, { type: "ice_candidate", candidate });
    }
    pendingCandidates = [];
  }

  sessionReady.then(() => {
    wsReady = true;
    if (answerSdp) flushSignalling();
  });

  pc.onicecandidate = (evt) => {
    if (!evt.candidate) return;
    const candidate = evt.candidate.toJSON();
    if (wsReady) sendSignal(sessionChannel, { type: "ice_candidate", candidate });
    else pendingCandidates.push(candidate);
  };

  pc.onconnectionstatechange = () => {
    const state = pc.connectionState;
    if (state === "connected") onStatus("WebRTC connected — waiting for data channel...", "ok");
    if (state === "failed") onStatus("WebRTC connection failed.", "err");
  };

  pc.ondatachannel = (evt) => {
    const dc = evt.channel;
    dc.onopen = () => {
      closeSignalChannel(sessionChannel);
      onStatus("Channel open — waiting for ZKP request...", "ok");
      onChannelOpen({
        send: (msg) => sendDataChannelMessage(dc, msg),
        close: () => {
          try {
            dc.close();
          } catch {
            // already closed
          }
        },
      });
    };
    dc.onmessage = (evt2) => {
      try {
        onMessage(JSON.parse(evt2.data));
      } catch {
        // ignore malformed frames
      }
    };
    dc.onerror = () => onStatus("Data channel error.", "err");
  };

  (async () => {
    await pc.setRemoteDescription({ type: "offer", sdp: offerSdp });
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    answerSdp = answer.sdp!;
    if (wsReady) flushSignalling();
  })();

  return {
    close: () => {
      try {
        pc.close();
      } catch {
        // already closed
      }
      closeSignalChannel(sessionChannel);
    },
  };
}
