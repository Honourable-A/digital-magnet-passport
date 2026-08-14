import { createClient } from "@/lib/supabase/client";


export async function getPassportPerformance(
  id:number
){

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
    "PERFORMANCE DATA:",
    data
  );


  console.log(
    "PERFORMANCE ERROR:",
    error
  );


  if(error){
    throw error;
  }


  return data;

}