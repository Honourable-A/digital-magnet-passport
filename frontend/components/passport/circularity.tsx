"use client";


import {
  useEffect,
  useState
} from "react";


import {
  getPassportCircularity
} from "@/lib/api/passport-details";


import Timeline from "@/components/circularity/timeline";

import PassportLineage from "@/components/circularity/passport-lineage";


export default function Circularity({
  passportId
}:{
  passportId:number;
}){


  const [data,setData] =
    useState<any>(null);


  const [loading,setLoading] =
    useState(true);

  useEffect(()=>{


    async function load(){


      try{


        const result =
          await getPassportCircularity(
            passportId
          );


        console.log(
          "CIRCULARITY DATA:",
          result
        );


        setData(result);


      }
      catch(error){


        console.error(
          "CIRCULARITY ERROR:",
          error
        );


        setData(null);


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
        Loading circularity...
      </p>

    );

  }





  return (

    <div className="space-y-6">



      {/* Sustainability Metrics */}

      {
        data
        ?

        <div className="grid gap-4 md:grid-cols-2">



          <div className="rounded-lg border p-4">

            <p className="text-sm text-muted-foreground">
              Recycled Content
            </p>


            <p className="mt-1 font-semibold">
              {data.recycled_content}%
            </p>

          </div>





          <div className="rounded-lg border p-4">

            <p className="text-sm text-muted-foreground">
              Carbon Footprint
            </p>


            <p className="mt-1 font-semibold">
              {data.carbon_footprint}
            </p>

          </div>





          <div className="rounded-lg border p-4">

            <p className="text-sm text-muted-foreground">
              Radioactivity
            </p>


            <p className="mt-1 font-semibold">
              {data.radioactivity}
            </p>

          </div>





          <div className="rounded-lg border p-4">

            <p className="text-sm text-muted-foreground">
              Conflict Mineral Status
            </p>


            <p className="mt-1 font-semibold">
              {data.conflict_mineral_status}
            </p>

          </div>



        </div>


        :

        <div className="rounded-lg border p-6">


          <h3 className="font-semibold">
            No Sustainability Data
          </h3>


          <p className="mt-2 text-sm text-muted-foreground">
            No circularity metrics have been registered
            for this passport.
          </p>


        </div>

      }







      {/* Lifecycle Timeline */}


      <div className="rounded-lg border p-6">


        <h3 className="font-semibold mb-4">
          Circularity Lifecycle
        </h3>


        <Timeline
          passportId={passportId}
        />


      </div>







      {/* Recycling Lineage */}


      <div className="rounded-lg border p-6">


        <h3 className="font-semibold mb-4">
          Passport Lineage
        </h3>

            <PassportLineage
        data={data?.lineage ?? []}
      />
            </div>





    </div>

  );


}