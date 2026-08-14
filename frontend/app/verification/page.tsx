import { RoleSelector } from "@/components/compliance/role-selector";
import { VerificationCard } from "@/components/compliance/verification-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Privacy & Verification
        </h1>

        <p className="mt-1 text-muted-foreground">
          Verify compliance conditions without exposing
          commercially sensitive composition data.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <VerificationCard
          title="CRMA"
          status="Verified"
        />

        <VerificationCard
          title="CBAM"
          status="Verified"
        />

        <VerificationCard
          title="ESG"
          status="Verified"
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Verified Conditions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            ✓ Dy threshold satisfied
          </div>

          <div className="rounded-lg border p-4">
            ✓ Recycled Content &gt; 20%
          </div>

          <div className="rounded-lg border p-4">
            Verified: 2026-04-12
          </div>
        </CardContent>
      </Card>

      <RoleSelector />
    </div>
  );
}