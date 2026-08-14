import { createClient } from "@/lib/supabase/client";


// -------------------------
// Sustainability
// -------------------------

export async function getPassportSustainability(
  passportId:number
){

const supabase=createClient();

const {
data,
error
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

const supabase=createClient();


const {
data,
error
}=await supabase
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

const supabase=createClient();


const {
data,
error
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



// -------------------------
// Recycled Material Passport
// -------------------------

export interface RecycledMaterialPassport {

id:number;

source_passport_id:number;

material_type:string;

quantity:number | null;

created_at:string | null;

}



export async function getRecycledMaterials(
passportId:number
):Promise<RecycledMaterialPassport[]> {


const supabase=createClient();



const {
data,
error
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
)
.order(
"created_at",
{
ascending:false
}
);



console.log(
"RECYCLED MATERIAL DATA:",
data
);

console.log(
"RECYCLED MATERIAL ERROR:",
error
);



if(error){

throw error;

}


return data ?? [];

}
// -------------------------
// Create Recycled Material 
// -------------------------
export async function createRecycledMaterial(
data:{
source_passport_id:number;
material_type:string;
quantity:number;
}
){

const supabase=createClient();


const {
data:result,
error
}=await supabase
.from("recycled_material_passport")
.insert([
data
])
.select()
.single();


if(error){
throw error;
}


return result;

}

// ----------------------------
//Add recycling event after material creation
//------------------------------
export async function createRecyclingEvent(
passportId:number,
notes:string
){

const supabase=createClient();


const {
error
}=await supabase
.from("passport_event")
.insert([
{
passport_id:passportId,
event_type:"Recycling",
event_date:new Date().toISOString(),
notes
}
]);


if(error){
throw error;
}

}
