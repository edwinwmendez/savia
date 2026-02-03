# Guía de Debugging: Crashes en Android (React Native/Expo)

Esta guía documenta cómo encontrar la causa de un crash en una app Android cuando no tienes información visible del error.

## El Problema

La app SAVIA se descargó desde Google Play (prueba interna) y al abrirla, se cerraba inmediatamente. No había ningún mensaje de error visible. Sentry (nuestra herramienta de monitoreo) no capturó nada porque el crash ocurría antes de que Sentry pudiera inicializarse.

## Herramienta Principal: ADB (Android Debug Bridge)

ADB es una herramienta de línea de comandos que permite comunicarte con un dispositivo Android conectado por USB.

### Requisitos Previos

1. **Habilitar "Opciones de desarrollador" en el celular:**
   - Ve a Configuración → Acerca del teléfono
   - Toca 7 veces en "Número de compilación"
   - Aparecerá el mensaje "Ahora eres desarrollador"

2. **Habilitar "Depuración USB":**
   - Ve a Configuración → Opciones de desarrollador
   - Activa "Depuración USB"

3. **Conectar el celular por USB a la computadora**

4. **Verificar que ADB detecta el dispositivo:**
   ```bash
   adb devices
   ```
   Deberías ver algo como:
   ```
   List of devices attached
   RFCW318B16V    device
   ```
   (El código es el ID de tu dispositivo)

## Proceso de Debugging Paso a Paso

### Paso 1: Limpiar los logs anteriores

Antes de reproducir el crash, limpiamos el historial de logs para no confundirnos con errores viejos:

```bash
adb logcat -c
```

Si tienes múltiples dispositivos conectados, especifica cuál:
```bash
adb -s RFCW318B16V logcat -c
```

### Paso 2: Reproducir el crash

Abre la app en el celular y deja que crashee.

### Paso 3: Capturar los logs

Inmediatamente después del crash, captura los logs:

```bash
adb logcat -d > crash_logs.txt
```

El flag `-d` significa "dump" - captura los logs actuales y termina (no se queda esperando).

### Paso 4: Buscar el error

Los logs de Android son MUY extensos (miles de líneas de todo el sistema). Necesitas filtrar para encontrar tu app.

#### Búsqueda 1: Por nombre del paquete
```bash
adb logcat -d | grep -i "com.savia.mobile"
```

#### Búsqueda 2: Por errores fatales de Android
```bash
adb logcat -d | grep -i "AndroidRuntime"
```

#### Búsqueda 3: Por palabras clave de error
```bash
adb logcat -d | grep -iE "fatal|crash|exception|error"
```

#### Búsqueda 4: Por React Native / Hermes (motor JS)
```bash
adb logcat -d | grep -iE "react|hermes|jscexecutor"
```

#### Búsqueda 5: Por crash dumps nativos
```bash
adb logcat -d | grep -i "DEBUG"
```

## El Error que Encontramos

Después de varias búsquedas, encontré esto en los logs:

```
F DEBUG   : Abort message: 'terminating due to uncaught exception of type
facebook::jni::JniException: com.facebook.react.common.JavascriptException:
[runtime not ready]: FirebaseError: Firebase: Error (auth/invalid-api-key).,
```

### Interpretación del Error

- `F DEBUG` = Fatal Debug (crash nativo)
- `facebook::jni::JniException` = Error de Java/JavaScript en React Native
- `FirebaseError: Firebase: Error (auth/invalid-api-key)` = **¡LA CAUSA REAL!**

El error `auth/invalid-api-key` significa que Firebase no recibió una API key válida.

## La Causa Raíz

En desarrollo local, la app lee las variables de entorno del archivo `.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
```

Pero cuando EAS Build compila la app para producción, **NO lee el archivo `.env`**. Las variables deben estar en `eas.json`:

**Antes (incorrecto):**
```json
"production": {
  "env": {
    "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY": "..."
  }
}
```

**Después (correcto):**
```json
"production": {
  "env": {
    "EXPO_PUBLIC_FIREBASE_API_KEY": "...",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN": "...",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID": "...",
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET": "...",
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "...",
    "EXPO_PUBLIC_FIREBASE_APP_ID": "...",
    "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY": "..."
  }
}
```

## La Solución

1. Agregué todas las variables de Firebase a `eas.json` en el perfil `production`
2. Generé un nuevo build: `eas build --platform android --profile production`
3. Subí el nuevo AAB a Google Play Console

## Comandos Útiles de ADB

| Comando | Descripción |
|---------|-------------|
| `adb devices` | Lista dispositivos conectados |
| `adb logcat -c` | Limpia los logs |
| `adb logcat -d` | Captura logs actuales (dump) |
| `adb logcat` | Muestra logs en tiempo real (Ctrl+C para salir) |
| `adb logcat -d \| grep "texto"` | Filtra logs por texto |
| `adb logcat -d > archivo.txt` | Guarda logs en archivo |
| `adb install app.apk` | Instala un APK |
| `adb uninstall com.paquete` | Desinstala una app |

## Lecciones Aprendidas

1. **Sentry no captura todo**: Si el crash ocurre antes de que tu código se ejecute (como un error de configuración), Sentry no lo verá.

2. **ADB es indispensable**: Para crashes nativos o de inicialización, ADB + logcat es la única forma de ver qué pasó.

3. **Variables de entorno en EAS**: SIEMPRE verificar que `eas.json` tenga TODAS las variables necesarias para producción. El archivo `.env` local NO se incluye en el build.

4. **Buscar por capas**: Primero busca por nombre de paquete, luego por palabras clave de error, luego por crash dumps nativos.

5. **El error real está en el mensaje**: Busca líneas con `Abort message:` o `Exception:` - ahí está la causa real.

## Checklist Pre-Publicación

Antes de subir a Play Store, verificar:

- [ ] Todas las variables de `.env` están en `eas.json` (perfil production)
- [ ] El build de producción se puede instalar y abrir sin crash
- [ ] Probar en un dispositivo real, no solo emulador
- [ ] Verificar que Firebase, Maps y otras APIs funcionen

---

*Documentado el 2026-02-03 después de resolver crash en SAVIA v3.0.0*
