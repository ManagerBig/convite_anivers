import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import prisma from '@/lib/prisma';
import { buildInviteUrl } from '@/lib/utils';

export async function GET(_: NextRequest, { params }: { params: { token: string } }) {
  const convite = await prisma.convite.findUnique({ where: { token: params.token } });
  if (!convite) {
    return NextResponse.json({ message: 'Convite não encontrado.' }, { status: 404 });
  }

  const link = buildInviteUrl(convite.token);
  const buffer = await QRCode.toBuffer(link, { width: 512, margin: 1 });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}