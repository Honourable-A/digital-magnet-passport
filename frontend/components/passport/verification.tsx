"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { getVerificationClaims } from "@/lib/api/passport-details";
import { useRoleStore } from "@/store/role-store";
import RecyclerRequest from "@/components/zkp/recycler-request";
import AuditorPanel from "@/components/zkp/auditor-panel";
import RegulatorPanel from "@/components/zkp/regulator-panel";


function formatClaimType(type: string) {
  return type.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}


export default function Verification({
  passportId,
  passportIdentifier,
}: {
  passportId: number;
  passportIdentifier: string;
}) {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restricted, setRestricted] = useState(false);

  const role = useRoleStore((state) => state.role);

  useEffect(() => {
    async function load() {
      try {
        const data = await getVerificationClaims(passportId);
        setClaims(data);
      } catch (error: any) {
        console.error("VERIFICATION ERROR:", error);
        if (error?.code === "42501") {
          setRestricted(true);
        }
        setClaims([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [passportId]);

  return (
    <div className="space-y-4">
      {role === "Recycler" && <RecyclerRequest passportIdentifier={passportIdentifier} />}
      {role === "Auditor" && <AuditorPanel passportIdentifier={passportIdentifier} />}
      {role === "Regulator" && <RegulatorPanel passportIdentifier={passportIdentifier} />}

      {loading && <p className="text-sm text-muted-foreground">Loading verification...</p>}

      {!loading && restricted && (
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Verification Restricted</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your current role does not have permission to view verification claims.
          </p>
        </div>
      )}

      {!loading && !restricted && claims.length === 0 && (
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">No Verification Claims</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No verification records are available for this passport.
          </p>
        </div>
      )}

      {!loading &&
        !restricted &&
        claims.map((claim) => (
          <div key={claim.claim_id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{formatClaimType(claim.claim_type)}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(claim.verification_date).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {claim.result ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span>Failed</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
