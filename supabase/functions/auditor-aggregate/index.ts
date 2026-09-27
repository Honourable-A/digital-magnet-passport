// Replaces FastAPI's GET /api/v1/auditor/aggregate/{passport_id}.
// Reads go through a user-scoped client so the ledger_entry SELECT RLS policy
// (AUDITOR/RECYCLER/ADMIN only) is actually enforced, not bypassed.

import { createClient } from "npm:@supabase/supabase-js@2";
import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { AuthError, requireRole, requireUser } from "../_shared/auth.ts";
import { homomorphicSum, publicKeyFromHex } from "../_shared/paillier.ts";

const MIN_CONTRIBUTORS = 2; // suppress aggregation below this count (k-anonymity floor)

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const user = await requireUser(req);
    requireRole(user, ["AUDITOR"]);

    const url = new URL(req.url);
    const passportId = url.pathname.split("/").pop();
    if (!passportId) {
      return jsonResponse({ detail: "Missing passport_id" }, 400);
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
    );

    const { data: entries, error } = await userClient
      .from("ledger_entry")
      .select("payload_2")
      .eq("passport_id", passportId)
      .eq("tampered", false);

    if (error) {
      return jsonResponse({ detail: error.message }, 500);
    }

    const count = entries?.length ?? 0;
    if (count < MIN_CONTRIBUTORS) {
      return jsonResponse({
        suppressed: true,
        reason: `fewer than ${MIN_CONTRIBUTORS} contributors`,
        count,
      });
    }

    const hePublicKeyN = Deno.env.get("HE_PUBLIC_KEY_N")!;
    const pk = publicKeyFromHex(hePublicKeyN);
    const ciphertexts = entries!.map((e) => BigInt(e.payload_2 as string));
    const encryptedSum = homomorphicSum(ciphertexts, pk);

    return jsonResponse({
      suppressed: false,
      count,
      passport_id: passportId,
      encrypted_sum: encryptedSum.toString(),
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return jsonResponse({ detail: err.message }, err.status);
    }
    return jsonResponse({ detail: (err as Error).message ?? "Internal error" }, 500);
  }
});
