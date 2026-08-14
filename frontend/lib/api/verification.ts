import { createClient } from "@/lib/supabase/client";


export interface VerificationClaim {

  claim_id:number;

  passport_id:number;

  claim_type:string;

  result:boolean;

  verification_date:string;

}



export async function getVerificationClaims(
  passportId:number
):Promise<VerificationClaim[]> {


  const supabase =
    createClient();



  const {
    data,
    error
  } =
  await supabase
    .from("verification_claim")
    .select(
      `
      claim_id,
      passport_id,
      claim_type,
      result,
      verification_date
      `
    )
    .eq(
      "passport_id",
      passportId
    )
    .order(
      "verification_date",
      {
        ascending:false
      }
    );



  console.log(
    "VERIFICATION CLAIMS:",
    data
  );


  console.log(
    "VERIFICATION ERROR:",
    error
  );



  if(error){

    throw error;

  }



  return data ?? [];

}