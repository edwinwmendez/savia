# Guia: Development Build iOS + Push Notifications

Guia paso a paso para compilar SAVIA en iOS con soporte de notificaciones push.

---

## Requisitos Previos

- **Cuenta de Apple Developer** (USD $99/ano) - https://developer.apple.com/account
  - Es obligatoria para compilar en iOS. Sin ella no se puede generar certificados ni provisioning profiles.
  - Si no la tienes, crea una en https://developer.apple.com/programs/enroll/
- **EAS CLI instalado y logueado** (ya lo hiciste para Android)
- **Dispositivo fisico iPhone/iPad** para probar push notifications (el simulador iOS NO soporta push)
- **Mac con Xcode instalado** (no es necesario abrirlo, pero debe estar instalado para que EAS pueda compilar localmente si es necesario)

---

## Paso 1: Verificar configuracion del proyecto

La configuracion de iOS ya esta lista en `app.json`:

```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.savia.mobile"
    },
    "plugins": [
      ["expo-notifications", { "color": "#1976D2" }]
    ]
  }
}
```

El `bundleIdentifier` es `com.savia.mobile` y el plugin `expo-notifications` ya esta configurado.

**No hay que cambiar nada aqui.**

---

## Paso 2: Registrar tu dispositivo iOS en EAS

iOS requiere que registres el UDID de tu dispositivo fisico antes de compilar.

```bash
cd savia-mobile
eas device:create
```

EAS te dara dos opciones:
1. **Website** (Recomendado) - Genera un link/QR que abres desde Safari en tu iPhone. El sitio web instala un perfil temporal que envia el UDID a EAS automaticamente.
2. **Manual** - Ingresas el UDID manualmente.

### Como obtener el UDID manualmente (alternativa)
1. Conecta tu iPhone al Mac via USB
2. Abre **Finder** (macOS Catalina+) o **iTunes**
3. Selecciona tu dispositivo
4. Haz clic en la informacion debajo del nombre del dispositivo hasta que aparezca el **UDID**
5. Clic derecho > Copiar

---

## Paso 3: Configurar credenciales de APNs (Push Notifications)

EAS puede manejar las credenciales automaticamente, pero aqui esta el proceso detallado por si necesitas hacerlo manual.

### Opcion A: Automatico (Recomendado)

Cuando ejecutes `eas build` por primera vez para iOS, EAS te preguntara si quieres habilitar push notifications. Responde **Yes** a todo. EAS generara automaticamente:
- Apple Distribution Certificate
- Provisioning Profile con Push Notifications habilitado
- APNs Key (clave de notificaciones push)

### Opcion B: Manual

Si necesitas configurar credenciales manualmente:

```bash
eas credentials -p ios
```

Selecciona:
1. **Build Credentials** > tu target
2. **Set up all build credentials**
3. Di **Yes** a generar nuevos certificados y profiles

### Configurar APNs Key manualmente (si EAS no lo hace)

1. Ve a https://developer.apple.com/account
2. **Certificates, Identifiers & Profiles** > **Keys**
3. Clic en **+** para crear nueva Key
4. Nombre: `SAVIA Push Key`
5. Habilita **Apple Push Notifications service (APNs)**
6. Clic en **Configure** > selecciona **Sandbox & Production**
7. Clic en **Continue** > **Register**
8. **Descarga el archivo .p8** (solo se puede descargar UNA vez)
9. Anota el **Key ID** (ej: `ABC123DEF4`)

Luego sube la key a EAS:

```bash
eas credentials -p ios
```

Selecciona: **Push Notifications** > **Upload APNs Key** > selecciona el archivo `.p8`

---

## Paso 4: Compilar el Development Build para iOS

```bash
cd savia-mobile
eas build --profile development --platform ios
```

EAS te preguntara varias cosas durante el primer build:

1. **"Log in to your Apple Developer account"**
   - Ingresa tu Apple ID y contrasena
   - Si tienes 2FA habilitado, ingresa el codigo de verificacion

2. **"Select Team"** (si perteneces a varios teams)
   - Selecciona tu team personal o el de tu organizacion

3. **"Enable push notifications?"**
   - Responde: **Yes**

4. **"Generate a new Apple Distribution Certificate?"**
   - Responde: **Yes**

5. **"Generate a new Apple Provisioning Profile?"**
   - Responde: **Yes**

El build se sube a los servidores de EAS y puede demorar varios minutos (plan gratuito tiene cola de espera).

---

