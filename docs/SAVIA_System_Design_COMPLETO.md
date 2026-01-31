# SAVIA - System Design Document
## Sistema de Alertas Vecinales Integrado de Atalaya

**Versión:** 1.0  
**Fecha:** 24 de Enero 2026  
**Autor:** Edwin Wilson Méndez Echevarría

---

# 1. VISIÓN GENERAL DEL SISTEMA

## 1.1 Descripción
SAVIA es una plataforma de seguridad ciudadana que permite a los vecinos de Atalaya reportar emergencias geolocalizadas y recibir atención coordinada por parte de las instituciones del COPROSEC (PNP, Serenazgo, Bomberos, Salud).

## 1.2 Plataformas a Desarrollar

| Plataforma | Tecnología | Usuarios | Propósito |
|------------|------------|----------|-----------|
| **App Móvil** | React Native + Expo | Ciudadanos, Agentes | Reportar y atender alertas |
| **Panel Web** | Next.js 16 | Administradores COPROSEC | Gestión, monitoreo y reportes |

## 1.3 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────┬───────────────────────────────┤
│      APP MÓVIL                  │         PANEL WEB             │
│  React Native + Expo            │         Next.js 16            │
│  React Navigation               │         Tailwind CSS          │
│  Expo Location                  │         Recharts              │
│  React Native Maps              │         React Leaflet         │
├─────────────────────────────────┴───────────────────────────────┤
│                        BACKEND (Firebase)                        │
├─────────────────────────────────────────────────────────────────┤
│  Firebase Auth          │  Autenticación email/password         │
│  Cloud Firestore        │  Base de datos NoSQL tiempo real      │
│  Cloud Storage          │  Almacenamiento de imágenes/videos    │
│  Cloud Functions        │  Lógica de negocio serverless         │
│  Cloud Messaging (FCM)  │  Notificaciones push                  │
├─────────────────────────────────────────────────────────────────┤
│                     SERVICIOS EXTERNOS                           │
├─────────────────────────────────────────────────────────────────┤
│  Google Maps API        │  Mapas, geocoding, direcciones        │
│  Google Places API      │  Autocompletado de direcciones        │
└─────────────────────────────────────────────────────────────────┘
```

---

# 2. ARQUITECTURA DEL SISTEMA

## 2.1 Diagrama de Arquitectura

```
                                    ┌─────────────────┐
                                    │   Google Maps   │
                                    │      API        │
                                    └────────┬────────┘
                                             │
┌──────────────────┐    ┌──────────────────┐ │ ┌──────────────────┐
│                  │    │                  │ │ │                  │
│   APP MÓVIL      │    │   PANEL WEB      │ │ │   FIREBASE       │
│   (React Native) │    │   (Next.js)      │ │ │   SERVICES       │
│                  │    │                  │ │ │                  │
│  ┌────────────┐  │    │  ┌────────────┐  │ │ │  ┌────────────┐  │
│  │ Ciudadano  │  │    │  │ Dashboard  │  │ │ │  │   Auth     │  │
│  │   View     │  │    │  │   View     │  │ │ │  └────────────┘  │
│  └────────────┘  │    │  └────────────┘  │ │ │  ┌────────────┐  │
│  ┌────────────┐  │    │  ┌────────────┐  │ │ │  │ Firestore  │  │
│  │ Agente   │  │    │  │  Reportes  │  │◄┼─┼─►│  Database  │  │
│  │   View     │  │    │  │   View     │  │ │ │  └────────────┘  │
│  └────────────┘  │    │  └────────────┘  │ │ │  ┌────────────┐  │
│                  │    │  ┌────────────┐  │ │ │  │  Storage   │  │
│                  │    │  │  Gestión   │  │ │ │  └────────────┘  │
│                  │    │  │   View     │  │ │ │  ┌────────────┐  │
│                  │    │  └────────────┘  │ │ │  │    FCM     │  │
│                  │    │                  │ │ │  └────────────┘  │
└────────┬─────────┘    └────────┬─────────┘ │ │  ┌────────────┐  │
         │                       │           │ │  │ Functions  │  │
         │                       │           │ │  └────────────┘  │
         └───────────────────────┴───────────┴─┴──────────────────┘
```

## 2.2 Flujo de Datos Principal

```
CIUDADANO                    FIREBASE                      AGENTE/ADMIN
    │                            │                              │
    │  1. Crea Alerta           │                              │
    ├──────────────────────────►│                              │
    │                           │  2. Guarda en Firestore      │
    │                           ├─────────────────────────────►│
    │                           │  3. Trigger Cloud Function   │
    │                           │  4. Envía Push (FCM)         │
    │                           ├─────────────────────────────►│
    │                           │                              │
    │                           │  5. Agente toma caso       │
    │                           │◄─────────────────────────────┤
    │  6. Notificación cambio   │                              │
    │◄──────────────────────────┤                              │
    │                           │                              │
```

---

# 3. DESIGN SYSTEM - SAVIA

## 3.1 Paleta de Colores

### Colores Primarios
| Nombre | Hex | Uso |
|--------|-----|-----|
| **Primary** | `#1976D2` | Botones principales, links, headers |
| **Primary Dark** | `#1565C0` | Estados hover/pressed |
| **Primary Light** | `#BBDEFB` | Backgrounds suaves, badges |

### Colores de Estado
| Nombre | Hex | Uso |
|--------|-----|-----|
| **Success** | `#4CAF50` | Alertas resueltas, confirmaciones |
| **Warning** | `#FF9800` | Alertas en atención, advertencias |
| **Error** | `#F44336` | Errores, alertas críticas |
| **Info** | `#2196F3` | Información, alertas reportadas |

### Colores de Urgencia
| Urgencia | Hex | Badge |
|----------|-----|-------|
| **Crítica** | `#D32F2F` | Rojo intenso |
| **Alta** | `#F57C00` | Naranja |
| **Media** | `#FBC02D` | Amarillo |
| **Baja** | `#388E3C` | Verde |

### Colores Neutros
| Nombre | Hex | Uso |
|--------|-----|-----|
| **Background** | `#F5F5F5` | Fondo de pantallas |
| **Surface** | `#FFFFFF` | Cards, modales |
| **Text Primary** | `#212121` | Texto principal |
| **Text Secondary** | `#757575` | Texto secundario |
| **Border** | `#E0E0E0` | Bordes, divisores |

## 3.2 Tipografía

### Familia: Inter (Google Fonts)
- Disponible en React Native y Web
- Excelente legibilidad en pantallas pequeñas

### Escala Tipográfica
| Estilo | Tamaño | Peso | Uso |
|--------|--------|------|-----|
| **H1** | 32px | Bold (700) | Títulos de pantalla |
| **H2** | 24px | SemiBold (600) | Secciones principales |
| **H3** | 20px | SemiBold (600) | Subsecciones |
| **H4** | 18px | Medium (500) | Títulos de cards |
| **Body** | 16px | Regular (400) | Texto general |
| **Body Small** | 14px | Regular (400) | Texto secundario |
| **Caption** | 12px | Regular (400) | Labels, hints |
| **Button** | 16px | SemiBold (600) | Botones |

## 3.3 Espaciado (8px Grid System)

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | 4px | Espaciado mínimo |
| `sm` | 8px | Padding interno pequeño |
| `md` | 16px | Padding estándar |
| `lg` | 24px | Separación de secciones |
| `xl` | 32px | Márgenes de pantalla |
| `2xl` | 48px | Separación grande |

## 3.4 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `sm` | 4px | Inputs, badges pequeños |
| `md` | 8px | Cards, botones |
| `lg` | 12px | Modales, cards grandes |
| `xl` | 16px | Bottom sheets |
| `full` | 9999px | Avatares, FAB |

## 3.5 Sombras

```css
/* Elevación 1 - Cards */
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)

/* Elevación 2 - Cards elevadas, dropdowns */
shadow-md: 0 4px 6px rgba(0,0,0,0.1)

/* Elevación 3 - Modales, FAB */
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)

/* Elevación 4 - Dialogs */
shadow-xl: 0 20px 25px rgba(0,0,0,0.15)
```

## 3.6 Iconografía

**Librería:** Lucide Icons (lucide-react / lucide-react-native)
- Consistente entre web y móvil
- Estilo outline limpio
- Tamaños: 16px, 20px, 24px, 32px

### Iconos por Categoría de Alerta
| Categoría | Icono | Color |
|-----------|-------|-------|
| Robo/Asalto | `shield-alert` | `#D32F2F` |
| Accidente tránsito | `car` | `#F57C00` |
| Emergencia médica | `heart-pulse` | `#E91E63` |
| Incendio | `flame` | `#FF5722` |
| Falla eléctrica | `zap-off` | `#FFC107` |
| Problema de agua | `droplets` | `#2196F3` |
| Pérdida/Hallazgo | `search` | `#9C27B0` |
| Otro | `alert-circle` | `#607D8B` |

