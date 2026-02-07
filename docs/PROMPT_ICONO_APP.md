# Prompt para Generar Icono de SAVIA

Usa este prompt en cualquier IA generadora de imagenes (Midjourney, DALL-E, Ideogram, Leonardo, etc.).

---

## Prompt principal

```text
Genera una imagen de un icono de aplicacion movil premium. El icono combina un escudo protector con un pin de ubicacion GPS en un solo simbolo unificado: la parte superior tiene forma de pin de mapa y la parte inferior se abre como un escudo. Dentro del simbolo, un destello o pulso de alerta (como ondas concentricas o un punto brillante) representa una alerta de emergencia activa. El color principal es un azul intenso (#1976D2) con un gradiente hacia azul oscuro (#0D47A1). Detalles y acentos en blanco y amarillo alerta (#FFC107). El fondo es azul oscuro (#0D47A1) para que el icono resalte. Estilo: icono de app moderno, limpio, con profundidad sutil (no completamente flat, permitir sombras suaves y ligero volumen). Similar en calidad al icono de apps como Citizen, Noonlight o Life360. Formato cuadrado 1024x1024 pixeles, PNG. No incluir texto ni letras.
```

## Prompt version fondo blanco (para adaptive-icon)

```text
Genera la misma imagen del icono anterior (escudo con pin GPS y ondas amarillas de alerta), pero ahora con fondo blanco solido (#FFFFFF). El escudo y el simbolo deben mantener los mismos colores azules (#1976D2, #0D47A1) y las ondas amarillas (#FFC107). Solo cambia el fondo a blanco. El simbolo debe ocupar al menos el 85-90% del area total de la imagen, bien centrado, con muy poco margen en los bordes. Formato cuadrado 1024x1024 pixeles, PNG.
```

---

## Despues de generar la imagen

Necesitas crear 3 versiones del icono para el proyecto:

### 1. `icon.png` (1024x1024)
- Icono completo con fondo
- Se usa como icono general de la app

### 2. `adaptive-icon.png` (1024x1024)
- Solo el escudo/simbolo centrado, SIN fondo
- Fondo transparente (PNG con alpha)
- El simbolo debe ocupar ~70% del area total (dejar margen)
- Android usa esto con un color de fondo configurable (actualmente blanco en app.json)

### 3. `play-store-icon.png` (512x512)
- Version a 512x512 del icon.png
- Requerido por Google Play Console al subir la app
- NO puede tener transparencia (fondo solido obligatorio)

### Donde colocar los archivos
```
savia-mobile/assets/icon.png              -> 1024x1024 con fondo
savia-mobile/assets/adaptive-icon.png     -> 1024x1024 fondo transparente
savia-mobile/assets/play-store-icon.png   -> 512x512 con fondo solido
```

### Referencia actual en app.json
Los archivos `icon.png` y `adaptive-icon.png` ya estan referenciados en `app.json`:
```json
"icon": "./assets/icon.png",
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#ffffff"
  }
}
```

No necesitas cambiar nada en app.json, solo reemplazar los archivos PNG en la carpeta assets.

---

## Colores de referencia de SAVIA

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | #1976D2 | Color principal de la app |
| Primary Dark | #1565C0 | Variante oscura |
| Error/Alert | #D32F2F | Rojo de alertas |
| Background | #FFFFFF | Fondo |
| Surface | #FFFFFF | Superficies |
