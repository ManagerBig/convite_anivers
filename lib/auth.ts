import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, randomBytes } from 'crypto';
import { ADMIN_SESSION_COOKIE } from './utils';

const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? randomBytes(16).toString('hex');
const expectedPassword = process.env.ADMIN_PASSWORD ?? 'change-me';
const sessionValue = createHash('sha256').update(expectedPassword + sessionSecret).digest('hex');

export function isAuthenticated() {
  const store = cookies();
  const cookie = store.get(ADMIN_SESSION_COOKIE);
  return cookie?.value === sessionValue;
}

export function requireAdmin() {
  if (!isAuthenticated()) {
    redirect('/admin/login');
  }
}

export function createAdminSession() {
  const store = cookies();
  store.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8
  });
}

export function clearAdminSession() {
  cookies().delete(ADMIN_SESSION_COOKIE);
}

export function validateAdminPassword(password: string) {
  return password === expectedPassword;
}
