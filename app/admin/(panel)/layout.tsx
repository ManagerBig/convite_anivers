import Link from 'next/link';
import LogoutButton from './logout-button';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin/festas" className="flex items-center gap-3">
            <img src="/logo.png" alt="Big Jump" className="h-10 w-10" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Big Jump USA</p>
              <p className="text-lg font-bold text-slate-800">Painel de Convites</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/admin/festas" className="rounded-full px-4 py-2 transition hover:bg-slate-100">Festas</Link>
            <Link href="/admin/festas/nova" className="rounded-full bg-bigjump.blue px-4 py-2 text-white shadow-sm shadow-bigjump.blue/30 transition hover:scale-105">Nova festa</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}