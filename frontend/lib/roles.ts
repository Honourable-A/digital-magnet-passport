export type Role =
  | "Manufacturer"
  | "Recycler"
  | "Auditor"
  | "Regulator"
  | "Admin";


export const passportPermissions: Record<Role, string[]> = {

  Manufacturer: [
    "overview",
    "composition",
    "performance",
    "provenance",
    "circularity",
    "compliance",
    "verification",
  ],


  Recycler: [
    "overview",
    "composition",
    "circularity",
    "verification",
  ],


  Auditor: [
    "overview",
    "composition",
    "performance",
    "provenance",
    "circularity",
    "compliance",
    "verification",
  ],


  Regulator: [
    "overview",
    "compliance",
    "verification",
    "provenance",
  ],


  Admin: [
    "overview",
    "composition",
    "performance",
    "provenance",
    "circularity",
    "compliance",
    "verification",
  ],

};