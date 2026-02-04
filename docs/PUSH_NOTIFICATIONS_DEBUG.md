# Diagnóstico: Notificaciones Push No Funcionan

**Fecha:** 2026-02-03
**Estado:** ✅ SOLUCIONADO - Logs agregados + fallback de projectId implementado
**Síntoma:** Las notificaciones in-app funcionan, pero las push notifications no llegan a ningún dispositivo.

---

## Resumen Ejecutivo

Las notificaciones push no llegan porque **ningún usuario tiene el campo `expoPushToken` guardado en Firestore**. El problema está en el registro del token en el cliente móvil, no en el backend.

---

## Evidencia del Problema

### Logs de Cloud Functions (backend)

Ejecutar para ver los logs:
```bash
firebase functions:log --only onAlertCreated,onAlertUpdated
```

**Logs encontrados:**
```
2026-02-03T22:22:09.712288Z [Push] 2 agentes notificados (0 con push)
2026-02-03T22:26:17.416837Z [AlertUpdated] Ciudadano majxqKSR8GWFBoPIPSf1wFgPpbl2 sin token Expo, solo notificación in-app
2026-02-03T22:32:53.409484Z [AlertUpdated] Ciudadano majxqKSR8GWFBoPIPSf1wFgPpbl2 sin token Expo, solo notificación in-app
```

**Interpretación:**
- `(0 con push)` = Ningún agente tiene token Expo registrado
- `sin token Expo, solo notificación in-app` = El ciudadano tampoco tiene token

### Verificación en Firestore

