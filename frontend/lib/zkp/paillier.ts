// Client-side Paillier encryption, ported verbatim from static/zkp_queue.html's
// paillierEncrypt(). The public key is a non-secret constant — served directly as an
// env var instead of a GET /he/public-key round trip (that endpoint had no logic
// beyond returning this same hardcoded value).
//
// BigInt literals (0n, 1n, ...) are avoided in favor of BigInt(0)/BigInt(1) because
// this project's tsconfig targets ES2017, where the type checker rejects BigInt
// literal syntax even though the runtime (evergreen browsers) supports it fine.

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === ONE) return ZERO;
  let result = ONE;
  base %= mod;
  while (exp > ZERO) {
    if (exp & ONE) result = (result * base) % mod;
    exp >>= ONE;
    base = (base * base) % mod;
  }
  return result;
}

export function getHePublicKeyHex(): string {
  const n = process.env.NEXT_PUBLIC_HE_PUBLIC_KEY_N;
  if (!n) {
    throw new Error("NEXT_PUBLIC_HE_PUBLIC_KEY_N is not configured");
  }
  return n;
}

export function paillierEncrypt(plaintext: number, nHex: string): string {
  const n = BigInt("0x" + nHex);
  const n2 = n * n;
  const gm = (ONE + BigInt(plaintext) * n) % n2;

  const bytes = new Uint8Array(Math.ceil(nHex.length / 2));
  crypto.getRandomValues(bytes);
  const randomBig = BigInt(
    "0x" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(""),
  );
  const r = (randomBig % (n - TWO)) + TWO;

  return ((gm * modPow(r, n, n2)) % n2).toString(10);
}
