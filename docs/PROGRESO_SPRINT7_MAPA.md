# Progreso: Sprint 7 - Mapa de Alertas Cercanas

**Fecha:** 1 Febrero 2026
**Rama:** `feature/s7-ciudadano-mapa`
**Estado:** COMPLETADO y mergeado a `develop`
**Commit:** `cc7bc0f` - feat: Mapa de alertas cercanas con filtros y marcadores por categoria
**Merge:** `528e73f` - Merge branch 'feature/s7-ciudadano-mapa' into develop

---

## Plan Utilizado

**Archivo:** `~/.claude/plans/serialized-snuggling-tide.md`
**Nombre:** Plan: Mapa de Alertas Cercanas (RF-ALC-004)

El plan original definía 8 archivos nuevos + 3 tests, 2 archivos modificados, con orden de implementacion paso a paso. Durante la implementacion el plan evoluciono significativamente por feedback del usuario en dispositivo real.

---

## Resumen de lo Implementado

### Funcionalidad Principal
Pantalla `CitizenMapScreen` que reemplaza el placeholder "Proximamente" con un mapa interactivo a pantalla completa que muestra alertas activas en tiempo real.

### Flujo de Usuario
1. Ciudadano entra al tab "Mapa"
2. Se solicita permiso de ubicacion (fallback a Atalaya si se deniega)
3. Mapa se centra en la ubicacion del usuario con punto azul nativo
4. Marcadores circulares de 32px con icono y color por categoria aparecen en el mapa
5. Al tocar un marcador: card flotante con info de la alerta (categoria, distancia, urgencia)
6. Desde el card: "Ver Detalle" navega a AlertDetail, "Navegar" abre Google Maps/Waze
7. Icono de filtros en header abre panel overlay con: radio, urgencia, tipo de alerta, toggle POIs
8. Controles de zoom (+/-) y boton centrar ubicacion (Crosshair azul)
9. POIs de Google (negocios, tiendas) ocultos por defecto para mapa mas limpio

---

## Archivos Creados (13)

### Utilidades
1. **`savia-mobile/src/features/map/utils/geoUtils.ts`**
   - `getDistanceInMeters()`: Formula Haversine para distancia entre coordenadas
   - `formatDistance()`: 150 -> "150 m", 1200 -> "1.2 km"
   - `radiusToDelta()`: Convierte radio en metros a latitudeDelta/longitudeDelta para zoom del mapa

### Servicios
2. **`savia-mobile/src/features/map/services/nearbyAlertsService.ts`**
   - `subscribeToActiveAlerts(onData, onError)`: Listener onSnapshot de Firestore
   - Query: `where('status', 'in', ['pending', 'assigned', 'in_progress']), orderBy('createdAt', 'desc')`
   - Sigue patron exacto de `alertQueryService.ts`

### Store
3. **`savia-mobile/src/features/map/store/nearbyAlertsStore.ts`**
   - Zustand store con estado: `allAlerts`, `userLatitude/Longitude`, `selectedRadius` (default 1000), `selectedUrgencies` (todas), `selectedCategories` (todas = vacio), `showMapPOIs` (false)
   - Computed: `mapFilteredAlerts()` (filtra por urgencia + categoria, sin distancia - para markers), `filteredAlerts()` (agrega filtro por distancia - para lista)
   - Actions: `setAllAlerts`, `setUserLocation`, `setSelectedRadius`, `toggleUrgency`, `toggleCategory`, `toggleMapPOIs`, `reset`
   - Tipo exportado: `RadiusOption = 200 | 500 | 1000 | 2000`

### Componentes UI
4. **`savia-mobile/src/features/map/components/AlertMarker.tsx`**
   - Marker custom de 32px con icono Lucide y color de categoria desde `useCategoryStore`
   - CATEGORY_ICONS: robbery=ShieldAlert, accident=Car, medical=Heart, fire=Flame, electrical=Zap, water=Droplets, lost=Search, other=HelpCircle
   - Workaround Android: `tracksViewChanges` inicia true, cambia a false despues de 500ms
   - Props: `coordinate: {latitude, longitude}`, `categoryType`, `alertId`, `onPress`

5. **`savia-mobile/src/features/map/components/AlertMapCard.tsx`**
   - Card flotante que aparece al tocar un marcador (diseño basado en C16 de savia.pen)
   - Muestra: emoji de categoria, nombre de categoria, distancia al usuario, badge de urgencia
   - Botones: "Ver Detalle" (outline) y "Navegar" (filled, abre GPS externo)
   - Calcula distancia en tiempo real usando Haversine + formatDistance

