import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const elements = ["Nd", "Pr", "Dy"];

export function FeedstockQualityPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedstock Quality Panel</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {elements.map((element) => (
            <div
              key={element}
              className="flex items-center gap-2 rounded-lg border p-4"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                Contains {element}
              </span>
            </div>
          ))}
        </div>

        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">
              Recycling Difficulty
            </dt>
            <dd className="mt-1 text-xl font-semibold">
              Medium
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              Recovery Confidence
            </dt>
            <dd className="mt-1 text-xl font-semibold">
              High
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}