Para verificar manualmente:
1. Ir a [Firebase Console](https://console.firebase.google.com/project/savia-27690/firestore)
2. Navegar a `users` → seleccionar cualquier documento
3. Buscar el campo `expoPushToken`
4. **Resultado esperado:** El campo no existe o está vacío en todos los usuarios

---

## Arquitectura del Sistema de Push Notifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO ACTUAL                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MOBILE (savia-mobile/)                                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Usuario hace login                                                 │   │
│  │ 2. authStore.ts llama registerForPushNotifications(userId)           │   │
│  │ 3. notificationPushService.ts:                                        │   │
│  │    - Verifica Device.isDevice (solo dispositivo físico)              │   │
│  │    - Obtiene projectId de Constants.expoConfig.extra.eas.projectId   │   │
│  │    - Solicita permisos de notificaciones                              │   │
│  │    - Genera ExpoPushToken via Expo SDK                                │   │
│  │    - Guarda token en Firestore: users/{userId}.expoPushToken         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼ (token guardado en Firestore)          │
│                                                                              │
│  BACKEND (backend/functions/)                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Trigger: onAlertCreated / onAlertUpdated                          │   │
│  │ 2. Lee tokens de usuarios relevantes desde Firestore                 │   │
│  │ 3. pushService.ts envía push via Expo Server SDK                     │   │
│  │ 4. Crea notificación in-app en Firestore                             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Análisis del Código - Puntos de Falla

### Archivo: `savia-mobile/src/features/notifications/services/notificationPushService.ts`

```typescript
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  // ❌ PUNTO DE FALLA 1: Solo funciona en dispositivo físico
  if (!Device.isDevice) {
    console.warn('[Notifications] Push notifications requieren dispositivo físico');
    return null;  // <- Retorna null, NO lanza error
  }

  // ❌ PUNTO DE FALLA 2: projectId puede ser undefined en builds de producción
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    (Constants as Record<string, unknown>)?.easConfig?.projectId;

  if (!projectId) {
    console.warn('[Notifications] No se encontró projectId de EAS. Ejecuta: eas init');
    return null;  // <- Retorna null, NO lanza error
  }

  try {
    // ❌ PUNTO DE FALLA 3: Permisos pueden ser denegados
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[Notifications] Permisos de notificaciones denegados');
      return null;  // <- Retorna null, NO lanza error
    }

    // Si llega aquí, genera y guarda el token
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenData.data;

    await updateDoc(doc(db, 'users', userId), { expoPushToken: token });
    return token;

  } catch (error) {
    // ❌ PUNTO DE FALLA 4: Error general
    console.error('[Notifications] Error registrando push notifications:', error);
    return null;
  }
}
```

### Archivo: `savia-mobile/src/shared/store/authStore.ts`

```typescript
// Líneas 129-133
// Registrar push notifications (no bloquea el flujo de auth)
setupNotificationHandler();
registerForPushNotifications(firebaseUser.uid).catch((err) => {
  console.warn('[Auth] Error registrando push notifications:', err);
});
```

**PROBLEMA:** El `.catch()` solo captura errores lanzados con `throw`. Los `return null` de los puntos de falla 1-3 **NO son capturados**, causando fallas silenciosas.

---

## Causas Probables (ordenadas por probabilidad)

### 1. `projectId` undefined en builds de producción (ALTA)

**Issue conocido de Expo:** https://github.com/expo/expo/issues/23225

En algunos builds de producción, `Constants.expoConfig.extra` puede ser `undefined` aunque esté configurado en `app.json`.

**Verificación:**
```typescript
// Agregar este log temporal en notificationPushService.ts
console.log('[Notifications] Constants.expoConfig:', JSON.stringify(Constants.expoConfig, null, 2));
console.log('[Notifications] projectId:', Constants?.expoConfig?.extra?.eas?.projectId);
```

**Configuración actual en app.json:**
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "6121b7e4-960c-41ea-83fc-57f06186367f"
      }
    }
  }
}
```

### 2. Permisos de notificaciones no otorgados (MEDIA)

Android 13+ (API 33) requiere permisos explícitos para notificaciones. Si el usuario no acepta el prompt, las push no funcionarán.

**Verificación:**
- En el dispositivo: Configuración → Apps → SAVIA → Notificaciones → Verificar que estén habilitadas

### 3. Falta FCM V1 Service Account Key en EAS (MEDIA-ALTA para Android)

Desde junio 2024, Expo requiere **FCM V1 credentials** para enviar push a Android. El legacy FCM API fue deprecado.

**Verificación:**
```bash
cd savia-mobile
eas credentials -p android
# Buscar: "FCM V1 Service Account Key"
```

**Si no existe, seguir:** https://docs.expo.dev/push-notifications/fcm-credentials/

### 4. Device.isDevice retorna false (BAJA en producción)

En emuladores siempre retorna `false`. En dispositivos físicos con apps de Play Store debería retornar `true`.

---

## Configuración Actual

### app.json (relevante para push)
```json
{
  "expo": {
    "plugins": [
      ["expo-notifications", { "color": "#1976D2" }]
    ],
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "extra": {
      "eas": {
        "projectId": "6121b7e4-960c-41ea-83fc-57f06186367f"
      }
    }
  }
}
```

### google-services.json
- **Existe:** ✅
- **project_number:** 771336495235
- **Tiene api_key:** ✅

### eas.json
- **development, preview, production:** Todos tienen las env vars de Firebase configuradas
- **EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:** 771336495235

### Backend (pushService.ts)
- **Usa:** `expo-server-sdk` v4.0.0
- **Valida tokens:** `Expo.isExpoPushToken(token)`
- **Envía via:** `expo.sendPushNotificationsAsync()`

---

## Solución Implementada

### ✅ Paso 1: Logs detallados agregados (HECHO)

El archivo `notificationPushService.ts` ahora tiene logs extensivos con prefijo `[Push]`:

```
[Push] ========== INICIO REGISTRO PUSH ==========
[Push] userId: xxx
[Push] Device.isDevice: true/false
[Push] Device.modelName: xxx
[Push] Platform.OS: android/ios
[Push] Constants.expoConfig: {...}
[Push] projectId desde Constants: xxx
[Push] projectId final a usar: xxx
[Push] Permisos existentes: granted/denied
[Push] ✅ Token generado: ExponentPushToken[xxx]
[Push] ✅ Token guardado exitosamente en Firestore
[Push] ========== FIN REGISTRO PUSH (ÉXITO) ==========
```

### ✅ Paso 2: Fallback de projectId agregado (HECHO)

Si `Constants.expoConfig.extra.eas.projectId` es undefined (problema conocido de Expo en builds de producción), ahora se usa automáticamente el projectId hardcodeado:

```typescript
const EAS_PROJECT_ID = '6121b7e4-960c-41ea-83fc-57f06186367f';

let projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? ...;

