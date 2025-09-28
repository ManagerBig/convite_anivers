import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createAdminSession, validateAdminPassword } from '@/lib/auth';
import { ADMIN_SESSION_COOKIE } from '@/lib/utils';
import { Suspense } from 'react';
import LoginForm from './login-form';

type LoginState = {
  error?: string;
};

async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  'use server';

  const password = formData.get('password')?.toString() ?? '';
  const redirectTo = formData.get('redirectTo')?.toString() || '/admin/festas';

  if (!validateAdminPassword(password)) {
    return { error: 'Senha inválida. Tente novamente.' };
  }

  createAdminSession();
  redirect(redirectTo);
}

export default async function AdminLoginPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const redirectTo = searchParams?.redirectTo ?? '/admin/festas';
  const isLogged = cookies().get(ADMIN_SESSION_COOKIE);
  if (isLogged) {
    redirect('/admin/festas');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/10 p-8 text-white shadow-xl backdrop-blur">
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="Big Jump" className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-2xl font-semibold">Painel Big Jump</h1>
          <p className="text-sm text-white/70">Entre com a senha administrativa para acessar o painel.</p>
        </div>
        <Suspense fallback={<div>Carregando...</div>}>
          <LoginForm loginAction={loginAction} redirectTo={redirectTo} />
        </Suspense>
      </div>
    </main>
  );
}