"use client";

import { useState } from "react";

import { Passport } from "@/lib/api/passport";

import { VerificationClaims } from "@/components/compliance/verification-claims";
import { CertificationCard } from "@/components/certification/certification-card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

interface Props {
  passports: Passport[];
}

export default function ComplianceSelector({
  passports,
}: Props) {
  const [selectedId, setSelectedId] = useState(
    String(passports[0]?.id ?? "")
  );

  const passport = passports.find(
    (item) => String(item.id) === selectedId
  );

  if (!passport) return null;

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>
            Select Passport
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Select
            value={selectedId}
            onValueChange={setSelectedId}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {passports.map((item) => (
                <SelectItem
                  key={item.id}
                  value={String(item.id)}
                >
                  {item.passport_id}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>
            Passport Compliance Summary
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">

            <div>
              <p className="text-sm text-muted-foreground">
                Passport ID
              </p>
              <p className="font-medium">
                {passport.passport_id}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Status
              </p>

              <Badge>
                {passport.status
                  ? "Verified"
                  : "Pending"}
              </Badge>
            </div>

          </div>
        </CardContent>
      </Card>


      <VerificationClaims
        passportId={passport.id}
      />
      <Card>
        <CardHeader>
            <CardTitle>
            Certification Records
            </CardTitle>
        </CardHeader>

        <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            <CertificationCard
                name="CRMA"
                status={
                passport.status
                    ? "Certified"
                    : "Pending"
                }
            />

            <CertificationCard
                name="CBAM"
                status={
                passport.status
                    ? "Certified"
                    : "Pending"
                }
            />

            <CertificationCard
                name="ESG Compliance"
                status={
                passport.status
                    ? "Certified"
                    : "Pending"
                }
            />

            </div>
        </CardContent>
        </Card>

    </div>
  );
}