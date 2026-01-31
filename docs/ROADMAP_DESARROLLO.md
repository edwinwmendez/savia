# SAVIA - Roadmap de Desarrollo

## Flujo de Trabajo con GitFlow

Este documento describe todas las features que se desarrollarán a lo largo del proyecto, organizadas por Sprint y MVP.

> **⚠️ Nota (31 Enero 2026):** El desarrollo inició con retraso respecto a las fechas originales. Las fechas listadas en los sprints son las planificadas inicialmente y se utilizan como referencia para la secuencia de trabajo. El equipo avanzará lo más rápido posible para recuperar el tiempo.

### Convención de Nombres

```
feature/[sprint]-[nombre-descriptivo]
release/v[X.Y.Z]
hotfix/[descripcion-corta]
```

---

## MVP 1: Flujo Básico

**Objetivo:** Ciudadano puede reportar alerta y agente puede atenderla.
**Duración:** 4 semanas (Sprints 1-4)
**Fecha objetivo:** 02 Febrero 2026

### Sprint 1 - Setup + Autenticación (Semana 1: 6-12 Enero)

| Feature | Historias | Descripción |
|---------|-----------|-------------|
| `feature/s1-setup-firebase` | - | Configurar Firebase en ambos proyectos móviles |
| `feature/s1-auth-ciudadano` | HU-AUTH-001, HU-AUTH-002 | Registro y login de ciudadano |
| `feature/s1-auth-agente` | HU-AUTH-004 | Login de agente |
| `feature/s1-recuperar-password` | HU-AUTH-003 | Recuperación de contraseña |

**Comandos:**
```bash
git flow feature start s1-setup-firebase
git flow feature start s1-auth-ciudadano
git flow feature start s1-auth-agente
git flow feature start s1-recuperar-password
```

**Criterios de aceptación:**
- [*] Firebase Auth conectado
- [*] Ciudadano puede registrarse con DNI, email y contraseña
- [*] Ciudadano puede iniciar sesión
- [*] Agente puede iniciar sesión
- [*] Usuario puede recuperar contraseña por email

---

### Sprint 2 - Crear Alerta (Semana 2: 13-19 Enero)

| Feature | Historias | Descripción |
|---------|-----------|-------------|
| `feature/s2-alerta-tipo` | HU-ALC-001 | Paso 1: Seleccionar tipo de alerta |
| `feature/s2-alerta-descripcion` | HU-ALC-002 | Paso 2: Descripción y nivel de urgencia |
| `feature/s2-alerta-ubicacion` | HU-ALC-003 | Paso 3: Ubicación con GPS |
| `feature/s2-alerta-confirmacion` | HU-ALC-004, HU-ALC-005 | Paso 4: Confirmación y envío |

**Comandos:**
```bash
git flow feature start s2-alerta-tipo
git flow feature start s2-alerta-descripcion
git flow feature start s2-alerta-ubicacion
git flow feature start s2-alerta-confirmacion
```

**Criterios de aceptación:**
- [ ] Ciudadano puede seleccionar tipo de emergencia (8 categorías)
- [ ] Ciudadano puede escribir descripción y adjuntar fotos/videos
- [ ] Ciudadano puede seleccionar nivel de urgencia
- [ ] Ubicación se obtiene automáticamente por GPS
- [ ] Ciudadano puede ajustar ubicación en el mapa
- [ ] Al enviar, se muestra confirmación con número de alerta

---

### Sprint 3 - Gestión de Alertas (Semana 3: 20-26 Enero)

| Feature | Historias | Descripción |
|---------|-----------|-------------|
| `feature/s3-ciudadano-mis-alertas` | HU-SEG-001, HU-SEG-002 | Lista y detalle de alertas del ciudadano |
| `feature/s3-agente-alertas-pendientes` | HU-OPE-001 | Lista de alertas pendientes para agente |
| `feature/s3-agente-tomar-caso` | HU-OPE-002, HU-OPE-003 | Agente toma un caso y ve detalle |
| `feature/s3-agente-actualizar-estado` | HU-OPE-004 | Agente actualiza estado de la alerta |

