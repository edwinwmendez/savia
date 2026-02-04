# Ideas Futuras - SAVIA

Registro de ideas y mejoras para implementar en futuros sprints.

---

## 1. Notificaciones en tiempo real para Admin Web

**Problema**: El panel admin no recibe notificaciones push. Solo ve datos al consultar Firestore manualmente (recargando la pagina o navegando).

**Solucion propuesta**: Implementar notificaciones en tiempo real usando una de estas opciones:
- **Opcion A**: Real-time listeners de Firestore (`onSnapshot`) para que el dashboard se actualice automaticamente cuando llegan nuevas alertas o cambian de estado.
- **Opcion B**: Web Push Notifications con Service Workers para que el admin reciba notificaciones del navegador incluso con la pestana en segundo plano.
- **Opcion C**: Ambas combinadas (listeners para datos en vivo + Web Push para avisos cuando no esta mirando).

**Contexto**: Actualmente las push notifications solo funcionan en dispositivos moviles via Expo/FCM. El admin web no tiene ningun mecanismo de aviso activo.

---

## 2. Mapa Operativo en Admin (alertas + agentes en tiempo real)

**Problema**: El admin no puede ver donde estan sus agentes ni como se distribuyen respecto a las alertas activas. El mapa de calor existente cumple su funcion (mostrar zonas con mas incidentes), pero no sirve para supervision operativa en tiempo real.

**Solucion propuesta**: Crear una pantalla dedicada "Mapa Operativo" en el admin panel que muestre en un solo mapa:
- **Alertas activas** con marcadores diferenciados por tipo, urgencia y estado (pendiente, en_camino, en_lugar).
- **Agentes activos** con su ubicacion actual, diferenciados por institucion (PNP, Serenazgo, Bomberos, etc.).
- **Lineas de asignacion**: conectar visualmente al agente con la alerta que tiene asignada.
- **Panel lateral** con lista filtrable de agentes e indicador de "ultima actualizacion hace X minutos".

**Tracking de agentes**: Actualmente solo los ciudadanos tienen tracking de ubicacion activo (cada 15 min via `locationTrackingService`). Para esta funcionalidad se necesita:
1. Activar el tracking tambien para agentes en `authStore.ts` (actualmente solo se activa si `role === 'citizen'`).
2. Reducir el intervalo de actualizacion para agentes a ~2-3 minutos (mejor granularidad operativa sin consumo excesivo de bateria ni escrituras Firestore).
3. En el admin, usar `onSnapshot` sobre los documentos de `users` con `role: 'agent'` e `isActive: true` para recibir actualizaciones de posicion en tiempo real sin polling.

**Por que onSnapshot y no polling**: Firestore ya soporta listeners en tiempo real. Cada vez que un agente actualiza su `lastLocation`, el admin recibe el cambio automaticamente. No se necesita ningun endpoint extra ni intervalo de consulta. Es mas eficiente y da mejor experiencia.

**Diferencia con el mapa de calor**: El mapa de calor muestra datos historicos agregados (densidad de incidentes por zona). El mapa operativo muestra el estado actual de la operacion: quien esta donde, que alertas estan activas, y que agentes estan respondiendo. Son complementarios.

**Contexto tecnico**: Los agentes ya tienen el campo `lastLocation` en Firestore (`users/{id}/lastLocation` con lat, lng, geohash, updatedAt). Solo falta activar el tracking desde la app movil y construir la vista en el admin.

---

## 3. Ubicacion de Instituciones en Mapa

**Problema**: Al crear o editar una institucion en el admin, no se puede especificar su ubicacion fisica. Esto limita funcionalidades como mostrar las instituciones en un mapa o calcular distancias.

**Solucion propuesta**: Agregar un selector de ubicacion en el modal de crear/editar institucion:
- **Mapa interactivo** donde el admin pueda hacer clic para colocar un marcador.
- **Campos de latitud/longitud** que se autocompleten al seleccionar en el mapa (o se puedan editar manualmente).
- **Direccion opcional** con texto libre o autocompletado via Google Places.

**Beneficios**:
- Mostrar instituciones en el Mapa Operativo con marcadores diferenciados por tipo (comisaria, estacion de bomberos, base de serenazgo, etc.).
- Calcular que institucion esta mas cerca de una alerta para asignacion inteligente.
- Visualizar cobertura geografica de cada institucion.

**Modelo de datos**: Agregar a la coleccion `institutions`:
```typescript
location?: {
  lat: number;
  lng: number;
  address?: string;
}
```

**Contexto**: Actualmente las instituciones solo tienen nombre, tipo y categorias que atienden. No tienen ubicacion geografica.