---

# 4. MÓDULOS DEL SISTEMA

## 4.1 Mapa de Módulos

```
SAVIA
├── 📱 APP MÓVIL
│   ├── 👤 MÓDULO CIUDADANO
│   │   ├── Autenticación (Login/Registro)
│   │   ├── Home (Acciones rápidas)
│   │   ├── Nueva Alerta (Crear reporte)
│   │   ├── Mis Alertas (Historial)
│   │   ├── Alertas Cercanas (Mapa)
│   │   ├── Notificaciones
│   │   └── Perfil/Configuración
│   │
│   └── 🛡️ MÓDULO AGENTE
│       ├── Home Agente
│       ├── Alertas Asignadas
│       ├── Atender Alerta
│       ├── Historial Atendidas
│       └── Perfil Agente
│
└── 💻 PANEL WEB
    └── 👔 MÓDULO ADMINISTRADOR
        ├── Dashboard (Monitoreo)
        ├── Gestión de Alertas
        ├── Gestión de Instituciones
        ├── Gestión de Usuarios
        ├── Gestión de Categorías
        ├── Reportes Estadísticos
        └── Configuración Sistema
```

## 4.2 Permisos por Rol

| Funcionalidad | Ciudadano | Agente | Admin |
|---------------|:---------:|:--------:|:-----:|
| Crear alertas | ✅ | ❌ | ❌ |
| Ver mis alertas | ✅ | ❌ | ❌ |
| Ver alertas cercanas | ✅ | ❌ | ❌ |
| Calificar atención | ✅ | ❌ | ❌ |
| Ver alertas asignadas | ❌ | ✅ | ✅ |
| Atender alertas | ❌ | ✅ | ❌ |
| Derivar alertas | ❌ | ✅ | ❌ |
| Dashboard monitoreo | ❌ | ❌ | ✅ |
| Gestionar instituciones | ❌ | ❌ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |
| Generar reportes | ❌ | ❌ | ✅ |
# 5. COMPONENTES UI REUTILIZABLES

## 5.1 Atomic Design Approach

Usamos el patrón **Atomic Design** para máxima reutilización:

```
ÁTOMOS → MOLÉCULAS → ORGANISMOS → TEMPLATES → PÁGINAS
```

---

## 5.2 ÁTOMOS (Componentes Base)

### 5.2.1 Button

```
┌─────────────────────────────────┐
│         Texto del Botón         │
└─────────────────────────────────┘
```

| Variante | Uso | Estilo |
|----------|-----|--------|
| **Primary** | Acciones principales | Fondo azul, texto blanco |
| **Secondary** | Acciones secundarias | Borde azul, fondo transparente |
| **Danger** | Acciones destructivas | Fondo rojo, texto blanco |
| **Ghost** | Acciones sutiles | Sin fondo, texto azul |
| **Disabled** | No disponible | Fondo gris, texto gris |

| Tamaño | Altura | Padding | Uso |
|--------|--------|---------|-----|
| **sm** | 32px | 12px 16px | Botones en cards |
| **md** | 44px | 12px 24px | Botones estándar |
| **lg** | 52px | 16px 32px | CTAs principales |

**Props:**
- `variant`: primary | secondary | danger | ghost
- `size`: sm | md | lg
- `disabled`: boolean
- `loading`: boolean
- `icon`: ReactNode (opcional)
- `fullWidth`: boolean

---

### 5.2.2 Input

```
┌─────────────────────────────────┐
│ Label                           │
├─────────────────────────────────┤
│ 🔍 Placeholder text...          │
├─────────────────────────────────┤
│ Helper text o error message     │
└─────────────────────────────────┘
```

| Estado | Borde | Icono |
|--------|-------|-------|
| **Default** | `#E0E0E0` | Gris |
| **Focus** | `#1976D2` | Azul |
| **Error** | `#F44336` | Rojo |
| **Disabled** | `#BDBDBD` | Gris claro |
| **Success** | `#4CAF50` | Verde |

**Props:**
- `label`: string
- `placeholder`: string
- `value`: string
- `error`: string (mensaje de error)
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `type`: text | email | password | number | phone
- `disabled`: boolean
- `required`: boolean

---

### 5.2.3 Badge / Chip

```
┌──────────────┐
│ 🔴 Crítica   │
└──────────────┘
```

| Variante | Color Fondo | Color Texto |
|----------|-------------|-------------|
| **critical** | `#FFEBEE` | `#D32F2F` |
| **high** | `#FFF3E0` | `#F57C00` |
| **medium** | `#FFFDE7` | `#F9A825` |
| **low** | `#E8F5E9` | `#388E3C` |
| **info** | `#E3F2FD` | `#1976D2` |
| **default** | `#F5F5F5` | `#757575` |

**Props:**
- `variant`: critical | high | medium | low | info | default
- `label`: string
- `icon`: ReactNode (opcional)
- `size`: sm | md

---

### 5.2.4 Avatar

```
┌─────┐      ┌─────┐
│ EW  │  o   │ 👤  │
└─────┘      └─────┘
Iniciales    Imagen
```

| Tamaño | Dimensión | Uso |
|--------|-----------|-----|
| **xs** | 24px | Lista compacta |
| **sm** | 32px | Comentarios |
| **md** | 40px | Headers, cards |
| **lg** | 56px | Perfil |
| **xl** | 80px | Pantalla perfil |

**Props:**
- `src`: string (URL imagen)
- `name`: string (para iniciales fallback)
- `size`: xs | sm | md | lg | xl
- `status`: online | offline | busy (punto de estado)

---

### 5.2.5 Icon Button

```
┌─────┐
│  ⚙️  │
└─────┘
```

| Tamaño | Dimensión | Icono |
|--------|-----------|-------|
| **sm** | 32px | 16px |
| **md** | 40px | 20px |
| **lg** | 48px | 24px |

**Props:**
- `icon`: ReactNode
- `size`: sm | md | lg
- `variant`: default | primary | danger
- `disabled`: boolean

---

### 5.2.6 Divider

```
─────────────────────────────────
```

**Props:**
- `orientation`: horizontal | vertical
- `label`: string (opcional, para dividers con texto)

---

## 5.3 MOLÉCULAS (Componentes Compuestos)

### 5.3.1 SearchBar

```
┌─────────────────────────────────────────┐
│ 🔍  Buscar alertas...              ✕    │
└─────────────────────────────────────────┘
```

**Props:**
- `placeholder`: string
- `value`: string
- `onSearch`: (value: string) => void
- `onClear`: () => void

---

### 5.3.2 StatCard

```
┌─────────────────────────┐
│  📊  145                │
│  Alertas Hoy            │
│  ↑ 12% vs ayer          │
└─────────────────────────┘
```

**Props:**
- `icon`: ReactNode
- `value`: string | number
- `label`: string
- `trend`: { value: number, direction: 'up' | 'down' }
- `color`: string

---

### 5.3.3 EmptyState

```
┌─────────────────────────────────┐
│                                 │
│            📭                   │
│                                 │
│    No hay alertas aún           │
│    Cuando reportes una alerta   │
│    aparecerá aquí               │
│                                 │
│    [ Crear Alerta ]             │
│                                 │
└─────────────────────────────────┘
```

**Props:**
- `icon`: ReactNode
- `title`: string
- `description`: string
- `action`: { label: string, onPress: () => void }

---

### 5.3.4 ListItem

```
┌─────────────────────────────────────────────────┐
│ 🔴  │  Robo en Av. Principal     │  Crítica    │
│     │  Hace 5 minutos            │     >       │
└─────────────────────────────────────────────────┘
```

**Props:**
- `leftIcon`: ReactNode
- `title`: string
- `subtitle`: string
- `rightContent`: ReactNode
- `onPress`: () => void
- `showChevron`: boolean

---

### 5.3.5 TabBar (Bottom Navigation)

```
┌─────────────────────────────────────────────────┐
│   🏠      📋       🗺️       🔔       👤        │
│  Home   Alertas   Mapa   Notif.   Perfil       │
└─────────────────────────────────────────────────┘
```

**Tabs Ciudadano:**
- Home, Mis Alertas, Mapa, Notificaciones, Perfil

**Tabs Agente:**
- Home, Asignadas, Historial, Perfil

---

### 5.3.6 Header / AppBar

```
┌─────────────────────────────────────────────────┐
│  ←  │      Título de Pantalla      │  ⚙️  🔔   │
└─────────────────────────────────────────────────┘
```

**Props:**
- `title`: string
- `showBack`: boolean
- `rightActions`: ReactNode[]
- `transparent`: boolean

---

