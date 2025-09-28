import { ConviteForm } from '@/components/convite-form';

export default function NovaFestaPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Cadastrar nova festa</h1>
        <p className="text-sm text-slate-500">Preencha os dados para gerar o convite automaticamente.</p>
      </header>
      <ConviteForm />
    </div>
  );
}