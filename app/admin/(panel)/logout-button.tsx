"use client";

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await fetch('/api/admin/logout', { method: 'POST' });
          router.replace('/admin/login');
        });
      }}
      disabled={pending}
      className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800 disabled:opacity-60"
    >
      {pending ? 'Saindo...' : 'Sair'}
    </button>
  );
}