## 5.4 ORGANISMOS (Componentes Complejos)

### 5.4.1 AlertCard (Reutilizable en Móvil y Web)

```
┌─────────────────────────────────────────────────────┐
│  ┌────┐                                             │
│  │ 🔴 │  Robo/Asalto                    [ Crítica ] │
│  └────┘                                             │
│                                                     │
│  Intento de robo en la esquina de Av. Atalaya      │
│  con Jr. Ucayali. Sujeto con cuchillo.             │
│                                                     │
│  📍 Av. Atalaya 234, Atalaya                       │
│  🕐 Hace 5 minutos                                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │              [ MINI MAPA ]                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Estado: 🟡 En Atención                            │
│  Atendido por: PNP Atalaya - Juan Pérez           │
│                                                     │
│  [ Ver Detalle ]              [ Navegar 📍 ]       │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `alert`: AlertObject
- `showMap`: boolean
- `showActions`: boolean
- `variant`: 'compact' | 'full'
- `onPress`: () => void
- `onNavigate`: () => void

---

### 5.4.2 AlertForm (Crear/Editar Alerta)

```
┌─────────────────────────────────────────────────────┐
│  TIPO DE EMERGENCIA                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │ 🚨  │ │ 🚗  │ │ 🏥  │ │ 🔥  │  ...             │
│  │Robo │ │Acc. │ │Méd. │ │Inc. │                   │
│  └─────┘ └─────┘ └─────┘ └─────┘                   │
│                                                     │
│  DESCRIPCIÓN *                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Describe qué está pasando...                │   │
│  │                                             │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│  Mínimo 10 caracteres                              │
│                                                     │
│  UBICACIÓN *                                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ 📍 Usar mi ubicación actual                 │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🗺️ Seleccionar en mapa                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  NIVEL DE URGENCIA                                  │
│  ○ Baja   ○ Media   ● Alta   ○ Crítica            │
│                                                     │
│  ADJUNTAR EVIDENCIA (Opcional)                     │
│  ┌─────┐ ┌─────┐ ┌─────┐                          │
│  │ 📷  │ │ 🎥  │ │  +  │                          │
│  │Foto │ │Video│ │     │                          │
│  └─────┘ └─────┘ └─────┘                          │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │          🚨 ENVIAR ALERTA                   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

### 5.4.3 MapView (Con marcadores de alertas)

```
┌─────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │         🔴        MAPA                      │   │
│  │              🟡                              │   │
│  │    🟢                     🔴                │   │
│  │                  📍                          │   │
│  │         🟡              🟢                   │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔴 Crítica (3)  🟡 Media (5)  🟢 Baja (2)  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `alerts`: Alert[]
- `userLocation`: { lat, lng }
- `radius`: number (metros)
- `onMarkerPress`: (alert: Alert) => void
- `showLegend`: boolean
- `interactive`: boolean

---

### 5.4.4 AlertTimeline (Historial de estados)

```
┌─────────────────────────────────────────────────────┐
│  HISTORIAL DE LA ALERTA                            │
│                                                     │
│  ● Reportada                                        │
│  │ 24 Ene 2026, 14:30                              │
│  │ Por: Edwin Méndez                               │
│  │                                                  │
│  ● En Atención                                      │
│  │ 24 Ene 2026, 14:35                              │
│  │ Tomado por: Juan Pérez (PNP)                    │
│  │                                                  │
│  ● En el lugar                                      │
│  │ 24 Ene 2026, 14:45                              │
│  │ Nota: Llegué al punto, evaluando situación      │
│  │                                                  │
│  ○ Resuelta (pendiente)                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 5.4.5 FilterBar

```
┌─────────────────────────────────────────────────────┐
│  Filtros:  [Tipo ▼]  [Estado ▼]  [Fecha ▼]  [✕]   │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `filters`: FilterConfig[]
- `activeFilters`: Record<string, any>
- `onFilterChange`: (filters) => void
- `onClear`: () => void

---

### 5.4.6 DataTable (Solo Web)

```
┌─────────────────────────────────────────────────────────────────┐
│  ☐ │ ID    │ Tipo        │ Ubicación      │ Estado   │ Acciones│
├─────────────────────────────────────────────────────────────────┤
│  ☐ │ #1234 │ 🔴 Robo     │ Av. Atalaya    │ 🟡 Atend │ 👁️ ✏️  │
│  ☐ │ #1233 │ 🚗 Accidente│ Jr. Lima       │ 🟢 Resu. │ 👁️ ✏️  │
│  ☐ │ #1232 │ 🏥 Médica   │ Av. Ucayali    │ 🔵 Rep.  │ 👁️ ✏️  │
├─────────────────────────────────────────────────────────────────┤
│  Mostrando 1-10 de 156          │◄│ 1 │ 2 │ 3 │...│ 16 │►│    │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5.4.7 Sidebar (Solo Web)

```
┌────────────────────┐
│  🛡️ SAVIA          │
│     Admin Panel    │
├────────────────────┤
│                    │
│  📊 Dashboard      │ ← activo
│  🚨 Alertas        │
│  🏢 Instituciones  │
│  👥 Usuarios       │
│  📁 Categorías     │
│  📈 Reportes       │
│                    │
├────────────────────┤
│  ⚙️ Configuración  │
│  🚪 Cerrar Sesión  │
└────────────────────┘
```

---

### 5.4.8 Modal / Dialog

```
┌─────────────────────────────────────────────────────┐
│  ╳                                                  │
│                                                     │
│               ⚠️                                    │
│                                                     │
│        ¿Confirmar envío de alerta?                 │
│                                                     │
│   Esta acción notificará a las autoridades         │
│   correspondientes de tu zona.                     │
│                                                     │
│   [ Cancelar ]         [ Confirmar ]               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `visible`: boolean
- `title`: string
- `message`: string
- `icon`: ReactNode
- `confirmText`: string
- `cancelText`: string
- `onConfirm`: () => void
- `onCancel`: () => void
- `variant`: 'info' | 'warning' | 'danger' | 'success'

---

### 5.4.9 Toast / Snackbar

```
┌─────────────────────────────────────────────────────┐
│  ✅  Alerta enviada correctamente          [ ✕ ]   │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `message`: string
- `variant`: 'success' | 'error' | 'warning' | 'info'
- `duration`: number (ms)
- `action`: { label: string, onPress: () => void }

---

### 5.4.10 BottomSheet (Solo Móvil)

```
┌─────────────────────────────────────────────────────┐
│                    ━━━━                             │
│                                                     │
│  Seleccionar tipo de alerta                        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🚨  Robo/Asalto                         >   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 🚗  Accidente de tránsito               >   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 🏥  Emergencia médica                   >   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 🔥  Incendio                            >   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```
# 6. CATÁLOGO DE PANTALLAS

## 6.1 Resumen de Pantallas

| Módulo | Cantidad | Plataforma |
|--------|----------|------------|
| App Ciudadano | 14 | Móvil |
| App Agente | 7 | Móvil |
| Panel Administrador | 10 | Web |
| **TOTAL** | **31** | |

---

## 6.2 APP MÓVIL - MÓDULO CIUDADANO (14 pantallas)