6. **`savia-mobile/src/features/map/components/MapFilterOverlay.tsx`**
   - Panel overlay que se abre desde el icono SlidersHorizontal del header
   - Backdrop transparente que cierra al tocar fuera
   - Secciones: Radio, Urgencia, Tipo de alerta, Toggle "Mostrar lugares de Google"
   - Labels de seccion en uppercase con estilo caption

7. **`savia-mobile/src/features/map/components/RadiusSelector.tsx`**
   - Control segmentado horizontal: 200m, 500m, 1km (default), 2km
   - Activo: fondo primary, texto blanco
   - Controla el zoom del mapa al cambiar

8. **`savia-mobile/src/features/map/components/UrgencyFilterChips.tsx`**
   - Chips horizontales en ScrollView: Critica, Alta, Media, Baja
   - Multi-select con colores de urgencia, minimo 1 debe quedar activo
   - Usa URGENCY_LEVELS de `features/alerts/data/urgencyLevels.ts`

9. **`savia-mobile/src/features/map/components/CategoryFilterChips.tsx`**
   - Chips con nombre y color de cada categoria desde `useCategoryStore`
   - Logica: vacio = todas visibles, seleccionar una o mas = solo esas
   - Permite deseleccionar todas (vuelve a mostrar todas)

10. **`savia-mobile/src/features/map/components/NearbyAlertItem.tsx`**
    - Item de lista (creado por el plan original, actualmente no usado en la UI C16)
    - Layout: urgency dot + categoryName + address + distance + time + chevron

11. **`savia-mobile/src/features/map/components/NearbyAlertsList.tsx`**
    - FlatList wrapper (creado por el plan original, actualmente no usado en la UI C16)
    - Header "ALERTAS ACTIVAS (N)", empty state, loading indicator

### Tests
12. **`savia-mobile/src/features/map/utils/__tests__/geoUtils.test.ts`** (10 tests)
    - Haversine con coordenadas conocidas, formatDistance para metros y km, radiusToDelta

13. **`savia-mobile/src/features/map/store/__tests__/nearbyAlertsStore.test.ts`** (20 tests)
    - Estado inicial, setAllAlerts, setUserLocation, setSelectedRadius
    - toggleUrgency (seleccionar, deseleccionar, proteccion ultima)
    - toggleCategory (seleccionar, deseleccionar, vacio = todas)
    - mapFilteredAlerts (sin filtros, por urgencia, por categoria, combinados)
    - filteredAlerts (sin ubicacion, por distancia, por urgencia, ordenamiento, propiedad distance)
    - reset

14. **`savia-mobile/src/features/map/services/__tests__/nearbyAlertsService.test.ts`** (3 tests)
    - Verifica onSnapshot se llama con query correcta, cleanup unsubscribe, manejo de errores

---

## Archivos Modificados (3)

### 1. `backend/firestore.rules` (linea 70)
```diff
- allow read: if isOwner(resource.data.createdBy) || isAgentOrAdmin();
+ allow read: if isAuthenticated();
```
**Justificacion:** El mapa necesita leer TODAS las alertas activas, no solo las del usuario. Las alertas son informacion publica de seguridad. El campo `createdBy` es un UID opaco — sin acceso a `users` (restringido) no revela identidad.
**Deploy:** `firebase deploy --only firestore:rules` ejecutado exitosamente.

### 2. `savia-mobile/src/features/home/screens/CitizenMapScreen.tsx` (reemplazo completo)
De placeholder de ~45 lineas a pantalla funcional de ~300 lineas.

### 3. `savia-mobile/src/features/home/screens/CitizenAlertDetailScreen.tsx` (fix bug)
Movido `useCategoryColorMap()` de linea 148 (despues de early returns) a linea 111 (antes de early returns) para corregir violacion de Rules of Hooks.

---

## Problemas Encontrados y Soluciones

### Problema 1: Error "Rendered more hooks than during the previous render"
**Contexto:** Al navegar del mapa a AlertDetail, la app crasheaba.
**Causa raiz:** `useCategoryColorMap()` se llamaba DESPUES de early returns (loading/error) en `CitizenAlertDetailScreen.tsx` linea 148. Los hooks de React deben llamarse ANTES de cualquier return condicional.
**Solucion:** Mover el hook a linea 111, antes de los early returns. Bug pre-existente expuesto por la nueva ruta de navegacion desde el mapa.

### Problema 2: Marcadores no visibles en el mapa
**Contexto:** El mapa se mostraba sin ningun marcador de alerta.
**Causa raiz (doble):**
1. Se usaba `filteredAlerts()` que filtra por distancia (radio 1km default). Si las alertas estaban a >1km, no aparecian.
2. En Android, `tracksViewChanges={false}` impide que el bitmap del marker custom se capture.
**Solucion:**
1. Mapa usa `mapFilteredAlerts()` (sin filtro de distancia) para markers.
2. Inicia con `tracksViewChanges={true}` en Android, cambia a false despues de 500ms.

