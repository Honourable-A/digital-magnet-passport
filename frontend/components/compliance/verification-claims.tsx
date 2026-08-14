"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getVerificationClaims,
  VerificationClaim,
} from "@/lib/api/verification";


interface VerificationClaimsProps {
  passportId: number;
}


function formatClaim(type: string) {
  switch (type) {
    case "recycled_content_threshold":
      return "Recycled Content Threshold";

    case "element_presence":
      return "Element Presence";

    case "element_threshold":
      return "Element Threshold";

    default:
      return type.replace(/_/g, " ");
  }
}


export function VerificationClaims({
  passportId,
}: VerificationClaimsProps) {


  const [claims, setClaims] = useState<VerificationClaim[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    if (!passportId) {
      setLoading(false);
      return;
    }


    async function loadClaims() {

      try {

        setLoading(true);


        const data = await getVerificationClaims(
          passportId
        );


        setClaims(data);


      } catch (error) {

        console.error(
          "Failed to load verification claims:",
          error
        );

      } finally {

        setLoading(false);

      }

    }


    loadClaims();


  }, [passportId]);



  return (

    <Card>

      <CardHeader>
        <CardTitle>
          Verified Claims
        </CardTitle>
      </CardHeader>


      <CardContent>

        {loading ? (

          <p className="text-sm text-muted-foreground">
            Loading verification claims...
          </p>


        ) : claims.length === 0 ? (

          <p className="text-sm text-muted-foreground">
            No verification claims available.
          </p>


        ) : (

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {claims.map((claim) => (

              <div
                key={claim.claim_id}
                className="rounded-lg border p-4"
              >

                <div className="flex items-center justify-between">


                  <div className="flex items-center gap-2">

                    {claim.result ? (

                      <CheckCircle2 className="h-5 w-5 text-green-600" />

                    ) : (

                      <XCircle className="h-5 w-5 text-red-600" />

                    )}


                    <p className="font-medium">
                      {formatClaim(
                        claim.claim_type
                      )}
                    </p>


                  </div>



                  <span
                    className={`text-sm font-medium ${
                      claim.result
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >

                    {claim.result
                      ? "Passed"
                      : "Failed"}

                  </span>


                </div>



                {claim.verification_date && (

                  <p className="mt-3 text-xs text-muted-foreground">

                    Verified on{" "}

                    {new Date(
                      claim.verification_date
                    ).toLocaleDateString()}

                  </p>

                )}


              </div>

            ))}


          </div>

        )}


      </CardContent>

    </Card>

  );

}