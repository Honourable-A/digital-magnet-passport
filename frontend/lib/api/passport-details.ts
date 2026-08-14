import { createClient } from "@/lib/supabase/client";


// --------------------
// Composition
// --------------------

export async function getPassportComposition(
  id: number
) {

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
  id:number
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
    .maybeSingle();



  console.log(
    "PERFORMANCE RESULT:",
    data
  );


  console.log(
    "PERFORMANCE ERROR:",
    error
  );



  if(error){
    throw error;
  }


  return data ?? null;

}// --------------------
// Circularity / Sustainability
// --------------------

export async function getPassportCircularity(
  id:number
){

const supabase=createClient();


// Sustainability data

const {
data:sustainability,
error:sustainabilityError
}=await supabase
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



if(sustainabilityError){

throw sustainabilityError;

}



// Passport lineage

const {
data:lineage,
error:lineageError
}=await supabase
.from("passport_lineage")
.select(
`
id,
source_passport_id,
target_passport_id,
relationship_type,
recovery_method,
generation_number,

source_passport:source_passport_id(
passport_id
),

target_passport:target_passport_id(
passport_id
)
`
)
.or(
`source_passport_id.eq.${id},target_passport_id.eq.${id}`
);



if(lineageError){

throw lineageError;

}



// Recycled material passport

const {
data:recycledMaterial,
error:materialError
}=await supabase
.from("recycled_material_passport")
.select(
`
id,
source_passport_id,
material_type,
quantity,
created_at
`
)
.eq(
"source_passport_id",
id
)
.order(
"created_at",
{
ascending:false
}
);



if(materialError){

throw materialError;

}



// Lifecycle events

const {
data:events,
error:eventError
}=await supabase
.from("passport_event")
.select(
`
id,
event_type,
event_date,
notes,
performed_by
`
)
.eq(
"passport_id",
id
)
.order(
"event_date",
{
ascending:true
}
);



if(eventError){

throw eventError;

}



return {

recycled_content:
sustainability?.recycled_content ?? null,


carbon_footprint:
sustainability?.carbon_footprint ?? null,


radioactivity:
sustainability?.radioactivity ?? null,


conflict_mineral_status:
sustainability?.conflict_mineral_status ?? null,


lineage:
lineage ?? [],


recycled_material:
recycledMaterial ?? [],


events:
events ?? []

};

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
    "COMPLIANCE DATA:",
    data
  );


  console.log(
    "COMPLIANCE ERROR:",
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




// --------------------
// Circularity Dashboard
// --------------------
export async function getCircularityDashboard(
passportId:number
){

const supabase=createClient();


const {
data:sustainability,
error:sustainabilityError
}=await supabase
.from("passport_sustainability")
.select("*")
.eq(
"passport_id",
passportId
)
.maybeSingle();


if(sustainabilityError)
throw sustainabilityError;



const {
data:lineage,
error:lineageError
}=await supabase
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


if(lineageError)
throw lineageError;



const {
data:events,
error:eventError
}=await supabase
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


if(eventError)
throw eventError;



const {
data:recycledMaterial,
error:materialError
}=await supabase
.from("recycled_material_passport")
.select(
`
id,
source_passport_id,
material_type,
quantity,
created_at
`
)
.eq(
"source_passport_id",
passportId
);


if(materialError)
throw materialError;



return {

sustainability:
sustainability ?? null,

lineage:
lineage ?? [],

events:
events ?? [],

recycled_material:
recycledMaterial ?? []

};

}