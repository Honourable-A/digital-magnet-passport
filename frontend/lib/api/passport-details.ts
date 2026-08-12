import { createClient } from "@/lib/supabase/client";


// --------------------
// Composition
// --------------------

export async function getPassportComposition(
  id:number
){

  const supabase = createClient();


  const {
    data,
    error
  } = await supabase
    .from("passport_material")
    .select("*")
    .eq(
      "passport_id",
      id
    );


  console.log(
    "DATABASE COMPOSITION QUERY:",
    id
  );


   console.log(
    "QUERY PASSPORT MATERIAL ID:",
    id
  );


  console.log(
    "COMPOSITION DATA:",
    data
  );


  console.log(
    "COMPOSITION ERROR:",
    error
  );

  if(error){
    throw error;
  }


  return data ?? [];

}


// --------------------
// Performance
// --------------------

export async function getPassportPerformance(
  id: number
) {

  const supabase = createClient();


  const {
    data,
    error
  } = await supabase
    .from("passport_material")
    .select(
      `
      magnet_grade,
      coercivity,
      remanence,
      temperature_class
      `
    )
    .eq(
      "passport_id",
      id
    )


  console.log(
    "PERFORMANCE RESULT:",
    data,
    error
  );


  if(error){

    throw error;

  }


  return data ?? null;

}

// --------------------
// Circularity
// --------------------

export async function getPassportCircularity(
  id:number
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
      id
    )
    .maybeSingle();


  console.log(
    "CIRCULARITY QUERY ID:",
    id
  );


  console.log(
    "CIRCULARITY RESULT:",
    data
  );


  console.log(
    "CIRCULARITY ERROR:",
    error
  );


  if(error){
    throw error;
  }


  return data;

}
// --------------------
// Compliance
// --------------------

export async function getPassportCompliance(
  id:number
){

  const supabase = createClient();


  const {
    data,
    error
  } = await supabase
    .from("passport_compliance")
    .select("*")
    .eq(
      "passport_id",
      id
    );


  console.log(
    "COMPLIANCE QUERY ID:",
    id
  );


  console.log(
    "COMPLIANCE DATA FROM DB:",
    data
  );


  console.log(
    "COMPLIANCE ERROR FROM DB:",
    error
  );


  if(error){

    throw error;

  }


  return data ?? [];

}

// --------------------
// Verification Claims
// --------------------

export async function getVerificationClaims(
  id:number
){

  const supabase = createClient();


  const {
    data,
    error
  } = await supabase
    .from("verification_claim")
    .select(
      `
      claim_id,
      claim_type,
      result,
      verification_date
      `
    )
    .eq(
      "passport_id",
      id
    )
    .order(
      "verification_date",
      {
        ascending:false
      }
    );



  console.log(
    "VERIFICATION QUERY ID:",
    id
  );


  console.log(
    "VERIFICATION DATA:",
    data
  );


  console.log(
    "VERIFICATION ERROR:",
    error
  );



  if(error){

    throw error;

  }


  return data ?? [];

}

// --------------------
// Passport Lineage
// --------------------

export async function getPassportLineage(
  passportId:number
){

  const supabase = createClient();


  const {
    data,
    error
  } = await supabase
    .from("passport_lineage")
    .select(`
      id,
      source_passport_id,
      target_passport_id,
      recovery_method,
      generation_number
    `)
    .or(
      `source_passport_id.eq.${passportId},target_passport_id.eq.${passportId}`
    )
    .order(
      "id",
      {
        ascending:true
      }
    );


  console.log(
    "LINEAGE API RESULT:",
    data
  );


  console.log(
    "LINEAGE API ERROR:",
    error
  );


  if(error){

    throw error;

  }


  return data ?? [];

}
// --------------------
// Circularity Dashboard
// --------------------

export async function getCircularityDashboard(
 passportId:number
){

 const supabase=createClient();



 const {
  data:sustainability
 } = await supabase
 .from("passport_sustainability")
 .select("*")
 .eq(
  "passport_id",
  passportId
 )
 .single();





 const {
  data:lineage
 } = await supabase
 .from("passport_lineage")
 .select("*")
 .eq(
  "target_passport_id",
  passportId
 );





 const {
  data:events
 } = await supabase
 .from("passport_event")
 .select("*")
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




 return {

  sustainability:
   sustainability ?? null,

  lineage:
   lineage ?? [],

  events:
   events ?? []

 };


}