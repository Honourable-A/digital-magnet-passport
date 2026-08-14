import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type VerificationCardProps = {
  title: string;
  status: string;
};

export function VerificationCard({
  title,
  status,
}: VerificationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-medium">{status}</span>
      </CardContent>
    </Card>
  );
}