### C01 - Splash Screen
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│           🛡️                    │
│          SAVIA                  │
│                                 │
│   Sistema de Alertas Vecinales  │
│                                 │
│                                 │
│          ○ ○ ○                  │
│        Cargando...              │
│                                 │
└─────────────────────────────────┘
```
**Propósito:** Pantalla de carga inicial mientras verifica autenticación
**Navegación:** → Login (si no autenticado) | → Home (si autenticado)

---

### C02 - Login
```
┌─────────────────────────────────┐
│                                 │
│           🛡️ SAVIA             │
│                                 │
│   Bienvenido                    │
│   Ingresa a tu cuenta           │
│                                 │
│   ┌─────────────────────────┐   │
│   │ 📧 correo@ejemplo.com   │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │ 🔒 ••••••••         👁️  │   │
│   └─────────────────────────┘   │
│                                 │
│   [ ¿Olvidaste tu contraseña? ] │
│                                 │
│   ┌─────────────────────────┐   │
│   │     INICIAR SESIÓN      │   │
│   └─────────────────────────┘   │
│                                 │
│   ─────────── o ───────────     │
│                                 │
│   ¿No tienes cuenta?            │
│   [ Regístrate aquí ]           │
│                                 │
└─────────────────────────────────┘
```
**Campos:**
- Email (required, email format)
- Password (required, min 8 chars)

**Acciones:**
- Iniciar Sesión → Home
- Olvidé contraseña → C04
- Registrarse → C03

---

### C03 - Registro
```
┌─────────────────────────────────┐
│  ←  Crear Cuenta                │
├─────────────────────────────────┤
│                                 │
│   ┌─────────────────────────┐   │
│   │ 🆔 DNI (8 dígitos)      │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │ 👤 Nombres              │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │ 👤 Apellidos            │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │ 📱 Celular (9 dígitos)  │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │ 📧 Email               │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │ 🔒 Contraseña       👁️  │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │ 🔒 Confirmar        👁️  │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │ 📍 Dirección referencia │   │
│   └─────────────────────────┘   │
│                                 │
│   ☑️ Acepto términos y cond.    │
│                                 │
│   ┌─────────────────────────┐   │
│   │      REGISTRARME        │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```
**Validaciones:**
- DNI: 8 dígitos, único
- Nombres/Apellidos: 2-50 chars alfabéticos
- Celular: 9 dígitos, inicia con 9
- Email: formato válido (requerido)
- Contraseña: min 8 chars, 1 mayúscula, 1 número
- Dirección: max 200 chars

---

### C04 - Recuperar Contraseña
```
┌─────────────────────────────────┐
│  ←  Recuperar Contraseña        │
├─────────────────────────────────┤
│                                 │
│            🔐                   │
│                                 │
│   Ingresa tu correo y te        │
│   enviaremos instrucciones      │
│   para restablecer tu           │
│   contraseña.                   │
│                                 │
│   ┌─────────────────────────┐   │
│   │ 📧 correo@ejemplo.com   │   │
│   └─────────────────────────┘   │
│                                 │
│   ┌─────────────────────────┐   │
│   │    ENVIAR INSTRUCCIONES │   │
│   └─────────────────────────┘   │
│                                 │
│   [ Volver a inicio de sesión ] │
│                                 │
└─────────────────────────────────┘
```

---

### C05 - Home Ciudadano
```
┌─────────────────────────────────┐
│  🛡️ SAVIA          🔔 2  👤     │
├─────────────────────────────────┤
│                                 │
│  Hola, Edwin 👋                 │
│  ¿Cómo podemos ayudarte?        │
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │    🚨                       ││
│  │    REPORTAR                 ││
│  │    EMERGENCIA               ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  ┌────────────┐ ┌────────────┐  │
│  │ 📋         │ │ 🗺️          │  │
│  │ Mis        │ │ Alertas    │  │
│  │ Alertas    │ │ Cercanas   │  │
│  │    (3)     │ │    (5)     │  │
│  └────────────┘ └────────────┘  │
│                                 │
│  ALERTAS RECIENTES EN TU ZONA   │
│  ┌─────────────────────────────┐│
│  │🔴 Robo - Av. Principal      ││
│  │   Hace 10 min · 500m        ││
│  ├─────────────────────────────┤│
│  │🟡 Accidente - Jr. Lima      ││
│  │   Hace 25 min · 1.2km       ││
│  └─────────────────────────────┘│
│                                 │
├─────────────────────────────────┤
│  🏠    📋    🗺️    🔔    👤     │
│ Home Alertas Mapa Notif Perfil  │
└─────────────────────────────────┘
```
**Componentes usados:**
- Header con avatar y notificaciones
- Botón principal grande (CTA)
- Quick action cards (2x)
- AlertCard (variant: compact)
- TabBar

---

### C06 - Nueva Alerta (Paso 1: Tipo)
```
┌─────────────────────────────────┐
│  ←  Nueva Alerta       Paso 1/4 │
├─────────────────────────────────┤
│                                 │
│  ¿Qué tipo de emergencia        │
│  quieres reportar?              │
│                                 │
│  ┌─────────┐ ┌─────────┐       │
│  │   🚨    │ │   🚗    │       │
│  │  Robo/  │ │Accidente│       │
│  │ Asalto  │ │tránsito │       │
│  └─────────┘ └─────────┘       │
│  ┌─────────┐ ┌─────────┐       │
│  │   🏥    │ │   🔥    │       │
│  │Emergenc.│ │Incendio │       │
│  │ médica  │ │         │       │
│  └─────────┘ └─────────┘       │
│  ┌─────────┐ ┌─────────┐       │
│  │   ⚡    │ │   💧    │       │
│  │  Falla  │ │Problema │       │
│  │eléctrica│ │de agua  │       │
│  └─────────┘ └─────────┘       │
│  ┌─────────┐ ┌─────────┐       │
│  │   🔍    │ │   ❓    │       │
│  │Pérdida/ │ │  Otro   │       │
│  │Hallazgo │ │         │       │
│  └─────────┘ └─────────┘       │
│                                 │
│  ┌─────────────────────────────┐│
│  │         SIGUIENTE           ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

### C07 - Nueva Alerta (Paso 2: Descripción)
```
┌─────────────────────────────────┐
│  ←  Nueva Alerta       Paso 2/4 │
├─────────────────────────────────┤
│                                 │
│  Tipo seleccionado:             │
│  ┌─────────────────────────────┐│
│  │ 🚨 Robo/Asalto      [Cambiar]│
│  └─────────────────────────────┘│
│                                 │
│  Describe la situación *        │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │ Intento de robo en la       ││
│  │ esquina, sujeto con         ││
│  │ cuchillo huyó hacia...      ││
│  │                             ││
│  │                             ││
│  └─────────────────────────────┘│
│  42/500 caracteres              │
│                                 │
│  Nivel de urgencia *            │
│  ┌────┐┌────┐┌────┐┌────┐      │
│  │Baja││Med.││Alta││Crít│      │
│  │ 🟢 ││ 🟡 ││ 🟠 ││ 🔴 │      │
│  └────┘└────┘└────┘└────┘      │
│         ▲ Seleccionado          │
│                                 │
│  ┌─────────────────────────────┐│
│  │         SIGUIENTE           ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

### C08 - Nueva Alerta (Paso 3: Ubicación)
```
┌─────────────────────────────────┐
│  ←  Nueva Alerta       Paso 3/4 │
├─────────────────────────────────┤
│                                 │
│  ¿Dónde ocurre la emergencia?   │
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │      [ MAPA INTERACTIVO ]   ││
│  │                             ││
│  │            📍               ││
│  │                             ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  📍 Ubicación seleccionada:     │
│  Av. Atalaya 234, Atalaya      │
│  Coordenadas: -10.731, -73.756 │
│                                 │
│  ┌─────────────────────────────┐│
│  │ 📍 Usar mi ubicación actual ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🔍 Buscar dirección...      ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │         SIGUIENTE           ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

### C09 - Nueva Alerta (Paso 4: Evidencia y Confirmación)
```
┌─────────────────────────────────┐
│  ←  Nueva Alerta       Paso 4/4 │
├─────────────────────────────────┤
│                                 │
│  Adjuntar evidencia (opcional)  │
│                                 │
│  ┌────────┐ ┌────────┐ ┌──────┐│
│  │  📷    │ │  🎥    │ │  +   ││
│  │ Foto   │ │ Video  │ │      ││
│  │        │ │        │ │      ││
│  └────────┘ └────────┘ └──────┘│
│  Máx. 10MB por archivo          │
│                                 │
│  ═══════════════════════════════│
│  RESUMEN DE TU ALERTA           │
│  ═══════════════════════════════│
│                                 │
│  Tipo: 🚨 Robo/Asalto          │
│  Urgencia: 🔴 Crítica          │
│  Ubicación: Av. Atalaya 234    │
│                                 │
│  Descripción:                   │
│  "Intento de robo en la        │
│  esquina, sujeto con cuchillo  │
│  huyó hacia el mercado..."     │
│                                 │
│  ⚠️ Al enviar, las autoridades  │
│  serán notificadas              │
│                                 │
│  ┌─────────────────────────────┐│
│  │    🚨 ENVIAR ALERTA         ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

### C10 - Confirmación de Alerta Enviada
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│            ✅                   │
│                                 │
│     ¡Alerta enviada!            │
│                                 │
│   Tu alerta #ALT-2026-0145      │
│   ha sido registrada            │
│   exitosamente.                 │
│                                 │
│   Las autoridades han sido      │
│   notificadas y atenderán       │
│   tu emergencia.                │
│                                 │
│   ┌─────────────────────────┐   │
│   │   VER ESTADO DE ALERTA  │   │
│   └─────────────────────────┘   │
│                                 │
│   [ Volver al inicio ]          │
│                                 │
└─────────────────────────────────┘
```

---

### C11 - Mis Alertas (Lista)
```
┌─────────────────────────────────┐
│  ←  Mis Alertas           🔍    │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ Todas │ Activas │ Cerradas ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🔴 Robo/Asalto              ││
│  │ Av. Atalaya 234             ││
│  │ 🟡 En Atención · Hoy 14:30  ││
│  │                          >  ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ 🚗 Accidente                ││
│  │ Jr. Lima 567                ││
│  │ 🟢 Resuelta · Ayer 09:15    ││
│  │                          >  ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ 🏥 Emergencia médica        ││
│  │ Av. Ucayali 890             ││
│  │ ⚫ Cerrada · 20 Ene         ││
│  │ ⭐⭐⭐⭐⭐                   ││
│  │                          >  ││
│  └─────────────────────────────┘│
│                                 │
├─────────────────────────────────┤
│  🏠    📋    🗺️    🔔    👤     │
└─────────────────────────────────┘
```

