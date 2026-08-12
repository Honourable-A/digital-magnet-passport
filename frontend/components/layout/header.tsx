"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Bot,
  ClipboardCheck,
  FileText,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Recycle,
  Blocks,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/client";
import { getCurrentUser, CurrentUser } from "@/lib/api/auth";



export function Header() {

  const router = useRouter();


  const [user, setUser] =
    useState<CurrentUser | null>(null);



  useEffect(() => {


    async function loadUser(){

      try{

        const currentUser =
          await getCurrentUser();

        setUser(currentUser);


      }
      catch{

        setUser(null);

      }

    }


    loadUser();


  }, []);





  async function handleLogout(){


    const supabase =
      createClient();


    await supabase.auth.signOut();


    router.replace("/login");

    router.refresh();


  }





  return (

    <header className="border-b bg-background">

      <div className="flex h-16 items-center justify-between px-4 sm:px-6">


        <div>

          <p className="text-sm text-muted-foreground">
            Digital Magnet Passport Platform
          </p>

        </div>




        <div className="flex items-center gap-4">


          {user && (

            <div className="text-right">

              <p className="text-sm font-medium">
                {user.email}
              </p>


              <p className="text-xs text-muted-foreground">
                {user.role}
              </p>


            </div>

          )}




          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >

            <LogOut className="mr-2 h-4 w-4" />

            Logout

          </Button>



        </div>


      </div>





      <nav className="flex overflow-x-auto border-t md:hidden">


        <Link
          href="/dashboard"
          className="flex min-w-fit flex-1 items-center justify-center gap-2 px-3 py-3 text-sm font-medium hover:bg-muted"
        >

          <LayoutDashboard className="h-4 w-4" />

          Dashboard

        </Link>




        <Link
          href="/passport"
          className="flex min-w-fit flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
        >

          <FileText className="h-4 w-4" />

          Passports

        </Link>





        <Link
          href="/provenance"
          className="flex min-w-fit flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
        >

          <GitBranch className="h-4 w-4" />

          Provenance

        </Link>





        <Link
          href="/verification"
          className="flex min-w-fit flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
        >

          <ShieldCheck className="h-4 w-4" />

          Verification

        </Link>





        <Link
          href="/compliance"
          className="flex min-w-fit flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
        >

          <ClipboardCheck className="h-4 w-4" />

          Compliance

        </Link>





        <Link
          href="/circularity"
          className="flex min-w-fit flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
        >

          <Recycle className="h-4 w-4" />

          Circularity

        </Link>





        <Link
          href="/blockchain"
          className="flex min-w-fit flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
        >

          <Blocks className="h-4 w-4" />

          Blockchain

        </Link>





        <Link
          href="/assistant"
          className="flex min-w-fit flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
        >

          <Bot className="h-4 w-4" />

          Assistant

        </Link>



      </nav>


    </header>

  );

}