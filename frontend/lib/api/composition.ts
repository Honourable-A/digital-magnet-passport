import { createClient } from "@/lib/supabase/client";


export async function getComposition(
  passportId:string | number
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
      passportId
    )
    



  if(error){

    console.error(
      "COMPOSITION ERROR:",
      error
    );

    throw error;

  }


  return data ?? null;

}