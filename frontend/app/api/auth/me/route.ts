import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function GET(){

  const supabase = await createClient();


  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();



  if(!user){

    return NextResponse.json(
      {
        detail:"Not authenticated"
      },
      {
        status:401
      }
    );

  }



  return NextResponse.json({
    id:user.id,
    email:user.email
  });

}