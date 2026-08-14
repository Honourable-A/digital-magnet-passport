import type { Passport } from "@/types/passport";

export const mockPassports: Passport[] = [
  {
    passportId: "DMP-000001",
    type: "NdFeB",
    application: "EV Traction Motor",
    lifecycle: "In Use",
    origin: "Australia",
    recycledContent: 22,
    verificationStatus: "Verified",
    recycled: false,

    compliance: {
      cbam: true,
      crma: true,
    },

    composition: {
      Nd: "Visible",
      Pr: "Visible",
      Dy: "Visible",
      Tb: "Visible",
    },
  },
];