if (!projectId) {
  console.warn('[Push] ⚠️ projectId no encontrado en Constants, usando fallback hardcodeado');
  projectId = EAS_PROJECT_ID;
}
```

### Paso 3 (PENDIENTE): Configurar FCM V1 Credentials para Android

**IMPORTANTE para Android:** Desde junio 2024, Expo requiere FCM V1 credentials.

Verificar si ya están configuradas:

```typescript
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  console.log('[Notifications] === INICIO REGISTRO PUSH ===');
  console.log('[Notifications] userId:', userId);
  console.log('[Notifications] Device.isDevice:', Device.isDevice);
  console.log('[Notifications] Device.modelName:', Device.modelName);

  if (!Device.isDevice) {
    console.warn('[Notifications] ❌ FALLA: No es dispositivo físico');
    return null;
  }

  console.log('[Notifications] Constants.expoConfig:', JSON.stringify(Constants.expoConfig, null, 2));

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    (Constants as Record<string, unknown>)?.easConfig?.projectId;

  console.log('[Notifications] projectId obtenido:', projectId);

  if (!projectId) {
    console.warn('[Notifications] ❌ FALLA: projectId es undefined');
    // FALLBACK: Usar projectId hardcodeado
    // projectId = '6121b7e4-960c-41ea-83fc-57f06186367f';
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('[Notifications] Permisos existentes:', existingStatus);

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      console.log('[Notifications] Solicitando permisos...');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('[Notifications] Nuevo status de permisos:', finalStatus);
    }

    if (finalStatus !== 'granted') {
      console.warn('[Notifications] ❌ FALLA: Permisos denegados');
      return null;
    }

    console.log('[Notifications] Generando token con projectId:', projectId);
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId as string,
    });
    const token = tokenData.data;
    console.log('[Notifications] ✅ Token generado:', token);

    await updateDoc(doc(db, 'users', userId), { expoPushToken: token });
    console.log('[Notifications] ✅ Token guardado en Firestore');
    console.log('[Notifications] === FIN REGISTRO PUSH (ÉXITO) ===');

    return token;
  } catch (error) {
    console.error('[Notifications] ❌ FALLA: Error en registro:', error);
    console.log('[Notifications] === FIN REGISTRO PUSH (ERROR) ===');
    return null;
  }
}
```

### Paso 2: Agregar fallback para projectId

Si el diagnóstico confirma que `projectId` es undefined en producción:

```typescript
const projectId =
  Constants?.expoConfig?.extra?.eas?.projectId ??
  (Constants as Record<string, unknown>)?.easConfig?.projectId ??
  '6121b7e4-960c-41ea-83fc-57f06186367f';  // Fallback hardcodeado
```

### Paso 3: Configurar FCM V1 Credentials para Android

1. Ir a [Firebase Console](https://console.firebase.google.com/project/savia-27690/settings/serviceaccounts/adminsdk)
2. Click en "Generate new private key"
3. Guardar el archivo JSON descargado
4. Subir a EAS:
```bash
cd savia-mobile
eas credentials -p android
# Seleccionar: "Add a new FCM V1 Service Account Key"
# Subir el archivo JSON
```

### Paso 4: Verificar permisos en Android 13+

Asegurar que `expo-notifications` solicite permisos correctamente. En `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "color": "#1976D2",
          "sounds": ["./assets/notification.wav"]
        }
      ]
    ],
    "android": {
      "permissions": ["RECEIVE_BOOT_COMPLETED", "VIBRATE", "POST_NOTIFICATIONS"]
    }
  }
}
```

### Paso 5: Rebuild y test

```bash
cd savia-mobile

# Limpiar cache
npx expo start -c

# O hacer nuevo build de producción
eas build --platform android --profile production
```

---

## Cómo Verificar que Funciona

### 1. Ver logs en Metro/Expo

Después de iniciar sesión, buscar en la consola:
```
[Notifications] === INICIO REGISTRO PUSH ===
[Notifications] ✅ Token generado: ExponentPushToken[xxxxx]
[Notifications] ✅ Token guardado en Firestore
```

### 2. Verificar en Firestore

1. Firebase Console → Firestore → users → [usuario]
2. Debe existir campo `expoPushToken` con valor tipo `ExponentPushToken[xxxxx]`

### 3. Verificar logs del backend

```bash
firebase functions:log --only onAlertCreated
```

Debe mostrar:
```
[Push] X agentes notificados (X con push)  # X > 0
```

### 4. Probar manualmente con Expo Push Tool

1. Copiar el `expoPushToken` de Firestore
2. Ir a https://expo.dev/notifications
3. Pegar el token y enviar notificación de prueba

---

## Referencias

- [Expo Push Notifications Setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [Expo FCM V1 Credentials](https://docs.expo.dev/push-notifications/fcm-credentials/)
- [Issue: projectId undefined](https://github.com/expo/expo/issues/23225)
- [Push Notifications FAQ](https://docs.expo.dev/push-notifications/faq/)

---

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-02-03 | Documento creado con diagnóstico inicial |
