"use client";

import {
  canViewDetailedProvenance,
  canViewExactRecycledContent,
  canViewPerformance,
} from "@/lib/access-policy";
import { useRoleStore } from "@/store/role-store";
import type { Passport } from "@/types/passport";

type RoleAwarePassportDataProps = {
  passport: Passport;
  section: "recycled-content" | "performance" | "provenance";
};

function displayValue(value: string | null) {
  return value ?? "Not available";
}

export function RoleAwarePassportData({
  passport,
  section,
}: RoleAwarePassportDataProps) {
  const role = useRoleStore((state) => state.role);

  if (section === "recycled-content") {
    const canViewExact =
      canViewExactRecycledContent(role);

    return (
      <div>
        <p className="text-sm text-muted-foreground">
          Recycled Content
        </p>

        <p className="mt-1 font-medium">
          {canViewExact
            ? `${passport.recycledContent}%`
            : "Threshold compliance verified"}
        </p>
      </div>
    );
  }

  if (section === "performance") {
    const hasAccess = canViewPerformance(role);

    if (!hasAccess) {
      return (
        <div className="rounded-lg border p-4">
          <p className="font-medium">
            Performance information restricted
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Magnet grade and performance data are available only
            to authorised stakeholders.
          </p>
        </div>
      );
    }

    return (
      <dl className="grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">
            Grade
          </dt>
          <dd className="mt-1 font-medium">
            {displayValue(passport.performance.grade)}
          </dd>
        </div>

        <div>
          <dt className="text-sm text-muted-foreground">
            Coercivity
          </dt>
          <dd className="mt-1 font-medium">
            {displayValue(
              passport.performance.coercivity
            )}
          </dd>
        </div>

        <div>
          <dt className="text-sm text-muted-foreground">
            Remanence
          </dt>
          <dd className="mt-1 font-medium">
            {displayValue(
              passport.performance.remanence
            )}
          </dd>
        </div>

        <div>
          <dt className="text-sm text-muted-foreground">
            Temperature Class
          </dt>
          <dd className="mt-1 font-medium">
            {displayValue(
              passport.performance.temperatureClass
            )}
          </dd>
        </div>

        <div>
          <dt className="text-sm text-muted-foreground">
            Performance Category
          </dt>
          <dd className="mt-1 font-medium">
            {displayValue(
              passport.performance.performanceCategory
            )}
          </dd>
        </div>
      </dl>
    );
  }

  const canViewDetails =
    canViewDetailedProvenance(role);

  return (
    <div className="space-y-5">
      <dl className="grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">
            Origin
          </dt>
          <dd className="mt-1 font-medium">
            {passport.origin}
          </dd>
        </div>

        <div>
          <dt className="text-sm text-muted-foreground">
            Current Stage
          </dt>
          <dd className="mt-1 font-medium">
            {passport.currentStage}
          </dd>
        </div>
      </dl>

      <div className="rounded-lg border p-4">
        <p className="font-medium">
          Detailed Provenance
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          {canViewDetails
            ? "Authorised for detailed provenance and audit records."
            : "Supplier identities and commercial relationships are restricted for this role."}
        </p>
      </div>
    </div>
  );
}