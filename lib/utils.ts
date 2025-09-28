import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatTimeRange(inicio?: string | null, fim?: string | null) {
  if (!inicio && !fim) return null;
  if (inicio && !fim) return `${inicio}`;
  if (!inicio && fim) return `${fim}`;
  return `${inicio} - ${fim}`;
}

export function formatCountdown(target: Date | string) {
  const date = target instanceof Date ? target : new Date(target);
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}

export function buildInviteUrl(token: string) {
  const base = process.env.INVITE_BASE_URL ?? 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/convite/${token}`;
}

export const ADMIN_SESSION_COOKIE = 'bigjump_admin';