**Comandos:**
```bash
git flow feature start s3-ciudadano-mis-alertas
git flow feature start s3-agente-alertas-pendientes
git flow feature start s3-agente-tomar-caso
git flow feature start s3-agente-actualizar-estado
```

**Criterios de aceptación:**
- [ ] Ciudadano ve lista de sus alertas con estados
- [ ] Ciudadano puede ver detalle de cada alerta
- [ ] Agente ve alertas pendientes ordenadas por urgencia
- [ ] Agente puede tomar un caso
- [ ] Agente puede cambiar estado: En camino → En el lugar → Resuelto

---

### Sprint 4 - Notificaciones + Deploy (Semana 4: 27 Enero - 2 Febrero)

| Feature | Historias | Descripción |
|---------|-----------|-------------|
| `feature/s4-notificaciones-push` | HU-SEG-003 | Notificaciones push con FCM |
| `feature/s4-timeline-estados` | - | Timeline visual de cambios de estado |
| `feature/s4-testing-e2e` | - | Tests end-to-end |

**Comandos:**
```bash
git flow feature start s4-notificaciones-push
git flow feature start s4-timeline-estados
git flow feature start s4-testing-e2e
```

**Release MVP 1:**
```bash
git flow release start v1.0.0
# Testing final, ajustes
git flow release finish v1.0.0
```

**Criterios de aceptación:**
- [ ] Ciudadano recibe notificación cuando agente toma su caso
- [ ] Ciudadano recibe notificación en cada cambio de estado
- [ ] Timeline muestra historial de estados con fecha/hora
- [ ] App desplegada en TestFlight/Play Console interno

---

## MVP 2: Panel Admin + Mejoras

**Objetivo:** Admin puede gestionar el sistema y nuevas funcionalidades móvil.
**Duración:** 3 semanas (Sprints 5-7)
**Fecha objetivo:** 23 Febrero 2026

### Sprint 5 - Admin Panel Setup (Semana 5: 3-9 Febrero)

| Feature | Historias | Descripción |
|---------|-----------|-------------|
| `feature/s5-admin-layout` | - | Layout principal del panel admin |
| `feature/s5-admin-auth` | - | Autenticación de administrador |
| `feature/s5-admin-dashboard` | HU-ADM-001 | Dashboard con KPIs principales |

**Comandos:**
```bash
git flow feature start s5-admin-layout
git flow feature start s5-admin-auth
git flow feature start s5-admin-dashboard
```

**Criterios de aceptación:**
- [ ] Panel web accesible en navegador
- [ ] Admin puede iniciar sesión
- [ ] Dashboard muestra: alertas hoy, pendientes, resueltas, agentes activos

---

### Sprint 6 - CRUD Admin (Semana 6: 10-16 Febrero)

| Feature | Historias | Descripción |
|---------|-----------|-------------|
| `feature/s6-admin-usuarios` | HU-ADM-002 | CRUD de usuarios (ciudadanos, agentes) |
| `feature/s6-admin-instituciones` | HU-ADM-003 | CRUD de instituciones |
| `feature/s6-admin-alertas` | - | Gestión y visualización de alertas |

**Comandos:**
```bash
git flow feature start s6-admin-usuarios
git flow feature start s6-admin-instituciones
git flow feature start s6-admin-alertas
```

**Criterios de aceptación:**
- [ ] Admin puede crear/editar/desactivar usuarios
- [ ] Admin puede asignar roles y instituciones
- [ ] Admin puede gestionar instituciones (PNP, Serenazgo, etc.)
- [ ] Admin puede ver todas las alertas con filtros

---

### Sprint 7 - Mejoras Móvil (Semana 7: 17-23 Febrero)

| Feature | Historias | Descripción |
|---------|-----------|-------------|
| `feature/s7-ciudadano-calificar` | HU-SEG-004 | Calificación de atención (1-5 estrellas) |
| `feature/s7-ciudadano-mapa` | - | Mapa de alertas cercanas |
| `feature/s7-agente-derivar` | HU-OPE-006 | Derivar alerta a otra institución |
| `feature/s7-agente-navegacion` | HU-OPE-005 | Navegación GPS a la ubicación |

