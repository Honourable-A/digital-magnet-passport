import ComplianceSelector from "./compliance-selector";

import { getPassports } from "@/lib/api/passport";

export default async function CompliancePage() {

  const passports = await getPassports();

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Compliance & Certification
        </h1>

        <p className="mt-1 text-muted-foreground">
          Review certification records, compliance claims and recycled-content certification.
        </p>
      </div>


      <ComplianceSelector
        passports={passports}
      />

    </div>
  );
}