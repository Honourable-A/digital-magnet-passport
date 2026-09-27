// Vendored from snarkjs@0.7.5's src/curves.js, trimmed to just what
// groth16_verify.js needs. Importing the real "snarkjs" package here pulls in its
// entire CLI/proving toolchain (bfj, ejs, circom_runtime, r1csfile, ...) and produced
// a 22MB bundle that Supabase's Edge Function deploy rejected with 413 (too large).
// This file plus groth16_verify.js depend on nothing but ffjavascript, which is
// already a direct dependency of ../index.ts.
import { buildBls12381, buildBn128 } from "npm:ffjavascript@0.3.1";

export async function getCurveFromName(name, options) {
  const singleThread = options && options.singleThread;
  const normName = name.toUpperCase().match(/[A-Za-z0-9]+/g).join("");
  if (["BN128", "BN254", "ALTBN128"].indexOf(normName) >= 0) {
    return await buildBn128(singleThread);
  } else if (["BLS12381"].indexOf(normName) >= 0) {
    return await buildBls12381(singleThread);
  }
  throw new Error(`Curve not supported: ${name}`);
}
