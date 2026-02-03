import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = ['/login', '/privacidad'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__savia_admin_session');
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Authenticated user trying to access login -> redirect to dashboard
  if (isPublicRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Unauthenticated user trying to access protected route -> redirect to login
  if (!isPublicRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
