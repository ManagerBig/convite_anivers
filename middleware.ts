import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'bigjump_admin';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const isAuthenticated = request.cookies.get(ADMIN_COOKIE);

  if (!isLoginPage && pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isLoginPage && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/admin/festas';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};