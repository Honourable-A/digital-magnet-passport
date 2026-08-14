"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  GitBranch,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Passports",
    href: "/passport",
    icon: FileText,
  },
  {
    name: "Provenance Network",
    href: "/provenance",
    icon: GitBranch,
  },
  {
    name: "Verification",
    href: "/verification",
    icon: ShieldCheck,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 border-r bg-background md:block">
      <div className="border-b px-6 py-5">
        <h1 className="text-lg font-semibold">TRACE4MAGNET</h1>

        <p className="text-sm text-muted-foreground">
          Digital Magnet Passport
        </p>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}