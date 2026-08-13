import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


async function getFullLineage(
  supabase: any,
  passportId: number,
  visited = new Set<number>(),
  relationships = new Map<number, any>()
) {


  if (visited.has(passportId)) {
    return Array.from(
      relationships.values()
    );
  }


  visited.add(passportId);



  const { data, error } = await supabase
    .from("passport_lineage")
    .select(`
      id,source_passport_id,
  target_passport_id,
      relationship_type,
      recovery_method,
      generation_number,

      source:passport!passport_lineage_source_passport_id_fkey(
        id,
        passport_id
      ),

      target:passport!passport_lineage_target_passport_id_fkey(
        id,
        passport_id
      )
    `)
    .or(
      `source_passport_id.eq.${passportId},target_passport_id.eq.${passportId}`
    );



  if (error) {

    console.error(
      "LINEAGE QUERY ERROR:",
      error
    );

    return Array.from(
      relationships.values()
    );

  }




  for (const item of data ?? []) {


    // remove duplicate relationships

    if (!relationships.has(item.id)) {

      relationships.set(
        item.id,
        item
      );

    }




    if (
      item.source.id !== passportId
    ) {

      await getFullLineage(
        supabase,
        item.source.id,
        visited,
        relationships
      );

    }




    if (
      item.target.id !== passportId
    ) {

      await getFullLineage(
        supabase,
        item.target.id,
        visited,
        relationships
      );

    }


  }



  return Array.from(
    relationships.values()
  );

}




export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id:string }>
  }
) {


  try {


    const { id } = await params;


    const passportId = Number(id);



    if (!passportId) {

      return NextResponse.json(
        {
          error:"Invalid passport id"
        },
        {
          status:400
        }
      );

    }





    console.log(
      "API START"
    );



    const supabase =
      await createClient();



    console.log(
      "SUPABASE CREATED"
    );






    /*
      Passport
    */

    const {
      data: passport,
      error: passportError
    } =
    await supabase
      .from("passport")
      .select("*")
      .eq(
        "id",
        passportId
      )
      .single();





    console.log(
      "PASSPORT QUERY DONE",
      passport,
      passportError
    );





    if (passportError) {

      return NextResponse.json(
        {
          error:passportError.message
        },
        {
          status:500
        }
      );

    }







    /*
      Full lineage
    */


    const lineage =
      await getFullLineage(
        supabase,
        passportId
      );



    console.log(
      "FULL LINEAGE COUNT:",
      lineage.length
    );






    /*
      Supply chain
    */


    const {
      data:supplyChain,
      error:supplyError
    }
    =
    await supabase
      .from("supply_chain_edge")
      .select(`
        id,
        relationship_type,
        confidence_score,

        source:company!supply_chain_edge_source_company_fkey(
          id,
          name,
          country,
          stage,
          company_type
        ),

        target:company!supply_chain_edge_target_company_fkey(
          id,
          name,
          country,
          stage,
          company_type
        )
      `);





    if (supplyError) {

      console.error(
        "SUPPLY ERROR:",
        supplyError
      );

    }





    return NextResponse.json({

      passport,

      lineage,

      supplyChain:
        supplyChain ?? []

    });



  }
  catch(error) {


    console.error(
      "PROVENANCE API ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:"Failed to load provenance"
      },
      {
        status:500
      }
    );


  }


}