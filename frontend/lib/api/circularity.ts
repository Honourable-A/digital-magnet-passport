import { createClient } from "@/lib/supabase/client";


// -------------------------
// Sustainability
// -------------------------

export async function getPassportSustainability(
  passportId:number
){

  const supabase = createClient();


  const {
    data,
    error
  } = await supabase
    .from("passport_sustainability")
    .select(
`
      recycled_content,
      carbon_footprint,
      radioactivity,
      conflict_mineral_status
`
    )
    .eq(
      "passport_id",
      passportId
    )
    .maybeSingle();



  console.log(
    "SUSTAINABILITY DATA:",
    data
  );


  console.log(
    "SUSTAINABILITY ERROR:",
    error
  );



  if(error){
    throw error;
  }


  return data ?? null;

}



// -------------------------
// Lifecycle Events
// -------------------------

export async function getPassportEvents(
  passportId:number
){

  const supabase = createClient();



  const {
    data,
    error
  } = await supabase
    .from("passport_event")
    .select(
`
      id,
      event_type,
      event_date,
      notes
`
    )
    .eq(
      "passport_id",
      passportId
    )
    .order(
      "event_date",
      {
        ascending:true
      }
    );



  console.log(
    "EVENT DATA:",
    data
  );


  console.log(
    "EVENT ERROR:",
    error
  );



  if(error){
    throw error;
  }


  return data ?? [];

}



// -------------------------
// Lineage
// -------------------------

export async function getPassportLineage(
  passportId:number
){

  const supabase = createClient();



  const {
    data,
    error
  } = await supabase
    .from("passport_lineage")
    .select(
`
      id,
      relationship_type,
      recovery_method,
      generation_number,

      source_passport:passport!passport_lineage_source_passport_id_fkey(
        id,
        passport_id
      ),

      target_passport:passport!passport_lineage_target_passport_id_fkey(
        id,
        passport_id
      )
`
    )
    .or(
      `source_passport_id.eq.${passportId},target_passport_id.eq.${passportId}`
    );



  console.log(
    "LINEAGE DATA:",
    data
  );


  console.log(
    "LINEAGE ERROR:",
    error
  );



  if(error){
    throw error;
  }


  return data ?? [];

}