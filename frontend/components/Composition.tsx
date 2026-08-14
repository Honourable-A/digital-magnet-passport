"use client";

import { useEffect, useState } from "react";

import {
  getPassportComposition,
} from "@/lib/api/passport-details";

import {
  useRoleStore
} from "@/store/role-store";


export default function Composition({
  passportId,
}: {
  passportId: number;
}) {


  const [composition, setComposition] =
    useState<any | null>(null);


  const [loading, setLoading] =
    useState(true);


  const [restricted, setRestricted] =
    useState(false);


  const role = useRoleStore(
    (state) => state.role
  );


  console.log(
    "COMPOSITION ROLE:",
    role
  );



  useEffect(() => {


    async function loadComposition(){


      try{


        const data =
          await getPassportComposition(
            passportId
          );


        console.log(
          "COMPOSITION RESULT:",
          data
        );



        // No rows in database
        if(!data || data.length === 0){

          setComposition(null);
          setRestricted(false);

          return;

        }



        // Data exists
        setComposition(
          data[0]
        );


      }
      catch(error:any){


        console.error(
          "COMPOSITION ERROR:",
          error
        );



        /*
          Supabase RLS permission error
        */

        if(
          error?.code === "42501"
        ){

          setRestricted(true);

        }
        else{

          setRestricted(false);

        }


      }
      finally{

        setLoading(false);

      }


    }



    loadComposition();


  },[passportId]);





  if(loading){


    return (

      <p className="text-sm text-muted-foreground">
        Loading composition...
      </p>

    );

  }





  // USER DOES NOT HAVE ACCESS

  if(restricted){


    return (

      <div className="rounded-lg border p-6">


        <h3 className="font-semibold">
          Composition Restricted
        </h3>


        <p className="mt-2 text-sm text-muted-foreground">
          Your current role does not have permission
          to view exact material composition.
        </p>


        <p className="mt-2 text-sm text-muted-foreground">
          Privacy-preserving verification allows
          compliance checks without exposing
          commercially sensitive composition data.
        </p>


      </div>

    );


  }





  // NO DATA EXISTS

  if(!composition){


    return (

      <div className="rounded-lg border p-6">


        <h3 className="font-semibold">
          No Composition Data
        </h3>


        <p className="mt-2 text-sm text-muted-foreground">
          No material composition information has
          been registered for this passport.
        </p>


      </div>

    );


  }





  // DATA AVAILABLE

  return (

    <div className="grid gap-4 md:grid-cols-2">


      {
        Object.entries(composition)
        .map(
          ([key,value]) => {


            if(
              [
                "id",
                "passport_id",
                "created_at",
                "updated_at"
              ].includes(key)
            ){

              return null;

            }



            return (

              <div
                key={key}
                className="rounded-lg border p-4"
              >

                <p className="text-sm capitalize text-muted-foreground">
                  {key.replaceAll("_"," ")}
                </p>


                <p className="mt-1 font-semibold">
                  {String(value)}
                </p>


              </div>

            );


          }
        )
      }


    </div>

  );


}
