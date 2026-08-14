import { createClient } from "@/lib/supabase/client";


export async function createRecyclingRecord({
  sourcePassportId,
  materialType,
  quantity,
  notes,
}:{
  sourcePassportId:number;
  materialType:string;
  quantity:number;
  notes:string;
}){


const supabase=createClient();


// Get logged-in user

const {
data:userData,
error:userError
}=await supabase.auth.getUser();


if(userError || !userData.user){

throw new Error(
"User not authenticated"
);

}



// Create recycled material passport

const {
data:material,
error:materialError
}=await supabase
.from("recycled_material_passport")
.insert([
{
source_passport_id:sourcePassportId,
material_type:materialType,
quantity
}
])
.select()
.single();



if(materialError){

console.error(
"RECYCLED MATERIAL CREATE ERROR:",
materialError
);

throw materialError;

}



// Create recycling lifecycle event

const {
data:event,
error:eventError
}=await supabase
.from("passport_event")
.insert([
{
passport_id:sourcePassportId,
event_type:"Recycling",
event_date:new Date().toISOString(),
performed_by:userData.user.id,
notes:
notes ||
"Recovered material produced"
}
])
.select()
.single();



if(eventError){

console.error(
"RECYCLING EVENT CREATE ERROR:",
eventError
);

throw eventError;

}



console.log(
"RECYCLED MATERIAL CREATED:",
material
);


console.log(
"RECYCLING EVENT CREATED:",
event
);



return {

material,

event

};


}