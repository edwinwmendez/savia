import { NextResponse, type NextRequest } from 'next/server';

// Rutas de autenticacion: redirigir a / si ya esta autenticado
const authRoutes = ['/login'];

// Rutas publicas: accesibles siempre (autenticado o no)
const publicRoutes = ['/privacidad', '/eliminar-cuenta'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__savia_admin_session');

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Rutas publicas: siempre accesibles, no hacer nada
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Authenticated user trying to access login -> redirect to dashboard
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Unauthenticated user trying to access protected route -> redirect to login
  if (!isAuthRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
