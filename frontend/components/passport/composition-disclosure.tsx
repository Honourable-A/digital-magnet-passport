"use client";

import {
  CheckCircle2,
  CircleX,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCompositionDisclosureLevel } from "@/lib/access-policy";
import { useRoleStore } from "@/store/role-store";
import type { CompositionElement } from "@/types/passport";

type CompositionDisclosureProps = {
  composition: CompositionElement[];
};

export function CompositionDisclosure({
  composition,
}: CompositionDisclosureProps) {
  const role = useRoleStore((state) => state.role);

  const disclosureLevel =
    getCompositionDisclosureLevel(role);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Composition</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Disclosure level
          </p>

          <p className="mt-1 font-medium capitalize">
            {disclosureLevel}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {composition.map((element) => (
            <div
              key={element.symbol}
              className="rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {element.symbol}
                </p>

                {element.present ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <CircleX className="h-5 w-5" />
                )}
              </div>

              <div className="mt-3 text-sm text-muted-foreground">
                {disclosureLevel === "exact" && (
                  <p>
                    {element.exactValue !== null
                      ? `${element.exactValue}${element.unit}`
                      : "Exact value not available"}
                  </p>
                )}

                {disclosureLevel === "range" && (
                  <p>
                    {element.range ??
                      "Range not available"}
                  </p>
                )}

                {disclosureLevel === "presence" && (
                  <p>
                    {element.present
                      ? `Contains ${element.symbol}`
                      : `Does not contain ${element.symbol}`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}