---

### C12 - Detalle de Mi Alerta
```
┌─────────────────────────────────┐
│  ←  Detalle Alerta    #ALT-0145 │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ 🚨 Robo/Asalto    [Crítica] ││
│  │                             ││
│  │ Intento de robo en la      ││
│  │ esquina, sujeto con        ││
│  │ cuchillo huyó hacia...     ││
│  └─────────────────────────────┘│
│                                 │
│  📍 Ubicación                   │
│  ┌─────────────────────────────┐│
│  │      [ MINI MAPA ]          ││
│  └─────────────────────────────┘│
│  Av. Atalaya 234, Atalaya      │
│                                 │
│  📷 Evidencia (2)               │
│  ┌────────┐ ┌────────┐         │
│  │  img1  │ │  img2  │         │
│  └────────┘ └────────┘         │
│                                 │
│  🕐 Historial                   │
│  ● Reportada - Hoy 14:30       │
│  │ Por ti                      │
│  ● En Atención - Hoy 14:35     │
│  │ PNP Atalaya - Juan Pérez    │
│  ○ Pendiente resolución        │
│                                 │
│  Atendido por:                  │
│  ┌─────────────────────────────┐│
│  │ 👮 Juan Pérez               ││
│  │ PNP Atalaya                 ││
│  │ 📞 Contactar                ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

### C13 - Calificar Atención
```
┌─────────────────────────────────┐
│  ←  Calificar Atención          │
├─────────────────────────────────┤
│                                 │
│           ⭐                    │
│                                 │
│  ¿Cómo fue la atención          │
│  recibida?                      │
│                                 │
│  Alerta: #ALT-0145              │
│  Atendido por: PNP Atalaya      │
│                                 │
│        ⭐ ⭐ ⭐ ⭐ ☆             │
│           4 de 5                │
│                                 │
│  Comentario (opcional)          │
│  ┌─────────────────────────────┐│
│  │ Llegaron rápido y fueron   ││
│  │ muy amables...              ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │      ENVIAR CALIFICACIÓN    ││
│  └─────────────────────────────┘│
│                                 │
│  [ Omitir ]                     │
│                                 │
└─────────────────────────────────┘
```

---

### C14 - Mapa de Alertas Cercanas
```
┌─────────────────────────────────┐
│  ←  Alertas Cercanas    ⚙️       │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │                             ││
│  │    🔴          MAPA         ││
│  │         🟡                  ││
│  │   🟢              🔴        ││
│  │              📍 (tú)        ││
│  │        🟡         🟢        ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  Radio: 1 km  [200m|500m|1k|2k]│
│                                 │
│  Filtrar por tipo:              │
│  ☑️🚨 ☑️🚗 ☑️🏥 ☐🔥 ☑️⚡ ☐💧   │
│                                 │
│  ALERTAS ACTIVAS (5)            │
│  ┌─────────────────────────────┐│
│  │🔴 Robo - 500m · Hace 10min ││
│  ├─────────────────────────────┤│
│  │🟡 Accidente - 800m · 25min ││
│  └─────────────────────────────┘│
│                                 │
├─────────────────────────────────┤
│  🏠    📋    🗺️    🔔    👤     │
└─────────────────────────────────┘
```
# 6.4 PANEL WEB - MÓDULO ADMINISTRADOR (Continuación)

### W06 - Crear/Editar Institución (Modal) - Completo
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│      ┌─────────────────────────────────────────────────────────────────┐   │
│      │  ╳  Nueva Institución                                           │   │
│      ├─────────────────────────────────────────────────────────────────┤   │
│      │                                                                 │   │
│      │  Nombre *                                                       │   │
│      │  ┌───────────────────────────────────────────────────────────┐ │   │
│      │  │ PNP Atalaya                                               │ │   │
│      │  └───────────────────────────────────────────────────────────┘ │   │
│      │                                                                 │   │
│      │  Tipo *                                                         │   │
│      │  ┌───────────────────────────────────────────────────────────┐ │   │
│      │  │ 🚔 PNP                                               ▼    │ │   │
│      │  └───────────────────────────────────────────────────────────┘ │   │
│      │                                                                 │   │
│      │  Teléfono                        Dirección                      │   │
│      │  ┌──────────────────┐           ┌──────────────────────────┐   │   │
│      │  │ 065-123456       │           │ Av. Principal 123        │   │   │
│      │  └──────────────────┘           └──────────────────────────┘   │   │
│      │                                                                 │   │
│      │  Horario de atención                                            │   │
│      │  ┌───────────────────────────────────────────────────────────┐ │   │
│      │  │ 24 horas                                                  │ │   │
│      │  └───────────────────────────────────────────────────────────┘ │   │
│      │                                                                 │   │
│      │  Tipos de alerta que atiende *                                  │   │
│      │  ☑️ Robo/Asalto    ☑️ Accidente    ☐ Emergencia médica         │   │
│      │  ☐ Incendio        ☐ Falla eléct. ☐ Problema agua              │   │
│      │  ☑️ Pérdida/Hallar ☑️ Otro                                      │   │
│      │                                                                 │   │
│      │  Estado                                                         │   │
│      │  ● Activo    ○ Inactivo                                        │   │
│      │                                                                 │   │
│      │  ┌─────────────────┐  ┌─────────────────┐                      │   │
│      │  │    Cancelar     │  │     Guardar     │                      │   │
│      │  └─────────────────┘  └─────────────────┘                      │   │
│      │                                                                 │   │
│      └─────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### W07 - Gestión de Usuarios
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🛡️ SAVIA Admin                                      🔔 12   👤 Admin ▼    │
├────────────────┬────────────────────────────────────────────────────────────┤
│                │                                                            │
│  📊 Dashboard  │   GESTIÓN DE USUARIOS                       [+ Nuevo]     │
│  🚨 Alertas    │                                                            │
│  🏢 Instituc.  │   ┌─────────────────┐                                      │
│  👥 Usuarios ◀ │   │ Todos │ Agentes │ Ciudadanos │ Admins │            │
│  📁 Categorías │   └─────────────────┘                                      │
│  📈 Reportes   │                                                            │
│                │   ┌─────────────────────────────────────────────────────┐  │
│                │   │ 🔍 Buscar por nombre o DNI...        │Rol ▼│Estado▼│  │
│                │   └─────────────────────────────────────────────────────┘  │
│                │                                                            │
│                │   ┌─────────────────────────────────────────────────────┐  │
│                │   │☐│ Nombre           │ DNI      │ Rol      │ Estado  │  │
│                │   ├─────────────────────────────────────────────────────┤  │
│                │   │☐│ Juan Pérez       │ 45678912 │👮Agente│ 🟢 Act. │  │
│                │   │☐│ María García     │ 78901234 │👮Agente│ 🟢 Act. │  │
│                │   │☐│ Edwin Méndez     │ 12345678 │👤Ciudadano│🟢 Act. │  │
│                │   │☐│ Ana López        │ 34567890 │👤Ciudadano│🔴 Inac.│  │
│                │   │☐│ Carlos Admin     │ 11111111 │👔 Admin  │ 🟢 Act. │  │
│                │   └─────────────────────────────────────────────────────┘  │
│                │                                                            │
│                │   Mostrando 1-10 de 234      │◄│ 1 │ 2 │...│ 24 │►│       │
│                │                                                            │
└────────────────┴────────────────────────────────────────────────────────────┘
```

---

