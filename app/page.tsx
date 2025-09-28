import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      <div className="rounded-3xl bg-white/10 p-10 text-center backdrop-blur">
        <h1 className="text-3xl font-bold">Sistema de Convites Big Jump USA</h1>
        <p className="mt-2 max-w-md text-sm text-slate-200">
          Gere convites personalizados, acompanhe confirmações e compartilhe convites com facilidade pelo painel admin.
        </p>
        <Link
          href="/admin/login"
          className="mt-6 inline-flex items-center rounded-full bg-bigjump.red px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-bigjump.red/40 transition-transform hover:scale-105"
        >
          Entrar no painel
        </Link>
      </div>
    </main>
  );
}
