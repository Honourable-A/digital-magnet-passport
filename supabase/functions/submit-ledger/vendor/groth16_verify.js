// Vendored from snarkjs@0.7.5's src/groth16_verify.js (GPL-3.0-or-later, 0kims
// association) — see curves.js in this directory for why. Logic is unmodified aside
// from the import path.
import { Scalar, utils } from "npm:ffjavascript@0.3.1";
import * as curves from "./curves.js";

const { unstringifyBigInts } = utils;

export default async function groth16Verify(_vk_verifier, _publicSignals, _proof, logger) {
  const vk_verifier = unstringifyBigInts(_vk_verifier);
  const proof = unstringifyBigInts(_proof);
  const publicSignals = unstringifyBigInts(_publicSignals);

  const curve = await curves.getCurveFromName(vk_verifier.curve);

  const IC0 = curve.G1.fromObject(vk_verifier.IC[0]);
  const IC = new Uint8Array(curve.G1.F.n8 * 2 * publicSignals.length);
  const w = new Uint8Array(curve.Fr.n8 * publicSignals.length);

  if (!publicInputsAreValid(curve, publicSignals)) {
    if (logger) logger.error("Public inputs are not valid.");
    return false;
  }

  for (let i = 0; i < publicSignals.length; i++) {
    const buffP = curve.G1.fromObject(vk_verifier.IC[i + 1]);
    IC.set(buffP, i * curve.G1.F.n8 * 2);
    Scalar.toRprLE(w, curve.Fr.n8 * i, publicSignals[i], curve.Fr.n8);
  }

  let cpub = await curve.G1.multiExpAffine(IC, w);
  cpub = curve.G1.add(cpub, IC0);

  const pi_a = curve.G1.fromObject(proof.pi_a);
  const pi_b = curve.G2.fromObject(proof.pi_b);
  const pi_c = curve.G1.fromObject(proof.pi_c);

  if (!isWellConstructed(curve, { pi_a, pi_b, pi_c })) {
    if (logger) logger.error("Proof commitments are not valid.");
    return false;
  }

  const vk_gamma_2 = curve.G2.fromObject(vk_verifier.vk_gamma_2);
  const vk_delta_2 = curve.G2.fromObject(vk_verifier.vk_delta_2);
  const vk_alpha_1 = curve.G1.fromObject(vk_verifier.vk_alpha_1);
  const vk_beta_2 = curve.G2.fromObject(vk_verifier.vk_beta_2);

  const res = await curve.pairingEq(
    curve.G1.neg(pi_a), pi_b,
    cpub, vk_gamma_2,
    pi_c, vk_delta_2,
    vk_alpha_1, vk_beta_2,
  );

  if (!res) {
    if (logger) logger.error("Invalid proof");
    return false;
  }

  if (logger) logger.info("OK!");
  return true;
}

function isWellConstructed(curve, proof) {
  return curve.G1.isValid(proof.pi_a) && curve.G2.isValid(proof.pi_b) && curve.G1.isValid(proof.pi_c);
}

function publicInputsAreValid(curve, publicInputs) {
  for (let i = 0; i < publicInputs.length; i++) {
    if (!Scalar.lt(publicInputs[i], curve.r)) return false;
  }
  return true;
}
