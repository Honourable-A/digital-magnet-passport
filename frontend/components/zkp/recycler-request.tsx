"use client";

import { useEffect, useRef, useState } from "react";
import { getCurrentUser } from "@/lib/api/auth";
import { joinPeersChannel, leavePeersChannel } from "@/lib/zkp/presence";
import { startRecyclerSession, type RecyclerSessionHandle, type StatusKind } from "@/lib/zkp/webrtc";
import { verifyProof } from "@/lib/zkp/groth16";
import { flagTampered, getLedgerEntries } from "@/lib/zkp/ledger";
import type { LedgerEntry, PresencePeer } from "@/lib/zkp/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_COLOR: Record<StatusKind, string> = {
  info: "text-blue-600",
  ok: "text-green-600",
  warn: "text-amber-600",
  err: "text-red-600",
};

// publicSignals[0] is the circuit's actual claim result ("was the threshold met"),
// distinct from zk_valid (whether the *proof itself* is cryptographically sound). It's
// only meaningful when the proof checks out — an invalid or tampered proof carries no
// guarantee that publicSignals[0] reflects anything real, so it's not shown for those.
function claimResult(entry: LedgerEntry): boolean | null {
  if (entry.tampered || entry.zk_valid !== true) return null;
  return entry.public_signals?.[0] === "1";
}

interface RequestResult {
  ok: boolean;
  mismatch?: boolean;
  claimMet?: boolean;
  commitment?: string;
}

