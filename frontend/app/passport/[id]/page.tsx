import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { mockPassports } from "@/data/mock-passports";

type PassportDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getStatusVariant(status: string) {
  return status === "Verified" ? "default" : "outline";
}

export default async function PassportDetailsPage({
  params,
}: PassportDetailsPageProps) {
  const { id } = await params;

  const passport = mockPassports.find(
    (item) => item.passportId === id
  );

  if (!passport) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-3 mb-2">
            <Link href="/passport">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Passports
            </Link>
          </Button>

          <h1 className="text-3xl font-semibold tracking-tight">
            {passport.passportId}
          </h1>

          <p className="mt-1 text-muted-foreground">
            Digital magnet passport details and verification information.
          </p>
        </div>

        <Badge
          variant={getStatusVariant(passport.verificationStatus)}
          className="w-fit"
        >
          {passport.verificationStatus}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="composition">Composition</TabsTrigger>
          <TabsTrigger value="provenance">Provenance</TabsTrigger>
          <TabsTrigger value="circularity">Circularity</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>

            <CardContent>
              <dl className="grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Passport ID
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.passportId}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Type
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.type}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Application
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.application}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Lifecycle
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.lifecycle}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Origin
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.origin}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Recycled Content
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.recycledContent}%
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-sm text-muted-foreground">
                    Compliance
                  </dt>

                  <dd className="mt-2 flex flex-wrap gap-3">
                    {passport.compliance.cbam && (
                      <span className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        CBAM
                      </span>
                    )}

                    {passport.compliance.crma && (
                      <span className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        CRMA
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="composition">
          <Card>
            <CardHeader>
              <CardTitle>Composition</CardTitle>
            </CardHeader>

            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                {Object.entries(passport.composition).map(
                  ([element, visibility]) => (
                    <div
                      key={element}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <dt className="font-medium">{element}</dt>
                      <dd className="text-muted-foreground">
                        {visibility}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="provenance">
          <Card>
            <CardHeader>
              <CardTitle>Provenance</CardTitle>
            </CardHeader>

            <CardContent>
              <dl>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Origin
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.origin}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="circularity">
          <Card>
            <CardHeader>
              <CardTitle>Circularity</CardTitle>
            </CardHeader>

            <CardContent>
              <dl className="grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Lifecycle
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.lifecycle}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    Recycled Content
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.recycledContent}%
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
            </CardHeader>

            <CardContent>
              <dl className="grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Verification Status
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.verificationStatus}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    CBAM
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.compliance.cbam
                      ? "Compliant"
                      : "Not Compliant"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">
                    CRMA
                  </dt>
                  <dd className="mt-1 font-medium">
                    {passport.compliance.crma
                      ? "Compliant"
                      : "Not Compliant"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}