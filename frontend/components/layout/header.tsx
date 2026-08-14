import Link from "next/link";
import {
  FileText,
  GitBranch,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Digital Magnet Passport Platform
          </p>
        </div>

        <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium sm:text-sm">
          Frontend Prototype
        </div>
      </div>

      <nav className="flex border-t md:hidden">
        <Link
          href="/dashboard"
          className="flex flex-1 items-center justify-center gap-2 px-3 py-3 text-sm font-medium hover:bg-muted"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/passport"
          className="flex flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
        >
          <FileText className="h-4 w-4" />
          Passports
        </Link>

        <Link
          href="/provenance"
          className="flex flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
        >
          <GitBranch className="h-4 w-4" />
          Provenance
        </Link>
        <Link
        href="/verification"
        className="flex flex-1 items-center justify-center gap-2 border-l px-3 py-3 text-sm font-medium hover:bg-muted"
      >
        <ShieldCheck className="h-4 w-4" />
        Verification
      </Link>
      </nav>
    </header>
  );
}