import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Countdown } from '@/components/countdown';
import { buildInviteUrl, formatDate, formatTimeRange } from '@/lib/utils';

export default async function PublicInvitePage({ params }: { params: { token: string } }) {
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
  const countdownDate = festa.horaInicio
    ? new Date(`${festa.data.toISOString().split('T')[0]}T${festa.horaInicio}`)
    : festa.data;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative isolate overflow-hidden">
        <Image
          src="/template/convite-base.png"
          alt="Fundo Big Jump"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center gap-10 px-6 py-20 text-center">
          <img src="/logo.png" alt="Big Jump" className="h-20 w-20" />
          <div className="rounded-full border border-white/40 px-6 py-2 text-xs font-semibold uppercase tracking-[0.6em] text-white/80">
            voce esta convidado
          </div>
          <h1 className="text-4xl font-black uppercase tracking-[0.4em]">{festa.nome}</h1>
          <div className="grid gap-6 text-sm text-white/90 md:grid-cols-2">
            <Info label="Data" value={<span>{formatDate(festa.data)}</span>} />
            <Info label="Horario" value={<span>{formatTimeRange(festa.horaInicio, festa.horaFim) ?? 'Em breve'}</span>} />
            <Info label="Salao" value={<span>{festa.sala}</span>} />
            {festa.idade && <Info label="Idade" value={<span>{festa.idade} anos</span>} />}
          </div>
          <div className="text-sm text-white/70">
            Falta pouco! <Countdown date={countdownDate} />
          </div>
          {festa.fotoUrl && (
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white/50">
              <Image
                src={festa.fotoUrl}
                alt="Foto do aniversariante"
                fill
                sizes="256px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="flex flex-col items-center gap-4">
            <Link
              href={`/convite/${params.token}/confirmar`}
              className="rounded-full bg-bigjump.red px-8 py-4 text-sm font-semibold uppercase tracking-[0.4em] text-white shadow-lg shadow-bigjump.red/40 transition hover:scale-105"
            >
              Confirmar presenca
            </Link>
            <p className="text-xs text-white/70">Compartilhe este convite: {buildInviteUrl(params.token)}</p>
          </div>
        </div>
      </div>
      <section className="bg-white px-6 py-12 text-slate-900">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Como chegar</h2>
            <p className="text-sm text-slate-600">Shopping Madrid Open Mall - Big Jump USA.</p>
            <a
              href="https://maps.app.goo.gl/S5mwXNte1x3sqXxU9"
              target="_blank"
              className="text-sm font-semibold text-bigjump.blue"
            >
              Abrir no Google Maps
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <iframe
              title="Localizacao Big Jump USA"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.524717770353!2d-43.29266912369853!3d-22.892794679265855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997d4c9ff19c989%3A0xf0e2555026a7566c!2sShopping%20Madrid%20Open%20Mall!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
              width="100%"
              height="260"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/10 px-6 py-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">{label}</p>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}