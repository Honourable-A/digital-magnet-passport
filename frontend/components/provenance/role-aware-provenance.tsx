"use client";

import { LockKeyhole } from "lucide-react";
import { SupplyChainGraph } from "@/components/provenance/supply-chain-graph";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { canViewDetailedProvenance } from "@/lib/access-policy";
import { useRoleStore } from "@/store/role-store";

const stages = [
  {
    stage: "S1",
    label: "Mining",
  },
  {
    stage: "S2",
    label: "Refining",
  },
  {
    stage: "S3",
    label: "Alloy Production",
  },
  {
    stage: "S4",
    label: "Magnet Manufacturing",
  },
  {
    stage: "S5",
    label: "Integration",
  },
  {
    stage: "S6",
    label: "Recycling",
  },
];

export function RoleAwareProvenance() {
  const role = useRoleStore((state) => state.role);

  const canViewDetails =
    canViewDetailedProvenance(role);

  return (
    <div className="space-y-6">
  

      {canViewDetails ? (
        <SupplyChainGraph />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              Supply-Chain Provenance
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5" />

                <div>
                  <p className="font-medium">
                    Detailed provenance restricted
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Supplier identities and commercial
                    relationships are available only to
                    authorised audit and regulatory roles.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {stages.map((item) => (
                <div
                  key={item.stage}
                  className="rounded-lg border p-4 text-center"
                >
                  <p className="text-lg font-semibold">
                    {item.stage}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              The provenance record confirms that the asset
              passed through the recognised S1–S6 supply-chain
              stages without exposing commercially sensitive
              supplier relationships.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}