## Paso 5: Instalar en tu iPhone

Cuando el build termine, EAS mostrara un **QR code** y un **link de descarga**.

### Desde el iPhone:
1. Abre el link desde Safari en tu iPhone
2. Se descargara un perfil de instalacion
3. Ve a **Ajustes** > **General** > **VPN y administracion de dispositivos**
4. Busca el perfil de SAVIA y toca **Instalar**
5. Ingresa tu codigo de desbloqueo si te lo pide
6. La app se instalara en tu pantalla de inicio

### Desde la CLI (si tienes el iPhone conectado por USB):
```bash
eas build:run -p ios
```

---

## Paso 6: Conectar al servidor de desarrollo

Una vez instalada la app en tu iPhone:

1. Asegurate de que tu Mac y tu iPhone esten en la **misma red WiFi**
2. En tu Mac:
   ```bash
   cd savia-mobile
   pnpm start --clear
   ```
3. En tu iPhone, abre la app SAVIA
4. Deberia conectarse automaticamente al servidor de desarrollo
5. Si no conecta, escanea el QR code que muestra la terminal

Ahora tienes hot reload, logs y todo igual que con Expo Go, pero con soporte nativo completo.

---

## Paso 7: Probar push notifications

1. Abre la app SAVIA en tu iPhone
2. Login como ciudadano
3. La app pedira **permiso para enviar notificaciones** > Toca **Permitir**
4. Verifica en Firebase Console > Firestore > `users/{uid}` que aparezca `expoPushToken`
5. Crea una alerta como ciudadano
6. Desde otra sesion, login como agente y toma el caso
7. El ciudadano deberia recibir la notificacion push

### Probar con la herramienta de Expo

Tambien puedes enviar una notificacion de prueba directamente:

1. Copia el `expoPushToken` de Firestore (ej: `ExponentPushToken[xxxxxx]`)
2. Ve a https://expo.dev/notifications
3. Pega el token, escribe un titulo y mensaje
4. Clic en **Send a Notification**
5. Deberia llegar al iPhone

---

## Diferencias con Android

| Aspecto | Android | iOS |
|---------|---------|-----|
| Cuenta de desarrollador | Gratis (Expo/EAS) | Apple Developer $99/ano |
| Credencial de push | FCM V1 Service Account Key | APNs Key (.p8) |
| Archivo de config | `google-services.json` | No necesita archivo extra |
| Simulador soporta push | Si (emulador) | No (requiere dispositivo fisico) |
| Formato de build | APK | IPA (o link de instalacion) |
| Instalacion | Descargar APK directo | Requiere provisioning profile |

---

## Troubleshooting

### "No se reciben notificaciones en iOS"
- Verifica que aceptaste el permiso de notificaciones al abrir la app
- Verifica que el `expoPushToken` esta guardado en Firestore
- Las push NO funcionan en el simulador iOS, solo en dispositivo fisico
- Verifica que la APNs Key esta subida en EAS: `eas credentials -p ios`

### "Build falla con error de certificados"
- Asegurate de tener una cuenta Apple Developer activa ($99/ano)
- Revoca certificados viejos si llegaste al limite (2 Distribution Certificates max)
- Usa `eas credentials -p ios` para gestionar certificados

### "La app no conecta al servidor de desarrollo"
- Mac y iPhone deben estar en la misma red WiFi
- Desactiva VPN si tienes una activa
- Intenta ingresar la URL del servidor manualmente en la app

### "Error: Provisioning Profile does not include the Push Notifications entitlement"
- Regenera el provisioning profile: `eas credentials -p ios`
- Selecciona **Generate a new Apple Provisioning Profile**
- Asegurate de que Push Notifications esta habilitado en tu App ID en Apple Developer Portal

---

## Resumen de Comandos

```bash
# 1. Registrar dispositivo iOS
eas device:create

# 2. Compilar Development Build
eas build --profile development --platform ios

# 3. Instalar en dispositivo (si conectado por USB)
eas build:run -p ios

# 4. Iniciar servidor de desarrollo
pnpm start --clear

# 5. Gestionar credenciales
eas credentials -p ios

# 6. Compilar para ambas plataformas a la vez
eas build --profile development --platform all
```

---

## Referencias

- [Expo Push Notifications Setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [Expo Notifications SDK](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [EAS Build - iOS](https://docs.expo.dev/build/introduction/)
- [App Credentials (Expo Docs)](https://docs.expo.dev/app-signing/app-credentials/)
