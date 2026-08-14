export type VerificationStatus =
  | "Verified"
  | "Pending Audit";

export type CertificationStatus =
  | "Certified"
  | "Compliant"
  | "Pending"
  | "Not Available";

export interface CompositionElement {
  symbol: "Nd" | "Pr" | "Dy" | "Tb";
  present: boolean;
  range: string | null;
  exactValue: number | null;
  unit: "%";
}

export interface MagnetPerformance {
  grade: string | null;
  coercivity: string | null;
  remanence: string | null;
  temperatureClass: string | null;
  performanceCategory: string | null;
}

export interface Certification {
  name: string;
  status: CertificationStatus;
}

export interface Passport {
  passportId: string;
  type: string;
  application: string;
  lifecycle: string;
  currentStage: string;
  origin: string;

  recycledContent: number;
  carbonFootprint: string | null;
  radioactivityStatus: string | null;
  conflictFreeStatus: string | null;

  verificationStatus: VerificationStatus;

  composition: CompositionElement[];

  performance: MagnetPerformance;

  compliance: {
    cbam: boolean;
    crma: boolean;
    esg: boolean;
    ul2809: boolean;
    certifiedRecycledContent: boolean;
  };

  certifications: Certification[];
}