import { createClient } from "@/lib/supabase/client";


export async function createPassportSustainability(
passportId:number
){

const supabase=createClient();


const {
error
}=await supabase
.from("passport_sustainability")
.insert([
{
passport_id:passportId,

recycled_content:0,

carbon_footprint:0,

radioactivity:0,

conflict_mineral_status:"Compliant"

}
]);


if(error){

throw error;

}

}