"use client";

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

type Props = {
  value: string;
  size?: number;
};

export function InviteQrCode({ value, size = 160 }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setSrc(null);
      return;
    }

    QRCode.toDataURL(value, { width: size, errorCorrectionLevel: 'H' })
      .then(setSrc)
      .catch(() => setSrc(null));
  }, [value, size]);

  if (!value) {
    return null;
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      {src ? (
        <img src={src} alt="QR Code do convite" className="h-auto w-full max-w-[200px]" />
      ) : (
        <div className="flex h-[200px] w-[200px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
          Gerando QR Code...
        </div>
      )}
      <span className="text-xs text-slate-500">Escaneie para confirmar presença</span>
    </div>
  );
}
