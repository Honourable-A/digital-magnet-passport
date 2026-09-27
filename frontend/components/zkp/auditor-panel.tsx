"use client";

import { useState } from "react";
import { auditorAggregate, type AggregateResult } from "@/lib/zkp/aggregate";
import { Button } from "@/components/ui/button";

export default function AuditorPanel({ passportIdentifier }: { passportIdentifier: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AggregateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      setResult(await auditorAggregate(passportIdentifier));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h3 className="font-semibold">Auditor Aggregation</h3>
      <p className="text-sm text-muted-foreground">
        Homomorphically sum all recycler-submitted values for {passportIdentifier} without decrypting them.
      </p>
      <Button onClick={run} disabled={loading}>
        {loading ? "Running..." : "Run aggregate"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result?.suppressed && (
        <p className="text-sm text-amber-700">Suppressed — {result.reason} (count: {result.count}).</p>
      )}
      {result && !result.suppressed && (
        <div className="text-sm space-y-1">
          <p>Contributors: {result.count}</p>
          <p className="font-mono text-xs break-all">Encrypted sum: {result.encrypted_sum}</p>
        </div>
      )}
    </div>
  );
}
