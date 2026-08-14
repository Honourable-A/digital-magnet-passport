import { getPassports } from "@/lib/api/passport";
import PassportTable from "./passport-table";

export default async function PassportPage() {
  const passports = await getPassports();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Digital Magnet Passports
        </h1>

        <p className="mt-1 text-muted-foreground">
          View registered magnet passports and their verification status.
        </p>
      </div>

      <PassportTable passports={passports} />
    </div>
  );
}