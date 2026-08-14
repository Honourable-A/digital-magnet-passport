import Link from "next/link";
import {
  FileCheck2,
  FileClock,
  FileText,
  Recycle,
} from "lucide-react";

import { SummaryCard } from "@/components/dashboard/summary-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockPassports } from "@/data/mock-passports";

const dashboardStats = {
  totalPassports: 1250,
  verified: 1100,
  recycled: 320,
  pendingAudit: 84,
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Magnetic Asset Overview
        </h1>

        <p className="mt-1 text-muted-foreground">
          Overview of digital magnet passports and their current status.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Passports"
          value={dashboardStats.totalPassports}
          description="Digital passports currently registered"
          icon={FileText}
        />

        <SummaryCard
          title="Verified"
          value={dashboardStats.verified}
          description="Passports with completed verification"
          icon={FileCheck2}
        />

        <SummaryCard
          title="Recycled"
          value={dashboardStats.recycled}
          description="Passports linked to recycled magnetic assets"
          icon={Recycle}
        />

        <SummaryCard
          title="Pending Audit"
          value={dashboardStats.pendingAudit}
          description="Passports awaiting audit completion"
          icon={FileClock}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Passports</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {mockPassports.map((passport) => (
            <Link
              key={passport.passportId}
              href={`/passport/${passport.passportId}`}
              className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted"
            >
              <div>
                <p className="font-medium">{passport.passportId}</p>

                <p className="text-sm text-muted-foreground">
                  {passport.type} · {passport.application} ·{" "}
                  {passport.origin}
                </p>
              </div>

              <Badge variant="outline">
                {passport.verificationStatus}
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}