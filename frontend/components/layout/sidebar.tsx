"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoleStore } from "@/store/role-store";

import {
  Bot,
  ClipboardCheck,
  FileText,
  GitBranch,
  LayoutDashboard,
  Recycle,
  Blocks,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";


const navigation = [
  {
    name: "Create Passport",
    href: "/create-passport",
    icon: PlusCircle,
    roles: ["Manufacturer", "Admin"],
  },

  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "Manufacturer",
      "Recycler",
      "Auditor",
      "Regulator",
      "Admin",
    ],
  },

  {
    name: "Passports",
    href: "/passport",
    icon: FileText,
    roles: [
      "Manufacturer",
      "Recycler",
      "Auditor",
      "Regulator",
      "Admin",
    ],
  },

  {
    name: "Provenance Network",
    href: "/provenance",
    icon: GitBranch,
    roles: [
      "Manufacturer",
      "Recycler",
      "Auditor",
      "Regulator",
      "Admin",
    ],
  },

  {
    name: "Verification",
    href: "/verification",
    icon: ShieldCheck,
    roles: [
      "Auditor",
      "Regulator",
      "Admin",
    ],
  },

  {
    name: "Compliance",
    href: "/compliance",
    icon: ClipboardCheck,
    roles: [
      "Manufacturer",
      "Auditor",
      "Regulator",
      "Admin",
    ],
  },

  {
    name: "Circularity",
    href: "/circularity",
    icon: Recycle,
    roles: [
      "Recycler",
      "Manufacturer",
      "Auditor",
      "Regulator",
      "Admin",
    ],
  },

  {
    name: "Blockchain",
    href: "/blockchain",
    icon: Blocks,
    roles: [
      "Regulator",
      "Admin",
    ],
  },

  {
    name: "AI Assistant",
    href: "/assistant",
    icon: Bot,
    roles: [
      "Manufacturer",
      "Recycler",
      "Auditor",
      "Regulator",
      "Admin",
    ],
  },
];


export function Sidebar() {

  const pathname = usePathname();

  const role = useRoleStore(
    (state) => state.role
  );


  if (!role) {
    return null;
  }


  const allowedNavigation =
    navigation.filter((item) =>
      item.roles.includes(role)
    );


  return (

    <aside className="w-64 border-r bg-background">

      <div className="p-6">

        <h1 className="text-xl font-bold">
          TRACE4MAGNET
        </h1>

        <p className="text-sm text-muted-foreground">
          Digital Magnet Passport
        </p>

      </div>


      <nav className="space-y-1 px-4">

        {
          allowedNavigation.map((item)=>{

            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );


            return (

              <Link

                key={item.href}

                href={item.href}

                className={`
                  flex
                  items-center
                  gap-3
                  rounded-md
                  px-3
                  py-2
                  text-sm
                  font-medium
                  transition

                  ${
                    isActive
                    ?
                    "bg-primary text-primary-foreground"
                    :
                    "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}

              >

                <Icon size={18}/>

                {item.name}

              </Link>

            );

          })
        }

      </nav>

    </aside>

  );

}