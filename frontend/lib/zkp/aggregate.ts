// Auditor aggregation / regulator decryption — thin wrappers around the
// auditor-aggregate / regulator-decrypt Edge Functions.
import { createClient } from "@/lib/supabase/client";

export interface AggregateResult {
  suppressed: boolean;
  reason?: string;
  count: number;
  passport_id?: string;
  encrypted_sum?: string;
}

export interface DecryptResult {
  suppressed: boolean;
  reason?: string;
  count: number;
  passport_id?: string;
  total_scaled?: number;
  average_pct?: number;
  element?: string | null;
}

export async function auditorAggregate(passportId: string): Promise<AggregateResult> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke(
    `auditor-aggregate/${encodeURIComponent(passportId)}`,
    { method: "GET" },
  );
  if (error) throw error;
  return data;
}

export async function regulatorDecrypt(passportId: string): Promise<DecryptResult> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke(
    `regulator-decrypt/${encodeURIComponent(passportId)}`,
    { method: "GET" },
  );
  if (error) throw error;
  return data;
}
