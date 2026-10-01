import type { UserRole } from "@/store/role-store";

export type CompositionDisclosureLevel =
  | "presence"
  | "range"
  | "exact";

export function getCompositionDisclosureLevel(
  role: UserRole
): CompositionDisclosureLevel {
  switch (role) {
    case "Manufacturer":
      return "exact";

    case "Auditor":
    case "Regulator":
      return "range";

    // Recycler deliberately does not get "exact" (or "range") here, even though they
    // did previously — the whole point of the ZKP verification flow is that a
    // Recycler proves a threshold claim (e.g. "recycled content > 20%") without ever
    // learning the real composition. Showing them the exact value on this tab made
    // that flow pointless, since they could just read the real number here instead.
    case "Recycler":
    case "Public":
    default:
      return "presence";
  }
}

export function canViewDetailedProvenance(
  role: UserRole
): boolean {
  return role === "Auditor" || role === "Regulator";
}

export function canViewPerformance(
  role: UserRole
): boolean {
  return (
    role === "Manufacturer" ||
    role === "Recycler" ||
    role === "Auditor" ||
    role === "Regulator"
  );
}

export function canViewExactRecycledContent(
  role: UserRole
): boolean {
  // Same reasoning as getCompositionDisclosureLevel — recycled content % is exactly
  // what the ZKP flow proves a threshold claim about; a Recycler shouldn't be able to
  // just read the real number elsewhere in the UI instead of requesting a proof.
  return (
    role === "Auditor" ||
    role === "Regulator"
  );
}