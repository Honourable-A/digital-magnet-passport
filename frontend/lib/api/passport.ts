import { createClient } from "@/lib/supabase/client";
export interface Passport {

  id: number;

  passport_id: string;

  magnet_type: string;

  application_sector: string;

  manufacturer: string;

  country_of_origin: string;

  manufacturing_date: string;

  current_stage: string;

  status: boolean;

  created_at: string;

  updated_at: string;

}



/*
  Get all passports

  Used by:
  - /passport
  - /circularity dropdown
  - /verification dropdown
*/

export async function getPassports(): Promise<Passport[]> {


  const supabase = createClient();



  const {
    data,
    error
  } = await supabase
    .from("passport")
    .select(
      `
      id,
      passport_id,
      magnet_type,
      application_sector,
      manufacturer,
      country_of_origin,
      manufacturing_date,
      current_stage,
      status,
      created_at,
      updated_at
      `
    )
    .order(
      "id",
      {
        ascending:true
      }
    );



  console.log(
    "PASSPORT LIST:",
    data
  );



  console.log(
    "PASSPORT LIST ERROR:",
    error
  );



  if(error){

    throw error;

  }



  return data ?? [];

}





/*
  Get single passport

  Used by:

  /passport/[id]

  Example:
  /passport/DMP-2024-001
*/

export async function getPassport(
  passportIdentifier:string
):Promise<Passport>{


  const supabase = createClient();



  console.log(
    "LOOKING FOR PASSPORT:",
    passportIdentifier
  );



  const {
    data,
    error
  } =
  await supabase
    .from("passport")
    .select("*")
    .eq(
      "passport_id",
      passportIdentifier
    )
    .single();




  console.log(
    "PASSPORT RESULT:",
    data
  );


  console.log(
    "PASSPORT ERROR:",
    error
  );




  if(error || !data){

    throw new Error(
      "Passport not found"
    );

  }



  return data;


}






/*
  Get passport dropdown data

  Used by:
  - Circularity
  - Verification
  - Compliance selectors

  Only returns required fields
*/

export async function getPassportOptions(){


  const supabase=createClient();



  const {
    data,
    error
  } = await supabase
    .from("passport")
    .select(
      `
      id,
      passport_id
      `
    )
    .order(
      "id",
      {
        ascending:true
      }
    );



  console.log(
    "PASSPORT OPTIONS:",
    data
  );



  console.log(
    "PASSPORT OPTIONS ERROR:",
    error
  );



  if(error){

    throw error;

  }



  return data ?? [];

}

///create passport///
export async function createPassport(
  passportData:{
    passport_id:string;
    magnet_type:string;
    application_sector:string;
    manufacturer:string;
    country_of_origin:string;
    manufacturing_date:string;
    current_stage:string;
  }
){


  const supabase = createClient();



  // Get logged-in user

  const {
    data:userData,
    error:userError
  } = await supabase.auth.getUser();



  if(userError || !userData.user){

    throw new Error(
      "User not authenticated"
    );

  }



  console.log(
    "SESSION USER:",
    userData.user
  );





  // 1. Create passport


  const {
    data:passport,
    error:passportError
  } = await supabase
    .from("passport")
    .insert([
      {
        ...passportData,
        status:true
      }
    ])
    .select()
    .single();




  if(passportError){

    console.error(
      "PASSPORT CREATE ERROR:",
      passportError
    );

    throw passportError;

  }





  console.log(
    "CREATED PASSPORT:",
    passport
  );






  // 2. Create initial lifecycle event


  const {
    error:eventError
  } = await supabase
    .from("passport_event")
    .insert([
      {
        passport_id: passport.id,

        event_type:"Manufactured",

        performed_by:userData.user.id,

        event_date:
          passport.manufacturing_date ??
          new Date().toISOString(),

        notes:
          "Magnet passport created and manufactured"
      }
    ]);






  if(eventError){

    console.error(
      "PASSPORT EVENT CREATE ERROR:",
      eventError
    );


    throw eventError;

  }






  console.log(
"MANUFACTURED EVENT CREATED"
);



// 3. Create default material record

await createPassportMaterial(
  passport.id
);



// 4. Create default sustainability record

await createPassportSustainability(
  passport.id
);



console.log(
"DEFAULT MATERIAL + SUSTAINABILITY CREATED"
);



return passport;

}

//
export async function createPassportMaterial(
  passportId:number
){

  const supabase=createClient();


  const {
    error
  } = await supabase
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

    console.error(
      "MATERIAL CREATE ERROR:",
      error
    );

    throw error;

  }

}
//
export async function createPassportSustainability(
  passportId:number
){

  const supabase=createClient();


  const {
    error
  } = await supabase
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

    console.error(
      "SUSTAINABILITY CREATE ERROR:",
      error
    );

    throw error;

  }

}
////
export async function getNextPassportId(){

  const supabase=createClient();


  const {
    data,
    error
  } = await supabase
    .from("passport")
    .select("id")
    .order(
      "id",
      {
        ascending:false
      }
    )
    .limit(1);



  if(error){

    throw error;

  }



  const next =
    (data?.[0]?.id ?? 0) + 1;



  const year =
    new Date().getFullYear();



  return `DMP-${year}-${String(next).padStart(3,"0")}`;

}