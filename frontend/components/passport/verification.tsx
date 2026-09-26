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

import {
  useRoleStore
} from "@/store/role-store";

import {
  createZKPRequest
} from "@/lib/api/zkp";


function formatClaimType(type:string){

  return type
    .replaceAll("_"," ")
    .replace(
      /\b\w/g,
      char => char.toUpperCase()
    );

}



export default function Verification({

  passportId,
  passportIdentifier,

}:{
  passportId:number;
  passportIdentifier:string;
}){


  const [claims,setClaims] =
    useState<any[]>([]);


  const [loading,setLoading] =
    useState(true);


  const [restricted,setRestricted] =
    useState(false);


  const [zkpStatus,setZkpStatus] =
    useState<any>(null);


  const [zkpLoading,setZkpLoading] =
    useState(false);



  const role = useRoleStore(
    (state)=>state.role
  );



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


        if(error?.code === "42501"){

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





  return (

    <div className="space-y-4">


      {
        role === "Recycler" && (

          <div className="rounded-lg border p-4">


            <h3 className="font-semibold">
              ZKP Verification
            </h3>


            <p className="mt-2 text-sm text-muted-foreground">
              Request a privacy-preserving verification
              proof for this passport.
            </p>



            <p className="mt-2 text-sm">

              Passport:

              {" "}

              <span className="font-medium">
                {passportIdentifier}
              </span>

            </p>



            <button

              className="
              mt-3
              rounded-md
              bg-primary
              px-4
              py-2
              text-sm
              text-white
              "

              disabled={zkpLoading}


              onClick={async()=>{


                try{


                  setZkpLoading(true);


                  const result =
                    await createZKPRequest({

                      passportId:
                      passportIdentifier,

                      element:
                      "Nd",

                      operator:
                      "gt",

                      threshold:
                      20

                    });



                  console.log(
                    "ZKP RESPONSE:",
                    result
                  );


                  setZkpStatus(result);



                }
                catch(error:any){


                  console.error(
                    "ZKP REQUEST FAILED:",
                    error
                  );


                  setZkpStatus({

                    status:"error",

                    message:
                    error.message

                  });


                }
                finally{


                  setZkpLoading(false);


                }


              }}


            >

              {
                zkpLoading
                ?
                "Sending Request..."
                :
                "Request ZKP Verification"
              }


            </button>





            {
              zkpStatus && (

                <div className="mt-4 rounded-lg border p-4">


                  <h4 className="font-semibold">
                    ZKP Verification Status
                  </h4>



                  <p className="mt-2 text-sm">

                    Status:

                    {" "}

                    <span className="font-medium">

                      {zkpStatus.status}

                    </span>

                  </p>



                  <p className="text-sm mt-1">

                    {zkpStatus.message}

                  </p>




                  <p className="text-sm mt-1">

                    Passport:

                    {" "}

                    {zkpStatus.passport_id}

                  </p>


                </div>

              )
            }


          </div>

        )
      }






      {
        claims.length === 0

        ?


        (

          <div className="rounded-lg border p-6">


            <h3 className="font-semibold">
              No Verification Claims
            </h3>


            <p className="mt-2 text-sm text-muted-foreground">

              No verification records are available
              for this passport.

            </p>


          </div>

        )


        :


        claims.map((claim)=>(


          <div

            key={claim.claim_id}

            className="
            rounded-lg
            border
            p-4
            "

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


        ))

      }


    </div>

  );


}