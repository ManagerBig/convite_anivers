"use client";

import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';

type Props = {
  nome: string;
  idade?: string;
  data?: string;
  horaInicio?: string;
  horaFim?: string;
  sala?: string;
  fotoUrl?: string;
};

export function ConvitePreview({ nome, idade, data, horaInicio, horaFim, sala, fotoUrl }: Props) {
  const formattedDate = useMemo(() => {
    if (!data) return '';
    const result = new Date(data);
    if (Number.isNaN(result.getTime())) return data;
    return format(result, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  }, [data]);

  const horarioTexto = useMemo(() => {
    if (!horaInicio && !horaFim) return '';
    if (horaInicio && horaFim) return `${horaInicio} às ${horaFim}`;
    return horaInicio ?? horaFim ?? '';
  }, [horaInicio, horaFim]);

  return (
    <div className="relative aspect-[3/5] w-full bg-slate-900/70 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
      {fotoUrl ? (
        <img src={fotoUrl} alt="Foto do aniversariante" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-[0.3em] text-white/60">
          Foto do aniversariante
        </div>
      )}
      <div className="relative flex h-full flex-col justify-end gap-6 p-10">
        <div className="text-sm font-semibold uppercase tracking-[0.5em] text-bigjump.yellow">Você é nosso convidado!</div>
        <h3 className="text-3xl font-black leading-tight drop-shadow-lg">{nome || 'Nome do aniversariante'}</h3>
        <div className="space-y-2 text-base text-white/90">
          <InfoLine label="Idade" value={idade ? `${idade} anos` : '—'} />
          <InfoLine label="Data" value={formattedDate || '—'} />
          <InfoLine label="Horário" value={horarioTexto || '—'} />
          <InfoLine label="Salão" value={sala || '—'} />
        </div>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em]">
      <span className="text-white/60">{label}</span>
      <span className={clsx('font-semibold text-white', value === '—' && 'text-white/40')}>{value}</span>
    </div>
  );
}
