export type VerificationStatus = "Verified" | "Pending Audit";
export type CompositionVisibility = "Visible" | "Restricted";

export interface Passport {
  passportId: string;
  type: string;
  application: string;
  lifecycle: string;
  origin: string;
  recycledContent: number;
  verificationStatus: VerificationStatus;
  recycled: boolean;

  compliance: {
    cbam: boolean;
    crma: boolean;
  };

  composition: {
    Nd: CompositionVisibility;
    Pr: CompositionVisibility;
    Dy: CompositionVisibility;
    Tb: CompositionVisibility;
  };
}