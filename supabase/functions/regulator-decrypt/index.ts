// Replaces FastAPI's GET /api/v1/regulator/decrypt/{passport_id}.
// The Paillier private key lives only as Edge Function secrets (HE_PRIVATE_KEY_P/Q) —
// unlike the old FastAPI backend, which hardcoded it directly in app/api/v1/protocol.py.

import { createClient } from "npm:@supabase/supabase-js@2";
import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { AuthError, requireRole, requireUser } from "../_shared/auth.ts";
import { decrypt, homomorphicSum, privateKeyFromHex } from "../_shared/paillier.ts";

const MIN_CONTRIBUTORS = 2;

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const user = await requireUser(req);
    requireRole(user, ["REGULATOR"]);

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
      .select("payload_2, element")
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

    const sk = privateKeyFromHex(
      Deno.env.get("HE_PRIVATE_KEY_P")!,
      Deno.env.get("HE_PRIVATE_KEY_Q")!,
    );
    const ciphertexts = entries!.map((e) => BigInt(e.payload_2 as string));
    const encryptedSum = homomorphicSum(ciphertexts, { n: sk.n, n2: sk.n2 });
    const totalScaled = decrypt(encryptedSum, sk);
    const averagePct = Number(totalScaled) / 10 / count;

    return jsonResponse({
      suppressed: false,
      passport_id: passportId,
      count,
      total_scaled: Number(totalScaled),
      average_pct: Math.round(averagePct * 100) / 100,
      element: entries![0]?.element ?? null,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return jsonResponse({ detail: err.message }, err.status);
    }
    return jsonResponse({ detail: (err as Error).message ?? "Internal error" }, 500);
  }
});
