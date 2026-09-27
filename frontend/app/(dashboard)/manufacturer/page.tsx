import ManufacturerQueue from "@/components/zkp/manufacturer-queue";

export default function ManufacturerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Manufacturer Verification Queue</h1>
        <p className="mt-2 text-muted-foreground">
          Review incoming zero-knowledge proof verification requests from recyclers.
        </p>
      </div>

      <ManufacturerQueue />
    </div>
  );
}
