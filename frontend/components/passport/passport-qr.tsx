"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function PassportQR({
  passportId,
}: {
  passportId: string;
}) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(
      `${window.location.origin}/passport/${passportId}`
    );
  }, [passportId]);


  if (!url) {
    return null;
  }


  return (
    <div className="space-y-3">

      <p className="text-sm text-muted-foreground">
        Scan QR to open Digital Passport
      </p>


      <QRCodeSVG
        value={url}
        size={180}
      />


      <p className="text-xs break-all">
        {url}
      </p>

    </div>
  );
}