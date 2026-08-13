"use client";

import {
  FileText,
  Recycle,
  ArrowDown,
} from "lucide-react";


interface LineageItem {

  id: number;

  source_passport_id: number;

  target_passport_id: number;

  relationship_type: string;

  recovery_method: string | null;

  generation_number: number | null;


  source_passport?: {
    passport_id: string;
  };


  target_passport?: {
    passport_id: string;
  };

}



export default function PassportLineage({
  data,
}: {
  data: LineageItem[];
}) {


  if (!data || data.length === 0) {

    return (

      <div className="rounded-lg border p-6">

        <h3 className="font-semibold">
          No Recycling Lineage Found
        </h3>


        <p className="mt-2 text-sm text-muted-foreground">
          This passport has not generated any recycled material lineage records yet.
        </p>

      </div>

    );

  }



  return (

    <div className="space-y-6">


      {
        data.map((item) => {


          const sourceId =
            item.source_passport?.passport_id
            ??
            `DMP-${String(item.source_passport_id).padStart(4, "0")}`;


          const targetId =
            item.target_passport?.passport_id
            ??
            `DMP-${String(item.target_passport_id).padStart(4, "0")}`;



          return (

            <div
              key={item.id}
              className="flex flex-col items-center gap-3"
            >


              {/* Source Passport */}

              <div className="w-full max-w-md rounded-lg border p-5">


                <div className="flex items-center gap-3">

                  <FileText className="h-5 w-5"/>


                  <div>

                    <p className="text-sm text-muted-foreground">
                      Source Passport
                    </p>


                    <p className="font-semibold">
                      {sourceId}
                    </p>

                  </div>

                </div>


              </div>



              <ArrowDown className="h-6 w-6"/>



              {/* Recycled Passport */}

              <div className="w-full max-w-md rounded-lg border p-5">


                <div className="flex items-center gap-3">


                  <Recycle className="h-5 w-5"/>


                  <div>

                    <p className="text-sm text-muted-foreground">
                      Recycled Passport
                    </p>


                    <p className="font-semibold">
                      {targetId}
                    </p>

                  </div>


                </div>



                <div className="mt-4 grid grid-cols-2 gap-3">


                  <div className="rounded-md border p-3">

                    <p className="text-xs text-muted-foreground">
                      Recovery Method
                    </p>


                    <p className="font-medium">
                      {
                        item.recovery_method
                        ??
                        "Not available"
                      }
                    </p>


                  </div>



                  <div className="rounded-md border p-3">


                    <p className="text-xs text-muted-foreground">
                      Generation
                    </p>


                    <p className="font-medium">

                      {
                        item.generation_number
                        ??
                        "Not available"
                      }

                    </p>


                  </div>


                </div>


              </div>


            </div>

          );

        })
      }


    </div>

  );

}