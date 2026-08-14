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
    case "Recycler":
      return "exact";

    case "Auditor":
    case "Regulator":
      return "range";

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
  return (
    role === "Recycler" ||
    role === "Auditor" ||
    role === "Regulator"
  );
}