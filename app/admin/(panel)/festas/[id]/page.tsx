import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import { ConviteForm } from '@/components/convite-form';
import { InviteQrCode } from '@/components/qr-code';
import { Countdown } from '@/components/countdown';
import { buildInviteUrl, formatDate, formatTimeRange } from '@/lib/utils';
import CopyLinkButton from './copy-link-button';

export default async function FestaDetailPage({ params }: { params: { id: string } }) {
  const festa = await prisma.festa.findUnique({
    where: { id: Number.parseInt(params.id, 10) },
    include: {
      convite: true,
      confirmados: true
    }
  });

  if (!festa || !festa.convite) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
        Festa nao encontrada.
      </div>
    );
  }

  const totalConfirmados = festa.confirmados.reduce((sum, item) => sum + 1 + item.acompanhantes, 0);
  const conviteLink = buildInviteUrl(festa.convite.token);

  return (
    <div className="space-y-10">
      <Link href="/admin/festas" className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para festas
      </Link>

      <section className="grid gap-8 rounded-2xl bg-white p-8 shadow-sm shadow-slate-200/60 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">{festa.nome}</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <Highlight
              label="Data"
              value={
                <div className="flex items-center gap-2">
                  <span>{formatDate(festa.data)}</span>
                  <Countdown date={festa.data} />
                </div>
              }
            />
            <Highlight label="Horario" value={formatTimeRange(festa.horaInicio, festa.horaFim) ?? 'Defina no cadastro'} />
            <Highlight label="Salao" value={festa.sala} />
            <Highlight label="Confirmados" value={`${totalConfirmados}${festa.capacidade ? ` / ${festa.capacidade}` : ''}`} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/api/convites/${festa.convite.token}/pdf`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-slate-700"
            >
              Baixar PDF
            </a>
            <CopyLinkButton link={conviteLink} />
            <Link
              href={`/convite/${festa.convite.token}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-100"
            >
              Abrir convite publico
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-slate-50 p-6">
          <InviteQrCode value={conviteLink} />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Editar convite</h2>
          <ConviteForm initialData={festa} mode="edit" />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Confirmados ({festa.confirmados.length})</h2>
          <div className="rounded-2xl border border-slate-200 bg-white">
            {festa.confirmados.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">Nenhuma confirmacao recebida ainda.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {festa.confirmados.map((confirmado) => (
                  <li key={confirmado.id} className="p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{confirmado.nome}</p>
                    <p className="text-xs text-slate-500">
                      Acompanhantes: {confirmado.acompanhantes} - Recebido em{' '}
                      {new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      }).format(confirmado.createdAt)}
                    </p>
                    {confirmado.mensagem && <p className="mt-1 text-xs text-slate-500">'{confirmado.mensagem}'</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Highlight({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <div className="mt-2 text-sm text-slate-900">{value}</div>
    </div>
  );
}



