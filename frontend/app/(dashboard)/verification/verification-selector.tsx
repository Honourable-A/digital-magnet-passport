"use client";

import { useState } from "react";

import { Passport } from "@/lib/api/passport";
import { VerificationClaims } from "@/components/compliance/verification-claims";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  passports: Passport[];
}

export default function VerificationSelector({
  passports,
}: Props) {
  const [selectedPassport, setSelectedPassport] = useState(
    passports.length ? String(passports[0].id) : ""
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Select Passport</CardTitle>
        </CardHeader>

        <CardContent>
          <Select
            value={selectedPassport}
            onValueChange={setSelectedPassport}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Passport" />
            </SelectTrigger>

            <SelectContent>
              {passports.map((passport) => (
                <SelectItem
                  key={passport.id}
                  value={String(passport.id)}
                >
                  {passport.passport_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedPassport && (
        <VerificationClaims passportId={selectedPassport} />
      )}
    </>
  );
}