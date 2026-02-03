# Next.js 16 - Referencia de Cambios

Documento de referencia para el proyecto SAVIA sobre los cambios importantes en Next.js 16.

---

## 1. Middleware renombrado a Proxy

El archivo `middleware.ts` fue **deprecado** y renombrado a `proxy.ts`.

### Cambios requeridos:

**Nombre del archivo:**
```bash
# Antes (Next.js 15)
middleware.ts

# Ahora (Next.js 16)
proxy.ts
```

**Nombre de la funcion exportada:**
```typescript
// Antes (Next.js 15)
export function middleware(request: NextRequest) {}

// Ahora (Next.js 16)
export function proxy(request: NextRequest) {}
```

**Ubicacion:** El archivo `proxy.ts` debe estar en `src/` (si usas src) o en la raiz del proyecto.

---

## 2. Estructura del Proxy

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas publicas (no requieren autenticacion)
const publicRoutes = ['/login', '/signup', '/privacidad']

// Rutas protegidas (requieren autenticacion)
const protectedRoutes = ['/dashboard', '/alertas', '/usuarios']

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const sessionCookie = request.cookies.get('session')?.value

  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  // Usuario no autenticado en ruta protegida -> login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Usuario autenticado en ruta publica -> dashboard
  if (isPublicRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Config: excluir rutas estaticas y de API
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 3. Config Matcher

El `matcher` define en que rutas se ejecuta el proxy:

```typescript
export const config = {
  // Patron simple
  matcher: '/dashboard/:path*',

  // Multiples patrones
  matcher: ['/dashboard/:path*', '/admin/:path*'],

  // Excluir rutas (regex negativo)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### Matcher avanzado (excluir prefetch):
```typescript
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

---

## 4. APIs Asincronas (Breaking Change)

En Next.js 16, las siguientes APIs son **completamente asincronas** (ya no hay compatibilidad sincrona):

- `cookies()`
- `headers()`
- `draftMode()`
- `params` en layout.js, page.js, route.js
- `searchParams` en page.js

### Ejemplo:
```typescript
// Antes (Next.js 15) - sincrono
export default function Page({ params }) {
  const { id } = params
}

// Ahora (Next.js 16) - asincrono
export default async function Page({ params }) {
  const { id } = await params
}
```

---

## 5. Configuracion de Next.js

Flags renombrados en `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Antes: skipMiddlewareUrlNormalize
  skipProxyUrlNormalize: true,
}

export default nextConfig
```

---

## 6. Codemod de Migracion

Para migrar automaticamente de Next.js 15 a 16:

```bash
npx @next/codemod@canary upgrade latest
```

Este codemod:
- Renombra `middleware.ts` a `proxy.ts`
- Renombra la funcion `middleware` a `proxy`
- Actualiza APIs asincronas
- Actualiza configuracion

---

## 7. Referencia Rapida

| Next.js 15 | Next.js 16 |
|------------|------------|
| `middleware.ts` | `proxy.ts` |
| `export function middleware()` | `export function proxy()` |
| `params.id` (sincrono) | `await params` (asincrono) |
| `searchParams.query` | `await searchParams` |
| `skipMiddlewareUrlNormalize` | `skipProxyUrlNormalize` |

---

## Fuentes

- [Next.js 16 Upgrade Guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-16.mdx)
- [Proxy API Reference](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/proxy.mdx)
- [Authentication Guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx)
