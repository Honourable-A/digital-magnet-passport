import {
  createClient
} from "@/lib/supabase/client";



export async function getPassportSustainability(
  passportId:number
){


  const supabase = createClient();


  const {
    data,
    error
  } = await supabase
    .from("passport_sustainability")
    .select("*")
    .eq(
      "passport_id",
      passportId
    )
    .single();



  if(error){

    console.error(
      "GET SUSTAINABILITY ERROR:",
      error
    );

    throw error;

  }



  return data;

}






export async function createPassportSustainability(
  sustainabilityData:{
    passport_id:number;
    recycled_content:number;
    carbon_footprint:number;
    radioactivity:number;
    conflict_mineral_status:string;
  }
){


  const supabase = createClient();



  const {
    data,
    error
  } = await supabase
    .from("passport_sustainability")
    .insert([
      sustainabilityData
    ])
    .select()
    .single();




  if(error){

    console.error(
      "CREATE SUSTAINABILITY ERROR:",
      error
    );


    throw error;

  }



  return data;


}