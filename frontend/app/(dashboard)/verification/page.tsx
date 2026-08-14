import { CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";
import { VerificationCard } from "@/components/compliance/verification-card";
import VerificationSelector from "./verification-selector";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getPassports } from "@/lib/api/passport";

export default async function VerificationPage() {
  const passports = await getPassports();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Privacy & Verification
        </h1>

        <p className="mt-1 text-muted-foreground">
          Verify compliance claims without exposing sensitive passport data.
        </p>
      </div>

      <VerificationSelector passports={passports} />

      <Card>
        <CardHeader>
          <CardTitle>Trusted Verification Service</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <ShieldCheck className="h-5 w-5" />

            <p className="mt-3 font-medium">
              Selective Disclosure
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Sensitive values are represented as verified claims rather than
              exposed directly.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <FileCheck2 className="h-5 w-5" />

            <p className="mt-3 font-medium">
              Server-Side Verification
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              The trusted demonstrator backend verifies claims using stored
              passport data.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <CheckCircle2 className="h-5 w-5" />

            <p className="mt-3 font-medium">
              Role-Based Response
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Each stakeholder role receives only the information it is
              authorised to view.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}