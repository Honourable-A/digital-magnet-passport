// Replaces FastAPI's POST /api/v1/ledger + its background Groth16 verification task.
// Verification runs synchronously here (snarkjs is native in Deno — no subprocess,
// no hardcoded local Node path like app/zkp_verify.py had), so zk_valid is resolved
// before this responds instead of arriving via a background task.

// @ts-ignore - ffjavascript ships no types for the npm: specifier here
import { buildBn128 } from "npm:ffjavascript@0.3.1";
// @ts-ignore - vendored JS, no types (see vendor/curves.js for why this is vendored
// instead of importing the "snarkjs" package: importing the full package pulled in
// its entire CLI/proving toolchain and produced a 22MB bundle that Supabase's deploy
// rejected with a 413 "request entity too large").
import groth16Verify from "./vendor/groth16_verify.js";
import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { AuthError, requireRole, requireUser, serviceClient } from "../_shared/auth.ts";
import verificationKey from "./verification_key.json" with { type: "json" };

// The verifier's internal curve build always tries multi-threaded mode, which
// crashes under Deno's node:worker_threads compat shim (confirmed locally:
// "ERR_INVALID_THIS" inside the `web-worker` polyfill). Building it once, up front,
// in single-thread mode caches it on globalThis — the internal build call then reuses
// this cached curve instead of rebuilding it, so the broken multi-threaded path is
// never hit. This runs once per warm function instance.
const curveReady = buildBn128(true).then((curve: unknown) => {
  (globalThis as unknown as { curve_bn128: unknown }).curve_bn128 = curve;
});

interface LedgerSubmitBody {
  passport_id: string;
  recycler_uid: string;
  element: string;
  operator: "gt" | "lt";
  threshold: number;
  commitment: string;
  salt: string;
  payload_2: string;
  zk_proof: unknown;
  public_signals: string[];
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const user = await requireUser(req);
    requireRole(user, ["MANUFACTURER"]);

    const body = (await req.json()) as LedgerSubmitBody;
    for (const field of ["passport_id", "recycler_uid", "element", "operator", "threshold", "commitment", "salt", "payload_2", "zk_proof", "public_signals"] as const) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return jsonResponse({ detail: `Missing field: ${field}` }, 400);
      }
    }

    await curveReady;
    const zkValid = await groth16Verify(verificationKey, body.public_signals, body.zk_proof);

    const db = serviceClient();
    const { data, error } = await db
      .from("ledger_entry")
      .insert({
        passport_id: body.passport_id,
        manufacturer_uid: user.supabaseUid,
        recycler_uid: body.recycler_uid,
        element: body.element,
        operator: body.operator,
        threshold: body.threshold,
        commitment: body.commitment,
        salt: body.salt,
        payload_2: body.payload_2,
        zk_proof: JSON.stringify(body.zk_proof),
        public_signals: JSON.stringify(body.public_signals),
        zk_valid: zkValid,
        tampered: false,
        // the column has no Postgres-level default (only a client-side SQLAlchemy
        // one, which doesn't apply to inserts from here) — set it explicitly.
        submitted_at: new Date().toISOString(),
      })
      .select("id, submitted_at, zk_valid")
      .single();

    if (error) {
      return jsonResponse({ detail: error.message }, 500);
    }

    return jsonResponse(data, 201);
  } catch (err) {
    if (err instanceof AuthError) {
      return jsonResponse({ detail: err.message }, err.status);
    }
    return jsonResponse({ detail: (err as Error).message ?? "Internal error" }, 500);
  }
});
