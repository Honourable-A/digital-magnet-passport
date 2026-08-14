"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { getPassportCompliance } from "@/lib/api/passport-details";

export default function Compliance({
  passportId,
}: {
  passportId: number;
}) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [restricted, setRestricted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const result = await getPassportCompliance(passportId);

        console.log("COMPLIANCE RESULT:", result);

        if (result && result.length > 0) {
          setData(result[0]);
        } else {
          setData(null);
        }
      } catch (error: any) {
        console.error("COMPLIANCE ERROR:", error);

        if (error?.code === "42501") {
          setRestricted(true);
        } else {
          setRestricted(false);
        }

        setData(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [passportId]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading compliance...
      </p>
    );
  }

  if (restricted) {
    return (
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold">
          Compliance Restricted
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Your current role does not have permission to view compliance information.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Regulatory verification can be performed without exposing sensitive compliance data.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold">
          No Compliance Data
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          No regulatory compliance information has been registered for this passport.
        </p>
      </div>
    );
  }
  console.log(
"COMPLIANCE DATA:",
data
);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.entries(data).map(([key, value]) => {

        if (
          [
            "id",
            "passport_id",
            "created_at",
            "updated_at",
          ].includes(key)
        ) {
          return null;
        }

        const formattedKey = key.replaceAll("_", " ");

        return (
          <div
            key={key}
            className="rounded-lg border p-4"
          >
            <p className="text-sm capitalize text-muted-foreground">
              {formattedKey}
            </p>

            <div className="mt-2 flex items-center gap-2 font-semibold">

              {typeof value === "boolean" ? (
                value ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Compliant</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span>Not Compliant</span>
                  </>
                )
              ) : (
                <span>
                  {
                    value !== null && value !== ""
                      ? String(value)
                      : "Not available"
                  }
                </span>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}