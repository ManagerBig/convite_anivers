import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildInviteUrl } from '@/lib/utils';

export async function GET(_: NextRequest, { params }: { params: { token: string } }) {
  const convite = await prisma.convite.findUnique({
    where: { token: params.token },
    include: {
      Festa: {
        include: {
          confirmados: true
        }
      }
    }
  });

  if (!convite) {
    return NextResponse.json({ message: 'Convite não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({
    convite,
    festa: convite.Festa,
    link: buildInviteUrl(convite.token)
  });
}