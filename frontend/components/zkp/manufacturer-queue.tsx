"use client";

import { useEffect, useRef, useState } from "react";
import { getCurrentUser } from "@/lib/api/auth";
import { joinPeersChannel, leavePeersChannel } from "@/lib/zkp/presence";
import { acceptOffer, listenForOffers, type ManufacturerSession, type StatusKind } from "@/lib/zkp/webrtc";
import { generateProof, randomSalt } from "@/lib/zkp/groth16";
import { getHePublicKeyHex, paillierEncrypt } from "@/lib/zkp/paillier";
import { submitLedger } from "@/lib/zkp/ledger";
import type { DataChannelMessage } from "@/lib/zkp/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface QueueSession {
  key: string; // `${recyclerUid}:${requestId}` — distinct per request, so a
  // completed/stale request never blocks a later one from the same Recycler.
  recyclerUid: string;
  recyclerName: string;
  status: string;
  statusKind: StatusKind;
  passportId?: string;
  element?: string;
  operator?: "gt" | "lt";
  threshold?: number;
  actualValue: string;
  proofGenerated: boolean;
  submitted: boolean;
  ackReceived: boolean;
  session: ManufacturerSession | null;
  proof?: Record<string, unknown>;
  publicSignals?: string[];
  commitment?: string;
  salt?: string;
  payload2?: string;
}

const STATUS_COLOR: Record<StatusKind, string> = {
  info: "text-blue-600",
  ok: "text-green-600",
  warn: "text-amber-600",
  err: "text-red-600",
};

