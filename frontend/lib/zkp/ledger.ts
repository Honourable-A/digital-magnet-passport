// Ledger operations — submission goes through the submit-ledger Edge Function
// (server-side proof re-verification); reads/flag go straight to the table, gated by
// the RLS policies added in supabase/migrations/20260927000000_ledger_entry_uids_and_rls.sql.
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LedgerEntry } from "./types";

export interface SubmitLedgerInput {
  passport_id: string;
  recycler_uid: string;
  element: string;
  operator: "gt" | "lt";
  threshold: number;
  commitment: string;
  salt: string;
  payload_2: string;
  zk_proof: Record<string, unknown>;
  public_signals: string[];
}

export async function submitLedger(
  input: SubmitLedgerInput,
): Promise<{ id: number; submitted_at: string; zk_valid: boolean }> {
  const supabase = createClient() as SupabaseClient;
  const { data, error } = await supabase.functions.invoke("submit-ledger", {
    body: input,
  });
  if (error) throw error;
  return data;
}

export async function getLedgerEntries(
  passportId: string,
  manufacturerUid?: string,
): Promise<LedgerEntry[]> {
  const supabase = createClient() as SupabaseClient;
  let query = supabase
    .from("ledger_entry")
    .select(
      "id, passport_id, manufacturer_uid, recycler_uid, element, operator, threshold, commitment, payload_2, zk_proof, public_signals, zk_valid, tampered, submitted_at",
    )
    .eq("passport_id", passportId)
    .order("submitted_at", { ascending: false });

  if (manufacturerUid) {
    query = query.eq("manufacturer_uid", manufacturerUid);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    zk_proof: JSON.parse(row.zk_proof as string),
    public_signals: JSON.parse(row.public_signals as string),
  })) as LedgerEntry[];
}

export async function flagTampered(entryId: number): Promise<void> {
  const supabase = createClient() as SupabaseClient;
  const { error } = await supabase
    .from("ledger_entry")
    .update({ tampered: true })
    .eq("id", entryId);
  if (error) throw error;
}
