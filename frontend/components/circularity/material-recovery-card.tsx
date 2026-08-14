import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MaterialRecoveryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Recovery Estimate</CardTitle>
      </CardHeader>

      <CardContent>
        <dl className="grid gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted-foreground">
              Nd Recoverable
            </dt>
            <dd className="mt-1 text-xl font-semibold">
              1.8 kg
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              Dy Recoverable
            </dt>
            <dd className="mt-1 text-xl font-semibold">
              0.4 kg
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted-foreground">
              Estimated Value
            </dt>
            <dd className="mt-1 text-xl font-semibold">
              £89
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}