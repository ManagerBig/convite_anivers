import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export default async function FestasListPage() {
  const festas = await prisma.festa.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      convite: true,
      confirmados: true
    }
  });

  const totalConfirmacoes = festas.reduce((acc: number, festa: (typeof festas)[number]) => {
    const presentes = festa.confirmados.reduce((sum: number, item: (typeof festa.confirmados)[number]) => sum + 1 + item.acompanhantes, 0);
    return acc + presentes;
  }, 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-3">
        <StatCard title="Festas cadastradas" value={festas.length} accent="text-bigjump.blue" />
        <StatCard title="Total confirmaÃƒÂ§ÃƒÂµes" value={totalConfirmacoes} accent="text-bigjump.red" />
        <StatCard title="Capacidade total" value={festas.reduce((sum: number, festa: (typeof festas)[number]) => sum + (festa.capacidade ?? 0), 0)} accent="text-bigjump.yellow" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3">Festa</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">SalÃƒÂ£o</th>
              <th className="px-6 py-3">Confirmados</th>
              <th className="px-6 py-3">Capacidade</th>
              <th className="px-6 py-3 text-right">AÃƒÂ§ÃƒÂµes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {festas.map((festa: (typeof festas)[number]) => {
              const confirmados = festa.confirmados.reduce((sum: number, item: (typeof festa.confirmados)[number]) => sum + 1 + item.acompanhantes, 0);
              return (
                <tr key={festa.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{festa.nome}</div>
                    <div className="text-xs text-slate-500">Convite #{festa.convite?.token ?? 'Ã¢â‚¬â€'}</div>
                  </td>
                  <td className="px-6 py-4">{formatDate(festa.data)}</td>
                  <td className="px-6 py-4">{festa.sala}</td>
                  <td className="px-6 py-4">{confirmados}</td>
                  <td className="px-6 py-4">{festa.capacidade ?? 'Ã¢â‚¬â€'}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/festas/${festa.id}`}
                      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-sm hover:bg-slate-700"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {festas.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            Nenhuma festa cadastrada ainda. Crie a primeira!
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ title, value, accent }: { title: string; value: number; accent: string }) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-sm shadow-slate-300/30`}>
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">{title}</p>
      <p className={`mt-4 text-3xl font-black ${accent.includes('text') ? accent : `${accent} bg-clip-text text-transparent`}`}>
        <span className={accent}>{value}</span>
      </p>
    </div>
  );
}