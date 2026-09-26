import { createClient } from "@/lib/supabase/client";


const ZKP_API_URL =
  process.env.NEXT_PUBLIC_ZKP_API_URL;


if (!ZKP_API_URL) {

  throw new Error(
    "NEXT_PUBLIC_ZKP_API_URL is not configured"
  );

}



async function getAccessToken() {

  const supabase =
    createClient();


  const {
    data: {
      session
    }

  } =
  await supabase.auth.getSession();



  console.log(
    "SUPABASE SESSION:",
    session
  );



  if (!session?.access_token) {

    throw new Error(
      "No authentication token available"
    );

  }



  console.log(
    "TOKEN FOUND"
  );


  return session.access_token;

}





export async function createZKPRequest({

  passportId,
  element,
  operator,
  threshold,

}: {

  passportId: string;
  element: string;
  operator: string;
  threshold: number;

}) {


  const token =
    await getAccessToken();




  const endpoint =
    `${ZKP_API_URL}/zkp/request`;



  console.log(
    "CALLING ZKP API:",
    endpoint
  );



  const payload = {

    passport_id:
      passportId,

    element,

    operator,

    threshold

  };



  console.log(
    "PAYLOAD:",
    payload
  );




  const response =
    await fetch(
      endpoint,
      {

        method: "POST",


        headers: {

          "Content-Type":
            "application/json",


          "Authorization":
            `Bearer ${token}`

        },


        body:
          JSON.stringify(payload)

      }
    );





  console.log(
    "RESPONSE STATUS:",
    response.status
  );



  const data =
    await response.json()
      .catch(
        () => null
      );



  console.log(
    "ZKP RESPONSE DATA:",
    data
  );




  if (!response.ok) {


    throw new Error(

      data?.detail ||
      "ZKP request failed"

    );

  }



  return data;

}