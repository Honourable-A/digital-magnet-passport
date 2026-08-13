"use client";

import {
  useEffect,
  useState,
} from "react";


import {
  getPassportCircularity
} from "@/lib/api/passport-details";


import Timeline from "@/components/circularity/timeline";

import PassportLineage from "@/components/circularity/passport-lineage";



interface CircularityData {

  recycled_content?: number | null;

  carbon_footprint?: number | null;

  radioactivity?: number | null;

  conflict_mineral_status?: string | null;

  lineage?: any[];

}



export default function Circularity({
  passportId,
}: {
  passportId:number;
}) {


  const [
    data,
    setData
  ] = useState<CircularityData | null>(null);



  const [
    loading,
    setLoading
  ] = useState(true);



  useEffect(()=>{


    async function loadCircularity(){


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


    loadCircularity();


  },[passportId]);




  if(loading){

    return (

      <p className="text-sm text-muted-foreground">
        Loading circularity data...
      </p>

    );

  }



  const lineage =
    data?.lineage ?? [];



  const generation =
    lineage.length > 0
      ? lineage[0]?.generation_number
      : null;




  return (

    <div className="space-y-6">



      {/* Circularity Summary */}

      <div className="grid gap-4 md:grid-cols-3">


        <div className="rounded-lg border p-4">

          <p className="text-sm text-muted-foreground">
            Recycled Content
          </p>


          <p className="mt-2 text-2xl font-semibold">

            {
              data?.recycled_content !== null &&
              data?.recycled_content !== undefined

              ? `${data.recycled_content}%`

              : "Not available"
            }

          </p>


        </div>





        <div className="rounded-lg border p-4">


          <p className="text-sm text-muted-foreground">
            Carbon Footprint
          </p>


          <p className="mt-2 text-2xl font-semibold">

            {
              data?.carbon_footprint !== null &&
              data?.carbon_footprint !== undefined

              ? `${data.carbon_footprint} kg CO₂e`

              : "Not available"
            }

          </p>


        </div>





        <div className="rounded-lg border p-4">


          <p className="text-sm text-muted-foreground">
            Generation Number
          </p>


          <p className="mt-2 text-2xl font-semibold">

            {
              generation ??
              "Not available"
            }

          </p>


        </div>


      </div>






      {/* Lifecycle */}

      <div className="rounded-lg border p-6">


        <h3 className="mb-4 font-semibold">
          Circularity Lifecycle
        </h3>



        <Timeline
          passportId={passportId}
        />


      </div>







      {/* Passport Lineage */}

      <div className="rounded-lg border p-6">


        <h3 className="mb-4 font-semibold">
          Passport Lineage
        </h3>



        <PassportLineage
          data={lineage}
        />


      </div>



    </div>

  );


}