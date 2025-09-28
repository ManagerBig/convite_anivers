export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-6 text-white">
      <div className="rounded-3xl bg-white/10 p-8 text-center shadow-lg backdrop-blur">
        <h1 className="text-3xl font-bold">Conteudo nao encontrado</h1>
        <p className="mt-2 text-sm text-white/70">O recurso solicitado pode ter sido removido ou nao existe.</p>
        <a href="/" className="mt-6 inline-flex items-center rounded-full bg-bigjump.red px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white shadow-lg shadow-bigjump.red/40">
          Voltar para a pagina inicial
        </a>
      </div>
    </main>
  );
}