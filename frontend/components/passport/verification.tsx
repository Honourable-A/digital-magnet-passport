"use client";


import {
  useEffect,
  useState
} from "react";


import {
  CheckCircle2,
  XCircle
} from "lucide-react";


import {
  getVerificationClaims
} from "@/lib/api/passport-details";



function formatClaimType(
  type:string
){

  return type
    .replaceAll("_"," ")
    .replace(
      /\b\w/g,
      char => char.toUpperCase()
    );

}



export default function Verification({

  passportId,

}:{
  passportId:number;
}){


  const [claims,setClaims] =
    useState<any[]>([]);


  const [loading,setLoading] =
    useState(true);



  const [restricted,setRestricted] =
    useState(false);



  useEffect(()=>{


    async function load(){


      try{


        const data =
          await getVerificationClaims(
            passportId
          );


        setClaims(data);


      }
      catch(error:any){


        console.error(
          "VERIFICATION ERROR:",
          error
        );


        if(
          error?.code === "42501"
        ){

          setRestricted(true);

        }


        setClaims([]);

      }
      finally{

        setLoading(false);

      }


    }


    load();


  },[passportId]);





  if(loading){

    return (

      <p className="text-sm text-muted-foreground">
        Loading verification...
      </p>

    );

  }





  if(restricted){


    return (

      <div className="rounded-lg border p-6">


        <h3 className="font-semibold">
          Verification Restricted
        </h3>


        <p className="mt-2 text-sm text-muted-foreground">
          Your current role does not have permission
          to view verification claims.
        </p>


      </div>

    );

  }





  if(claims.length === 0){


    return (

      <div className="rounded-lg border p-6">


        <h3 className="font-semibold">
          No Verification Claims
        </h3>


        <p className="mt-2 text-sm text-muted-foreground">
          No verification records are available
          for this passport.
        </p>


      </div>

    );

  }





  return (

    <div className="space-y-4">


      {
        claims.map(
          (claim)=>(


            <div
              key={claim.claim_id}
              className="rounded-lg border p-4"
            >


              <div className="flex items-center justify-between">


                <div>


                  <p className="font-semibold">
                    {
                      formatClaimType(
                        claim.claim_type
                      )
                    }
                  </p>



                  <p className="text-sm text-muted-foreground">

                    {
                      new Date(
                        claim.verification_date
                      )
                      .toLocaleString()
                    }

                  </p>


                </div>



                <div className="flex items-center gap-2">


                  {
                    claim.result

                    ?

                    <>

                      <CheckCircle2
                        className="
                        h-5
                        w-5
                        text-green-600
                        "
                      />

                      <span>
                        Verified
                      </span>

                    </>


                    :

                    <>

                      <XCircle
                        className="
                        h-5
                        w-5
                        text-red-600
                        "
                      />

                      <span>
                        Failed
                      </span>

                    </>


                  }


                </div>


              </div>


            </div>


          )
        )
      }


    </div>

  );


}