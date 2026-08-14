"use client";

import { QRCodeSVG } from "qrcode.react";

export default function PassportQR({
  passportId
}:{
  passportId:string;
}){
const url =
`${process.env.NEXT_PUBLIC_APP_URL}/passport/${passportId}`;

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