import { ArrowDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const timeline = [
  {
    company: "MP Materials",
    stage: "S1 Mining",
  },
  {
    company: "Lynas",
    stage: "S2 Refining",
  },
  {
    company: "Neo Performance",
    stage: "S3 Alloy",
  },
  {
    company: "TDK",
    stage: "S4 Magnet Manufacturing",
  },
  {
    company: "Nidec",
    stage: "S5 Integration",
  },
  {
    company: "BMW",
    stage: "S5 Integration",
  },
];

export function ProvenanceTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provenance Timeline</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center">
          {timeline.map((item, index) => (
            <div
              key={`${item.company}-${item.stage}`}
              className="flex w-full max-w-md flex-col items-center"
            >
              <div className="w-full rounded-lg border p-4 text-center">
                <p className="font-semibold">{item.company}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.stage}
                </p>
              </div>

              {index < timeline.length - 1 && (
                <ArrowDown className="my-3 h-5 w-5 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}