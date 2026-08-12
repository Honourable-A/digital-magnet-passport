import { createClient } from "@/lib/supabase/client";


export async function getPassportDetails(
  id:string
){

  const supabase = createClient();


  const {
    data,
    error
  } = await supabase
    .from("passports")
    .select("*")
    .eq("id",id)
    .single();



  if(error){

    throw error;

  }


  return data;

}