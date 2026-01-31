# SAVIA Backend - Firebase

Backend serverless para el Sistema de Alertas Vecinales Integrado de Atalaya.

## Estructura

```
backend/
├── functions/              # Cloud Functions
│   ├── src/
│   │   └── index.ts       # Funciones principales
│   ├── package.json
│   └── tsconfig.json
├── firebase.json          # Configuración de Firebase
├── .firebaserc            # Proyecto de Firebase
├── firestore.rules        # Reglas de seguridad Firestore
├── firestore.indexes.json # Índices de Firestore
└── storage.rules          # Reglas de seguridad Storage
```

## Servicios de Firebase Utilizados

| Servicio | Propósito |
|----------|-----------|
| Firebase Authentication | Autenticación de usuarios |
| Cloud Firestore | Base de datos NoSQL en tiempo real |
| Firebase Storage | Almacenamiento de imágenes/videos |
| Cloud Functions | Lógica de negocio serverless |
| Cloud Messaging (FCM) | Notificaciones push |

## Cloud Functions

| Función | Tipo | Descripción |
|---------|------|-------------|
| `onAlertCreated` | Trigger Firestore | Notifica a agentes cuando se crea una alerta |
| `onAlertUpdated` | Trigger Firestore | Notifica al ciudadano cuando cambia el estado |
| `registerCitizen` | HTTPS Callable | Registra nuevos ciudadanos |
| `getDashboardStats` | HTTPS Callable | Obtiene estadísticas para el panel admin |

## Configuración

### Requisitos Previos

1. [Firebase CLI](https://firebase.google.com/docs/cli) instalado
2. Proyecto de Firebase creado
3. Node.js 20+

### Instalación

```bash
# Instalar Firebase CLI (si no lo tienes)
pnpm add -g firebase-tools

# Iniciar sesión en Firebase
firebase login

# Instalar dependencias de functions
cd functions
pnpm install
```

### Configurar Proyecto

1. Edita `.firebaserc` con el ID de tu proyecto:
```json
{
  "projects": {
    "default": "tu-proyecto-id"
  }
}
```

## Desarrollo Local

### Iniciar Emuladores

```bash
# Desde la carpeta backend
firebase emulators:start
```

Los emuladores estarán disponibles en:
- **UI**: http://localhost:4000
- **Auth**: http://localhost:9099
- **Firestore**: http://localhost:8080
- **Functions**: http://localhost:5001
- **Storage**: http://localhost:9199

### Compilar Functions

```bash
cd functions
pnpm build
```

## Despliegue

### Desplegar Todo

```bash
firebase deploy
```

### Desplegar Solo Functions

```bash
firebase deploy --only functions
```

### Desplegar Solo Reglas

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Colecciones de Firestore

| Colección | Descripción |
|-----------|-------------|
| `users` | Usuarios del sistema (ciudadanos, agentes, admins) |
| `alerts` | Alertas reportadas |
| `institutions` | Instituciones (PNP, Serenazgo, etc.) |
| `categories` | Categorías de alertas |
| `ratings` | Calificaciones de atención |
| `notifications` | Notificaciones del sistema |

## Reglas de Seguridad

Las reglas están definidas en `firestore.rules` y `storage.rules`. Implementan:

- Autenticación obligatoria para todas las operaciones
- Control de acceso basado en roles (citizen, agent, admin)
- Validación de datos en escrituras
- Protección de datos sensibles
