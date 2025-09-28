"use client";

import { useState } from 'react';

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(link);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          console.error('Nao foi possivel copiar o link', error);
        }
      }}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-100"
    >
      {copied ? 'Link copiado!' : 'Copiar link do convite'}
    </button>
  );
}