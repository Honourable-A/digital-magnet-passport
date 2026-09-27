// snarkjs proof generation/verification, ported from static/zkp_queue.html's
// generateAndSend()/verifyAndShow(). Loaded as a plain <script> global (same UMD
// bundle the demo pages use) rather than an npm dependency, served from
// /zkp/snarkjs.min.js in the Next.js public directory.

declare global {
  interface Window {
    snarkjs?: {
      groth16: {
        fullProve: (
          input: Record<string, string>,
          wasmPath: string,
          zkeyPath: string,
        ) => Promise<{ proof: Record<string, unknown>; publicSignals: string[] }>;
        verify: (
          verificationKey: unknown,
          publicSignals: string[],
          proof: Record<string, unknown>,
        ) => Promise<boolean>;
      };
    };
  }
}

let loadPromise: Promise<void> | null = null;

export function loadSnarkjs(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("snarkjs can only load in the browser"));
  }
  if (window.snarkjs) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/zkp/snarkjs.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load snarkjs"));
    document.head.appendChild(script);
  });
  return loadPromise;
}

export async function generateProof(input: {
  valueScaled: number;
  salt: string;
  thresholdScaled: number;
  isGt: boolean;
}): Promise<{ proof: Record<string, unknown>; publicSignals: string[] }> {
  await loadSnarkjs();
  return window.snarkjs!.groth16.fullProve(
    {
      value_scaled: String(input.valueScaled),
      salt: input.salt,
      threshold_scaled: String(input.thresholdScaled),
      is_gt: input.isGt ? "1" : "0",
    },
    "/zkp/element_threshold.wasm",
    "/zkp/element_threshold_0000.zkey",
  );
}

export async function verifyProof(
  publicSignals: string[],
  proof: Record<string, unknown>,
): Promise<boolean> {
  await loadSnarkjs();
  const verificationKey = await fetch("/zkp/verification_key.json").then((r) => r.json());
  return window.snarkjs!.groth16.verify(verificationKey, publicSignals, proof);
}

export function randomSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(31));
  return BigInt(
    "0x" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(""),
  ).toString(10);
}
