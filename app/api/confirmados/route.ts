import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const festaIdParam = request.nextUrl.searchParams.get('festaId');
  const festaId = festaIdParam ? Number.parseInt(festaIdParam, 10) : null;

  if (!festaId) {
    return NextResponse.json({ message: 'Informe o identificador da festa.' }, { status: 400 });
  }

  const confirmados = await prisma.confirmado.findMany({
    where: { festaId },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(confirmados);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });
  }

  const { festaId, nome, acompanhantes, mensagem } = body as {
    festaId?: number;
    nome?: string;
    acompanhantes?: number;
    mensagem?: string;
  };

  if (!festaId || !nome) {
    return NextResponse.json({ message: 'Preencha nome e festa.' }, { status: 400 });
  }

  const festa = await prisma.festa.findUnique({ where: { id: festaId }, include: { convite: true } });
  if (!festa) {
    return NextResponse.json({ message: 'Festa não encontrada.' }, { status: 404 });
  }

  const created = await prisma.confirmado.create({
    data: {
      festaId,
      nome,
      acompanhantes: Math.max(0, Number(acompanhantes ?? 0)),
      mensagem: mensagem?.toString().trim() || null
    }
  });

  return NextResponse.json(created, { status: 201 });
}