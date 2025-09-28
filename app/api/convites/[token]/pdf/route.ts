import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvitationPdf } from '@/lib/pdf-generator';

export async function GET(_: NextRequest, { params }: { params: { token: string } }) {
  const festa = await prisma.festa.findFirst({
    where: {
      convite: {
        token: params.token
      }
    },
    include: {
      convite: true
    }
  });

  if (!festa || !festa.convite) {
    return NextResponse.json({ message: 'Convite não encontrado.' }, { status: 404 });
  }

  try {
    const pdf = await generateInvitationPdf(festa);
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=convite-${params.token}.pdf`
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao gerar PDF.' }, { status: 500 });
  }
}