### W08 - Crear/Editar Usuario Agente (Modal)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│      ┌─────────────────────────────────────────────────────────────────┐   │
│      │  ╳  Nuevo Usuario Agente                                      │   │
│      ├─────────────────────────────────────────────────────────────────┤   │
│      │                                                                 │   │
│      │  DNI *                           Celular *                      │   │
│      │  ┌──────────────────┐           ┌──────────────────┐           │   │
│      │  │ 45678912         │           │ 987654321        │           │   │
│      │  └──────────────────┘           └──────────────────┘           │   │
│      │                                                                 │   │
│      │  Nombres *                       Apellidos *                    │   │
│      │  ┌──────────────────┐           ┌──────────────────┐           │   │
│      │  │ Juan Carlos      │           │ Pérez López      │           │   │
│      │  └──────────────────┘           └──────────────────┘           │   │
│      │                                                                 │   │
│      │  Email *                                                        │   │
│      │  ┌───────────────────────────────────────────────────────────┐ │   │
│      │  │ juan.perez@pnp.gob.pe                                     │ │   │
│      │  └───────────────────────────────────────────────────────────┘ │   │
│      │                                                                 │   │
│      │  Institución asignada *                                         │   │
│      │  ┌───────────────────────────────────────────────────────────┐ │   │
│      │  │ 🚔 PNP Atalaya                                       ▼    │ │   │
│      │  └───────────────────────────────────────────────────────────┘ │   │
│      │                                                                 │   │
│      │  Rol *                           Estado                         │   │
│      │  ┌──────────────────┐           ● Activo  ○ Inactivo           │   │
│      │  │ 👮 Agente  ▼   │                                          │   │
│      │  └──────────────────┘                                          │   │
│      │                                                                 │   │
│      │  ☑️ Enviar credenciales por email                               │   │
│      │                                                                 │   │
│      │  ┌─────────────────┐  ┌─────────────────┐                      │   │
│      │  │    Cancelar     │  │     Guardar     │                      │   │
│      │  └─────────────────┘  └─────────────────┘                      │   │
│      │                                                                 │   │
│      └─────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### W09 - Gestión de Categorías de Alerta
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🛡️ SAVIA Admin                                      🔔 12   👤 Admin ▼    │
├────────────────┬────────────────────────────────────────────────────────────┤
│                │                                                            │
│  📊 Dashboard  │   CATEGORÍAS DE ALERTA                      [+ Nueva]     │
│  🚨 Alertas    │                                                            │
│  🏢 Instituc.  │   ┌─────────────────────────────────────────────────────┐  │
│  👥 Usuarios   │   │☐│ Icono │ Nombre           │ Color   │ Orden│Estado│  │
│  📁 Categorías◀│   ├─────────────────────────────────────────────────────┤  │
│  📈 Reportes   │   │☐│  🚨   │ Robo/Asalto      │ #D32F2F │  1   │🟢 Act│  │
│                │   │☐│  🚗   │ Accidente trán.  │ #F57C00 │  2   │🟢 Act│  │
│                │   │☐│  🏥   │ Emergencia méd.  │ #E91E63 │  3   │🟢 Act│  │
│                │   │☐│  🔥   │ Incendio         │ #FF5722 │  4   │🟢 Act│  │
│                │   │☐│  ⚡   │ Falla eléctrica  │ #FFC107 │  5   │🟢 Act│  │
│                │   │☐│  💧   │ Problema de agua │ #2196F3 │  6   │🟢 Act│  │
│                │   │☐│  🔍   │ Pérdida/Hallazgo │ #9C27B0 │  7   │🟢 Act│  │
│                │   │☐│  ❓   │ Otro             │ #607D8B │  8   │🟢 Act│  │
│                │   └─────────────────────────────────────────────────────┘  │
│                │                                                            │
│                │   💡 Arrastra las filas para cambiar el orden              │
│                │                                                            │
└────────────────┴────────────────────────────────────────────────────────────┘
```

---

### W10 - Reportes Estadísticos
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🛡️ SAVIA Admin                                      🔔 12   👤 Admin ▼    │
├────────────────┬────────────────────────────────────────────────────────────┤
│                │                                                            │
│  📊 Dashboard  │   REPORTES ESTADÍSTICOS                                    │
│  🚨 Alertas    │                                                            │
│  🏢 Instituc.  │   Período: [01/01/2026] a [24/01/2026]    [Generar]       │
│  👥 Usuarios   │                                                            │
│  📁 Categorías │   ┌────────────────────────────────────────────────────┐   │
│  📈 Reportes ◀ │   │            ALERTAS POR TIPO                        │   │
│                │   │   ████████████████████  Robo (45)                  │   │
│                │   │   ██████████████  Accidente (32)                   │   │
│                │   │   ████████████  Médica (28)                        │   │
│                │   │   ██████  Incendio (15)                            │   │
│                │   │   ████  Otros (12)                                 │   │
│                │   └────────────────────────────────────────────────────┘   │
│                │                                                            │
│                │   ┌────────────────────────────────────────────────────┐   │
│                │   │         TENDENCIA DIARIA (Enero 2026)              │   │
│                │   │    12│      ╭─╮                                    │   │
│                │   │    10│  ╭─╮ │ │    ╭─╮                             │   │
│                │   │     8│╭─╯ ╰─╯ ╰────╯ ╰─╮  ╭─╮                      │   │
│                │   │     6│                  ╰──╯ │                      │   │
│                │   │     4│                       ╰──                    │   │
│                │   │      └──────────────────────────────────           │   │
│                │   │       1  5  10  15  20  24                          │   │
│                │   └────────────────────────────────────────────────────┘   │
│                │                                                            │
│                │   MÉTRICAS CLAVE                                           │
│                │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│                │   │   132    │ │  15 min  │ │   89%    │ │  4.5 ⭐  │     │
│                │   │  Total   │ │ T.Prom.  │ │  Tasa    │ │ Satisf.  │     │
│                │   │ alertas  │ │ Respuesta│ │Resolución│ │ Usuarios │     │
│                │   └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                │                                                            │
│                │   MAPA DE CALOR - ZONAS CRÍTICAS                          │
│                │   ┌────────────────────────────────────────────────────┐   │
│                │   │                                                    │   │
│                │   │      ░░░▒▒▒▓▓▓███       MAPA DE CALOR             │   │
│                │   │    ░░░▒▒▒▓▓▓███████                                │   │
│                │   │      ░░▒▒▒▓▓███                                    │   │
│                │   │                                                    │   │
│                │   └────────────────────────────────────────────────────┘   │
│                │                                                            │
│                │   [ 📄 Exportar PDF ]  [ 📊 Exportar Excel ]              │
│                │                                                            │
└────────────────┴────────────────────────────────────────────────────────────┘
```

---

# 7. FLUJOS DE NAVEGACIÓN

## 7.1 Flujo App Ciudadano

```
                              ┌─────────────┐
                              │   SPLASH    │
                              │    (C01)    │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │ No autenticado │                │ Autenticado
                    ▼                                 ▼
              ┌─────────────┐                  ┌─────────────┐
              │   LOGIN     │                  │    HOME     │
              │    (C02)    │                  │    (C05)    │
              └──────┬──────┘                  └──────┬──────┘
                     │                                │
        ┌────────────┼────────────┐      ┌───────────┼───────────┐
        │            │            │      │           │           │
        ▼            ▼            ▼      ▼           ▼           ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐
  │ REGISTRO │ │ RECUPERAR│ │   HOME   │ │ NUEVA  │ │  MIS   │ │ MAPA   │
  │  (C03)   │ │  (C04)   │ │  (C05)   │ │ALERTA  │ │ALERTAS │ │CERCANAS│
  └──────────┘ └──────────┘ └──────────┘ │(C06-09)│ │ (C11)  │ │ (C14)  │
                                         └────┬───┘ └───┬────┘ └────────┘
                                              │         │
                                              ▼         ▼
                                        ┌──────────┐ ┌──────────┐
                                        │CONFIRMAR │ │ DETALLE  │
                                        │  (C10)   │ │  (C12)   │
                                        └──────────┘ └────┬─────┘
                                                          │
                                                          ▼
                                                    ┌──────────┐
                                                    │CALIFICAR │
                                                    │  (C13)   │
                                                    └──────────┘
```

## 7.2 Flujo App Agente

```
              ┌─────────────┐
              │   LOGIN     │
              │    (C02)    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │    HOME     │
              │  AGENTE   │
              │    (O01)    │
              └──────┬──────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ ALERTAS  │ │HISTORIAL │ │  PERFIL  │
  │ASIGNADAS │ │  (O06)   │ │  (O07)   │
  │  (O02)   │ └──────────┘ └──────────┘
  └────┬─────┘
       │
       ▼
  ┌──────────┐
  │ DETALLE  │
  │  (O03)   │
  └────┬─────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
       ▼              ▼              ▼
 ┌──────────┐  ┌──────────┐  ┌──────────┐
 │ACTUALIZAR│  │ DERIVAR  │  │ NAVEGAR  │
 │ ESTADO   │  │  (O05)   │  │   GPS    │
 │  (O04)   │  └──────────┘  └──────────┘
 └──────────┘
```

## 7.3 Flujo Panel Web Admin

