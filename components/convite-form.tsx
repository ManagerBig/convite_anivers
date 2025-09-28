"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Festa, Convite } from '@prisma/client';
import { ConvitePreview } from './convite-preview';
import { UploadImage } from './upload-image';

export type ConviteFormValues = {
  nome: string;
  idade: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  sala: string;
  capacidade: string;
};

type Props = {
  initialData?: (Festa & { convite?: Convite | null }) | null;
  mode?: 'create' | 'edit';
};

export function ConviteForm({ initialData, mode = 'create' }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<ConviteFormValues>({
    nome: initialData?.nome ?? '',
    idade: initialData?.idade?.toString() ?? '',
    data: initialData?.data ? new Date(initialData.data).toISOString().slice(0, 10) : '',
    horaInicio: initialData?.horaInicio ?? '',
    horaFim: initialData?.horaFim ?? '',
    sala: initialData?.sala ?? '',
    capacidade: initialData?.capacidade?.toString() ?? ''
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.fotoUrl ?? null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const actionLabel = mode === 'edit' ? 'Atualizar festa' : 'Criar festa';

  const inviteData = useMemo(() => ({
    ...values,
    fotoUrl: photoPreview,
    token: initialData?.convite?.token ?? ''
  }), [values, photoPreview, initialData?.convite?.token]);

  const handleValueChange = (key: keyof ConviteFormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const endpoint =
      mode === 'edit' && initialData ? `/api/festas/${initialData.id}` : '/api/festas';
    const method = mode === 'edit' ? 'PATCH' : 'POST';

    const formData = new FormData();
    formData.append('nome', values.nome);
    formData.append('idade', values.idade);
    formData.append('data', values.data);
    formData.append('horaInicio', values.horaInicio);
    formData.append('horaFim', values.horaFim);
    formData.append('sala', values.sala);
    formData.append('capacidade', values.capacidade);
    if (photoFile) {
      formData.append('foto', photoFile);
    }

    try {
      const response = await fetch(endpoint, {
        method,
        body: formData
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message ?? 'Não foi possível salvar a festa.');
      }

      const data = await response.json();
      setMessage('Convite salvo com sucesso!');
      if (mode === 'create') {
        router.replace(`/admin/festas/${data.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5">
        <div>
          <label className="block text-sm font-medium text-slate-600">Nome do aniversariante</label>
          <input
            required
            value={values.nome}
            onChange={handleValueChange('nome')}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-600">Idade</label>
            <input
              type="number"
              min={1}
              value={values.idade}
              onChange={handleValueChange('idade')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600">Data da festa</label>
            <input
              type="date"
              required
              value={values.data}
              onChange={handleValueChange('data')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600">Horário de início</label>
            <input
              type="time"
              value={values.horaInicio}
              onChange={handleValueChange('horaInicio')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Horário de término</label>
            <input
              type="time"
              value={values.horaFim}
              onChange={handleValueChange('horaFim')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Salão</label>
          <input
            required
            value={values.sala}
            onChange={handleValueChange('sala')}
            placeholder="Ex.: Beverly Hills"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Capacidade</label>
          <input
            type="number"
            min={0}
            value={values.capacidade}
            onChange={handleValueChange('capacidade')}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
          />
        </div>
        <UploadImage
          initialUrl={photoPreview}
          onFileSelected={(file, previewUrl) => {
            setPhotoFile(file);
            setPhotoPreview(previewUrl);
          }}
        />
        {message && (
          <p className="text-sm text-slate-600">{message}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-bigjump.blue px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-bigjump.blue/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Salvando...' : actionLabel}
        </button>
      </form>
      <DivPreview inviteData={inviteData} />
    </div>
  );
}

function DivPreview({ inviteData }: { inviteData: Record<string, string | null> }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5">
      <h2 className="text-lg font-semibold text-slate-700">Pré-visualização</h2>
      <p className="mt-1 text-sm text-slate-500">
        Os dados abaixo são atualizados conforme o formulário.
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-invite-template bg-cover bg-center">
        <ConvitePreview
          nome={inviteData.nome ?? ''}
          idade={inviteData.idade ?? ''}
          data={inviteData.data ?? ''}
          horaInicio={inviteData.horaInicio ?? ''}
          horaFim={inviteData.horaFim ?? ''}
          sala={inviteData.sala ?? ''}
          fotoUrl={inviteData.fotoUrl ?? undefined}
        />
      </div>
    </div>
  );
}
