import { Lock, ShieldCheck, Database } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PrivacyAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Privacy-Preserving Analytics
        </CardTitle>

        <CardDescription>
          Aggregated sustainability insights computed using encrypted analytics.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Total Recycled Nd
            </p>

            <p className="mt-2 text-3xl font-bold">
              1250 kg
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Participating Suppliers
            </p>

            <p className="mt-2 text-3xl font-bold">
              Encrypted
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Analytics Status
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              Secure
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-green-600" />

            <div>
              <h3 className="font-medium">
                Computed Using Encrypted Analytics
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Individual supplier values remain encrypted while the platform
                computes aggregated sustainability metrics. This enables trusted
                reporting without exposing commercially sensitive information.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-dashed p-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />

            <div>
              <p className="font-medium">
                Hidden Supplier Contributions
              </p>

              <p className="text-sm text-muted-foreground">
                Supplier A ••••••
              </p>

              <p className="text-sm text-muted-foreground">
                Supplier B ••••••
              </p>

              <p className="text-sm text-muted-foreground">
                Supplier C ••••••
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}