```
              ┌─────────────┐
              │   LOGIN     │
              │    (W01)    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │  DASHBOARD  │◄────────────────────────────────┐
              │    (W02)    │                                 │
              └──────┬──────┘                                 │
                     │                                        │
    ┌────────────────┼────────────────┬───────────────┐      │
    │                │                │               │      │
    ▼                ▼                ▼               ▼      │
┌────────┐     ┌────────┐      ┌────────┐      ┌────────┐   │
│ALERTAS │     │INSTITUC│      │USUARIOS│      │REPORTES│   │
│ (W03)  │     │ (W05)  │      │ (W07)  │      │ (W10)  │   │
└───┬────┘     └───┬────┘      └───┬────┘      └────────┘   │
    │              │               │                         │
    ▼              ▼               ▼                         │
┌────────┐     ┌────────┐      ┌────────┐                   │
│DETALLE │     │CREAR/  │      │CREAR/  │                   │
│ (W04)  │     │EDITAR  │      │EDITAR  │                   │
└────────┘     │ (W06)  │      │ (W08)  │                   │
               └────────┘      └────────┘                   │
                                                             │
              ┌────────┐                                     │
              │CATEGOR.│─────────────────────────────────────┘
              │ (W09)  │
              └────────┘
```
# 8. MODELO DE DATOS (Firebase Firestore)

## 8.1 Estructura de Colecciones

```
firestore/
├── users/
│   └── {userId}/
│       ├── dni: string
│       ├── firstName: string
│       ├── lastName: string
│       ├── phone: string
│       ├── email: string
│       ├── address: string
│       ├── role: "citizen" | "agent" | "admin"
│       ├── institutionId: string (agents only)
│       ├── isActive: boolean
│       ├── fcmToken: string (for push notifications)
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       └── lastLoginAt: timestamp
│
├── alerts/
│   └── {alertId}/
│       ├── categoryId: string (ref categories)
│       ├── categoryName: string (denormalized)
│       ├── categoryEmoji: string (denormalized)
│       ├── description: string (max 500 chars)
│       ├── urgencyLevel: "low" | "medium" | "high" | "critical"
│       ├── status: "reported" | "in_progress" | "on_the_way" | "on_site" | "resolved" | "closed"
│       ├── location: { latitude: number, longitude: number }
│       ├── address: string
│       ├── geohash: string (for proximity queries)
│       ├── imageUrls: array<string> (max 3)
│       ├── citizenId: string (ref users)
│       ├── agentId: string (ref users)
│       ├── institutionId: string (ref institutions)
│       ├── timeline: array<{ status, timestamp, userId, note? }>
│       ├── rating: number (1-5)
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── institutions/
│   └── {institutionId}/
│       ├── name: string
│       ├── type: "pnp" | "serenazgo" | "bomberos" | "salud" | "defensa_civil" | "otro"
│       ├── phone: string
│       ├── email: string
│       ├── address: string
│       ├── categoryIds: array<string>
│       ├── isActive: boolean
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── categories/
    └── {categoryId}/
        ├── name: string
        ├── shortName: string
        ├── emoji: string
        ├── color: string (hex)
        ├── order: number
        ├── isActive: boolean
        ├── institutionIds: array<string>
        └── createdAt: timestamp
```

## 8.2 Índices Requeridos

```javascript
// Alerts by citizen ordered by date
alerts: citizenId ASC, createdAt DESC

// Alerts by status and urgency
alerts: status ASC, urgencyLevel DESC, createdAt DESC

// Alerts by institution
alerts: institutionId ASC, status ASC, createdAt DESC

// Geospatial queries (using geohash)
alerts: geohash ASC, status ASC
```

---

# 9. APIs Y CLOUD FUNCTIONS

## 9.1 Endpoints de Cloud Functions

### Autenticación
| Función | Método | Descripción |
|---------|--------|-------------|
| `onUserCreate` | Trigger | Crear documento en usuarios al registrarse |
| `validateDNI` | POST | Verificar DNI único antes de registro |

### Alertas
| Función | Método | Descripción |
|---------|--------|-------------|
| `createAlert` | POST | Crear alerta con validaciones |
| `onAlertCreated` | Trigger | Notificar agentes al crear alerta |
| `onAlertUpdated` | Trigger | Notificar ciudadano al cambiar estado |
| `getNearbyAlerts` | GET | Obtener alertas por radio geográfico (geohash) |
| `assignAlert` | POST | Asignar alerta a agente |
| `transferAlert` | POST | Derivar alerta a otra institución |

### Notificaciones
| Función | Método | Descripción |
|---------|--------|-------------|
| `sendPushNotification` | Internal | Enviar notificación FCM |
| `updateFCMToken` | POST | Actualizar token de dispositivo |

### Reportes
| Función | Método | Descripción |
|---------|--------|-------------|
| `getStatistics` | GET | Obtener métricas por rango de fechas |
| `getHeatmapData` | GET | Datos para mapa de calor |
| `exportReport` | POST | Generar PDF/Excel de reporte |

## 9.2 Estructura de Respuestas

```typescript
// Respuesta estándar exitosa
{
  success: true,
  data: { ... },
  message: "Operación exitosa"
}

// Respuesta de error
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "El DNI ya está registrado"
  }
}
```

---

# 10. PROMPTS PARA GOOGLE STITCH

## 10.1 Configuración Base para Todos los Prompts

```
Base configuration for all screens:
- App name: SAVIA
- Primary color: #1976D2 (blue)
- Secondary color: #F5F5F5 (light gray background)
- Font: Inter or system default
- Style: Clean, modern, professional
- Platform: Mobile app (unless specified as web)
- Language: Spanish
```

---

## 10.2 PROMPTS APP MÓVIL - CIUDADANO

### C02 - Login
```
Create a mobile app login screen for "SAVIA" emergency alert system.

Include:
- Logo placeholder at top (shield icon with "SAVIA" text)
- "Bienvenido" heading
- "Ingresa a tu cuenta" subheading
- Email input field with envelope icon
- Password input field with lock icon and show/hide toggle
- "¿Olvidaste tu contraseña?" link
- Primary blue "INICIAR SESIÓN" button (full width)
- Divider with "o" text
- "¿No tienes cuenta? Regístrate aquí" link at bottom

Style: Clean, white background, blue primary color (#1976D2), rounded inputs
```

### C03 - Registro
```
Create a mobile app registration screen for SAVIA.

Include header with back arrow and title "Crear Cuenta"

Form fields (all with appropriate icons):
- DNI (8 digits) - ID card icon
- Nombres - person icon
- Apellidos - person icon  
- Celular (9 digits) - phone icon
- Email (required) - envelope icon
- Contraseña - lock icon with show/hide
- Confirmar contraseña - lock icon with show/hide
- Dirección referencia - location icon

Checkbox: "Acepto términos y condiciones"

Primary blue "REGISTRARME" button at bottom

Style: Scrollable form, white background, consistent spacing
```

### C05 - Home Ciudadano
```
Create a mobile app home screen for SAVIA citizen module.

Top section:
- Header with SAVIA logo, notification bell (with badge "2"), and user avatar
- Greeting "Hola, Edwin 👋"
- Subtitle "¿Cómo podemos ayudarte?"

Main action:
- Large red emergency button with siren icon
- Text "REPORTAR EMERGENCIA"

Quick actions (2 cards side by side):
- "Mis Alertas" with clipboard icon and badge "(3)"
- "Alertas Cercanas" with map icon and badge "(5)"

Section "ALERTAS RECIENTES EN TU ZONA":
- 2 compact alert cards showing:
  - Red dot, "Robo - Av. Principal", "Hace 10 min · 500m"
  - Yellow dot, "Accidente - Jr. Lima", "Hace 25 min · 1.2km"

Bottom navigation bar with 5 tabs:
- Home (active), Alertas, Mapa, Notificaciones, Perfil

Style: Card-based layout, subtle shadows, clean design
```

### C06-C09 - Nueva Alerta (Multi-step)
```
Create a mobile multi-step form for creating an emergency alert in SAVIA.

Step 1 - Alert Type Selection:
- Header "Nueva Alerta" with back arrow and "Paso 1/4"
- Title "¿Qué tipo de emergencia quieres reportar?"
- Grid of 8 icon buttons (2x4):
  🚨 Robo/Asalto, 🚗 Accidente, 🏥 Emergencia médica, 🔥 Incendio
  ⚡ Falla eléctrica, 💧 Problema agua, 🔍 Pérdida/Hallazgo, ❓ Otro
- "SIGUIENTE" button at bottom

Step 2 - Description:
- Selected type shown in chip
- Large textarea "Describe la situación"
- Character counter "42/500"
- Urgency selector: 4 options (Baja-green, Media-yellow, Alta-orange, Crítica-red)

Step 3 - Location:
- Interactive map placeholder
- Selected location text
- "Usar mi ubicación actual" button with GPS icon
- "Buscar dirección" search input

Step 4 - Evidence & Confirmation:
- Photo/Video upload area (3 slots)
- Summary card showing all entered data
- Warning text about notifying authorities
- Large red "ENVIAR ALERTA" button

Style: Progress indicator, clear step transitions, validation states
```

