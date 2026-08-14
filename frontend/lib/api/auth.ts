import { createClient } from "@/lib/supabase/client";


export interface CurrentUser {
  id: string;
  email: string;
  role: string;
}


export async function getCurrentUser(): Promise<CurrentUser> {

  const supabase = createClient();


  const {
    data: {
      user
    },
    error
  } = await supabase.auth.getUser();


  if(error || !user){
    throw new Error("No authenticated user");
  }


  return {
    id: user.id,
    email: user.email ?? "",
    role: user.user_metadata?.role ?? ""
  };

}