**Comandos:**
```bash
git flow feature start s7-ciudadano-calificar
git flow feature start s7-ciudadano-mapa
git flow feature start s7-agente-derivar
git flow feature start s7-agente-navegacion
```

**Release MVP 2:**
```bash
git flow release start v2.0.0
git flow release finish v2.0.0
```

**Criterios de aceptación:**
- [ ] Ciudadano puede calificar atención recibida
- [ ] Ciudadano ve mapa con alertas cercanas en tiempo real
- [ ] Agente puede derivar alerta a otra institución
- [ ] Agente puede abrir navegación GPS al lugar

---

## MVP 3: Reportes y Optimización

**Objetivo:** Reportes estadísticos y mejoras de rendimiento.
**Duración:** 2 semanas (Sprints 8-9)
**Fecha objetivo:** 09 Marzo 2026

### Sprint 8 - Reportes (Semana 8: 24 Febrero - 2 Marzo)

| Feature | Historias | Descripción |
|---------|-----------|-------------|
| `feature/s8-reportes-estadisticos` | HU-ADM-004 | Reportes con filtros de fecha |
| `feature/s8-graficos-charts` | - | Gráficos de barras, líneas, pie |
| `feature/s8-exportar-pdf-excel` | - | Exportación de reportes |

**Comandos:**
```bash
git flow feature start s8-reportes-estadisticos
git flow feature start s8-graficos-charts
git flow feature start s8-exportar-pdf-excel
```

**Criterios de aceptación:**
- [ ] Admin puede filtrar por rango de fechas
- [ ] Reportes: alertas por tipo, por urgencia, por estado, por institución
- [ ] Gráficos interactivos con Recharts
- [ ] Exportar a PDF y Excel

---

### Sprint 9 - Optimización + Launch (Semana 9: 3-9 Marzo)

| Feature | Historias | Descripción |
|---------|-----------|-------------|
| `feature/s9-mapa-calor` | - | Mapa de calor de zonas problemáticas |
| `feature/s9-notificaciones-proximidad` | RF-NOT-003 | Alertas cercanas por proximidad |
| `feature/s9-optimizacion` | - | Performance y QA final |

**Comandos:**
```bash
git flow feature start s9-mapa-calor
git flow feature start s9-notificaciones-proximidad
git flow feature start s9-optimizacion
```

**Release Final:**
```bash
git flow release start v3.0.0
git flow release finish v3.0.0
```

**Criterios de aceptación:**
- [ ] Mapa de calor muestra zonas con más incidentes
- [ ] Usuario recibe notificación si hay alerta cerca
- [ ] App optimizada para Android 8+
- [ ] App publicada en Play Store

---

## Resumen de Features

| MVP | Sprint | Features | Release |
|-----|--------|----------|---------|
| MVP 1 | 1 | 4 features | - |
| MVP 1 | 2 | 4 features | - |
| MVP 1 | 3 | 4 features | - |
| MVP 1 | 4 | 3 features | v1.0.0 |
| MVP 2 | 5 | 3 features | - |
| MVP 2 | 6 | 3 features | - |
| MVP 2 | 7 | 4 features | v2.0.0 |
| MVP 3 | 8 | 3 features | - |
| MVP 3 | 9 | 3 features | v3.0.0 |

**Total: 31 features + 3 releases**

---

## Comandos Rápidos de GitFlow

```bash
# Iniciar feature
git flow feature start [nombre]

# Terminar feature (merge a develop)
git flow feature finish [nombre]

# Publicar feature a remote
git flow feature publish [nombre]

# Iniciar release
git flow release start v[X.Y.Z]

# Terminar release (merge a main y develop)
git flow release finish v[X.Y.Z]

# Hotfix urgente
git flow hotfix start [nombre]
git flow hotfix finish [nombre]
```

---

## Notas Importantes

1. **Cada feature debe tener su propio PR** para revisión antes del merge
2. **Los releases se hacen al final de cada MVP** para marcar versiones estables
3. **Hotfixes** solo se usan para correcciones urgentes en producción
4. **Develop** siempre debe estar en estado funcional (no romper el build)
