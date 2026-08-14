import type { Passport } from "@/types/passport";

export const mockPassports: Passport[] = [
  {
    passportId: "DMP-000001",
    type: "NdFeB",
    application: "EV Traction Motor",
    lifecycle: "In Use",
    currentStage: "In Use",
    origin: "Australia",

    recycledContent: 22,
    carbonFootprint: null,
    radioactivityStatus: null,
    conflictFreeStatus: null,

    verificationStatus: "Verified",

    composition: [
      {
        symbol: "Nd",
        present: true,
        range: "> 20%",
        exactValue: 26,
        unit: "%",
      },
      {
        symbol: "Pr",
        present: true,
        range: null,
        exactValue: 5,
        unit: "%",
      },
      {
        symbol: "Dy",
        present: true,
        range: "> 2%",
        exactValue: 4,
        unit: "%",
      },
      {
        symbol: "Tb",
        present: false,
        range: null,
        exactValue: null,
        unit: "%",
      },
    ],

    performance: {
      grade: "N42EH",
      coercivity: "Available",
      remanence: null,
      temperatureClass: "180°C",
      performanceCategory: null,
    },

    compliance: {
      cbam: true,
      crma: true,
      esg: true,
      ul2809: true,
      certifiedRecycledContent: true,
    },

    certifications: [
      {
        name: "UL2809",
        status: "Certified",
      },
      {
        name: "CBAM",
        status: "Compliant",
      },
      {
        name: "CRMA",
        status: "Compliant",
      },
      {
        name: "ESG",
        status: "Compliant",
      },
      {
        name: "Certified Recycled Content",
        status: "Certified",
      },
    ],
  },
];