### Problema 3: Todos los marcadores del mismo color naranja
**Contexto:** Todas las alertas de prueba eran urgencia "high" (#F57C00), asi que los markers por urgencia se veian iguales.
**Solucion:** Cambiar de colores por urgencia a colores por categoria usando `useCategoryStore`. Cada tipo de alerta ahora tiene su color distintivo.

### Problema 4: Filtros de urgencia no funcionaban
**Contexto:** Cambiar filtros de urgencia no afectaba los markers del mapa.
**Causa raiz:** El mapa renderizaba `allAlerts` directamente (sin filtrar). Los filtros solo afectaban a `filteredAlerts()` que no se usaba para markers.
**Solucion:** Crear `mapFilteredAlerts()` en el store que filtra por urgencia y categoria (sin distancia). El mapa ahora usa esta funcion para renderizar markers.

### Problema 5: Necesidad de filtro por categoria
**Contexto:** El usuario pidio poder filtrar por tipo de alerta ademas de urgencia.
**Solucion:**
1. Agregar `selectedCategories` y `toggleCategory` al store
2. Crear componente `CategoryFilterChips` con colores dinamicos desde Firestore
3. Integrar en `MapFilterOverlay` con seccion "Tipo de alerta"

### Problema 6: Rediseno segun C16 de savia.pen
**Contexto:** El diseno original (mapa 300px + lista + filtros inline) no coincidia con el mockup C16.
**Solucion:** Rediseno completo siguiendo C16:
- Mapa a pantalla completa (flex: 1) en lugar de 300px
- Filtros movidos a overlay desde icono en header (SlidersHorizontal)
- Card flotante al tocar marker (emoji + categoria + distancia + urgencia + botones)
- Eliminacion de lista inline (NearbyAlertItem/NearbyAlertsList quedan sin usar)

### Problema 7: Intento de clustering con react-native-map-clustering
**Contexto:** Marcadores se veian grandes al alejar el zoom. Se intento clustering.
**Primer problema:** La libreria requiere prop `coordinate` expuesta en el componente wrapper. AlertMarker usaba `latitude/longitude` separados, asi que la libreria no reconocia los markers.
**Fix:** Cambiar AlertMarker a recibir `coordinate: {latitude, longitude}` como objeto.
**Segundo problema:** Con pocas alertas en la misma zona, el clustering las agrupaba en un cluster invisible, haciendo que "desaparecieran" del mapa.
**Decision final:** Remover `react-native-map-clustering`. Con < 100 alertas en una ciudad pequena como Atalaya, el clustering no aporta valor. Se mantuvo el cambio de prop `coordinate` por ser mas limpio.

### Problema 8: Marcadores de Google (POIs) estorban
**Contexto:** Los POIs de Google (negocios, tiendas, estaciones) se superponian con los marcadores de alertas.
**Solucion:** Usar `customMapStyle` de react-native-maps para ocultar POIs (`featureType: 'poi'` y `featureType: 'transit'` con `visibility: 'off'`). Toggle en filtros "Mostrar lugares de Google" (apagado por defecto).

---

## Funcionalidades Adicionales (no estaban en el plan original)

1. **Controles de zoom (+/-)**: Botones Plus y Minus que usan `getCamera()/animateCamera()` para zoom in/out
2. **Card flotante al tocar marker**: Patron AlertMapCard con info completa + navegacion GPS
3. **Filtro por categoria**: CategoryFilterChips con colores dinamicos de Firestore
4. **Ocultar POIs de Google**: customMapStyle + toggle en filtros
5. **Diseno C16**: Rediseno completo basado en el mockup de savia.pen

---

## Estado de Tests

**Total: 29 suites, 190 tests - TODOS PASAN**

Tests nuevos en esta feature:
- `geoUtils.test.ts`: 10 tests
- `nearbyAlertsStore.test.ts`: 20 tests (11 originales + 9 para categoria/mapFiltered)
- `nearbyAlertsService.test.ts`: 3 tests

---

## Estructura Final de Archivos del Feature Map

```
savia-mobile/src/features/map/
  components/
    AlertMarker.tsx          # Marker custom 32px con icono y color por categoria
    AlertMapCard.tsx          # Card flotante con info de alerta + botones
    CategoryFilterChips.tsx   # Chips de filtro por tipo de alerta
    MapFilterOverlay.tsx      # Panel overlay de filtros (radio + urgencia + categoria + POIs)
    NearbyAlertItem.tsx       # Item de lista (no usado en UI actual)
    NearbyAlertsList.tsx      # FlatList wrapper (no usado en UI actual)
    RadiusSelector.tsx        # Selector de radio (200m/500m/1km/2km)
    UrgencyFilterChips.tsx    # Chips de filtro por urgencia
  services/
    nearbyAlertsService.ts    # Suscripcion Firestore a alertas activas
    __tests__/
      nearbyAlertsService.test.ts
  store/
    nearbyAlertsStore.ts      # Zustand store con filtros y computed
    __tests__/
      nearbyAlertsStore.test.ts
  utils/
    geoUtils.ts               # Haversine, formatDistance, radiusToDelta
    __tests__/
      geoUtils.test.ts
```

---

## Estado del Sprint 7 - COMPLETO

| Feature | Estado |
|---------|--------|
| HU-SEG-004: Calificar atencion | COMPLETADO (sprint anterior) |
| HU-OPE-005: Navegacion GPS | COMPLETADO (sprint anterior) |
| HU-OPE-006: Derivar alertas | COMPLETADO (sprint anterior) |
| RF-ADM-005: CRUD categorias admin | COMPLETADO (sprint anterior) |
| Integracion categorias-instituciones | COMPLETADO (sprint anterior) |
| **Mapa de alertas cercanas** | **COMPLETADO (esta sesion)** |

---

## Estado del MVP2 - COMPLETO

Todos los criterios de aceptacion del MVP2 (Sprints 5-7) estan cumplidos:
- [x] Panel web accesible con auth de admin
- [x] Dashboard con KPIs
- [x] CRUD de usuarios, instituciones, categorias, alertas
- [x] Ciudadano puede calificar atencion
- [x] Ciudadano ve mapa con alertas cercanas en tiempo real
- [x] Agente puede derivar alerta
- [x] Agente puede navegar GPS
- [x] Categorias conectadas admin-movil-backend

---

## Lo Que Sigue: MVP3 (Sprints 8-9)

### Sprint 8 - Reportes Estadisticos
- **HU-ADM-004**: Reportes con filtros de fecha
- Graficos interactivos con Recharts (barras, lineas, pie)
- Reportes: alertas por tipo, urgencia, estado, institucion
- Exportar a PDF y Excel
- Rama: `feature/s8-reportes-estadisticos`

### Sprint 9 - Optimizacion + Launch
- Mapa de calor de zonas problematicas en admin dashboard
- Notificaciones por proximidad (RF-NOT-003)
- Optimizacion de performance y QA final
- App publicada en Play Store
- Rama: `feature/s9-mapa-calor`, `feature/s9-notificaciones-proximidad`, `feature/s9-optimizacion`

---

## Notas Importantes para Contexto Futuro

### Sobre el mapa en admin dashboard
El admin dashboard (Sprint 5) muestra KPIs numericos. NO tiene mapa en tiempo real. El mapa de calor esta planificado para Sprint 9 (MVP3). Esto NO es un bloqueador de MVP2.

### Sobre clustering
Se intento implementar `react-native-map-clustering` v4 pero se removio. Con pocas alertas en Atalaya, el clustering agrupaba markers y los hacia desaparecer. Los markers de `react-native-maps` siempre tienen tamano fijo en pixeles (32px) sin importar el zoom. No hay forma nativa de escalarlos con el zoom. Esto es aceptable para el caso de uso (alertas en una ciudad pequena).

### Sobre las reglas de Firestore
La regla de `alerts` se cambio de `isOwner || isAgentOrAdmin` a `isAuthenticated`. Esto permite que cualquier usuario logueado lea alertas (necesario para el mapa). Los campos sensibles como `createdBy` son UIDs opacos que no revelan identidad sin acceso a la coleccion `users` (que si esta restringida).

### Sobre NearbyAlertItem y NearbyAlertsList
Estos componentes fueron creados en el plan original para una vista con lista debajo del mapa. El rediseno C16 elimino la lista en favor de un mapa a pantalla completa con card flotante. Los componentes existen pero NO se usan en la UI actual. Se pueden reutilizar en el futuro si se necesita una vista de lista.

### Sobre la prop coordinate en AlertMarker
AlertMarker usa `coordinate: {latitude, longitude}` como objeto (no props separadas). Esto fue necesario para compatibilidad con react-native-map-clustering. Aunque se removio el clustering, se mantuvo el cambio porque es mas limpio y consistente con la API de react-native-maps Marker.

---

## Datos de Referencia Rapida

- **Ubicacion default Atalaya:** `{ latitude: -10.7291, longitude: -73.7538 }`
- **Firebase project:** `savia-27690`
- **Colores urgencia:** critical=#D32F2F, high=#F57C00, medium=#FBC02D, low=#388E3C
- **Colores categoria:** dinamicos desde Firestore via `useCategoryStore`
- **Navegacion a detalle:** `navigation.navigate('AlertDetail', { alertId })`
- **Query alertas activas:** `where('status', 'in', ['pending', 'assigned', 'in_progress']), orderBy('createdAt', 'desc')`