export default function RecyclerRequest({ passportIdentifier }: { passportIdentifier: string }) {
  const [me, setMe] = useState<{ id: string; email: string } | null>(null);
  const [peers, setPeers] = useState<PresencePeer[]>([]);
  const [targetUid, setTargetUid] = useState<string>("");
  const [element, setElement] = useState("Nd");
  const [operator, setOperator] = useState<"gt" | "lt">("gt");
  const [threshold, setThreshold] = useState("20");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ text: string; kind: StatusKind } | null>(null);
  const [result, setResult] = useState<RequestResult | null>(null);
  const [ledgerResult, setLedgerResult] = useState<string | null>(null);
  const [checkingLedger, setCheckingLedger] = useState(false);
  const [history, setHistory] = useState<LedgerEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const presenceChannelRef = useRef<ReturnType<typeof joinPeersChannel> | null>(null);
  const sessionRef = useRef<RecyclerSessionHandle | null>(null);
  const receivedRef = useRef<{ commitment: string; proof: Record<string, unknown> } | null>(null);
  const meRef = useRef<{ id: string; email: string } | null>(null);

  // The visible record of past requests the Prof's feedback asked for — backed by
  // ledger_entry (the durable record every submission already writes to), scoped to
  // this Recycler's own submissions for this passport, so it survives reloads instead
  // of living only in transient component state.
  async function loadHistory() {
    if (!meRef.current) return;
    setHistoryLoading(true);
    try {
      const entries = await getLedgerEntries(passportIdentifier);
      setHistory(entries.filter((e) => e.recycler_uid === meRef.current!.id));
    } catch {
      // leave history as-is — this is a convenience list, not critical path
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const user = await getCurrentUser();
      if (cancelled) return;
      setMe({ id: user.id, email: user.email });
      meRef.current = { id: user.id, email: user.email };

      presenceChannelRef.current = joinPeersChannel(
        { supabaseUid: user.id, email: user.email, role: "RECYCLER", status: "online" },
        (allPeers) => setPeers(allPeers.filter((p) => p.role === "MANUFACTURER")),
      );

      loadHistory();
    })();

    return () => {
      cancelled = true;
      sessionRef.current?.close();
      if (presenceChannelRef.current) leavePeersChannel(presenceChannelRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passportIdentifier]);

  async function handleSend() {
    if (!me || !targetUid) return;
    const thresholdNum = parseFloat(threshold);
    if (isNaN(thresholdNum)) {
      setStatus({ text: "Enter a valid threshold.", kind: "err" });
      return;
    }

    setSending(true);
    setResult(null);
    setLedgerResult(null);
    setStatus({ text: "Connecting...", kind: "info" });

    const request = {
      type: "zkp_request" as const,
      passport_id: passportIdentifier,
      element,
      operator,
      threshold: thresholdNum,
    };

    sessionRef.current = startRecyclerSession({
      myUid: me.id,
      myEmail: me.email,
      targetUid,
      request,
      onStatus: (text, kind) => setStatus({ text, kind }),
      onMessage: async (msg) => {
        if (msg.type !== "zkp_result") return;
        setStatus({ text: "Verifying ZK proof...", kind: "info" });

        // Mark complete the instant the payload arrives, not after verification
        // finishes. Verification involves loading the snarkjs wasm and running the
        // actual Groth16 check, which can take a real amount of time — if a transient
        // ICE hiccup happened during that window, the connection-state handler would
        // still have reported it as a hard failure, since expectedClose was only set
        // afterward. The data has already done its job once it's received; anything
        // that happens to the transport after that is no longer our concern.
        sessionRef.current?.markComplete();

        // Sent regardless of the verification outcome — it means "I finished
        // processing your result", not "the claim was true". The Manufacturer
        // waits for this (plus its own ledger submission) before closing, so the
        // connection is never torn down mid-exchange from our side.
        let success = false;
        try {
          const ok = await verifyProof(msg.publicSignals, msg.proof);
          if (!ok) {
            setStatus({ text: "Proof failed cryptographic verification.", kind: "err" });
            setResult({ ok: false });
            return;
          }

          const expectedThreshold = String(Math.round(thresholdNum * 10));
          const expectedIsGt = operator === "gt" ? "1" : "0";
          if (msg.publicSignals[2] !== expectedThreshold || msg.publicSignals[3] !== expectedIsGt) {
            setStatus({ text: "Proof parameters mismatch.", kind: "err" });
            setResult({ ok: false, mismatch: true });
            return;
          }

          const claimMet = msg.publicSignals[0] === "1";
          const commitment = msg.publicSignals[1];
          receivedRef.current = { commitment, proof: msg.proof };
          success = true;
          setStatus({
            text: claimMet ? "Proof verified — claim satisfied." : "Proof verified — claim not met.",
            kind: claimMet ? "ok" : "warn",
          });
          setResult({ ok: true, claimMet, commitment });
        } catch (error) {
          setStatus({ text: `Verification error: ${(error as Error).message}`, kind: "err" });
        } finally {
          sessionRef.current?.send({ type: "zkp_result_ack", success });
          setSending(false);
          loadHistory();
        }
      },
    });
  }

  async function handleCheckLedger() {
    if (!targetUid || !receivedRef.current) return;
    setCheckingLedger(true);
    setLedgerResult(null);

    try {
      const entries = await getLedgerEntries(passportIdentifier, targetUid);
      if (entries.length === 0) {
        setLedgerResult("No ledger entry found for this passport.");
        return;
      }
      const entry = entries[0];
      const commitmentMatches = entry.commitment === receivedRef.current.commitment;
      const proofMatches = JSON.stringify(entry.zk_proof) === JSON.stringify(receivedRef.current.proof);
      const allPass = commitmentMatches && proofMatches;

      if (!allPass) {
        await flagTampered(entry.id);
        setLedgerResult(
          `Tamper detected — commitment ${commitmentMatches ? "matches" : "MISMATCH"}, proof ${
            proofMatches ? "matches" : "MISMATCH"
          }. Entry flagged as tampered.`,
        );
      } else {
        setLedgerResult("Ledger consistent — commitment and proof match what was received over WebRTC.");
      }
    } catch (error) {
      setLedgerResult(`Error: ${(error as Error).message}`);
    } finally {
      setCheckingLedger(false);
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div>
        <h3 className="font-semibold">ZKP Verification</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Request a privacy-preserving verification proof for this passport.{" "}
          <span className="font-medium">{passportIdentifier}</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Manufacturer</label>
          <Select value={targetUid} onValueChange={setTargetUid}>
            <SelectTrigger>
              <SelectValue placeholder={peers.length ? "Select a manufacturer" : "No manufacturers online"} />
            </SelectTrigger>
            <SelectContent>
              {peers.map((p) => (
                <SelectItem key={p.supabaseUid} value={p.supabaseUid}>
                  {p.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Element</label>
          <Select value={element} onValueChange={setElement}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Nd", "Pr", "Dy", "Tb"].map((el) => (
                <SelectItem key={el} value={el}>
                  {el}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Condition</label>
          <Select value={operator} onValueChange={(v) => setOperator(v as "gt" | "lt")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gt">Greater than (&gt;)</SelectItem>
              <SelectItem value="lt">Less than (&lt;)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Threshold (%)</label>
          <Input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
        </div>
      </div>

      <Button onClick={handleSend} disabled={sending || !targetUid}>
        {sending ? "Sending Request..." : "Request ZKP Verification"}
      </Button>

      {status && <p className={`text-sm ${STATUS_COLOR[status.kind]}`}>{status.text}</p>}

      {result && (
        <div className="rounded-lg border p-3 space-y-2">
          {!result.ok ? (
            <p className="text-sm text-amber-700">
              {result.mismatch ? "Parameters do not match the request." : "Proof failed cryptographic verification."}
            </p>
          ) : (
            <>
              <p className={`text-sm font-medium ${result.claimMet ? "text-green-700" : "text-red-700"}`}>
                {result.claimMet ? "Claim verified" : "Claim not met"}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                Commitment: {result.commitment?.slice(0, 20)}…
              </p>
              <Button variant="outline" size="sm" onClick={handleCheckLedger} disabled={checkingLedger}>
                {checkingLedger ? "Checking..." : "Check ledger consistency"}
              </Button>
              {ledgerResult && <p className="text-sm">{ledgerResult}</p>}
            </>
          )}
        </div>
      )}

      <div className="space-y-2 border-t pt-4">
        <h4 className="text-sm font-medium">Your verification requests for this passport</h4>
        {historyLoading && <p className="text-sm text-muted-foreground">Loading history...</p>}
        {!historyLoading && history.length === 0 && (
          <p className="text-sm text-muted-foreground">No requests yet.</p>
        )}
        {!historyLoading && history.length > 0 && (
          <div className="space-y-2">
            {history.map((entry) => {
              const met = claimResult(entry);
              return (
                <div key={entry.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <span>
                    {entry.element} {entry.operator === "gt" ? ">" : "<"} {entry.threshold}% —{" "}
                    {new Date(entry.submitted_at).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-2">
                    {met !== null && (
                      <span className={met ? "font-medium text-green-700" : "font-medium text-amber-700"}>
                        {met ? "Claim satisfied" : "Claim not met"}
                      </span>
                    )}
                    <span
                      className={
                        entry.tampered
                          ? "font-medium text-red-700"
                          : entry.zk_valid === true
                            ? "font-medium text-green-700"
                            : entry.zk_valid === false
                              ? "font-medium text-red-700"
                              : "text-muted-foreground"
                      }
                    >
                      {entry.tampered ? "Tampered" : entry.zk_valid === null ? "Pending" : entry.zk_valid ? "Verified" : "Invalid"}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
