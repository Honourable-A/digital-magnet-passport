"use client";

import { useEffect } from "react";

import { getCurrentUser } from "@/lib/api/auth";

import {
 useRoleStore,
 UserRole
} from "@/store/role-store";

import {
 createClient
} from "@/lib/supabase/client";


function mapRole(role:string): UserRole {

  switch (role) {

    case "MANUFACTURER":
      return "Manufacturer";

    case "RECYCLER":
      return "Recycler";

    case "AUDITOR":
      return "Auditor";

    case "REGULATOR":
      return "Regulator";

    case "ADMIN":
      return "Admin";

    case "Manufacturer":
      return "Manufacturer";

    case "Recycler":
      return "Recycler";

    case "Auditor":
      return "Auditor";

    case "Regulator":
      return "Regulator";

    case "Admin":
      return "Admin";

    default:
      return "Public";

  }

}



export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {


  const setRole = useRoleStore(
    (state) => state.setRole
  );


  useEffect(() => {


    async function loadUser() {

      try {


        // TEMPORARY SESSION CHECK

        const supabase = createClient();


        const {
          data:{
            session
          }

        } = await supabase.auth.getSession();



        console.log(
          "SESSION USER:",
          session?.user
        );


        console.log(
          "USER METADATA:",
          session?.user?.user_metadata
        );



        // EXISTING ROLE LOAD

        const user = await getCurrentUser();


        console.log(
          "CURRENT USER:",
          user
        );


        setRole(
          mapRole(user.role)
        );


      } catch (error) {

        console.error(
          "AUTH ERROR:",
          error
        );


        setRole("Public");

      }

    }


    loadUser();


  }, [setRole]);



  return (
    <>
      {children}
    </>
  );

}