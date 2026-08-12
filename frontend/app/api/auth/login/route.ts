import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function POST(
  request: NextRequest
) {

  const body = await request.json();


  const supabase = await createClient();


  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });



  if(error){

    return NextResponse.json(
      {
        detail:error.message
      },
      {
        status:401
      }
    );

  }



  return NextResponse.json({
    user:data.user,
    session:data.session
  });

}