export default function ManufacturerQueue() {
  const [sessions, setSessions] = useState<Record<string, QueueSession>>({});
  const sessionsRef = useRef(sessions);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  function updateSession(key: string, patch: Partial<QueueSession>) {
    setSessions((prev) => (prev[key] ? { ...prev, [key]: { ...prev[key], ...patch } } : prev));
  }

  // Only actually tears the connection down once both conditions the Prof asked for
  // are met: the Recycler's ack has arrived, and ledger submission has completed.
  function maybeCloseSession(key: string) {
    const s = sessionsRef.current[key];
    if (!s?.session || !s.ackReceived || !s.submitted) return;
    s.session.markComplete();
    s.session.close();
  }

  useEffect(() => {
    let presenceChannel: ReturnType<typeof joinPeersChannel> | null = null;
    let offerListener: { close: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const user = await getCurrentUser();
      if (cancelled) return;

      presenceChannel = joinPeersChannel(
        { supabaseUid: user.id, email: user.email, role: "MANUFACTURER", status: "online" },
        () => {},
      );

      offerListener = listenForOffers({
        myUid: user.id,
        onOffer: (offer) => {
          const key = `${offer.recyclerUid}:${offer.requestId}`;

          setSessions((prev) => {
            if (prev[key]) return prev;
            return {
              ...prev,
              [key]: {
                key,
                recyclerUid: offer.recyclerUid,
                recyclerName: offer.recyclerName,
                status: "Establishing WebRTC connection...",
                statusKind: "info",
                actualValue: "",
                proofGenerated: false,
                submitted: false,
                ackReceived: false,
                session: null,
              },
            };
          });

          acceptOffer({
            myUid: user.id,
            recyclerUid: offer.recyclerUid,
            offerSdp: offer.sdp,
            requestId: offer.requestId,
            onStatus: (text, kind) => updateSession(key, { status: text, statusKind: kind }),
            onMessage: (msg: DataChannelMessage) => {
              if (msg.type === "zkp_request") {
                updateSession(key, {
                  passportId: msg.passport_id,
                  element: msg.element,
                  operator: msg.operator,
                  threshold: msg.threshold,
                  status: "Request received — enter value and generate proof.",
                  statusKind: "warn",
                });
              } else if (msg.type === "zkp_result_ack") {
                updateSession(key, {
                  ackReceived: true,
                  status: msg.success
                    ? "Recycler verified the proof. Submit to auditor ledger."
                    : "Recycler could not verify the proof.",
                  statusKind: msg.success ? "ok" : "warn",
                });
                maybeCloseSession(key);
              }
            },
            onChannelOpen: (session) => {
              updateSession(key, {
                session,
                status: "Channel open — waiting for ZKP request...",
                statusKind: "ok",
              });
            },
          });
        },
      });
    })();

    return () => {
      cancelled = true;
      offerListener?.close();
      if (presenceChannel) leavePeersChannel(presenceChannel);
    };
  }, []);

  async function handleGenerateProof(key: string) {
    const s = sessionsRef.current[key];
    if (!s?.session || s.threshold === undefined || !s.element || !s.operator) return;
    const val = parseFloat(s.actualValue);
    if (isNaN(val)) {
      updateSession(key, { status: "Enter the actual element percentage first.", statusKind: "err" });
      return;
    }

    updateSession(key, { status: "Generating Groth16 ZK proof in browser...", statusKind: "info" });

    try {
      const valueScaled = Math.round(val * 10);
      const thresholdScaled = Math.round(s.threshold * 10);
      const salt = randomSalt();

      const { proof, publicSignals } = await generateProof({
        valueScaled,
        salt,
        thresholdScaled,
        isGt: s.operator === "gt",
      });

      const payload2 = paillierEncrypt(valueScaled, getHePublicKeyHex());

      s.session.send({ type: "zkp_result", proof, publicSignals });

      updateSession(key, {
        proof,
        publicSignals,
        commitment: publicSignals[1],
        salt,
        payload2,
        proofGenerated: true,
        status: "Proof sent to recycler. Awaiting verification...",
        statusKind: "ok",
      });
    } catch (error) {
      updateSession(key, { status: `Error: ${(error as Error).message}`, statusKind: "err" });
    }
  }

  async function handleSubmitToLedger(key: string) {
    const s = sessionsRef.current[key];
    if (
      !s?.passportId ||
      !s.proof ||
      !s.publicSignals ||
      !s.commitment ||
      !s.salt ||
      !s.payload2 ||
      !s.element ||
      !s.operator ||
      s.threshold === undefined
    ) {
      return;
    }

    try {
      const result = await submitLedger({
        passport_id: s.passportId,
        recycler_uid: s.recyclerUid,
        element: s.element,
        operator: s.operator,
        threshold: s.threshold,
        commitment: s.commitment,
        salt: s.salt,
        payload_2: s.payload2,
        zk_proof: s.proof,
        public_signals: s.publicSignals,
      });
      updateSession(key, {
        submitted: true,
        status: `Submitted to ledger (entry #${result.id}, zk_valid: ${result.zk_valid}). Session complete.`,
        statusKind: "ok",
      });
      maybeCloseSession(key);
    } catch (error) {
      updateSession(key, { status: `Ledger error: ${(error as Error).message}`, statusKind: "err" });
    }
  }

  const sessionList = Object.values(sessions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming ZKP requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessionList.length === 0 && (
          <p className="text-sm text-muted-foreground">No active requests. Standing by.</p>
        )}

        {sessionList.map((s) => (
          <div key={s.key} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {s.recyclerName} <Badge variant="outline" className="ml-2">RECYCLER</Badge>
              </span>
            </div>

            <p className={`text-sm ${STATUS_COLOR[s.statusKind]}`}>{s.status}</p>

            {s.passportId && (
              <div className="text-sm space-y-1">
                <p>Passport: <span className="font-mono">{s.passportId}</span></p>
                <p>Element: {s.element}</p>
                <p>Condition: {s.operator === "gt" ? "Greater than (>)" : "Less than (<)"}</p>
                <p>Threshold: {s.threshold}%</p>
              </div>
            )}

            {s.passportId && !s.proofGenerated && (
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Actual element value (%)"
                  value={s.actualValue}
                  onChange={(e) => updateSession(s.key, { actualValue: e.target.value })}
                />
                <Button onClick={() => handleGenerateProof(s.key)}>Generate & send proof</Button>
              </div>
            )}

            {s.proofGenerated && !s.submitted && (
              <Button onClick={() => handleSubmitToLedger(s.key)}>Submit to ledger</Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
