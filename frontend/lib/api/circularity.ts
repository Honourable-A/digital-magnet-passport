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
    .single();



  if(error){
    throw error;
  }


  return data;

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
      source_passport_id,
      target_passport_id
      `
    )
    .or(
      `source_passport_id.eq.${passportId},target_passport_id.eq.${passportId}`
    );


  if(error){
    throw error;
  }


  return data ?? [];

}