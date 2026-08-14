import { createClient } from "@/lib/supabase/client";


export async function getUserRole() {

  const supabase = createClient();


  const {
    data: {
      user
    },
    error
  } = await supabase.auth.getUser();


  console.log("AUTH USER:", user);
  console.log("AUTH ERROR:", error);


  if(error || !user){
    return null;
  }


  const role = user.user_metadata?.role;


  console.log("ROLE FROM METADATA:", role);


  return role ?? null;

}