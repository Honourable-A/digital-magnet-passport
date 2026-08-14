import { createClient } from "@/lib/supabase/client";


export async function createPassportMaterial(
  passportId:number
){

const supabase=createClient();


const {
error
}=await supabase
.from("passport_material")
.insert([
{
passport_id:passportId,

nd:25,
pr:5,
dy:1,
tb:0,

ce:0,
la:0,
sm:0,

fe:60,
b:1,

magnet_grade:"N42",

coercivity:900,

remanence:1.3,

temperature_class:"150C"

}
]);


if(error){

throw error;

}

}