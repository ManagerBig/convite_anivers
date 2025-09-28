import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import prisma from '@/lib/prisma';
import { buildInviteUrl } from '@/lib/utils';
import { isAuthenticated } from '@/lib/auth';

async function ensureUploadsDir() {
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsPath, { recursive: true });
  return uploadsPath;
}

async function persistFile(file: File) {
  if (!file || file.size === 0) return null;
  const uploadsPath = await ensureUploadsDir();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = path.extname(file.name) || '.png';
  const safeName = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
  const destination = path.join(uploadsPath, safeName);
  await fs.writeFile(destination, buffer);
  return `/uploads/${safeName}`;
}

function parseOptionalInt(value: string | null | undefined) {
  if (!value || value.trim() === '') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseOptionalString(value: string | null | undefined) {
  if (!value || value.trim() === '') return null;
  return value;
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 });
  }

  const festas = await prisma.festa.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      convite: true,
      confirmados: true
    }
  });

  return NextResponse.json(festas);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 });
  }

  const formData = await request.formData();
  const nome = formData.get('nome')?.toString().trim();
  const dataBruta = formData.get('data')?.toString();
  const idade = formData.get('idade')?.toString();
  const horaInicio = formData.get('horaInicio')?.toString();
  const horaFim = formData.get('horaFim')?.toString();
  const sala = formData.get('sala')?.toString().trim();
  const capacidade = formData.get('capacidade')?.toString();
  const foto = formData.get('foto') as File | null;

  if (!nome || !dataBruta || !sala) {
    return NextResponse.json({ message: 'Campos obrigatorios ausentes.' }, { status: 400 });
  }

  const data = new Date(dataBruta);
  if (Number.isNaN(data.getTime())) {
    return NextResponse.json({ message: 'Data invalida.' }, { status: 400 });
  }

  const fotoUrl = foto ? await persistFile(foto) : null;
  const idadeNumero = parseOptionalInt(idade ?? null);
  const capacidadeNumero = parseOptionalInt(capacidade ?? null);
  const token = randomUUID().replace(/-/g, '').slice(0, 12);
  const link = buildInviteUrl(token);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const festa = await tx.festa.create({
        data: {
          nome,
          data,
          idade: idadeNumero,
          horaInicio: parseOptionalString(horaInicio),
          horaFim: parseOptionalString(horaFim),
          sala,
          capacidade: capacidadeNumero,
          fotoUrl
        }
      });

      const convite = await tx.convite.create({
        data: {
          festaId: festa.id,
          token,
          link
        }
      });

      return { festa, convite };
    });

    return NextResponse.json(
      {
        id: result.festa.id,
        token: result.convite.token
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao salvar festa.' }, { status: 500 });
  }
}