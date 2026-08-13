"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import {
  useRoleStore,
  UserRole,
} from "@/store/role-store";


function mapRole(role: string): UserRole {

  switch(role){

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

    default:
      return "Public";

  }

}


export default function LoginForm() {


  const router = useRouter();

  const searchParams = useSearchParams();


  const redirect =
    searchParams.get("redirect") || "/dashboard";


  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");

  const [error,setError] = useState("");

  const [loading,setLoading] = useState(false);



  const setRole =
    useRoleStore(
      (state)=>state.setRole
    );



  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();


    setError("");

    setLoading(true);


    try {


      const supabase = createClient();



      const {
        data,
        error:loginError
      } =
      await supabase.auth.signInWithPassword({

        email,

        password,

      });



      if(loginError){

        setError(loginError.message);

        return;

      }



      if(!data.user){

        setError("Login failed");

        return;

      }



      const role =
        data.user.user_metadata?.role
        || "MANUFACTURER";



      setRole(
        mapRole(role)
      );



      router.replace(
        redirect
      );


      router.refresh();



    }
    catch(err){


      console.error(
        "LOGIN ERROR:",
        err
      );


      setError(
        "Unable to login"
      );


    }
    finally{


      setLoading(false);


    }

  }



  return (

    <div className="flex min-h-screen items-center justify-center bg-muted/40">


      <div className="w-full max-w-md rounded-lg border bg-background p-8 shadow-lg">


        <h1 className="mb-6 text-center text-3xl font-bold">
          TRACE4MAGNET
        </h1>



        <p className="mb-8 text-center text-muted-foreground">
          Sign in to access the Digital Magnet Passport platform.
        </p>



        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >


          <div>

            <label className="mb-2 block text-sm font-medium">
              Email
            </label>


            <input

              type="email"

              value={email}

              onChange={(e)=>
                setEmail(e.target.value)
              }

              className="w-full rounded-md border px-3 py-2"

              placeholder="you@example.com"

              required

            />

          </div>




          <div>

            <label className="mb-2 block text-sm font-medium">
              Password
            </label>


            <input

              type="password"

              value={password}

              onChange={(e)=>
                setPassword(e.target.value)
              }

              className="w-full rounded-md border px-3 py-2"

              placeholder="••••••••"

              required

            />

          </div>




          {
            error && (

              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">

                {error}

              </div>

            )
          }




          <button

            type="submit"

            disabled={loading}

            className="w-full rounded-md bg-primary py-2 text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"

          >

            {
              loading
              ? "Signing In..."
              : "Sign In"
            }

          </button>



        </form>


      </div>


    </div>

  );

}