### C11 - Mis Alertas
```
Create a mobile list screen for "Mis Alertas" (My Alerts) in SAVIA.

Header: Back arrow, "Mis Alertas" title, search icon

Tab bar: "Todas" | "Activas" | "Cerradas"

List of alert cards, each showing:
- Left: Category icon with color (red for robbery, etc.)
- Title: Alert type (e.g., "Robo/Asalto")
- Subtitle: Location (e.g., "Av. Atalaya 234")
- Status badge: Yellow "En Atención", Green "Resuelta", Gray "Cerrada"
- Timestamp: "Hoy 14:30" or "Ayer 09:15"
- Rating stars (for closed alerts)
- Chevron arrow right

3-4 sample alert cards

Bottom navigation bar

Style: Clean list with dividers, status colors prominent
```

### C14 - Mapa Alertas Cercanas
```
Create a mobile map screen for nearby alerts in SAVIA.

Header: Back arrow, "Alertas Cercanas", settings gear icon

Large map area (70% of screen) with:
- Multiple colored markers (red, yellow, green dots)
- User location pin in center
- Zoom controls

Below map:
- Radius selector: "Radio: 1 km" with options [200m|500m|1k|2k]
- Filter toggles for alert types (checkboxes with icons)

Bottom section "ALERTAS ACTIVAS (5)":
- Compact list of 2-3 alerts with:
  - Color dot, type, distance, time ago
  - Tappable rows

Bottom navigation bar

Style: Full-bleed map, floating controls, clean overlay
```

---

## 10.3 PROMPTS APP MÓVIL - AGENTE

### O01 - Home Agente
```
Create a mobile home screen for SAVIA agent module.

Header: SAVIA logo with "Agente" badge, notification bell (5), user avatar

Welcome section:
- "Bienvenido, Juan 👮"
- Institution name "PNP Atalaya"

Main alert card:
- Large number "5" with siren icon
- "Alertas Pendientes"
- "VER ALERTAS" button

Stats row (2 cards):
- "12 Atendidas hoy"
- "47 Este mes"

Section "MIS CASOS ACTIVOS":
- 2 active case cards showing:
  - Red badge #0145, "Robo", location
  - Status "En camino · Hace 5min"
  - Action buttons: [Actualizar] [Navegar]

Bottom navigation: Home, Alertas, Historial, Perfil

Style: Professional, badge-heavy, action-oriented
```

### O03 - Detalle Alerta Agente
```
Create a mobile alert detail screen for SAVIA agent.

Header: Back arrow, "Alerta #0145", red urgency badge

Top card:
- Large icon and "ROBO/ASALTO" title
- "Urgencia: CRÍTICA" label

Map section:
- Map with route line to destination
- Distance "1.5km" and ETA "5 min"

Location: Address text with pin icon

Description section:
- Full text of the emergency report
- "Reportado por: Edwin Méndez · 📞 987654321"
- "Hace 8 minutos"

Evidence section:
- 2 photo thumbnails

3 Action buttons (full width, stacked):
- Blue "📍 NAVEGAR AL PUNTO"
- Green "✅ TOMAR ESTE CASO"
- Gray "↗️ DERIVAR A OTRA INST."

Style: Information-dense, action buttons prominent
```

### O04 - Actualizar Estado
```
Create a mobile screen for updating alert status in SAVIA agent app.

Header: Back arrow, "Actualizar Estado"

Current status: "Alerta #0145 - Robo/Asalto"
"Estado actual: 🟡 En camino"

Radio button list "Selecciona el nuevo estado":
- 🚗 En camino (on_the_way) - "Estoy dirigiéndome"
- 📍 En el lugar (on_site) - "Llegué al punto"
- ✅ Resuelto (resolved) - "Caso atendido exitosamente"

Textarea: "Agregar nota (opcional)"
Sample text inside

Photo upload section:
- "📷 Adjuntar evidencia"
- Add photo button

Primary button: "ACTUALIZAR ESTADO"

Style: Form-focused, clear status options with descriptions
```

---

## 10.4 PROMPTS PANEL WEB ADMIN

### W02 - Dashboard
```
Create a web admin dashboard for SAVIA emergency management system.

Layout: Sidebar navigation on left, main content area on right

Sidebar:
- SAVIA Admin logo at top
- Menu items: Dashboard (active), Alertas, Instituciones, Usuarios, Categorías, Reportes
- Bottom: Configuración, Cerrar Sesión

Top header:
- Notification bell with badge
- Admin user dropdown

Main content:
- Title "ALERTAS HOY" with date
- 4 stat cards in row: Total (45), Pendientes (12), Resueltas (28), Críticas (5)
- Each with percentage change indicator

Large map section:
- Real-time map with colored alert markers
- Title "MAPA EN TIEMPO REAL"

Table section:
- Title "ALERTAS ACTIVAS" with "Ver todas" link
- Columns: #, Tipo, Ubicación, Estado, Tiempo
- 3-4 sample rows

Style: Clean dashboard layout, data visualization focus, professional colors
```

### W05 - Gestión Instituciones
```
Create a web admin screen for managing institutions in SAVIA.

Same sidebar navigation as dashboard.

Main content:
- Title "GESTIÓN DE INSTITUCIONES"
- "+ Nueva" button on right

Data table with columns:
- Checkbox
- Nombre (e.g., "PNP Atalaya")
- Tipo (with icon: 🚔 PNP, 🦺 Serenazgo, 🚒 Bomberos, 🏥 Salud)
- Estado (green "Activo" or red "Inactivo" badge)
- Acciones (view, edit, delete icons)

5 sample institution rows

Pagination at bottom: "Mostrando 1-5 de 5"

Style: Clean table layout, action icons, status badges
```

### W10 - Reportes
```
Create a web admin reports screen for SAVIA with statistics and charts.

Same sidebar navigation.

Main content:
- Title "REPORTES ESTADÍSTICOS"
- Date range picker: Start date, End date, Generate button

Charts section (2 column layout):
Left chart:
- Title "ALERTAS POR TIPO"
- Horizontal bar chart with 5 categories
- Different colors per category

Right chart:
- Title "TENDENCIA DIARIA"
- Line chart showing daily alert count
- X-axis: days, Y-axis: count

Metrics row (4 cards):
- Total alertas: 132
- Tiempo Promedio Respuesta: 15 min
- Tasa Resolución: 89%
- Satisfacción: 4.5 stars

Heat map section:
- Title "MAPA DE CALOR - ZONAS CRÍTICAS"
- Map with heat overlay

Export buttons:
- "📄 Exportar PDF"
- "📊 Exportar Excel"

Style: Data visualization focused, charts prominent, export options clear
```

---

# 11. CHECKLIST DE IMPLEMENTACIÓN

## 11.1 Fase 1 - Setup (Sprint 1)
- [ ] Crear proyecto Firebase
- [ ] Configurar Authentication
- [ ] Configurar Firestore con reglas de seguridad
- [ ] Configurar Cloud Storage
- [ ] Crear proyecto React Native con Expo
- [ ] Crear proyecto Next.js para web admin
- [ ] Configurar repositorio Git

## 11.2 Fase 2 - Módulo Ciudadano (Sprint 1-2)
- [ ] Implementar autenticación (Login/Registro)
- [ ] Implementar Home con navegación
- [ ] Implementar flujo de crear alerta
- [ ] Implementar lista de mis alertas
- [ ] Implementar detalle de alerta
- [ ] Implementar mapa de alertas cercanas
- [ ] Configurar notificaciones push

## 11.3 Fase 3 - Módulo Agente (Sprint 3)
- [ ] Implementar Home agente
- [ ] Implementar lista de alertas asignadas
- [ ] Implementar detalle y tomar caso
- [ ] Implementar actualizar estado
- [ ] Implementar derivar alerta
- [ ] Implementar historial

## 11.4 Fase 4 - Panel Web Admin (Sprint 3-4)
- [ ] Implementar autenticación admin
- [ ] Implementar dashboard con mapa
- [ ] Implementar gestión de alertas
- [ ] Implementar gestión de instituciones
- [ ] Implementar gestión de usuarios
- [ ] Implementar reportes estadísticos

---

# 12. ANEXOS

## 12.1 Referencias de Diseño
- Material Design 3: https://m3.material.io/
- Lucide Icons: https://lucide.dev/
- Inter Font: https://fonts.google.com/specimen/Inter

## 12.2 Herramientas Recomendadas
- Diseño UI: Google Stitch, Figma
- Prototipado: Figma, InVision
- Íconos: Lucide, Heroicons
- Mapas: Google Maps, Leaflet

---

**FIN DEL SYSTEM DESIGN DOCUMENT**

Versión: 1.0
Última actualización: 24 de Enero 2026
Autor: Edwin Wilson Méndez Echevarría
