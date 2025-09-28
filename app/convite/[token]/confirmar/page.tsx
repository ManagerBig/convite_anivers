import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { RsvpForm } from '@/components/rsvp-form';
import { formatDate, formatTimeRange } from '@/lib/utils';

export default async function RsvpPage({ params }: { params: { token: string } }) {
  const convite = await prisma.convite.findUnique({
    where: { token: params.token },
    include: {
      Festa: true
    }
  });

  if (!convite) {
    notFound();
  }

  const festa = convite.Festa;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <div className="rounded-3xl bg-white/10 p-8 shadow-xl backdrop-blur">
          <Link href={`/convite/${params.token}`} className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
            &larr; Voltar ao convite
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Confirmar presenca</h1>
          <p className="mt-2 text-sm text-white/70">
            {festa.nome} - {formatDate(festa.data)} - {formatTimeRange(festa.horaInicio, festa.horaFim) ?? 'Horario a confirmar'} - Salao {festa.sala}
          </p>
        </div>
        <RsvpForm festaId={festa.id} />
      </div>
    </main>
  );
}