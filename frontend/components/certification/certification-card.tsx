import { CheckCircle2, Clock3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CertificationStatus } from "@/types/passport";

type CertificationCardProps = {
  name: string;
  status: CertificationStatus;
};

export function CertificationCard({
  name,
  status,
}: CertificationCardProps) {
  const isComplete =
    status === "Certified" || status === "Compliant";

  const Icon = isComplete ? CheckCircle2 : Clock3;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center gap-2">
        <Icon className="h-5 w-5" />

        <span className="font-medium">
          {status}
        </span>
      </CardContent>
    </Card>
  );
}