"use client";

import { useState } from "react";
import { regulatorDecrypt, type DecryptResult } from "@/lib/zkp/aggregate";
import { Button } from "@/components/ui/button";

export default function RegulatorPanel({ passportIdentifier }: { passportIdentifier: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DecryptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      setResult(await regulatorDecrypt(passportIdentifier));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h3 className="font-semibold">Regulator Decryption</h3>
      <p className="text-sm text-muted-foreground">
        Decrypt the aggregate for {passportIdentifier} to compute the average across contributors.
      </p>
      <Button onClick={run} disabled={loading}>
        {loading ? "Running..." : "Decrypt aggregate"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result?.suppressed && (
        <p className="text-sm text-amber-700">Suppressed — {result.reason} (count: {result.count}).</p>
      )}
      {result && !result.suppressed && (
        <div className="text-sm space-y-1">
          <p>Contributors: {result.count}</p>
          <p>Element: {result.element}</p>
          <p className="font-medium">Average: {result.average_pct}%</p>
        </div>
      )}
    </div>
  );
}
