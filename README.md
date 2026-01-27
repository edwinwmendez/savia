# SAVIA - Sistema de Alertas Vecinales Integrado de Atalaya

Sistema de seguridad ciudadana que permite a los vecinos de Atalaya reportar emergencias geolocalizadas y recibir atención coordinada por parte de las instituciones del COPROSEC (PNP, Serenazgo, Bomberos, Salud).

## Estructura del Proyecto

```md
savia/
├── savia-mobile/     # App móvil (React Native + Expo)
├── savia-admin/      # Panel web administrativo (Next.js)
├── backend/          # Backend serverless (Firebase)
│   ├── functions/    # Cloud Functions
│   ├── firestore.rules
│   └── storage.rules
└── docs/             # Documentación del proyecto
    ├── PRD_SAVIA_COMPLETO.md
    ├── SAVIA_System_Design_COMPLETO.md
    └── SAVIA_UI_SPECS_COMPLETO.md
```

## Stack Tecnológico

### App Móvil (`savia-mobile`)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|

| React Native | 0.83+ | Framework de desarrollo móvil |
| Expo | SDK 55 | Herramientas y servicios para RN |
| TypeScript | 5.9+ | Tipado estático |
| React Navigation | 7.x | Navegación entre pantallas |

### Panel Web (`savia-admin`)
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.x | Framework React con SSR |
| TypeScript | 5.9+ | Tipado estático |
| Tailwind CSS | 4.x | Framework CSS utility-first |

### Backend
| Servicio | Propósito |
|----------|-----------|
| Firebase Authentication | Autenticación de usuarios |
| Cloud Firestore | Base de datos NoSQL |
| Firebase Storage | Almacenamiento de archivos |
| Cloud Functions | Lógica serverless |
| Cloud Messaging (FCM) | Notificaciones push |

## Requisitos Previos

- Node.js 20+
- pnpm 10+
- Cuenta de Firebase
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS, solo macOS)

## Instalación

### App Móvil
```bash
cd savia-mobile
pnpm install
pnpm start
```

### Panel Web Admin
```bash
cd savia-admin
pnpm install
pnpm dev
```

### Backend (Firebase Functions)
```bash
cd backend/functions
pnpm install
pnpm build
```

## Scripts Disponibles

### savia-mobile
- `pnpm start` - Inicia Expo
- `pnpm android` - Ejecuta en Android
- `pnpm ios` - Ejecuta en iOS
- `pnpm web` - Ejecuta en navegador

### savia-admin
- `pnpm dev` - Servidor de desarrollo
- `pnpm build` - Build de producción
- `pnpm start` - Inicia servidor de producción

### backend
- `firebase emulators:start` - Inicia emuladores locales
- `firebase deploy` - Despliega a producción

## Autor

**Edwin Wilson Méndez Echevarría**
Universidad Continental
Ingeniería de Sistemas e Informática
