"use client";

import { useState } from 'react';

interface Props {
  festaId: number;
}

export function RsvpForm({ festaId }: Props) {
  const [nome, setNome] = useState('');
  const [acompanhantes, setAcompanhantes] = useState(0);
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setFeedback(null);

    try {
      const response = await fetch('/api/confirmados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ festaId, nome, acompanhantes, mensagem })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? 'Não foi possível confirmar sua presença.');
      }

      setStatus('success');
      setFeedback('Presença confirmada com sucesso! Obrigado.');
      setNome('');
      setAcompanhantes(0);
      setMensagem('');
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'Tente novamente em instantes.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white/80 p-6 backdrop-blur">
      <div>
        <label className="block text-sm font-medium text-slate-600">Seu nome</label>
        <input
          required
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Quantidade de acompanhantes</label>
        <input
          type="number"
          min={0}
          value={acompanhantes}
          onChange={(event) => setAcompanhantes(Number(event.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Mensagem (opcional)</label>
        <textarea
          value={mensagem}
          onChange={(event) => setMensagem(event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-bigjump.blue focus:outline-none focus:ring-2 focus:ring-bigjump.blue/20"
        />
      </div>
      {feedback && (
        <p className={`text-sm ${status === 'success' ? 'text-emerald-600' : 'text-bigjump.red'}`}>{feedback}</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-full bg-bigjump.red px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-bigjump.red/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? 'Enviando...' : 'Confirmar presença'}
      </button>
    </form>
  );
}
