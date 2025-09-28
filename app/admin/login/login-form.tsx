"use client";

import { useFormState, useFormStatus } from 'react-dom';

interface Props {
  loginAction: (state: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
  redirectTo: string;
}

const initialState = { error: undefined };

export default function LoginForm({ loginAction, redirectTo }: Props) {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div>
        <label className="block text-sm font-medium text-white/80">Senha de administrador</label>
        <input
          type="password"
          name="password"
          required
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-bigjump.yellow focus:outline-none focus:ring-2 focus:ring-bigjump.yellow/40"
          placeholder="Digite a senha"
        />
      </div>
      {state?.error && <p className="text-sm text-red-300">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-bigjump.red px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-bigjump.red/40 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}