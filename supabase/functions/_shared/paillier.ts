// Paillier homomorphic addition/decryption in plain BigInt — ports the same "g = n+1"
// simplified-Paillier scheme the browser-side encryption (frontend, and the old
// static demo pages) already uses, and that Python's `phe` library implements too.
// No external crypto library needed; this is a handful of modular-arithmetic ops.

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === 1n) return 0n;
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return result;
}

function gcd(a: bigint, b: bigint): bigint {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a: bigint, b: bigint): bigint {
  return (a / gcd(a, b)) * b;
}

// Extended Euclidean algorithm for modular inverse.
function modInverse(a: bigint, m: bigint): bigint {
  let [old_r, r] = [a % m, m];
  let [old_s, s] = [1n, 0n];
  while (r !== 0n) {
    const q = old_r / r;
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return ((old_s % m) + m) % m;
}

export interface PaillierPublicKey {
  n: bigint;
  n2: bigint;
}

export function publicKeyFromHex(nHex: string): PaillierPublicKey {
  const n = BigInt("0x" + nHex);
  return { n, n2: n * n };
}

// Homomorphic sum of ciphertexts: E(m1) * E(m2) * ... mod n^2 = E(m1 + m2 + ...).
export function homomorphicSum(ciphertexts: bigint[], pk: PaillierPublicKey): bigint {
  return ciphertexts.reduce((acc, c) => (acc * c) % pk.n2, 1n);
}

export interface PaillierPrivateKey {
  n: bigint;
  n2: bigint;
  lambda: bigint;
  mu: bigint; // (lambda^-1 mod n), using the g = n+1 optimization
}

export function privateKeyFromHex(pHex: string, qHex: string): PaillierPrivateKey {
  const p = BigInt("0x" + pHex);
  const q = BigInt("0x" + qHex);
  const n = p * q;
  const n2 = n * n;
  const lambda = lcm(p - 1n, q - 1n);
  const mu = modInverse(lambda % n, n);
  return { n, n2, lambda, mu };
}

export function decrypt(ciphertext: bigint, sk: PaillierPrivateKey): bigint {
  const u = modPow(ciphertext, sk.lambda, sk.n2);
  const l = (u - 1n) / sk.n;
  return (l * sk.mu) % sk.n;
}
