import { readFile } from 'fs/promises';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { buildInviteUrl, formatDate, formatTimeRange } from './utils';
import { Festa, Convite } from '@prisma/client';

export async function generateInvitationPdf(festa: Festa & { convite?: Convite | null }) {
  if (!festa.convite) {
    throw new Error('Convite não encontrado para esta festa.');
  }

  const conviteUrl = buildInviteUrl(festa.convite.token);
  const templatePath = path.join(process.cwd(), 'public', 'template', 'convite-base.png');
  const template = await readFile(templatePath);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([1080, 1920]);
  const background = await pdfDoc.embedPng(template);
  page.drawImage(background, {
    x: 0,
    y: 0,
    width: 1080,
    height: 1920
  });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const title = festa.nome;
  page.drawText(title.toUpperCase(), {
    x: 80,
    y: 1400,
    size: 36,
    font,
    color: rgb(1, 1, 1)
  });

  const details: Array<{ label: string; value: string | null }> = [
    { label: 'Idade', value: festa.idade ? `${festa.idade} anos` : null },
    { label: 'Data', value: formatDate(festa.data) },
    { label: 'Horário', value: formatTimeRange(festa.horaInicio, festa.horaFim) },
    { label: 'Salão', value: festa.sala }
  ];

  let offset = 1280;
  details.forEach((detail) => {
    if (!detail.value) return;
    page.drawText(`${detail.label}: ${detail.value}`, {
      x: 80,
      y: offset,
      size: 24,
      font: regular,
      color: rgb(1, 1, 1)
    });
    offset -= 60;
  });

  const qrDataUrl = await QRCode.toDataURL(conviteUrl);
  const qrImage = await pdfDoc.embedPng(Buffer.from(qrDataUrl.split(',')[1] ?? '', 'base64'));

  page.drawImage(qrImage, {
    x: 780,
    y: 260,
    width: 220,
    height: 220
  });

  page.drawText('Confirme sua presença pelo QR Code ou link:', {
    x: 80,
    y: 420,
    size: 18,
    font: regular,
    color: rgb(1, 1, 1)
  });

  page.drawText(conviteUrl, {
    x: 80,
    y: 380,
    size: 14,
    font,
    color: rgb(1, 1, 1)
  });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

