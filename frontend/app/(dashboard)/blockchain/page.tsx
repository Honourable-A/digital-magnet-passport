import {
  Blocks,
  FilePlus2,
  FilePenLine,
  ShieldCheck,
  BadgeCheck,
  Hash,
  Calendar,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const blockchainEvents = [
  {
    title: "Passport Created",
    description: "Initial Digital Magnet Passport registered on the blockchain.",
    icon: FilePlus2,
    passport: "MAG-001",
    block: "#458",
    timestamp: "2026-07-29 19:14",
    hash: "0x84c72a9df6b31c8f",
    status: "Recorded",
  },
  {
    title: "Passport Updated",
    description: "Passport information updated after manufacturing stage.",
    icon: FilePenLine,
    passport: "MAG-001",
    block: "#462",
    timestamp: "2026-07-30 09:42",
    hash: "0xf72b81ce3c9120ab",
    status: "Recorded",
  },
  {
    title: "Certificate Issued",
    description: "Compliance certificate recorded for the passport.",
    icon: BadgeCheck,
    passport: "MAG-001",
    block: "#465",
    timestamp: "2026-07-30 11:15",
    hash: "0x93ae1df821bc0ffe",
    status: "Issued",
  },
  {
    title: "Verification Generated",
    description: "Verification results successfully stored.",
    icon: ShieldCheck,
    passport: "MAG-001",
    block: "#469",
    timestamp: "2026-07-30 14:30",
    hash: "0xab81ef7219bc4fd1",
    status: "Verified",
  },
];

export default function BlockchainPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Blocks className="h-8 w-8 text-primary" />

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Blockchain Audit Trail
          </h1>

          <p className="text-muted-foreground">
            Immutable audit records demonstrating accountability,
            provenance and trust across the Digital Magnet Passport
            lifecycle.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {blockchainEvents.map((event) => {
          const Icon = event.icon;

          return (
            <Card key={event.title}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <CardTitle>{event.title}</CardTitle>

                  <CardDescription>
                    {event.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Passport
                    </span>

                    <span>{event.passport}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">
                      Status
                    </span>

                    <span className="text-green-600 font-medium">
                      ✓ {event.status}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">
                      Block Number
                    </span>

                    <span>{event.block}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Timestamp
                    </span>

                    <span>{event.timestamp}</span>
                  </div>

                  <div className="flex justify-between items-start gap-3">
                    <span className="font-medium flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Hash
                    </span>

                    <span className="text-right break-all text-xs text-muted-foreground">
                      {event.hash}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}