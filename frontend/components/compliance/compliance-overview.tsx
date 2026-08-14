import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const complianceItems = [
  "UL2809",
  "CBAM",
  "CRMA",
  "ESG",
  "Certified Recycled Content",
];

export function ComplianceOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Overview</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {complianceItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-lg border p-4"
            >
              <CheckCircle2 className="h-5 w-5" />

              <span className="text-sm font-medium">
                {item}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}