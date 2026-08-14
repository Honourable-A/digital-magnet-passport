import { ArrowDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const flowStages = [
  "Mine",
  "Refining",
  "Manufacture",
  "Use",
  "Recovery",
  "Recycling",
];

export function CircularityFlow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Circularity Flow</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center">
          {flowStages.map((stage, index) => (
            <div
              key={stage}
              className="flex w-full max-w-md flex-col items-center"
            >
              <div className="w-full rounded-lg border p-4 text-center font-medium">
                {stage}
              </div>

              {index < flowStages.length - 1 && (
                <ArrowDown className="my-3 h-5 w-5 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}