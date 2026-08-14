"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const roles = [
  "Public",
  "Manufacturer",
  "Recycler",
  "Auditor",
  "Regulator",
] as const;

type Role = (typeof roles)[number];

export function RoleSelector() {
  const [selectedRole, setSelectedRole] =
    useState<Role>("Public");

  const compositionVisible =
    selectedRole === "Recycler" ||
    selectedRole === "Manufacturer" ||
    selectedRole === "Auditor" ||
    selectedRole === "Regulator";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role-Based View</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <Button
              key={role}
              type="button"
              variant={
                selectedRole === role
                  ? "default"
                  : "outline"
              }
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Provenance
            </p>

            <p className="mt-2 font-medium">
              Visible
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Composition
            </p>

            <p className="mt-2 font-medium">
              {compositionVisible
                ? "Visible"
                : "Restricted"}
            </p>
          </div>
        </div>

        {compositionVisible ? (
          <div className="rounded-lg border p-4">
            <p className="font-medium">
              Composition access granted
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border p-3">
                Nd — Visible
              </div>

              <div className="rounded-md border p-3">
                Pr — Visible
              </div>

              <div className="rounded-md border p-3">
                Dy — Visible
              </div>

              <div className="rounded-md border p-3">
                Tb — Visible
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border p-4">
            <p className="font-medium">
              Composition restricted
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Exact material composition is hidden for the
              selected role.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}