import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import prisma from '@/lib/prisma';
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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 });
  }

  const festaId = Number.parseInt(params.id, 10);
  const festa = await prisma.festa.findUnique({
    where: { id: festaId },
    include: {
      convite: true,
      confirmados: true
    }
  });

  if (!festa) {
    return NextResponse.json({ message: 'Festa nao encontrada.' }, { status: 404 });
  }

  return NextResponse.json(festa);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 });
  }

  const festaId = Number.parseInt(params.id, 10);
  const festaExistente = await prisma.festa.findUnique({ where: { id: festaId } });

  if (!festaExistente) {
    return NextResponse.json({ message: 'Festa nao encontrada.' }, { status: 404 });
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

  const fotoUrl = foto ? await persistFile(foto) : festaExistente.fotoUrl;
  const idadeNumero = parseOptionalInt(idade ?? null);
  const capacidadeNumero = parseOptionalInt(capacidade ?? null);

  try {
    const festa = await prisma.festa.update({
      where: { id: festaId },
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

    return NextResponse.json(festa);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao atualizar festa.' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 });
  }

  const festaId = Number.parseInt(params.id, 10);

  try {
    await prisma.festa.delete({ where: { id: festaId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao excluir festa.' }, { status: 500 });
  }
}