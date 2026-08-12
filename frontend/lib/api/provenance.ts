import { createClient } from "@/lib/supabase/client";


export async function getProvenance(
  passportId: number
) {

  const supabase = createClient();


  // Debug: check all passports
  const {
    data: allPassports,
    error: allError
  } = await supabase
    .from("passport")
    .select("*");


  console.log(
    "ALL PASSPORTS:",
    allPassports
  );

  console.log(
    "ALL PASSPORT ERROR:",
    allError
  );



  // Get selected passport

  const {
    data: passport,
    error
  } = await supabase
    .from("passport")
    .select("*")
    .eq(
      "id",
      passportId
    )
    .maybeSingle();



  console.log(
    "SEARCH ID:",
    passportId
  );


  console.log(
    "FOUND PASSPORT:",
    passport
  );


  console.log(
    "PASSPORT ERROR:",
    error
  );



  return {

    passport,

    path: []

  };

}