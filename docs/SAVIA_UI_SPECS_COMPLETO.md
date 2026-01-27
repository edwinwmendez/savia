# 📱 SAVIA - ESPECIFICACIONES COMPLETAS DE UI
## Sistema de Alertas Vecinales Integrado de Atalaya
### Guía de Diseño para Generación con IA

**Versión:** 2.0  
**Fecha:** Enero 2026  
**Total de pantallas:** 33 (16 Ciudadano + 7 Operador + 10 Admin Web)

---

# ⚠️ REGLAS CRÍTICAS DE CONSISTENCIA

> **LEER ANTES DE GENERAR CUALQUIER PANTALLA**

## REGLA 1: NUNCA HARDCODEAR VALORES
```
❌ INCORRECTO: "Background: #1976D2"
✅ CORRECTO:   "Background: use variable 'primary'"

❌ INCORRECTO: "Font size: 16px"
✅ CORRECTO:   "Font size: use variable 'font-body'"

❌ INCORRECTO: "Padding: 24px"
✅ CORRECTO:   "Padding: use variable 'spacing-lg'"
```

## REGLA 2: ALTURA SIEMPRE DINÁMICA
```
❌ INCORRECTO: "Screen height: 812px"
✅ CORRECTO:   "Screen height: DYNAMIC (fit content + safe areas)"

La altura debe adaptarse al contenido. Solo el ANCHO es fijo (375px mobile, 1440px web).
```

## REGLA 3: USAR COMPONENTES REUTILIZABLES
```
❌ INCORRECTO: Describir cada input desde cero
✅ CORRECTO:   "[USE COMPONENT: INPUT FIELD] with Label: 'Email'"
```

## REGLA 4: BORDES CONSISTENTES
```
Todas las pantallas móviles: Device frame corners radius-xl
Todos los cards: radius-lg
Todos los inputs: radius-lg
Todos los botones: radius-lg
Todos los badges: radius-sm
Todos los avatares: radius-full
```

---

# 🎨 PARTE 1: SISTEMA DE DISEÑO GLOBAL

## 1.1 THEME VARIABLES - COLORES

```yaml
# COLORES PRIMARIOS
primary:          "#1976D2"   # Azul principal
primary-dark:     "#1565C0"   # Azul oscuro (hover/pressed)
primary-light:    "#BBDEFB"   # Azul claro (backgrounds suaves)

# COLORES DE ESTADO
success:          "#4CAF50"   # Verde (éxito, completado)
warning:          "#FF9800"   # Naranja (advertencia, en proceso)
error:            "#F44336"   # Rojo (error, peligro, emergencia)
info:             "#2196F3"   # Azul info

# COLORES DE SUPERFICIE
background:       "#F5F5F5"   # Fondo general de la app
surface:          "#FFFFFF"   # Cards, modals, inputs
border:           "#E0E0E0"   # Bordes y divisores

# COLORES DE TEXTO
text-primary:     "#212121"   # Texto principal (casi negro)
text-secondary:   "#757575"   # Texto secundario (gris)

# COLORES DE URGENCIA
urgency-critical: "#D32F2F"   # Crítica (rojo oscuro)
urgency-high:     "#F57C00"   # Alta (naranja)
urgency-medium:   "#FBC02D"   # Media (amarillo)
urgency-low:      "#388E3C"   # Baja (verde)

# COLORES DE CATEGORÍAS DE ALERTA
alert-robbery:    "#D32F2F"   # Robo/Asalto
alert-accident:   "#F57C00"   # Accidente
alert-medical:    "#E91E63"   # Emergencia médica
alert-fire:       "#FF5722"   # Incendio
alert-electrical: "#FFC107"   # Falla eléctrica
alert-water:      "#2196F3"   # Problema de agua
alert-lost:       "#9C27B0"   # Pérdida/Hallazgo
alert-other:      "#607D8B"   # Otro
```

## 1.2 THEME VARIABLES - TIPOGRAFÍA

```yaml
# TAMAÑOS DE FUENTE
font-h1:          32    # Títulos principales
font-h2:          24    # Títulos de sección
font-h3:          20    # Subtítulos
font-h4:          18    # Headers de cards
font-body:        16    # Texto normal
font-body-small:  14    # Texto secundario
font-caption:     12    # Etiquetas, helpers
font-button:      16    # Texto de botones

# PESOS DE FUENTE
font-weight-bold:     700
font-weight-semibold: 600
font-weight-medium:   500
font-weight-regular:  400

# FAMILIA
font-family: "Inter" (fallback: system-ui)
```

## 1.3 THEME VARIABLES - ESPACIADO

```yaml
# ESCALA DE ESPACIADO (base 8px)
spacing-xs:   4     # Gaps mínimos
spacing-sm:   8     # Padding interno pequeño
spacing-md:   16    # Padding estándar
spacing-lg:   24    # Márgenes entre secciones
spacing-xl:   32    # Separación mayor
spacing-2xl:  48    # Espacios grandes
```

## 1.4 THEME VARIABLES - BORDES

```yaml
# BORDER RADIUS
radius-sm:    4     # Badges, chips pequeños
radius-md:    8     # Inputs pequeños, botones small
radius-lg:    12    # Cards, botones, inputs
radius-xl:    16    # Modals, cards destacadas, device frame
radius-full:  9999  # Círculos perfectos
```

## 1.5 THEME VARIABLES - ICONOS

```yaml
# TAMAÑOS DE ICONOS
icon-sm:   16    # Inline, indicadores
icon-md:   20    # Inputs, listas
icon-lg:   24    # Navigation, headers
icon-xl:   32    # Features, estados grandes
```

## 1.6 THEME VARIABLES - SOMBRAS

```yaml
# PRESETS DE SOMBRAS
shadow-sm:      "0 2px 4px rgba(0,0,0,0.08)"
shadow-md:      "0 2px 8px rgba(0,0,0,0.06)"
shadow-lg:      "0 4px 12px rgba(0,0,0,0.10)"
shadow-xl:      "0 8px 24px rgba(0,0,0,0.15)"
shadow-nav:     "0 -2px 8px rgba(0,0,0,0.08)"
shadow-button:  "0 4px 12px [color] at 30% opacity"
```

---

# 🏗️ PARTE 2: COMPONENTES REUTILIZABLES

## 2.1 SCREEN BASE - MOBILE

```yaml
MOBILE_SCREEN_BASE:
  width: 375px (FIJO)
  height: DYNAMIC (se ajusta al contenido)
  min_height: "100vh o contenido mínimo"
  
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background' or 'surface'"
    corners: "use variable 'radius-xl'" # SIEMPRE para device frame
  
  safe_areas:
    top: 44px (status bar)
    bottom: 34px (home indicator)
  
  content_padding:
    horizontal: "use variable 'spacing-lg'"
```

## 2.2 COMPONENT: HEADER_MOBILE

```yaml
HEADER_MOBILE:
  height: 56px
  background: "use variable 'surface'"
  shadow: "use variable 'shadow-sm'"
  padding_horizontal: "use variable 'spacing-md'"
  border: none
  border_radius: none
  
  layout: row
  justify: space-between
  align: center
  
  slots:
    left:
      options:
        - back_arrow: {icon: "arrow-left", size: "icon-lg", color: "text-primary"}
        - close: {icon: "x", size: "icon-lg", color: "text-primary"}
        - logo: {icon: "shield" + text: "SAVIA"}
    
    center:
      title:
        font_size: "use variable 'font-h4'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-primary'"
    
    right:
      options:
        - icon_button: {size: "icon-lg", color: "text-primary"}
        - text_link: {font_size: "font-body-small", color: "primary"}
        - avatar: {size: 36px, radius: "radius-full"}
        - spacer: {width: 24px} # para balance visual
```

## 2.3 COMPONENT: INPUT_FIELD

```yaml
INPUT_FIELD:
  container:
    width: 100%
    height: 56px
    background: "use variable 'surface'"
    border: "1px solid 'border'"
    border_radius: "use variable 'radius-lg'"
    padding_left: 52px (con icono) | "spacing-md" (sin icono)
    padding_right: "use variable 'spacing-md'" | 52px (con icono derecho)
  
  icon_left:
    position: "16px from left, vertical center"
    size: "use variable 'icon-md'"
    color: "use variable 'text-secondary'"
  
  icon_right:
    position: "16px from right, vertical center"
    size: "use variable 'icon-md'"
    color: "use variable 'text-secondary'"
  
  label:
    font_size: "use variable 'font-body-small'"
    font_weight: "use variable 'font-weight-medium'"
    color: "use variable 'text-primary'"
    margin_bottom: "use variable 'spacing-sm'"
  
  placeholder:
    font_size: "use variable 'font-body'"
    color: "use variable 'text-secondary'"
  
  helper_text:
    font_size: "use variable 'font-caption'"
    color: "use variable 'text-secondary'"
    margin_top: "use variable 'spacing-xs'"
  
  states:
    default: {border_color: "border"}
    focus: {border_color: "primary", shadow: "0 0 0 3px primary-light"}
    error: {border_color: "error", helper_color: "error"}
    disabled: {background: "background", opacity: 0.6}
```

## 2.4 COMPONENT: BUTTON_PRIMARY

```yaml
BUTTON_PRIMARY:
  container:
    width: 100% | auto
    height: 56px
    background: "use variable 'primary'"
    border: none
    border_radius: "use variable 'radius-lg'"
    shadow: "0 4px 12px 'primary' at 30% opacity"
  
  content:
    layout: row
    justify: center
    align: center
    gap: "use variable 'spacing-sm'"
  
  icon:
    size: "use variable 'icon-md'"
    color: "use variable 'surface'"
  
  text:
    font_size: "use variable 'font-button'"
    font_weight: "use variable 'font-weight-semibold'"
    color: "use variable 'surface'"
  
  states:
    default: {background: "primary"}
    hover: {background: "primary-dark"}
    pressed: {background: "primary-dark", shadow: "shadow-sm"}
    disabled: {opacity: 0.5, shadow: none}
```

## 2.5 COMPONENT: BUTTON_SECONDARY

```yaml
BUTTON_SECONDARY:
  container:
    width: 100% | auto
    height: 56px
    background: "use variable 'surface'"
    border: "2px solid 'primary'"
    border_radius: "use variable 'radius-lg'"
    shadow: none
  
  text:
    font_size: "use variable 'font-button'"
    font_weight: "use variable 'font-weight-semibold'"
    color: "use variable 'primary'"
  
  states:
    hover: {background: "primary-light at 20%"}
```

## 2.6 COMPONENT: CARD

```yaml
CARD:
  container:
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-lg'"
    padding: "use variable 'spacing-md'"
    shadow: "use variable 'shadow-md'"
    border: none
  
  variants:
    with_accent:
      border_left: "4px solid [accent_color]"
    
    elevated:
      shadow: "use variable 'shadow-lg'"
    
    interactive:
      hover_shadow: "use variable 'shadow-lg'"
```

## 2.7 COMPONENT: BADGE

```yaml
BADGE:
  container:
    height: auto
    padding_vertical: "use variable 'spacing-xs'"
    padding_horizontal: "use variable 'spacing-sm'"
    border_radius: "use variable 'radius-sm'"
    background: "[color] at 15% opacity"
    border: none
  
  text:
    font_size: "use variable 'font-caption'"
    font_weight: "use variable 'font-weight-semibold'"
    color: "[color] at 100%"
  
  with_dot:
    dot_size: 6px
    dot_color: "[color]"
    dot_position: left
    gap: "use variable 'spacing-xs'"
```

## 2.8 COMPONENT: BOTTOM_NAV_CITIZEN

```yaml
BOTTOM_NAV_CITIZEN:
  container:
    height: "64px + 34px safe area = 98px"
    background: "use variable 'surface'"
    shadow: "use variable 'shadow-nav'"
    border_radius_top: "use variable 'radius-xl'"
    padding_bottom: 34px
    position: fixed bottom
  
  tabs:
    count: 5
    distribution: equal
    items:
      - {name: "Inicio", icon: "home"}
      - {name: "Mapa", icon: "map"}
      - {name: "Alertas", icon: "file-text"}
      - {name: "Notif.", icon: "bell"}
      - {name: "Perfil", icon: "user"}
  
  tab_item:
    layout: vertical
    align: center
    icon_size: "use variable 'icon-lg'"
    label_size: "use variable 'font-caption'"
    gap: "use variable 'spacing-xs'"
  
  tab_states:
    inactive: {color: "text-secondary"}
    active: {color: "primary"}
```

## 2.9 COMPONENT: BOTTOM_NAV_OPERATOR

```yaml
BOTTOM_NAV_OPERATOR:
  # Same as BOTTOM_NAV_CITIZEN except:
  tabs:
    count: 4
    items:
      - {name: "Inicio", icon: "home"}
      - {name: "Alertas", icon: "clipboard-list"}
      - {name: "Historial", icon: "clock"}
      - {name: "Perfil", icon: "user"}
```

## 2.10 COMPONENT: PROGRESS_BAR

```yaml
PROGRESS_BAR:
  track:
    height: 4px
    background: "use variable 'border'"
    border_radius: "use variable 'radius-full'"
  
  fill:
    height: 4px
    background: "use variable 'primary'" # or "success" when complete
    border_radius: "use variable 'radius-full'"
    width: "[percentage]%"
```

## 2.11 COMPONENT: ALERT_TYPE_CARD

```yaml
ALERT_TYPE_CARD:
  container:
    width: flexible (grid item)
    height: 100px
    background: "use variable 'surface'"
    border: "2px solid 'border'"
    border_radius: "use variable 'radius-lg'"
    padding: "use variable 'spacing-md'"
    layout: vertical
    align: center
  
  icon:
    size: 24-32px
    color: "[category_color]"
  
  label:
    font_size: "use variable 'font-body-small'"
    font_weight: "use variable 'font-weight-medium'"
    margin_top: "use variable 'spacing-sm'"
  
  states:
    default: {border_color: "border"}
    hover: {border_color: "primary-light"}
    selected: {border_color: "primary", background: "primary-light at 20%"}
```

## 2.12 COMPONENT: URGENCY_SELECTOR

```yaml
URGENCY_SELECTOR:
  container:
    width: "flex 1" (en fila de 4)
    height: 72px
    background: "use variable 'surface'"
    border: "2px solid 'border'"
    border_radius: "use variable 'radius-md'"
    padding: "use variable 'spacing-sm'"
    layout: vertical
    align: center
  
  circle:
    size: 24px
    background: "[urgency_color]"
    icon_color: "surface"
  
  label:
    font_size: "use variable 'font-caption'"
    margin_top: "use variable 'spacing-xs'"
  
  states:
    default: {border_color: "border", label_color: "text-primary"}
    selected: {border_color: "[urgency_color]", background: "[urgency_color] at 10%", label_color: "[urgency_color]"}
```

## 2.13 COMPONENT: LIST_ITEM_ALERT

```yaml
LIST_ITEM_ALERT:
  container:
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-lg'"
    padding: "use variable 'spacing-md'"
    shadow: "use variable 'shadow-md'"
  
  layout: row
  justify: space-between
  align: center
  
  left_section:
    layout: row
    status_dot:
      size: 10px
      shape: circle
      color: "[status_color]"
    
    info:
      margin_left: "use variable 'spacing-sm'"
      title:
        font_size: "use variable 'font-body'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-primary'"
      subtitle:
        font_size: "use variable 'font-body-small'"
        color: "use variable 'text-secondary'"
      badge: "[USE COMPONENT: BADGE]"
  
  right_section:
    chevron:
      icon: "chevron-right"
      size: "use variable 'icon-md'"
      color: "use variable 'border'"
  
  variant_with_accent:
    border_left: "4px solid [urgency_color]"
```

## 2.14 COMPONENT: TIMELINE

```yaml
TIMELINE:
  container:
    layout: vertical
  
  item:
    layout: row
    
    left_column:
      dot:
        size: 12px
        shape: circle
        completed: {background: "success", fill: solid}
        pending: {background: "transparent", border: "2px solid 'border'"}
      
      line:
        width: 2px
        height: "connects to next dot"
        completed: {background: "success"}
        pending: {background: "border"}
    
    right_column:
      margin_left: "use variable 'spacing-md'"
      title:
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-semibold'"
      subtitle:
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
      time:
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
```

---


---

# 📱 PARTE 3: PANTALLAS APP CIUDADANO (16 pantallas)

---

## C01 - SPLASH SCREEN

```yaml
SCREEN_ID: C01
NAME: Splash Screen
TYPE: Mobile
PURPOSE: Pantalla inicial de carga

DIMENSIONS:
  width: 375px
  height: DYNAMIC (minimum 100vh)

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "linear gradient from 'primary' (top) to 'primary-dark' (bottom)"
    border_radius: "use variable 'radius-xl'" # Device frame
    padding: none

LAYOUT:

  1_SPACER_TOP:
    flex: 1

  2_LOGO_SECTION:
    layout: vertical
    align: center
    
    shield_icon:
      size: 96px
      color: "use variable 'surface'"
      style: "shield with checkmark inside"
    
    app_name:
      text: "SAVIA"
      font_size: "use variable 'font-h1'"
      font_weight: "use variable 'font-weight-bold'"
      color: "use variable 'surface'"
      letter_spacing: 4px
      margin_top: "use variable 'spacing-lg'"
    
    tagline:
      text: "Sistema de Alertas Vecinales"
      font_size: "use variable 'font-body'"
      font_weight: "use variable 'font-weight-regular'"
      color: "use variable 'surface' at 90% opacity"
      margin_top: "use variable 'spacing-sm'"
    
    subtitle:
      text: "Integrado de Atalaya"
      font_size: "use variable 'font-body-small'"
      font_weight: "use variable 'font-weight-regular'"
      color: "use variable 'surface' at 70% opacity"
      margin_top: "use variable 'spacing-xs'"

  3_SPACER_MIDDLE:
    flex: 1

  4_LOADING_SECTION:
    layout: vertical
    align: center
    margin_bottom: 120px
    
    loading_dots:
      count: 3
      dot_size: 10px
      dot_color: "use variable 'surface'"
      gap: "use variable 'spacing-sm'"
      animation: "pulsing/bouncing"
    
    loading_text:
      text: "Cargando..."
      font_size: "use variable 'font-body-small'"
      font_weight: "use variable 'font-weight-regular'"
      color: "use variable 'surface' at 80% opacity"
      margin_top: "use variable 'spacing-md'"

  5_FOOTER:
    margin_bottom: "use variable 'spacing-xl'"
    text: "© 2026 COPROSEC Atalaya"
    font_size: "use variable 'font-caption'"
    color: "use variable 'surface' at 50% opacity"
    align: center
```

---

## C02 - LOGIN

```yaml
SCREEN_ID: C02
NAME: Login
TYPE: Mobile
PURPOSE: Inicio de sesión del ciudadano

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"
    padding_horizontal: "use variable 'spacing-lg'"

LAYOUT:

  1_STATUS_BAR_SPACER:
    height: 44px

  2_LOGO_SECTION:
    margin_top: "use variable 'spacing-2xl'"
    layout: vertical
    align: center
    
    shield_icon:
      size: 64px
      color: "use variable 'primary'"
    
    app_name:
      text: "SAVIA"
      font_size: "use variable 'font-h1'"
      font_weight: "use variable 'font-weight-bold'"
      color: "use variable 'primary'"
      margin_top: "use variable 'spacing-md'"

  3_WELCOME_TEXT:
    margin_top: "use variable 'spacing-xl'"
    
    title:
      text: "Bienvenido"
      font_size: "use variable 'font-h2'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'text-primary'"
    
    subtitle:
      text: "Ingresa a tu cuenta"
      font_size: "use variable 'font-body'"
      font_weight: "use variable 'font-weight-regular'"
      color: "use variable 'text-secondary'"
      margin_top: "use variable 'spacing-sm'"

  4_FORM_SECTION:
    margin_top: "use variable 'spacing-xl'"
    gap: "use variable 'spacing-md'"
    
    email_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Correo electrónico"
      icon_left: "envelope"
      placeholder: "correo@ejemplo.com"
      helper: "Helper text"
    
    password_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Contraseña"
      icon_left: "lock"
      icon_right: "eye"
      placeholder: "••••••••"
      helper: "Helper text"

  5_FORGOT_PASSWORD:
    margin_top: "use variable 'spacing-md'"
    text: "¿Olvidaste tu contraseña?"
    font_size: "use variable 'font-body-small'"
    font_weight: "use variable 'font-weight-medium'"
    color: "use variable 'primary'"
    align: left

  6_LOGIN_BUTTON:
    margin_top: "use variable 'spacing-lg'"
    component: "[USE COMPONENT: BUTTON_PRIMARY]"
    text: "INICIAR SESIÓN"
    width: 100%

  7_DIVIDER:
    margin_top: "use variable 'spacing-lg'"
    layout: row
    align: center
    
    line_left:
      flex: 1
      height: 1px
      background: "use variable 'border'"
    
    text:
      text: "o"
      font_size: "use variable 'font-body-small'"
      color: "use variable 'text-secondary'"
      padding_horizontal: "use variable 'spacing-md'"
      background: "use variable 'surface'"
    
    line_right:
      flex: 1
      height: 1px
      background: "use variable 'border'"

  8_REGISTER_LINK:
    margin_top: "use variable 'spacing-lg'"
    align: center
    
    text_normal:
      text: "¿No tienes cuenta? "
      font_size: "use variable 'font-body-small'"
      color: "use variable 'text-secondary'"
    
    text_link:
      text: "Regístrate aquí"
      font_size: "use variable 'font-body-small'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'primary'"

  9_BOTTOM_SAFE_AREA:
    height: 34px
```

---

## C03 - REGISTRO

```yaml
SCREEN_ID: C03
NAME: Crear Cuenta / Registro
TYPE: Mobile
PURPOSE: Registro de nuevo ciudadano

DIMENSIONS:
  width: 375px
  height: DYNAMIC (scrollable)

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"
    scroll: ENABLED

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Crear Cuenta"
    right: ["settings_icon", "bell_icon"]

  2_FORM_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_top: "use variable 'spacing-md'"
    gap: "use variable 'spacing-md'"
    
    dni_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "DNI"
      icon_left: "id-card"
      placeholder: "8 dígitos"
      helper: "Helper text"
    
    nombres_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Nombres"
      icon_left: "user"
      placeholder: "Nombres"
      helper: "Helper text"
    
    apellidos_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Apellidos"
      icon_left: "user"
      placeholder: "Apellidos"
      helper: "Helper text"
    
    celular_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Celular"
      icon_left: "phone"
      placeholder: "9 dígitos"
      helper: "Helper text"
    
    email_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Email (opcional)"
      icon_left: "envelope"
      placeholder: "correo@ejemplo.com"
      helper: "Helper text"
    
    password_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Contraseña"
      icon_left: "lock"
      icon_right: "eye"
      placeholder: "Mín. 8 caracteres"
      helper: "Helper text"
    
    confirm_password_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Confirmar contraseña"
      icon_left: "lock"
      icon_right: "eye"
      placeholder: "Confirmar"
      helper: "Helper text"

  3_TERMS_CHECKBOX:
    margin_top: "use variable 'spacing-md'"
    layout: row
    align: start
    
    checkbox:
      size: 24px
      border: "2px solid 'border'"
      border_radius: "use variable 'radius-sm'"
      checked_state:
        background: "use variable 'primary'"
        icon: "checkmark"
        icon_color: "use variable 'surface'"
    
    label:
      text: "Acepto términos y condiciones"
      font_size: "use variable 'font-body-small'"
      color: "use variable 'text-primary'"
      margin_left: "use variable 'spacing-sm'"

  4_REGISTER_BUTTON:
    margin_top: "use variable 'spacing-lg'"
    margin_bottom: "use variable 'spacing-xl'"
    component: "[USE COMPONENT: BUTTON_PRIMARY]"
    text: "REGISTRARME"
    width: 100%
```

---

## C04 - RECUPERAR CONTRASEÑA

```yaml
SCREEN_ID: C04
NAME: Recuperar Contraseña
TYPE: Mobile
PURPOSE: Solicitar restablecimiento de contraseña

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Recuperar Contraseña"
    right: ["settings_icon", "bell_icon"]

  2_MAIN_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_top: "use variable 'spacing-2xl'"
    
    illustration:
      align: center
      size: 100px
      shape: circle
      background: "use variable 'primary-light'"
      border: "3px solid 'primary'"
      icon: "key"
      icon_size: 48px
      icon_color: "use variable 'primary'"
    
    instruction_text:
      margin_top: "use variable 'spacing-xl'"
      text: "Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña."
      font_size: "use variable 'font-body'"
      font_weight: "use variable 'font-weight-regular'"
      color: "use variable 'text-secondary'"
      align: center
      line_height: 24px

  3_FORM:
    margin_top: "use variable 'spacing-xl'"
    padding_horizontal: "use variable 'spacing-lg'"
    
    email_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Correo electrónico"
      icon_left: "envelope"
      placeholder: "correo@ejemplo.com"
      helper: "Helper text"

  4_SUBMIT_BUTTON:
    margin_top: "use variable 'spacing-lg'"
    padding_horizontal: "use variable 'spacing-lg'"
    component: "[USE COMPONENT: BUTTON_PRIMARY]"
    icon_left: "send"
    text: "ENVIAR INSTRUCCIONES"
    width: 100%

  5_BACK_LINK:
    margin_top: "use variable 'spacing-lg'"
    align: center
    layout: row
    
    icon:
      name: "arrow-left"
      size: "use variable 'icon-sm'"
      color: "use variable 'text-secondary'"
    
    text:
      text: "Volver a inicio de sesión"
      font_size: "use variable 'font-body-small'"
      font_weight: "use variable 'font-weight-medium'"
      color: "use variable 'text-secondary'"
      margin_left: "use variable 'spacing-xs'"

  6_SPACER:
    flex: 1

  7_BOTTOM_SAFE_AREA:
    height: 34px
```

---

## C05 - HOME CIUDADANO

```yaml
SCREEN_ID: C05
NAME: Home Ciudadano
TYPE: Mobile
PURPOSE: Pantalla principal del ciudadano

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    height: 64px
    background: "use variable 'surface'"
    shadow: "use variable 'shadow-sm'"
    padding_horizontal: "use variable 'spacing-md'"
    layout: row
    justify: space-between
    align: center
    
    logo_section:
      layout: row
      align: center
      
      shield_icon:
        size: "use variable 'icon-lg'"
        color: "use variable 'primary'"
      
      app_name:
        text: "SAVIA"
        font_size: "use variable 'font-h4'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'primary'"
        margin_left: "use variable 'spacing-sm'"
    
    right_section:
      layout: row
      gap: "use variable 'spacing-md'"
      
      notification_bell:
        icon: "bell"
        size: "use variable 'icon-lg'"
        color: "use variable 'text-primary'"
        badge:
          value: "2"
          size: 18px
          background: "use variable 'error'"
          text_color: "use variable 'surface'"
          font_size: 10px
          position: "top-right, offset -4px"
      
      avatar:
        size: 36px
        shape: circle
        background: "use variable 'primary'"
        text: "EW"
        text_color: "use variable 'surface'"
        font_size: "use variable 'font-body-small'"

  2_SCROLLABLE_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_top: "use variable 'spacing-md'"
    padding_bottom: 100px
    
    greeting:
      title:
        text: "Hola, Edwin 👋"
        font_size: "use variable 'font-h2'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-primary'"
      
      subtitle:
        text: "¿Cómo podemos ayudarte?"
        font_size: "use variable 'font-body'"
        color: "use variable 'text-secondary'"
        margin_top: "use variable 'spacing-xs'"
    
    emergency_button:
      margin_top: "use variable 'spacing-lg'"
      width: 100%
      height: 120px
      background: "use variable 'error'"
      border_radius: "use variable 'radius-xl'"
      shadow: "0 8px 16px 'error' at 35% opacity"
      layout: vertical
      align: center
      justify: center
      
      icon:
        name: "alert-triangle" # or siren
        size: 48px
        color: "use variable 'surface'"
      
      text:
        text: "REPORTAR EMERGENCIA"
        font_size: "use variable 'font-h4'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'surface'"
        margin_top: "use variable 'spacing-sm'"
    
    quick_actions:
      margin_top: "use variable 'spacing-lg'"
      layout: row
      gap: "use variable 'spacing-md'"
      
      card_mis_alertas:
        component: "[USE COMPONENT: CARD]"
        flex: 1
        height: 100px
        layout: vertical
        align: center
        justify: center
        
        icon:
          name: "clipboard-list"
          size: "use variable 'icon-lg'"
          color: "use variable 'primary'"
        
        title:
          text: "Mis Alertas"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-medium'"
          color: "use variable 'text-primary'"
          margin_top: "use variable 'spacing-sm'"
        
        subtitle:
          text: "3 activas"
          font_size: "use variable 'font-caption'"
          color: "use variable 'text-secondary'"
      
      card_alertas_cercanas:
        component: "[USE COMPONENT: CARD]"
        flex: 1
        height: 100px
        # Same structure, different content:
        icon: "map-pin", color: "success"
        title: "Alertas Cercanas"
        subtitle: "En tu zona"
    
    recent_activity:
      margin_top: "use variable 'spacing-lg'"
      
      header_row:
        layout: row
        justify: space-between
        
        title:
          text: "Actividad Reciente"
          font_size: "use variable 'font-body'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'text-primary'"
        
        link:
          text: "Ver todo"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'primary'"
      
      alert_cards:
        margin_top: "use variable 'spacing-md'"
        gap: "use variable 'spacing-sm'"
        
        card_1:
          component: "[USE COMPONENT: LIST_ITEM_ALERT]"
          icon_bg: "'alert-robbery' at 10% opacity"
          icon_color: "use variable 'alert-robbery'"
          title: "Robo a mano armada"
          subtitle: "200m · Hace 5 min"
        
        card_2:
          component: "[USE COMPONENT: LIST_ITEM_ALERT]"
          icon_bg: "'alert-accident' at 10% opacity"
          icon_color: "use variable 'alert-accident'"
          title: "Accidente vehicular"
          subtitle: "1.2km · Hace 20 min"
        
        card_3:
          component: "[USE COMPONENT: LIST_ITEM_ALERT]"
          icon_bg: "'text-secondary' at 10% opacity"
          icon_color: "use variable 'text-secondary'"
          title: "Actividad sospechosa"
          subtitle: "500m · Hace 45 min"

  3_BOTTOM_NAV:
    component: "[USE COMPONENT: BOTTOM_NAV_CITIZEN]"
    active_tab: "Inicio"
```

---

## C06 - NUEVA ALERTA (Paso 1: Tipo)

```yaml
SCREEN_ID: C06
NAME: Nueva Alerta - Selección de Tipo
TYPE: Mobile
PURPOSE: Paso 1 de 4 - Seleccionar tipo de emergencia

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "close_x"
    center: "Nueva Alerta"
    right: "spacer_24px"

  2_PROGRESS:
    padding_horizontal: "use variable 'spacing-lg'"
    margin_top: "use variable 'spacing-md'"
    
    step_text:
      text: "Paso 1 de 4"
      font_size: "use variable 'font-caption'"
      font_weight: "use variable 'font-weight-medium'"
      color: "use variable 'text-secondary'"
    
    progress_bar:
      component: "[USE COMPONENT: PROGRESS_BAR]"
      margin_top: "use variable 'spacing-sm'"
      percentage: 25%

  3_MAIN_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    margin_top: "use variable 'spacing-lg'"
    flex: 1
    
    question:
      text: "¿Qué tipo de emergencia quieres reportar?"
      font_size: "use variable 'font-h3'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'text-primary'"
      line_height: 28px
    
    category_grid:
      margin_top: "use variable 'spacing-lg'"
      layout: grid
      columns: 2
      gap: "use variable 'spacing-md'"
      
      # 8 cards using [USE COMPONENT: ALERT_TYPE_CARD]
      card_1:
        icon: "🚨" # or shield-alert
        icon_color: "use variable 'alert-robbery'"
        label: "Robo/Asalto"
        state: SELECTED
      
      card_2:
        icon: "🚗"
        icon_color: "use variable 'alert-accident'"
        label: "Accidente"
        state: default
      
      card_3:
        icon: "🏥"
        icon_color: "use variable 'alert-medical'"
        label: "Médica"
      
      card_4:
        icon: "🔥"
        icon_color: "use variable 'alert-fire'"
        label: "Incendio"
      
      card_5:
        icon: "⚡"
        icon_color: "use variable 'alert-electrical'"
        label: "Violencia"
      
      card_6:
        icon: "👤"
        icon_color: "use variable 'text-secondary'"
        label: "Acoso"
      
      card_7:
        icon: "🏠"
        icon_color: "use variable 'alert-other'"
        label: "Desastre"
      
      card_8:
        icon: "✏️"
        icon_color: "use variable 'alert-other'"
        label: "Otro"

  4_BOTTOM_SECTION:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_bottom: "use variable 'spacing-xl'"
    margin_top: auto
    
    next_button:
      component: "[USE COMPONENT: BUTTON_PRIMARY]"
      text: "SIGUIENTE"
      width: 100%

  5_BOTTOM_SAFE_AREA:
    height: 34px
```

---

## C07 - NUEVA ALERTA (Paso 2: Descripción)

```yaml
SCREEN_ID: C07
NAME: Nueva Alerta - Descripción y Urgencia
TYPE: Mobile
PURPOSE: Paso 2 de 4 - Describir situación y nivel de urgencia

DIMENSIONS:
  width: 375px
  height: DYNAMIC (scrollable)

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"
    scroll: ENABLED

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Nueva Alerta"
    right:
      text: "Cancelar"
      font_size: "use variable 'font-body-small'"
      color: "use variable 'primary'"

  2_PROGRESS:
    padding_horizontal: "use variable 'spacing-lg'"
    margin_top: "use variable 'spacing-md'"
    
    row:
      layout: row
      justify: space-between
      
      step_text:
        text: "Paso 2 de 4"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
      
      percentage:
        text: "50%"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
    
    progress_bar:
      component: "[USE COMPONENT: PROGRESS_BAR]"
      margin_top: "use variable 'spacing-sm'"
      percentage: 50%

  3_MAIN_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    margin_top: "use variable 'spacing-lg'"
    flex: 1
    
    selected_type:
      label:
        text: "Tipo de incidente"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-secondary'"
      
      chip:
        margin_top: "use variable 'spacing-sm'"
        background: "'alert-robbery' at 10% opacity"
        border_radius: "use variable 'radius-full'"
        padding_vertical: "use variable 'spacing-sm'"
        padding_horizontal: "use variable 'spacing-md'"
        layout: row
        align: center
        
        dot:
          size: 8px
          shape: circle
          background: "use variable 'alert-robbery'"
        
        text:
          text: "Robo / Asalto"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-medium'"
          color: "use variable 'alert-robbery'"
          margin_left: "use variable 'spacing-sm'"
        
        edit_icon:
          name: "edit"
          size: "use variable 'icon-sm'"
          color: "use variable 'alert-robbery'"
          margin_left: "use variable 'spacing-sm'"
    
    description_section:
      margin_top: "use variable 'spacing-lg'"
      
      label:
        text: "Describe la situación"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
      
      textarea:
        margin_top: "use variable 'spacing-sm'"
        width: 100%
        height: 120px
        background: "use variable 'surface'"
        border: "1px solid 'border'"
        border_radius: "use variable 'radius-md'"
        padding: "use variable 'spacing-md'"
        placeholder: "Describe brevemente qué está sucediendo (ej: dos sujetos en moto)..."
        placeholder_color: "use variable 'text-secondary'"
        font_size: "use variable 'font-body'"
      
      counter:
        margin_top: "use variable 'spacing-xs'"
        text: "0/200"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
        align: right
    
    urgency_section:
      margin_top: "use variable 'spacing-lg'"
      
      label_row:
        layout: row
        align: center
        
        text:
          text: "Nivel de Urgencia"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-medium'"
          color: "use variable 'text-primary'"
        
        info_icon:
          name: "info"
          size: "use variable 'icon-sm'"
          color: "use variable 'text-secondary'"
          margin_left: "use variable 'spacing-xs'"
      
      urgency_options:
        margin_top: "use variable 'spacing-md'"
        layout: row
        gap: "use variable 'spacing-sm'"
        
        # 4 options using [USE COMPONENT: URGENCY_SELECTOR]
        option_baja:
          label: "Baja"
          color: "use variable 'urgency-low'"
          icon: "checkmark"
          state: default
        
        option_media:
          label: "Media"
          color: "use variable 'urgency-medium'"
          icon: "triangle"
          state: default
        
        option_alta:
          label: "Alta"
          color: "use variable 'urgency-high'"
          icon: "alert"
          state: SELECTED
        
        option_critica:
          label: "Crítica"
          color: "use variable 'urgency-critical'"
          icon: "zap"
          state: default
      
      helper_info:
        margin_top: "use variable 'spacing-md'"
        background: "'urgency-high' at 10% opacity"
        border_radius: "use variable 'radius-md'"
        padding: "use variable 'spacing-md'"
        layout: row
        
        icon:
          name: "alert-circle"
          size: "use variable 'icon-md'"
          color: "use variable 'urgency-high'"
        
        text:
          margin_left: "use variable 'spacing-sm'"
          text: "Alta: Situación en curso con riesgo potencial para personas o propiedad privada. Requiere atención rápida."
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-primary'"
          line_height: 20px

  4_BOTTOM_SECTION:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_bottom: "use variable 'spacing-xl'"
    margin_top: auto
    
    next_button:
      component: "[USE COMPONENT: BUTTON_PRIMARY]"
      icon_right: "arrow-right"
      text: "SIGUIENTE"
      width: 100%

  5_BOTTOM_SAFE_AREA:
    height: 34px
```

---


## C08 - NUEVA ALERTA (Paso 3: Ubicación)

```yaml
SCREEN_ID: C08
NAME: Nueva Alerta - Ubicación
TYPE: Mobile
PURPOSE: Paso 3 de 4 - Seleccionar ubicación de la emergencia

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Nueva Alerta"
    right:
      text: "Cancelar"
      color: "use variable 'primary'"

  2_PROGRESS:
    padding_horizontal: "use variable 'spacing-lg'"
    margin_top: "use variable 'spacing-md'"
    
    row:
      justify: space-between
      step_text: "Paso 3 de 4"
      percentage: "75%"
    
    progress_bar:
      component: "[USE COMPONENT: PROGRESS_BAR]"
      percentage: 75%

  3_MAIN_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    margin_top: "use variable 'spacing-md'"
    flex: 1
    
    question:
      text: "¿Dónde ocurre la emergencia?"
      font_size: "use variable 'font-h3'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'text-primary'"
    
    map_container:
      margin_top: "use variable 'spacing-md'"
      width: 100%
      height: 220px
      border_radius: "use variable 'radius-lg'"
      overflow: hidden
      
      map_placeholder:
        background: "#E8E8E8"
        display: "map image"
      
      center_pin:
        icon: "map-pin"
        size: 40px
        color: "use variable 'error'"
        position: center
      
      zoom_controls:
        position: "right, margin 'spacing-md'"
        layout: vertical
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-md'"
        shadow: "use variable 'shadow-md'"
        
        button_plus:
          size: 36px
          icon: "plus"
        
        divider:
          height: 1px
          background: "use variable 'border'"
        
        button_minus:
          size: 36px
          icon: "minus"
    
    selected_location:
      margin_top: "use variable 'spacing-md'"
      component: "[USE COMPONENT: CARD]"
      variant: "with_accent"
      accent_color: "use variable 'success'"
      padding: "use variable 'spacing-md'"
      
      row:
        layout: row
        align: center
        
        icon:
          name: "map-pin"
          size: "use variable 'icon-md'"
          color: "use variable 'success'"
        
        address:
          margin_left: "use variable 'spacing-sm'"
          text: "Av. Atalaya 234, Atalaya"
          font_size: "use variable 'font-body'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'text-primary'"
      
      coordinates:
        margin_top: "use variable 'spacing-xs'"
        text: "Coordenadas: -10.7312, -73.7565"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
    
    gps_button:
      margin_top: "use variable 'spacing-md'"
      width: 100%
      height: 52px
      background: "'primary-light' at 30% opacity"
      border: "2px solid 'primary'"
      border_radius: "use variable 'radius-md'"
      layout: row
      justify: center
      align: center
      
      icon:
        name: "crosshair"
        size: "use variable 'icon-md'"
        color: "use variable 'primary'"
      
      text:
        text: "Usar mi ubicación actual"
        font_size: "use variable 'font-body'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'primary'"
        margin_left: "use variable 'spacing-sm'"
    
    search_input:
      margin_top: "use variable 'spacing-md'"
      component: "[USE COMPONENT: INPUT_FIELD]"
      height: 52px
      icon_left: "search"
      placeholder: "Buscar dirección..."
      label: none

  4_BOTTOM_SECTION:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_bottom: "use variable 'spacing-xl'"
    margin_top: auto
    
    next_button:
      component: "[USE COMPONENT: BUTTON_PRIMARY]"
      text: "SIGUIENTE"
      width: 100%

  5_BOTTOM_SAFE_AREA:
    height: 34px
```

---

## C09 - NUEVA ALERTA (Paso 4: Confirmación)

```yaml
SCREEN_ID: C09
NAME: Nueva Alerta - Confirmación
TYPE: Mobile
PURPOSE: Paso 4 de 4 - Revisar y enviar alerta

DIMENSIONS:
  width: 375px
  height: DYNAMIC (scrollable)

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"
    scroll: ENABLED

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Nueva Alerta"
    right: "Cancelar"

  2_PROGRESS:
    padding_horizontal: "use variable 'spacing-lg'"
    margin_top: "use variable 'spacing-md'"
    
    row:
      step_text: "Paso 4 de 4"
      percentage: "100%"
    
    progress_bar:
      component: "[USE COMPONENT: PROGRESS_BAR]"
      percentage: 100%
      fill_color: "use variable 'success'"

  3_SCROLLABLE_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    margin_top: "use variable 'spacing-md'"
    padding_bottom: 120px
    
    evidence_section:
      label:
        text: "Adjuntar evidencia (opcional)"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
      
      upload_slots:
        margin_top: "use variable 'spacing-md'"
        layout: row
        gap: "use variable 'spacing-sm'"
        
        slot_1_with_image:
          flex: 1
          height: 80px
          border_radius: "use variable 'radius-md'"
          background: "gray placeholder image"
          position: relative
          
          delete_button:
            position: "top-right, offset -8px"
            size: 24px
            shape: circle
            background: "use variable 'error'"
            icon: "x"
            icon_size: "use variable 'icon-sm'"
            icon_color: "use variable 'surface'"
        
        slot_2_add:
          flex: 1
          height: 80px
          background: "'primary-light' at 20% opacity"
          border: "2px dashed 'primary'"
          border_radius: "use variable 'radius-md'"
          layout: center
          
          icon:
            name: "camera"
            size: "use variable 'icon-lg'"
            color: "use variable 'primary'"
        
        slot_3_empty:
          flex: 1
          height: 80px
          background: "use variable 'surface'"
          border: "2px dashed 'border'"
          border_radius: "use variable 'radius-md'"
          layout: center
          
          icon:
            name: "plus"
            size: "use variable 'icon-lg'"
            color: "use variable 'text-secondary'"
    
    summary_section:
      margin_top: "use variable 'spacing-lg'"
      
      label:
        text: "RESUMEN DE TU ALERTA"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'text-secondary'"
        letter_spacing: 1px
      
      summary_card:
        margin_top: "use variable 'spacing-md'"
        background: "use variable 'background'"
        border_radius: "use variable 'radius-lg'"
        padding: "use variable 'spacing-md'"
        
        rows:
          gap: "use variable 'spacing-md'"
          
          row_type:
            label: "Tipo:"
            label_style:
              font_size: "use variable 'font-body-small'"
              color: "use variable 'text-secondary'"
            value_row:
              emoji: "🚨"
              text: "Robo/Asalto"
              text_style:
                font_size: "use variable 'font-body'"
                font_weight: "use variable 'font-weight-medium'"
                color: "use variable 'text-primary'"
          
          row_urgency:
            label: "Urgencia:"
            badge:
              component: "[USE COMPONENT: BADGE]"
              variant: "with_dot"
              color: "use variable 'urgency-high'"
              text: "Alta"
          
          row_location:
            label: "Ubicación:"
            value: "Av. Atalaya 234, Atalaya"
          
          row_description:
            label: "Descripción:"
            value: "Intento de robo en la esquina, dos sujetos en moto..."
            value_style:
              max_lines: 2
              overflow: ellipsis
              line_height: 22px
    
    warning_banner:
      margin_top: "use variable 'spacing-lg'"
      background: "'warning' at 10% opacity"
      border_left: "4px solid 'warning'"
      border_radius: "use variable 'radius-md'"
      padding: "use variable 'spacing-md'"
      layout: row
      
      icon:
        name: "alert-triangle"
        size: "use variable 'icon-md'"
        color: "use variable 'warning'"
      
      text:
        margin_left: "use variable 'spacing-sm'"
        text: "Al enviar esta alerta, las autoridades de tu zona serán notificadas inmediatamente."
        font_size: "use variable 'font-body-small'"
        color: "use variable 'text-primary'"
        line_height: 20px

  4_BOTTOM_SECTION:
    position: fixed bottom
    background: "use variable 'surface'"
    padding: "use variable 'spacing-lg'"
    shadow: "0 -4px 12px rgba(0,0,0,0.08)"
    
    submit_button:
      width: 100%
      height: 56px
      background: "use variable 'error'"
      border_radius: "use variable 'radius-lg'"
      shadow: "0 6px 16px 'error' at 40% opacity"
      layout: row
      justify: center
      align: center
      
      icon:
        name: "alert-circle"
        size: "use variable 'icon-md'"
        color: "use variable 'surface'"
      
      text:
        text: "ENVIAR ALERTA"
        font_size: "use variable 'font-button'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'surface'"
        margin_left: "use variable 'spacing-sm'"

  5_BOTTOM_SAFE_AREA:
    height: 34px
```

---

## C10 - ALERTA ENVIADA (Success)

```yaml
SCREEN_ID: C10
NAME: Alerta Enviada - Confirmación de Éxito
TYPE: Mobile
PURPOSE: Confirmar que la alerta fue enviada exitosamente

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_STATUS_BAR_SPACER:
    height: 44px

  2_SPACER_TOP:
    flex: 0.8

  3_SUCCESS_SECTION:
    padding_horizontal: "use variable 'spacing-lg'"
    layout: vertical
    align: center
    
    success_icon:
      size: 120px
      shape: circle
      background: "'success' at 15% opacity"
      border: "4px solid 'success'"
      layout: center
      
      icon:
        name: "check"
        size: 56px
        color: "use variable 'success'"
    
    title:
      margin_top: "use variable 'spacing-xl'"
      text: "¡Alerta enviada!"
      font_size: "use variable 'font-h1'"
      font_weight: "use variable 'font-weight-bold'"
      color: "use variable 'text-primary'"
      align: center
    
    alert_id_badge:
      margin_top: "use variable 'spacing-md'"
      background: "use variable 'background'"
      border_radius: "use variable 'radius-md'"
      padding_vertical: "use variable 'spacing-sm'"
      padding_horizontal: "use variable 'spacing-md'"
      
      text:
        text: "Tu alerta #ALT-2026-0145"
        font_size: "use variable 'font-body-small'"
        color: "use variable 'text-secondary'"
    
    confirmation_text:
      margin_top: "use variable 'spacing-sm'"
      text: "ha sido registrada exitosamente."
      font_size: "use variable 'font-body'"
      color: "use variable 'text-primary'"
      align: center

  4_INFO_CARD:
    margin_top: "use variable 'spacing-xl'"
    margin_horizontal: "use variable 'spacing-lg'"
    background: "'primary-light' at 30% opacity"
    border_radius: "use variable 'radius-xl'"
    padding: "use variable 'spacing-lg'"
    layout: vertical
    align: center
    
    bell_icon:
      size: "use variable 'icon-xl'"
      color: "use variable 'primary'"
    
    main_text:
      margin_top: "use variable 'spacing-md'"
      text: "Las autoridades de tu zona han sido notificadas"
      font_size: "use variable 'font-body'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'primary-dark'"
      align: center
    
    sub_text:
      margin_top: "use variable 'spacing-sm'"
      text: "Recibirás actualizaciones sobre el estado de tu alerta"
      font_size: "use variable 'font-body-small'"
      color: "use variable 'primary'"
      align: center
      line_height: 20px

  5_WHATS_NEXT:
    margin_top: "use variable 'spacing-xl'"
    padding_horizontal: "use variable 'spacing-lg'"
    
    title:
      text: "¿Qué sigue?"
      font_size: "use variable 'font-body-small'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'text-secondary'"
    
    steps_list:
      margin_top: "use variable 'spacing-md'"
      layout: vertical
      gap: "use variable 'spacing-md'"
      
      step_item:
        layout: row
        align: start
        
        number_circle:
          size: 24px
          shape: circle
          background: "use variable 'primary'"
          text: "[1, 2, 3]"
          text_style:
            font_size: "use variable 'font-caption'"
            color: "use variable 'surface'"
            align: center
        
        text:
          margin_left: "use variable 'spacing-md'"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-primary'"
      
      steps:
        - "Un operador tomará tu caso"
        - "Te notificaremos cuando esté en camino"
        - "Podrás ver el progreso en tiempo real"

  6_SPACER:
    flex: 1

  7_BOTTOM_ACTIONS:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_bottom: "use variable 'spacing-xl'"
    
    primary_button:
      component: "[USE COMPONENT: BUTTON_PRIMARY]"
      icon_left: "eye"
      text: "VER ESTADO DE ALERTA"
      width: 100%
    
    secondary_link:
      margin_top: "use variable 'spacing-md'"
      align: center
      layout: row
      justify: center
      
      icon:
        name: "home"
        size: "use variable 'icon-sm'"
        color: "use variable 'text-secondary'"
      
      text:
        text: "Volver al inicio"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-secondary'"
        margin_left: "use variable 'spacing-xs'"

  8_BOTTOM_SAFE_AREA:
    height: 34px
```

---

## C11 - MIS ALERTAS (Lista)

```yaml
SCREEN_ID: C11
NAME: Mis Alertas - Lista
TYPE: Mobile
PURPOSE: Ver historial de alertas del ciudadano

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Mis Alertas"
    right: "search_icon"

  2_TAB_BAR:
    background: "use variable 'surface'"
    height: 48px
    border_bottom: "1px solid 'border'"
    padding_horizontal: "use variable 'spacing-md'"
    layout: row
    
    tabs:
      count: 3
      distribution: equal
      
      tab_todas:
        text: "Todas"
        state: ACTIVE
        active_style:
          color: "use variable 'primary'"
          border_bottom: "3px solid 'primary'"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
      
      tab_activas:
        text: "Activas"
        color: "use variable 'text-secondary'"
      
      tab_cerradas:
        text: "Cerradas"
        color: "use variable 'text-secondary'"

  3_SCROLLABLE_CONTENT:
    padding_horizontal: "use variable 'spacing-md'"
    padding_top: "use variable 'spacing-md'"
    padding_bottom: 100px
    gap: "use variable 'spacing-sm'"
    
    alert_cards:
      # Card 1
      card_1:
        component: "[USE COMPONENT: LIST_ITEM_ALERT]"
        status_dot_color: "use variable 'warning'"
        title: "Robo/Asalto"
        location: "Av. Atalaya 234"
        status_badge:
          text: "En Atención"
          color: "use variable 'warning'"
        time: "Hoy 14:30"
      
      # Card 2
      card_2:
        component: "[USE COMPONENT: LIST_ITEM_ALERT]"
        status_dot_color: "use variable 'success'"
        title: "Accidente"
        location: "Jr. Lima 567"
        status_badge:
          text: "Resuelta"
          color: "use variable 'success'"
        time: "Ayer 09:15"
        rating:
          stars: 5
          filled: 4
          star_color: "use variable 'warning'"
      
      # Card 3
      card_3:
        component: "[USE COMPONENT: LIST_ITEM_ALERT]"
        status_dot_color: "use variable 'text-secondary'"
        title: "Emergencia médica"
        location: "Av. Ucayali 890"
        status_badge:
          text: "Cerrada"
          color: "use variable 'text-secondary'"
        time: "20 Ene"
        rating:
          stars: 5
          filled: 5

  4_BOTTOM_NAV:
    component: "[USE COMPONENT: BOTTOM_NAV_CITIZEN]"
    active_tab: "Alertas"
```

---

## C12 - DETALLE DE MI ALERTA

```yaml
SCREEN_ID: C12
NAME: Detalle de Mi Alerta
TYPE: Mobile
PURPOSE: Ver detalle completo de una alerta del ciudadano

DIMENSIONS:
  width: 375px
  height: DYNAMIC (scrollable)

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"
    scroll: ENABLED

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Detalle Alerta"
    right: "settings_icon"

  2_SCROLLABLE_CONTENT:
    padding_bottom: "use variable 'spacing-2xl'"
    
    alert_header_card:
      background: "use variable 'surface'"
      padding: "use variable 'spacing-lg'"
      border_bottom: "1px solid 'border'"
      
      layout: row
      justify: space-between
      align: start
      
      left_section:
        layout: row
        
        icon_container:
          size: 56px
          background: "'alert-robbery' at 15% opacity"
          border_radius: "use variable 'radius-lg'"
          layout: center
          emoji: "🚨"
          emoji_size: 28px
        
        info:
          margin_left: "use variable 'spacing-md'"
          
          type:
            text: "Robo/Asalto"
            font_size: "use variable 'font-h3'"
            font_weight: "use variable 'font-weight-bold'"
            color: "use variable 'text-primary'"
          
          id:
            text: "#ALT-2026-0145"
            font_size: "use variable 'font-caption'"
            color: "use variable 'text-secondary'"
            margin_top: "use variable 'spacing-xs'"
      
      right_section:
        layout: vertical
        align: end
        
        status_badge:
          component: "[USE COMPONENT: BADGE]"
          variant: "with_dot"
          color: "use variable 'warning'"
          text: "En Atención"
        
        urgency_badge:
          margin_top: "use variable 'spacing-sm'"
          background: "use variable 'urgency-high'"
          border_radius: "use variable 'radius-sm'"
          padding_vertical: "use variable 'spacing-xs'"
          padding_horizontal: "use variable 'spacing-sm'"
          text: "Alta"
          text_style:
            font_size: "use variable 'font-caption'"
            font_weight: "use variable 'font-weight-bold'"
            color: "use variable 'surface'"
    
    description_section:
      background: "use variable 'surface'"
      margin_top: "use variable 'spacing-sm'"
      padding: "use variable 'spacing-lg'"
      
      label:
        text: "Descripción"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-secondary'"
      
      text:
        margin_top: "use variable 'spacing-sm'"
        text: "Intento de robo en la esquina de Av. Atalaya con Jr. Ucayali. Sujeto armado con cuchillo, aproximadamente 1.70m, polera negra. Víctima herida en el brazo."
        font_size: "use variable 'font-body'"
        color: "use variable 'text-primary'"
        line_height: 24px
    
    location_section:
      background: "use variable 'surface'"
      margin_top: "use variable 'spacing-sm'"
      padding: "use variable 'spacing-lg'"
      
      label:
        text: "📍 Ubicación"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-secondary'"
      
      mini_map:
        margin_top: "use variable 'spacing-sm'"
        height: 120px
        border_radius: "use variable 'radius-md'"
        background: "map placeholder with red pin"
      
      address:
        margin_top: "use variable 'spacing-sm'"
        text: "Av. Atalaya 234, Atalaya"
        font_size: "use variable 'font-body'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
    
    evidence_section:
      background: "use variable 'surface'"
      margin_top: "use variable 'spacing-sm'"
      padding: "use variable 'spacing-lg'"
      
      label:
        text: "📷 Evidencia (2)"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-secondary'"
      
      images_row:
        margin_top: "use variable 'spacing-sm'"
        layout: row
        gap: "use variable 'spacing-sm'"
        
        thumbnail_1:
          size: 80x80px
          border_radius: "use variable 'radius-md'"
          background: "gray placeholder"
        
        thumbnail_2:
          size: 80x80px
          border_radius: "use variable 'radius-md'"
          background: "gray placeholder"
    
    timeline_section:
      background: "use variable 'surface'"
      margin_top: "use variable 'spacing-sm'"
      padding: "use variable 'spacing-lg'"
      
      label:
        text: "🕐 Historial"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-secondary'"
      
      timeline:
        margin_top: "use variable 'spacing-md'"
        component: "[USE COMPONENT: TIMELINE]"
        
        items:
          - status: completed
            title: "Reportada"
            subtitle: "Por ti"
            time: "Hoy 14:30"
          
          - status: completed
            title: "En Atención"
            subtitle: "Tomado por Juan Pérez"
            time: "Hoy 14:35"
          
          - status: pending
            title: "Pendiente resolución"
            subtitle: ""
            time: ""
    
    operator_card:
      background: "use variable 'surface'"
      margin_top: "use variable 'spacing-sm'"
      margin_horizontal: "use variable 'spacing-md'"
      border_radius: "use variable 'radius-lg'"
      padding: "use variable 'spacing-lg'"
      shadow: "use variable 'shadow-md'"
      
      label:
        text: "Atendido por:"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
      
      operator_info:
        margin_top: "use variable 'spacing-md'"
        layout: row
        align: center
        
        avatar:
          size: 48px
          shape: circle
          background: "use variable 'primary-light'"
          emoji: "👮"
          emoji_position: center
        
        info:
          margin_left: "use variable 'spacing-md'"
          
          name:
            text: "Juan Pérez"
            font_size: "use variable 'font-body'"
            font_weight: "use variable 'font-weight-semibold'"
            color: "use variable 'text-primary'"
          
          institution:
            text: "PNP Atalaya"
            font_size: "use variable 'font-body-small'"
            color: "use variable 'text-secondary'"
        
        contact_button:
          margin_left: auto
          background: "'primary-light' at 30% opacity"
          border_radius: "use variable 'radius-md'"
          padding_vertical: "use variable 'spacing-sm'"
          padding_horizontal: "use variable 'spacing-md'"
          text: "Contactar"
          text_style:
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-medium'"
            color: "use variable 'primary'"
```

---

## C13 - CALIFICAR ATENCIÓN

```yaml
SCREEN_ID: C13
NAME: Calificar Atención
TYPE: Mobile
PURPOSE: Calificar el servicio recibido

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Calificar Atención"
    right: "spacer_24px"

  2_MAIN_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    flex: 1
    
    illustration:
      margin_top: "use variable 'spacing-xl'"
      align: center
      
      icon_container:
        size: 88px
        shape: circle
        background: "'warning' at 15% opacity"
        layout: center
        
        icon:
          name: "star"
          size: 44px
          color: "use variable 'warning'"
    
    question:
      margin_top: "use variable 'spacing-lg'"
      text: "¿Cómo fue la atención recibida?"
      font_size: "use variable 'font-h3'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'text-primary'"
      align: center
    
    alert_reference:
      margin_top: "use variable 'spacing-lg'"
      background: "use variable 'background'"
      border_radius: "use variable 'radius-lg'"
      padding: "use variable 'spacing-md'"
      
      row_1:
        layout: row
        label:
          text: "Alerta:"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-secondary'"
        value:
          text: "#ALT-2026-0145"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'primary'"
      
      row_2:
        margin_top: "use variable 'spacing-sm'"
        layout: row
        label:
          text: "Atendido por:"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-secondary'"
        value:
          text: "🚔 PNP Atalaya"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'text-primary'"
    
    star_rating:
      margin_top: "use variable 'spacing-xl'"
      align: center
      
      stars_row:
        layout: row
        justify: center
        gap: "use variable 'spacing-sm'"
        
        stars:
          count: 5
          size: 48px
          filled_color: "use variable 'warning'"
          empty_color: "use variable 'border'"
          filled_count: 4 # 4 of 5 filled
      
      rating_text:
        margin_top: "use variable 'spacing-md'"
        text: "4 de 5 estrellas"
        font_size: "use variable 'font-h4'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'warning'"
        align: center
    
    rating_labels:
      margin_top: "use variable 'spacing-md'"
      layout: row
      justify: space-between
      
      label_left:
        text: "😞 Malo"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
      
      label_right:
        text: "😊 Excelente"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
    
    comment_section:
      margin_top: "use variable 'spacing-xl'"
      
      label:
        text: "Comentario (opcional)"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
      
      textarea:
        margin_top: "use variable 'spacing-sm'"
        width: 100%
        height: 100px
        background: "use variable 'surface'"
        border: "1px solid 'border'"
        border_radius: "use variable 'radius-lg'"
        padding: "use variable 'spacing-md'"
        text: "Llegaron rápido y fueron muy amables. Resolvieron el problema de manera eficiente."
        font_size: "use variable 'font-body'"
        color: "use variable 'text-primary'"
        line_height: 22px
      
      counter:
        margin_top: "use variable 'spacing-xs'"
        text: "89/300"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
        align: right

  3_BOTTOM_SECTION:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_bottom: "use variable 'spacing-xl'"
    margin_top: auto
    
    submit_button:
      width: 100%
      height: 56px
      background: "use variable 'warning'"
      border_radius: "use variable 'radius-lg'"
      shadow: "0 4px 12px 'warning' at 40% opacity"
      layout: row
      justify: center
      align: center
      
      icon:
        name: "star"
        size: "use variable 'icon-md'"
        color: "use variable 'text-primary'"
      
      text:
        text: "ENVIAR CALIFICACIÓN"
        font_size: "use variable 'font-button'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'text-primary'"
        margin_left: "use variable 'spacing-sm'"
    
    skip_link:
      margin_top: "use variable 'spacing-md'"
      align: center
      text: "Omitir por ahora"
      font_size: "use variable 'font-body-small'"
      font_weight: "use variable 'font-weight-medium'"
      color: "use variable 'text-secondary'"

  4_BOTTOM_SAFE_AREA:
    height: 34px
```

---


## C14 - MAPA DE ALERTAS CERCANAS

```yaml
SCREEN_ID: C14
NAME: Mapa de Alertas Cercanas
TYPE: Mobile
PURPOSE: Ver alertas cercanas en un mapa interactivo

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Alertas Cercanas"
    right: "settings_icon"

  2_MAP_SECTION:
    height: 350px
    width: 100%
    position: relative
    
    map_background:
      background: "map placeholder image"
    
    user_location:
      position: "center-bottom area"
      size: 16px
      shape: circle
      color: "use variable 'primary'"
      pulse_animation: true
    
    alert_markers:
      critical_marker:
        size: 20px
        color: "use variable 'urgency-critical'"
      high_marker:
        size: 18px
        color: "use variable 'urgency-high'"
      medium_marker:
        size: 16px
        color: "use variable 'urgency-medium'"
      low_marker:
        size: 14px
        color: "use variable 'urgency-low'"
    
    map_controls:
      position: "right, margin 'spacing-md'"
      layout: vertical
      
      location_button:
        size: 44px
        background: "use variable 'primary'"
        border_radius: "use variable 'radius-md'"
        shadow: "use variable 'shadow-md'"
        icon: "crosshair"
        icon_color: "use variable 'surface'"
      
      zoom_buttons:
        margin_top: "use variable 'spacing-sm'"
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-md'"
        shadow: "use variable 'shadow-md'"
        
        button_plus:
          size: 40px
          icon: "plus"
        
        divider:
          height: 1px
          background: "use variable 'border'"
        
        button_minus:
          size: 40px
          icon: "minus"

  3_RADIUS_SELECTOR:
    margin_top: "use variable 'spacing-md'"
    padding_horizontal: "use variable 'spacing-lg'"
    
    segmented_control:
      background: "use variable 'background'"
      border_radius: "use variable 'radius-md'"
      padding: "use variable 'spacing-xs'"
      layout: row
      
      segments:
        count: 4
        height: 36px
        
        segment_200m:
          text: "200m"
          state: default
          background: transparent
          color: "use variable 'text-secondary'"
        
        segment_500m:
          text: "500m"
          state: default
        
        segment_1km:
          text: "1km"
          state: SELECTED
          background: "use variable 'primary'"
          color: "use variable 'surface'"
          border_radius: "use variable 'radius-sm'"
        
        segment_2km:
          text: "2km"
          state: default

  4_FILTER_CHIPS:
    margin_top: "use variable 'spacing-md'"
    padding_horizontal: "use variable 'spacing-lg'"
    
    scroll: horizontal
    layout: row
    gap: "use variable 'spacing-sm'"
    
    chip_structure:
      height: 32px
      padding_horizontal: "use variable 'spacing-md'"
      border_radius: "use variable 'radius-full'"
      layout: row
      align: center
      gap: "use variable 'spacing-xs'"
      
      default_style:
        background: "use variable 'surface'"
        border: "1px solid 'border'"
        text_color: "use variable 'text-secondary'"
      
      selected_style:
        background: "[category_color] at 15% opacity"
        border: "1px solid [category_color]"
        text_color: "[category_color]"
    
    chips:
      - emoji: "🚨"
        text: "Crítica (3)"
        state: SELECTED
        color: "use variable 'urgency-critical'"
      
      - emoji: "🟠"
        text: "Media (5)"
        state: SELECTED
        color: "use variable 'urgency-medium'"
      
      - emoji: "🟢"
        text: "Baja (2)"
        state: SELECTED
        color: "use variable 'urgency-low'"

  5_ALERTS_LIST:
    margin_top: "use variable 'spacing-md'"
    padding_horizontal: "use variable 'spacing-lg'"
    padding_bottom: 100px
    
    header:
      text: "ALERTAS ACTIVAS (5)"
      font_size: "use variable 'font-caption'"
      font_weight: "use variable 'font-weight-bold'"
      color: "use variable 'text-secondary'"
      letter_spacing: 1px
    
    list:
      margin_top: "use variable 'spacing-md'"
      gap: "use variable 'spacing-sm'"
      
      alert_row_structure:
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-lg'"
        padding: "use variable 'spacing-md'"
        layout: row
        justify: space-between
        align: center
        
        left:
          layout: row
          align: center
          
          urgency_dot:
            size: 10px
            shape: circle
            color: "[urgency_color]"
          
          info:
            margin_left: "use variable 'spacing-sm'"
            
            type:
              font_size: "use variable 'font-body-small'"
              font_weight: "use variable 'font-weight-medium'"
              color: "use variable 'text-primary'"
            
            distance:
              font_size: "use variable 'font-caption'"
              color: "use variable 'text-secondary'"
        
        right:
          layout: row
          align: center
          
          time:
            font_size: "use variable 'font-caption'"
            color: "use variable 'text-secondary'"
          
          chevron:
            icon: "chevron-right"
            size: "use variable 'icon-md'"
            color: "use variable 'border'"
            margin_left: "use variable 'spacing-sm'"
      
      rows:
        - urgency: "urgency-critical"
          type: "Robo a mano armada"
          distance: "200m"
          time: "5 min"
        
        - urgency: "urgency-high"
          type: "Accidente vehicular"
          distance: "350m"
          time: "12 min"
        
        - urgency: "urgency-medium"
          type: "Actividad sospechosa"
          distance: "800m"
          time: "25 min"

  6_BOTTOM_NAV:
    component: "[USE COMPONENT: BOTTOM_NAV_CITIZEN]"
    active_tab: "Mapa"
```

---

## C15 - PERFIL CIUDADANO

```yaml
SCREEN_ID: C15
NAME: Perfil Ciudadano
TYPE: Mobile
PURPOSE: Ver y editar perfil del usuario ciudadano

DIMENSIONS:
  width: 375px
  height: DYNAMIC (scrollable)

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"
    scroll: ENABLED

LAYOUT:

  1_HEADER_PROFILE:
    background: "linear gradient from 'primary' to 'primary-dark'"
    padding_top: 44px # status bar
    padding_bottom: "use variable 'spacing-xl'"
    padding_horizontal: "use variable 'spacing-lg'"
    border_radius_bottom: "use variable 'radius-xl'"
    
    top_row:
      layout: row
      justify: space-between
      align: center
      
      back_button:
        icon: "arrow-left"
        size: "use variable 'icon-lg'"
        color: "use variable 'surface'"
      
      title:
        text: "Mi Perfil"
        font_size: "use variable 'font-h4'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'surface'"
      
      edit_button:
        icon: "edit"
        size: "use variable 'icon-lg'"
        color: "use variable 'surface'"
    
    avatar_section:
      margin_top: "use variable 'spacing-xl'"
      align: center
      
      avatar:
        size: 88px
        shape: circle
        background: "use variable 'surface'"
        border: "4px solid 'surface'"
        shadow: "use variable 'shadow-lg'"
        
        initials:
          text: "EW"
          font_size: "use variable 'font-h2'"
          font_weight: "use variable 'font-weight-bold'"
          color: "use variable 'primary'"
      
      camera_badge:
        position: "bottom-right of avatar"
        size: 28px
        shape: circle
        background: "use variable 'primary-light'"
        border: "2px solid 'surface'"
        icon: "camera"
        icon_size: "use variable 'icon-sm'"
        icon_color: "use variable 'primary'"
      
      name:
        margin_top: "use variable 'spacing-md'"
        text: "Edwin Wilson Méndez"
        font_size: "use variable 'font-h3'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'surface'"
      
      member_since:
        margin_top: "use variable 'spacing-xs'"
        text: "Miembro desde Enero 2026"
        font_size: "use variable 'font-body-small'"
        color: "use variable 'surface' at 80% opacity"

  2_STATS_ROW:
    margin_top: -20px # overlap with header
    margin_horizontal: "use variable 'spacing-lg'"
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"
    padding: "use variable 'spacing-md'"
    shadow: "use variable 'shadow-md'"
    layout: row
    
    stat_item:
      flex: 1
      layout: vertical
      align: center
      
      number:
        font_size: "use variable 'font-h3'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'text-primary'"
      
      label:
        margin_top: "use variable 'spacing-xs'"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
    
    divider:
      width: 1px
      height: 40px
      background: "use variable 'border'"
    
    stats:
      - number: "12"
        label: "Alertas"
      
      - number: "4.8"
        label: "Rating"
        icon: "star"
        icon_color: "use variable 'warning'"
      
      - number: "3"
        label: "Activas"

  3_INFO_SECTION:
    margin_top: "use variable 'spacing-lg'"
    padding_horizontal: "use variable 'spacing-lg'"
    
    section_title:
      text: "INFORMACIÓN PERSONAL"
      font_size: "use variable 'font-caption'"
      font_weight: "use variable 'font-weight-bold'"
      color: "use variable 'text-secondary'"
      letter_spacing: 1px
    
    info_cards:
      margin_top: "use variable 'spacing-md'"
      background: "use variable 'surface'"
      border_radius: "use variable 'radius-lg'"
      shadow: "use variable 'shadow-md'"
      overflow: hidden
      
      row_structure:
        padding: "use variable 'spacing-md'"
        layout: row
        align: center
        border_bottom: "1px solid 'border'"
        
        icon_container:
          size: 40px
          shape: circle
          background: "[icon_color] at 15% opacity"
          layout: center
          
          icon:
            size: "use variable 'icon-md'"
            color: "[icon_color]"
        
        info:
          margin_left: "use variable 'spacing-md'"
          flex: 1
          
          label:
            font_size: "use variable 'font-caption'"
            color: "use variable 'text-secondary'"
          
          value:
            font_size: "use variable 'font-body'"
            font_weight: "use variable 'font-weight-semibold'"
            color: "use variable 'text-primary'"
            margin_top: 2px
      
      rows:
        - icon: "id-card"
          icon_color: "use variable 'primary'"
          label: "DNI"
          value: "12345678"
        
        - icon: "phone"
          icon_color: "use variable 'success'"
          label: "Celular"
          value: "987 654 321"
        
        - icon: "envelope"
          icon_color: "use variable 'warning'"
          label: "Email"
          value: "edwin.mendez@email.com"
        
        - icon: "map-pin"
          icon_color: "use variable 'error'"
          label: "Distrito"
          value: "Atalaya, Ucayali"
          border_bottom: none

  4_ACTIONS_SECTION:
    margin_top: "use variable 'spacing-lg'"
    padding_horizontal: "use variable 'spacing-lg'"
    
    section_title:
      text: "OPCIONES"
      font_size: "use variable 'font-caption'"
      font_weight: "use variable 'font-weight-bold'"
      color: "use variable 'text-secondary'"
      letter_spacing: 1px
    
    action_cards:
      margin_top: "use variable 'spacing-md'"
      background: "use variable 'surface'"
      border_radius: "use variable 'radius-lg'"
      shadow: "use variable 'shadow-md'"
      overflow: hidden
      
      row_structure:
        padding: "use variable 'spacing-md'"
        layout: row
        align: center
        justify: space-between
        border_bottom: "1px solid 'border'"
        
        left:
          layout: row
          align: center
          
          icon:
            size: "use variable 'icon-lg'"
            color: "use variable 'text-primary'"
          
          text:
            margin_left: "use variable 'spacing-md'"
            font_size: "use variable 'font-body'"
            font_weight: "use variable 'font-weight-medium'"
            color: "use variable 'text-primary'"
        
        right:
          chevron:
            icon: "chevron-right"
            size: "use variable 'icon-md'"
            color: "use variable 'border'"
      
      rows:
        - icon: "settings"
          text: "Configuración"
        
        - icon: "bell"
          text: "Notificaciones"
        
        - icon: "shield"
          text: "Privacidad y seguridad"
        
        - icon: "help-circle"
          text: "Ayuda y soporte"
          border_bottom: none

  5_LOGOUT_BUTTON:
    margin_top: "use variable 'spacing-lg'"
    margin_horizontal: "use variable 'spacing-lg'"
    margin_bottom: "use variable 'spacing-md'"
    
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-lg'"
    padding: "use variable 'spacing-md'"
    shadow: "use variable 'shadow-md'"
    layout: row
    align: center
    justify: center
    
    icon:
      name: "log-out"
      size: "use variable 'icon-lg'"
      color: "use variable 'error'"
    
    text:
      margin_left: "use variable 'spacing-sm'"
      text: "Cerrar Sesión"
      font_size: "use variable 'font-body'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'error'"

  6_APP_VERSION:
    padding_bottom: "use variable 'spacing-lg'"
    align: center
    
    text: "SAVIA Ciudadano v1.0.0"
    font_size: "use variable 'font-caption'"
    color: "use variable 'text-secondary'"

  7_BOTTOM_NAV:
    component: "[USE COMPONENT: BOTTOM_NAV_CITIZEN]"
    active_tab: "Perfil"
```

---

## C16 - NOTIFICACIONES

```yaml
SCREEN_ID: C16
NAME: Notificaciones
TYPE: Mobile
PURPOSE: Ver historial de notificaciones del ciudadano

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Notificaciones"
    right:
      text: "Limpiar"
      font_size: "use variable 'font-body-small'"
      font_weight: "use variable 'font-weight-medium'"
      color: "use variable 'primary'"

  2_TABS:
    background: "use variable 'surface'"
    padding_horizontal: "use variable 'spacing-md'"
    border_bottom: "1px solid 'border'"
    height: 48px
    layout: row
    
    tab_todas:
      flex: 1
      layout: center
      text: "Todas"
      font_size: "use variable 'font-body-small'"
      font_weight: "use variable 'font-weight-medium'"
      color: "use variable 'primary'"
      border_bottom: "3px solid 'primary'"
      state: ACTIVE
    
    tab_no_leidas:
      flex: 1
      layout: center
      text: "No leídas"
      font_size: "use variable 'font-body-small'"
      color: "use variable 'text-secondary'"
      badge:
        text: "5"
        background: "use variable 'error'"
        color: "use variable 'surface'"
        size: 18px
        margin_left: "use variable 'spacing-xs'"

  3_NOTIFICATIONS_LIST:
    padding_bottom: 100px
    
    section_today:
      section_header:
        padding: "use variable 'spacing-md'" "use variable 'spacing-lg'"
        text: "HOY"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'text-secondary'"
        letter_spacing: 1px
      
      notifications:
        notification_structure:
          background: "use variable 'surface'"
          padding: "use variable 'spacing-md'" "use variable 'spacing-lg'"
          border_bottom: "1px solid 'border'"
          layout: row
          align: start
          
          unread_indicator:
            # Only for unread notifications
            position: left
            width: 3px
            height: 100%
            background: "use variable 'primary'"
          
          icon_container:
            size: 44px
            shape: circle
            background: "[type_color] at 15% opacity"
            layout: center
            
            icon:
              size: "use variable 'icon-lg'"
              color: "[type_color]"
          
          content:
            flex: 1
            margin_left: "use variable 'spacing-md'"
            
            title:
              font_size: "use variable 'font-body'"
              font_weight: "use variable 'font-weight-semibold'"
              color: "use variable 'text-primary'"
            
            message:
              margin_top: "use variable 'spacing-xs'"
              font_size: "use variable 'font-body-small'"
              color: "use variable 'text-secondary'"
              line_height: 20px
            
            time:
              margin_top: "use variable 'spacing-sm'"
              font_size: "use variable 'font-caption'"
              color: "use variable 'text-secondary'"
        
        items_today:
          - type: "alert_update"
            icon: "bell"
            icon_color: "use variable 'primary'"
            title: "Alerta actualizada"
            message: "Tu alerta #0145 ha sido tomada por un operador de PNP Atalaya."
            time: "Hace 10 min"
            unread: true
          
          - type: "alert_resolved"
            icon: "check-circle"
            icon_color: "use variable 'success'"
            title: "Alerta resuelta"
            message: "La alerta #0143 que reportaste ha sido marcada como resuelta. ¡Gracias por tu colaboración!"
            time: "Hace 2 horas"
            unread: true
          
          - type: "nearby_alert"
            icon: "map-pin"
            icon_color: "use variable 'error'"
            title: "Alerta cercana"
            message: "Se ha reportado un incidente de robo a 300m de tu ubicación. Mantente alerta."
            time: "Hace 4 horas"
            unread: false
    
    section_yesterday:
      section_header:
        text: "AYER"
      
      items_yesterday:
        - type: "rating_request"
          icon: "star"
          icon_color: "use variable 'warning'"
          title: "Califica tu experiencia"
          message: "¿Cómo fue la atención en tu alerta #0142? Tu opinión nos ayuda a mejorar."
          time: "Ayer 15:30"
          unread: false
        
        - type: "system"
          icon: "info"
          icon_color: "use variable 'info'"
          title: "Actualización del sistema"
          message: "SAVIA se ha actualizado a la versión 1.0.1 con mejoras de rendimiento."
          time: "Ayer 09:00"
          unread: false
    
    section_older:
      section_header:
        text: "ESTA SEMANA"
      
      items_older:
        - type: "tip"
          icon: "lightbulb"
          icon_color: "use variable 'warning'"
          title: "Consejo de seguridad"
          message: "Recuerda siempre verificar tu entorno antes de reportar una emergencia."
          time: "Lun 10:00"
          unread: false

  4_EMPTY_STATE:
    # Show when no notifications
    display: none # hidden when there are notifications
    padding: "use variable 'spacing-2xl'"
    layout: vertical
    align: center
    
    icon_container:
      size: 80px
      shape: circle
      background: "use variable 'background'"
      layout: center
      
      icon:
        name: "bell-off"
        size: 40px
        color: "use variable 'text-secondary'"
    
    title:
      margin_top: "use variable 'spacing-lg'"
      text: "No hay notificaciones"
      font_size: "use variable 'font-h4'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'text-primary'"
    
    subtitle:
      margin_top: "use variable 'spacing-sm'"
      text: "Cuando recibas notificaciones, aparecerán aquí."
      font_size: "use variable 'font-body-small'"
      color: "use variable 'text-secondary'"
      align: center

  5_BOTTOM_NAV:
    component: "[USE COMPONENT: BOTTOM_NAV_CITIZEN]"
    active_tab: "Notif."
```

---

# 📱 PARTE 4: PANTALLAS APP OPERADOR (7 pantallas)

---

## O01 - HOME OPERADOR

```yaml
SCREEN_ID: O01
NAME: Home Operador
TYPE: Mobile
PURPOSE: Pantalla principal del operador de emergencias

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    height: 64px
    background: "use variable 'surface'"
    shadow: "use variable 'shadow-sm'"
    padding_horizontal: "use variable 'spacing-md'"
    layout: row
    justify: space-between
    align: center
    
    logo_section:
      layout: row
      align: center
      
      shield_icon:
        size: "use variable 'icon-lg'"
        color: "use variable 'primary'"
      
      app_name:
        text: "SAVIA"
        font_size: "use variable 'font-h4'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'primary'"
        margin_left: "use variable 'spacing-sm'"
      
      operator_badge:
        margin_left: "use variable 'spacing-sm'"
        background: "'success' at 15% opacity"
        border_radius: "use variable 'radius-sm'"
        padding_vertical: 2px
        padding_horizontal: "use variable 'spacing-sm'"
        text: "Operador"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'success'"
    
    right_section:
      layout: row
      gap: "use variable 'spacing-md'"
      
      notification_bell:
        icon: "bell"
        size: "use variable 'icon-lg'"
        color: "use variable 'text-primary'"
        badge:
          value: "5"
          background: "use variable 'error'"
      
      avatar:
        size: 36px
        shape: circle
        background: "use variable 'primary-light'"
        emoji: "👮"

  2_SCROLLABLE_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_top: "use variable 'spacing-md'"
    padding_bottom: 100px
    
    greeting:
      title:
        text: "Bienvenido, Juan 👮"
        font_size: "use variable 'font-h2'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-primary'"
      
      institution:
        text: "PNP Atalaya"
        font_size: "use variable 'font-body'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'primary'"
        margin_top: "use variable 'spacing-xs'"
    
    pending_alerts_card:
      margin_top: "use variable 'spacing-lg'"
      width: 100%
      height: 120px
      background: "linear gradient from 'warning' to 'warning' darker 10%"
      border_radius: "use variable 'radius-xl'"
      padding: "use variable 'spacing-lg'"
      shadow: "0 4px 16px 'warning' at 35% opacity"
      layout: row
      justify: space-between
      align: center
      
      left_section:
        layout: vertical
        
        number:
          text: "5"
          font_size: 48px
          font_weight: "use variable 'font-weight-bold'"
          color: "use variable 'surface'"
        
        label:
          text: "Alertas pendientes"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'surface' at 90% opacity"
      
      right_section:
        button:
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-md'"
          padding_vertical: "use variable 'spacing-sm'"
          padding_horizontal: "use variable 'spacing-md'"
          
          text: "VER ALERTAS"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'warning'"
    
    stats_row:
      margin_top: "use variable 'spacing-lg'"
      layout: row
      gap: "use variable 'spacing-md'"
      
      stat_card_structure:
        flex: 1
        component: "[USE COMPONENT: CARD]"
        padding: "use variable 'spacing-md'"
        layout: vertical
        align: center
        
        number:
          font_size: "use variable 'font-h2'"
          font_weight: "use variable 'font-weight-bold'"
          color: "use variable 'text-primary'"
        
        label:
          font_size: "use variable 'font-caption'"
          color: "use variable 'text-secondary'"
          margin_top: "use variable 'spacing-xs'"
      
      stats:
        - number: "12"
          label: "Atendidas hoy"
          accent: "use variable 'success'"
        
        - number: "47"
          label: "Este mes"
          accent: "use variable 'primary'"
    
    active_cases:
      margin_top: "use variable 'spacing-lg'"
      
      header_row:
        layout: row
        justify: space-between
        
        title:
          text: "Mis casos activos"
          font_size: "use variable 'font-body'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'text-primary'"
        
        link:
          text: "Ver todos"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'primary'"
      
      cases_list:
        margin_top: "use variable 'spacing-md'"
        gap: "use variable 'spacing-sm'"
        
        case_card_structure:
          component: "[USE COMPONENT: CARD]"
          variant: "with_accent"
          accent_color: "[urgency_color]"
          padding: "use variable 'spacing-md'"
          
          top_row:
            layout: row
            justify: space-between
            
            badge:
              component: "[USE COMPONENT: BADGE]"
              color: "[urgency_color]"
              text: "[alert_id]"
            
            type_text:
              font_size: "use variable 'font-body'"
              font_weight: "use variable 'font-weight-semibold'"
              color: "use variable 'text-primary'"
          
          location:
            margin_top: "use variable 'spacing-sm'"
            font_size: "use variable 'font-body-small'"
            color: "use variable 'text-secondary'"
          
          bottom_row:
            margin_top: "use variable 'spacing-md'"
            layout: row
            justify: space-between
            align: center
            
            status:
              layout: row
              align: center
              
              dot:
                size: 8px
                shape: circle
                color: "[status_color]"
              
              text:
                margin_left: "use variable 'spacing-xs'"
                font_size: "use variable 'font-caption'"
                color: "[status_color]"
            
            actions:
              layout: row
              gap: "use variable 'spacing-sm'"
              
              button_update:
                background: "'primary-light' at 30% opacity"
                border_radius: "use variable 'radius-md'"
                padding_vertical: "use variable 'spacing-xs'"
                padding_horizontal: "use variable 'spacing-sm'"
                text: "Actualizar"
                font_size: "use variable 'font-caption'"
                color: "use variable 'primary'"
              
              button_navigate:
                background: "'success' at 15% opacity"
                border_radius: "use variable 'radius-md'"
                padding_vertical: "use variable 'spacing-xs'"
                padding_horizontal: "use variable 'spacing-sm'"
                text: "Navegar"
                font_size: "use variable 'font-caption'"
                color: "use variable 'success'"
        
        cases:
          - alert_id: "#0145"
            urgency_color: "use variable 'urgency-critical'"
            type: "Robo a mano armada"
            location: "Av. Atalaya 234"
            status: "En camino"
            status_color: "use variable 'warning'"
          
          - alert_id: "#0143"
            urgency_color: "use variable 'urgency-high'"
            type: "Accidente de tránsito"
            location: "Jr. Lima 567"
            status: "En el lugar"
            status_color: "use variable 'success'"

  3_BOTTOM_NAV:
    component: "[USE COMPONENT: BOTTOM_NAV_OPERATOR]"
    active_tab: "Inicio"
```

---

## O02 - ALERTAS ASIGNADAS

```yaml
SCREEN_ID: O02
NAME: Alertas Asignadas
TYPE: Mobile
PURPOSE: Ver lista de alertas pendientes y asignadas al operador

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "menu_icon"
    center: "Alertas"
    right: "filter_icon"

  2_TAB_BAR:
    background: "use variable 'surface'"
    height: 48px
    border_bottom: "1px solid 'border'"
    padding_horizontal: "use variable 'spacing-sm'"
    layout: row
    
    tab_structure:
      flex: 1
      layout: center
      height: 100%
      font_size: "use variable 'font-body-small'"
      font_weight: "use variable 'font-weight-medium'"
      
      badge:
        margin_left: "use variable 'spacing-xs'"
        min_width: 20px
        height: 20px
        border_radius: "use variable 'radius-full'"
        font_size: 10px
        font_weight: "use variable 'font-weight-bold'"
    
    tabs:
      - text: "Pendientes"
        state: ACTIVE
        color: "use variable 'primary'"
        border_bottom: "3px solid 'primary'"
        badge:
          text: "5"
          background: "use variable 'error'"
          color: "use variable 'surface'"
      
      - text: "Mis Casos"
        color: "use variable 'text-secondary'"
        badge:
          text: "2"
          background: "use variable 'warning'"
          color: "use variable 'text-primary'"
      
      - text: "Todas"
        color: "use variable 'text-secondary'"

  3_ALERTS_LIST:
    padding_horizontal: "use variable 'spacing-md'"
    padding_top: "use variable 'spacing-md'"
    padding_bottom: 100px
    
    urgency_section_structure:
      margin_bottom: "use variable 'spacing-lg'"
      
      section_header:
        layout: row
        align: center
        margin_bottom: "use variable 'spacing-sm'"
        
        dot:
          size: 10px
          shape: circle
          color: "[urgency_color]"
        
        text:
          margin_left: "use variable 'spacing-sm'"
          text: "[URGENCY_LABEL]"
          font_size: "use variable 'font-caption'"
          font_weight: "use variable 'font-weight-bold'"
          color: "[urgency_color]"
          letter_spacing: 1px
        
        count:
          margin_left: "use variable 'spacing-sm'"
          text: "([count])"
          font_size: "use variable 'font-caption'"
          color: "use variable 'text-secondary'"
      
      alerts:
        gap: "use variable 'spacing-sm'"
    
    alert_card_structure:
      component: "[USE COMPONENT: CARD]"
      variant: "with_accent"
      accent_color: "[urgency_color]"
      padding: "use variable 'spacing-md'"
      
      top_row:
        layout: row
        align: center
        
        icon_container:
          size: 44px
          shape: circle
          background: "[category_color] at 15% opacity"
          layout: center
          emoji: "[emoji]"
          emoji_size: 24px
        
        info:
          margin_left: "use variable 'spacing-md'"
          flex: 1
          
          id_badge:
            component: "[USE COMPONENT: BADGE]"
            color: "[urgency_color]"
            text: "[alert_id]"
          
          type:
            margin_top: "use variable 'spacing-xs'"
            font_size: "use variable 'font-body'"
            font_weight: "use variable 'font-weight-semibold'"
            color: "use variable 'text-primary'"
      
      location_row:
        margin_top: "use variable 'spacing-sm'"
        layout: row
        align: center
        
        icon:
          name: "map-pin"
          size: "use variable 'icon-sm'"
          color: "use variable 'text-secondary'"
        
        text:
          margin_left: "use variable 'spacing-xs'"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-secondary'"
      
      bottom_row:
        margin_top: "use variable 'spacing-md'"
        layout: row
        justify: space-between
        align: center
        
        time_distance:
          layout: row
          gap: "use variable 'spacing-md'"
          
          time:
            layout: row
            align: center
            icon: "clock"
            icon_size: "use variable 'icon-sm'"
            text: "[time_ago]"
            font_size: "use variable 'font-caption'"
            color: "use variable 'text-secondary'"
          
          distance:
            layout: row
            align: center
            icon: "navigation"
            text: "[distance]"
        
        take_button:
          background: "[urgency_color]"
          border_radius: "use variable 'radius-md'"
          padding_vertical: "use variable 'spacing-sm'"
          padding_horizontal: "use variable 'spacing-md'"
          text: "TOMAR CASO"
          font_size: "use variable 'font-caption'"
          font_weight: "use variable 'font-weight-bold'"
          color: "use variable 'surface'"
    
    sections:
      - urgency: "CRÍTICAS"
        urgency_color: "use variable 'urgency-critical'"
        count: 2
        alerts:
          - emoji: "🚨"
            alert_id: "#0147"
            type: "Robo a mano armada"
            location: "Av. Principal 456"
            time: "2 min"
            distance: "1.5 km"
          
          - emoji: "🏥"
            alert_id: "#0146"
            type: "Emergencia médica"
            location: "Jr. Ucayali 123"
            time: "5 min"
            distance: "800 m"
      
      - urgency: "ALTA"
        urgency_color: "use variable 'urgency-high'"
        count: 1
        alerts:
          - emoji: "🚗"
            alert_id: "#0144"
            type: "Accidente de tránsito"
            location: "Av. Lima esq. Jr. Atalaya"
            time: "10 min"
            distance: "2 km"
      
      - urgency: "MEDIA"
        urgency_color: "use variable 'urgency-medium'"
        count: 2
        alerts:
          - emoji: "⚡"
            alert_id: "#0142"
            type: "Falla eléctrica"
            location: "Calle Los Pinos 78"
            time: "15 min"
            distance: "1.2 km"
          
          - emoji: "💧"
            alert_id: "#0141"
            type: "Problema de agua"
            location: "Av. Central 890"
            time: "20 min"
            distance: "1.8 km"

  4_BOTTOM_NAV:
    component: "[USE COMPONENT: BOTTOM_NAV_OPERATOR]"
    active_tab: "Alertas"
```

---


## O03 - DETALLE ALERTA (OPERADOR)

```yaml
SCREEN_ID: O03
NAME: Detalle Alerta - Vista Operador
TYPE: Mobile
PURPOSE: Ver detalle completo de una alerta para tomar acción

DIMENSIONS:
  width: 375px
  height: DYNAMIC (scrollable)

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"
    scroll: ENABLED

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Alerta #0145"
    right:
      badge:
        text: "CRÍTICA"
        background: "use variable 'urgency-critical'"
        color: "use variable 'surface'"
        border_radius: "use variable 'radius-sm'"
        padding: "spacing-xs" "spacing-sm"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-bold'"

  2_SCROLLABLE_CONTENT:
    padding_bottom: 120px
    
    alert_banner:
      background: "linear gradient from 'urgency-critical' at 10% to 'urgency-critical' at 5%"
      padding: "use variable 'spacing-lg'"
      layout: row
      align: center
      
      icon_container:
        size: 56px
        shape: circle
        background: "use variable 'surface'"
        shadow: "use variable 'shadow-md'"
        layout: center
        emoji: "🚨"
        emoji_size: 28px
      
      info:
        margin_left: "use variable 'spacing-md'"
        
        type:
          text: "ROBO/ASALTO"
          font_size: "use variable 'font-h3'"
          font_weight: "use variable 'font-weight-bold'"
          color: "use variable 'urgency-critical'"
        
        time:
          text: "Reportado hace 8 minutos"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-secondary'"
          margin_top: "use variable 'spacing-xs'"
    
    map_section:
      margin_top: "use variable 'spacing-sm'"
      background: "use variable 'surface'"
      padding: "use variable 'spacing-md'"
      
      map_container:
        height: 180px
        border_radius: "use variable 'radius-xl'"
        overflow: hidden
        shadow: "use variable 'shadow-sm'"
        
        map_content:
          background: "map placeholder"
          route_line:
            style: "dashed"
            color: "use variable 'primary'"
          destination_pin:
            color: "use variable 'error'"
          current_location:
            color: "use variable 'primary'"
      
      info_badges:
        margin_top: "use variable 'spacing-md'"
        layout: row
        gap: "use variable 'spacing-md'"
        
        distance_badge:
          flex: 1
          background: "'primary-light' at 30% opacity"
          border_radius: "use variable 'radius-md'"
          padding: "use variable 'spacing-sm'" "use variable 'spacing-md'"
          layout: row
          align: center
          justify: center
          
          icon:
            name: "navigation"
            size: "use variable 'icon-sm'"
            color: "use variable 'primary'"
          
          text:
            margin_left: "use variable 'spacing-xs'"
            text: "1.5 km"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-semibold'"
            color: "use variable 'primary'"
        
        eta_badge:
          flex: 1
          background: "'success' at 15% opacity"
          border_radius: "use variable 'radius-md'"
          padding: "use variable 'spacing-sm'" "use variable 'spacing-md'"
          layout: row
          align: center
          justify: center
          
          icon:
            name: "clock"
            color: "use variable 'success'"
          
          text:
            text: "5 min"
            color: "use variable 'success'"
    
    location_card:
      margin_top: "use variable 'spacing-sm'"
      background: "use variable 'surface'"
      padding: "use variable 'spacing-md'"
      
      layout: row
      align: center
      
      icon:
        name: "map-pin"
        size: "use variable 'icon-lg'"
        color: "use variable 'error'"
      
      address:
        margin_left: "use variable 'spacing-md'"
        text: "Av. Atalaya 234, esquina con Jr. Ucayali"
        font_size: "use variable 'font-body'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-primary'"
    
    description_card:
      margin_top: "use variable 'spacing-sm'"
      background: "use variable 'surface'"
      padding: "use variable 'spacing-md'"
      
      label:
        text: "📝 Descripción"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-secondary'"
      
      text:
        margin_top: "use variable 'spacing-sm'"
        text: "Intento de robo en la esquina. Sujeto armado con cuchillo, aproximadamente 1.70m, polera negra. Víctima herida en el brazo. Se escucho disparos al aire."
        font_size: "use variable 'font-body'"
        color: "use variable 'text-primary'"
        line_height: 22px
    
    evidence_card:
      margin_top: "use variable 'spacing-sm'"
      background: "use variable 'surface'"
      padding: "use variable 'spacing-md'"
      
      label:
        text: "📷 Evidencia adjunta (2)"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-secondary'"
      
      images_row:
        margin_top: "use variable 'spacing-sm'"
        layout: row
        gap: "use variable 'spacing-sm'"
        
        thumbnail:
          size: 100x100px
          border_radius: "use variable 'radius-md'"
          background: "gray placeholder"
    
    reporter_card:
      margin_top: "use variable 'spacing-sm'"
      background: "use variable 'surface'"
      padding: "use variable 'spacing-md'"
      
      label:
        text: "👤 Reportado por"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'text-secondary'"
      
      reporter_info:
        margin_top: "use variable 'spacing-md'"
        layout: row
        align: center
        
        avatar:
          size: 44px
          shape: circle
          background: "use variable 'primary-light'"
          text: "EM"
          text_color: "use variable 'primary'"
        
        info:
          margin_left: "use variable 'spacing-md'"
          flex: 1
          
          name:
            text: "Edwin Méndez"
            font_size: "use variable 'font-body'"
            font_weight: "use variable 'font-weight-semibold'"
            color: "use variable 'text-primary'"
          
          phone:
            text: "987 654 321"
            font_size: "use variable 'font-body-small'"
            color: "use variable 'text-secondary'"
            margin_top: 2px
        
        time:
          text: "Hace 8 min"
          font_size: "use variable 'font-caption'"
          color: "use variable 'text-secondary'"

  3_ACTION_BUTTONS:
    position: fixed bottom
    background: "use variable 'surface'"
    padding: "use variable 'spacing-md'" "use variable 'spacing-lg'"
    shadow: "0 -4px 12px rgba(0,0,0,0.08)"
    padding_bottom: 34px # safe area
    
    buttons_row:
      layout: row
      gap: "use variable 'spacing-sm'"
      
      navigate_button:
        flex: 1
        height: 52px
        background: "use variable 'primary'"
        border_radius: "use variable 'radius-lg'"
        layout: row
        justify: center
        align: center
        
        icon:
          name: "navigation"
          size: "use variable 'icon-md'"
          color: "use variable 'surface'"
        
        text:
          margin_left: "use variable 'spacing-sm'"
          text: "NAVEGAR"
          font_size: "use variable 'font-button'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'surface'"
      
      take_button:
        flex: 1
        height: 52px
        background: "use variable 'success'"
        border_radius: "use variable 'radius-lg'"
        
        icon: "check-circle"
        text: "TOMAR CASO"
      
      derive_button:
        width: 52px
        height: 52px
        background: "use variable 'surface'"
        border: "2px solid 'text-secondary'"
        border_radius: "use variable 'radius-lg'"
        layout: center
        
        icon:
          name: "share"
          size: "use variable 'icon-md'"
          color: "use variable 'text-secondary'"
```

---

## O04 - ACTUALIZAR ESTADO

```yaml
SCREEN_ID: O04
NAME: Actualizar Estado de Alerta
TYPE: Mobile
PURPOSE: Actualizar el estado de una alerta asignada

DIMENSIONS:
  width: 375px
  height: DYNAMIC (scrollable)

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"
    scroll: ENABLED

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Actualizar Estado"
    right: "spacer_24px"

  2_MAIN_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_top: "use variable 'spacing-md'"
    padding_bottom: 120px
    
    alert_reference:
      background: "use variable 'background'"
      border_radius: "use variable 'radius-lg'"
      padding: "use variable 'spacing-md'"
      layout: row
      align: center
      
      emoji:
        text: "🚨"
        size: 28px
      
      info:
        margin_left: "use variable 'spacing-md'"
        
        type:
          text: "Robo a mano armada"
          font_size: "use variable 'font-body'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'text-primary'"
        
        alert_id:
          text: "#0145"
          font_size: "use variable 'font-caption'"
          color: "use variable 'text-secondary'"
      
      current_status:
        margin_left: auto
        layout: row
        align: center
        
        dot:
          size: 8px
          shape: circle
          background: "use variable 'warning'"
        
        text:
          margin_left: "use variable 'spacing-xs'"
          text: "En camino"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'warning'"
    
    status_section:
      margin_top: "use variable 'spacing-lg'"
      
      label:
        text: "Selecciona el nuevo estado"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
      
      status_options:
        margin_top: "use variable 'spacing-md'"
        gap: "use variable 'spacing-sm'"
        
        option_structure:
          background: "use variable 'surface'"
          border: "2px solid 'border'"
          border_radius: "use variable 'radius-lg'"
          padding: "use variable 'spacing-md'"
          layout: row
          align: center
          
          radio:
            size: 24px
            shape: circle
            border: "2px solid 'border'"
            
            selected:
              border: "2px solid '[status_color]'"
              inner_circle:
                size: 12px
                background: "[status_color]"
          
          emoji:
            size: 24px
            margin_left: "use variable 'spacing-md'"
          
          text_section:
            margin_left: "use variable 'spacing-md'"
            
            title:
              font_size: "use variable 'font-body'"
              font_weight: "use variable 'font-weight-semibold'"
              color: "use variable 'text-primary'"
            
            subtitle:
              font_size: "use variable 'font-body-small'"
              color: "use variable 'text-secondary'"
              margin_top: 2px
          
          default_state:
            border_color: "use variable 'border'"
          
          selected_state:
            border_color: "[status_color]"
            background: "[status_color] at 10% opacity"
            title_color: "[status_color]"
        
        options:
          - emoji: "🚗"
            title: "En camino"
            subtitle: "Me dirijo al lugar"
            color: "use variable 'warning'"
            state: default
          
          - emoji: "📍"
            title: "En el lugar"
            subtitle: "He llegado al sitio"
            color: "use variable 'info'"
            state: default
          
          - emoji: "🔧"
            title: "Atendiendo"
            subtitle: "Resolviendo la situación"
            color: "use variable 'primary'"
            state: default
          
          - emoji: "✅"
            title: "Resuelto"
            subtitle: "Incidente controlado"
            color: "use variable 'success'"
            state: SELECTED
    
    note_section:
      margin_top: "use variable 'spacing-lg'"
      
      label:
        text: "Nota de actualización (opcional)"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
      
      textarea:
        margin_top: "use variable 'spacing-sm'"
        width: 100%
        height: 120px
        background: "use variable 'surface'"
        border: "1px solid 'border'"
        border_radius: "use variable 'radius-lg'"
        padding: "use variable 'spacing-md'"
        placeholder: "Agrega detalles sobre el estado actual..."
        font_size: "use variable 'font-body'"
        text: "Se procedió a detener al sospechoso. La víctima fue atendida por paramédicos. Se requiere ambulancia para traslado."
      
      counter:
        margin_top: "use variable 'spacing-xs'"
        text: "156/500"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
        align: right
    
    evidence_section:
      margin_top: "use variable 'spacing-lg'"
      
      label:
        text: "Agregar evidencia (opcional)"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
      
      upload_slots:
        margin_top: "use variable 'spacing-md'"
        layout: row
        gap: "use variable 'spacing-sm'"
        
        slot_1:
          flex: 1
          height: 80px
          border_radius: "use variable 'radius-md'"
          background: "gray placeholder image"
          position: relative
          
          delete_badge:
            position: "top-right, offset -8px"
            size: 24px
            shape: circle
            background: "use variable 'error'"
            icon: "x"
            icon_color: "use variable 'surface'"
        
        slot_2:
          flex: 1
          height: 80px
          background: "'primary-light' at 20% opacity"
          border: "2px dashed 'primary'"
          border_radius: "use variable 'radius-md'"
          layout: center
          
          icon:
            name: "camera"
            size: "use variable 'icon-lg'"
            color: "use variable 'primary'"
        
        slot_3:
          flex: 1
          height: 80px
          background: "use variable 'surface'"
          border: "2px dashed 'border'"
          border_radius: "use variable 'radius-md'"
          layout: center
          
          icon:
            name: "plus"
            size: "use variable 'icon-lg'"
            color: "use variable 'text-secondary'"

  3_SUBMIT_BUTTON:
    position: fixed bottom
    background: "use variable 'surface'"
    padding: "use variable 'spacing-lg'"
    shadow: "0 -4px 12px rgba(0,0,0,0.08)"
    padding_bottom: 34px
    
    button:
      width: 100%
      height: 56px
      background: "use variable 'success'"
      border_radius: "use variable 'radius-lg'"
      shadow: "0 4px 12px 'success' at 35% opacity"
      layout: row
      justify: center
      align: center
      
      icon:
        name: "check"
        size: "use variable 'icon-md'"
        color: "use variable 'surface'"
      
      text:
        margin_left: "use variable 'spacing-sm'"
        text: "ACTUALIZAR ESTADO"
        font_size: "use variable 'font-button'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'surface'"
```

---

## O05 - DERIVAR ALERTA

```yaml
SCREEN_ID: O05
NAME: Derivar Alerta
TYPE: Mobile
PURPOSE: Derivar una alerta a otra institución

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "back_arrow"
    center: "Derivar Alerta"
    right: "spacer_24px"

  2_MAIN_CONTENT:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_top: "use variable 'spacing-md'"
    flex: 1
    
    alert_reference:
      background: "use variable 'background'"
      border_radius: "use variable 'radius-lg'"
      padding: "use variable 'spacing-md'"
      layout: row
      align: center
      
      emoji: "🚨"
      info:
        alert_id: "#0145"
        type: "Robo a mano armada"
    
    warning_banner:
      margin_top: "use variable 'spacing-md'"
      background: "'warning' at 10% opacity"
      border_left: "4px solid 'warning'"
      border_radius: "use variable 'radius-md'"
      padding: "use variable 'spacing-md'"
      layout: row
      
      icon:
        name: "alert-triangle"
        size: "use variable 'icon-md'"
        color: "use variable 'warning'"
      
      text:
        margin_left: "use variable 'spacing-sm'"
        text: "Al derivar esta alerta, dejarás de ser el responsable. Asegúrate de seleccionar la institución correcta."
        font_size: "use variable 'font-body-small'"
        color: "use variable 'text-primary'"
        line_height: 20px
    
    institution_section:
      margin_top: "use variable 'spacing-lg'"
      
      label:
        text: "Selecciona la institución"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
      
      institution_options:
        margin_top: "use variable 'spacing-md'"
        gap: "use variable 'spacing-sm'"
        
        option_structure:
          background: "use variable 'surface'"
          border: "2px solid 'border'"
          border_radius: "use variable 'radius-lg'"
          padding: "use variable 'spacing-md'"
          layout: row
          align: center
          
          radio:
            size: 24px
            shape: circle
            border: "2px solid 'border'"
          
          emoji:
            size: 28px
            margin_left: "use variable 'spacing-md'"
          
          name:
            margin_left: "use variable 'spacing-md'"
            font_size: "use variable 'font-body'"
            font_weight: "use variable 'font-weight-semibold'"
            color: "use variable 'text-primary'"
          
          disabled_state:
            opacity: 0.6
            pointer: not-allowed
          
          selected_state:
            background: "'primary-light' at 30% opacity"
            border_color: "use variable 'primary'"
            radio_filled: "use variable 'primary'"
        
        options:
          - emoji: "🚔"
            name: "PNP Atalaya"
            state: DISABLED
            note: "(Tu institución)"
          
          - emoji: "🦺"
            name: "Serenazgo"
            state: SELECTED
          
          - emoji: "🚒"
            name: "Bomberos"
            state: default
          
          - emoji: "🏥"
            name: "Centro de Salud"
            state: default
    
    reason_section:
      margin_top: "use variable 'spacing-lg'"
      
      label:
        text: "Motivo de derivación"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
      
      textarea:
        margin_top: "use variable 'spacing-sm'"
        width: 100%
        height: 120px
        background: "use variable 'surface'"
        border: "1px solid 'border'"
        border_radius: "use variable 'radius-lg'"
        padding: "use variable 'spacing-md'"
        placeholder: "Explica brevemente por qué derivas esta alerta..."
        font_size: "use variable 'font-body'"
      
      helper:
        margin_top: "use variable 'spacing-xs'"
        text: "Este mensaje será visible para la institución receptora"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
    
    summary_card:
      margin_top: "use variable 'spacing-lg'"
      background: "'success' at 10% opacity"
      border_radius: "use variable 'radius-lg'"
      padding: "use variable 'spacing-md'"
      layout: row
      align: center
      
      icon:
        name: "arrow-right"
        size: "use variable 'icon-lg'"
        color: "use variable 'success'"
      
      text:
        margin_left: "use variable 'spacing-md'"
        text: "Se derivará a: 🦺 Serenazgo"
        font_size: "use variable 'font-body'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'success'"

  3_BOTTOM_BUTTONS:
    padding_horizontal: "use variable 'spacing-lg'"
    padding_bottom: "use variable 'spacing-xl'"
    margin_top: auto
    
    buttons_row:
      layout: row
      gap: "use variable 'spacing-md'"
      
      cancel_button:
        flex: 1
        component: "[USE COMPONENT: BUTTON_SECONDARY]"
        text: "Cancelar"
        border_color: "use variable 'text-secondary'"
        text_color: "use variable 'text-secondary'"
      
      confirm_button:
        flex: 1
        component: "[USE COMPONENT: BUTTON_PRIMARY]"
        text: "Confirmar"

  4_BOTTOM_SAFE_AREA:
    height: 34px
```

---

## O06 - HISTORIAL DE ATENCIONES

```yaml
SCREEN_ID: O06
NAME: Historial de Atenciones
TYPE: Mobile
PURPOSE: Ver historial de alertas atendidas por el operador

DIMENSIONS:
  width: 375px
  height: DYNAMIC

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"

LAYOUT:

  1_HEADER:
    component: "[USE COMPONENT: HEADER_MOBILE]"
    left: "menu_icon"
    center: "Historial"
    right: "filter_icon"

  2_SCROLLABLE_CONTENT:
    padding_bottom: 100px
    
    stats_card:
      margin: "use variable 'spacing-md'" "use variable 'spacing-lg'"
      background: "linear gradient from 'primary' to 'primary-dark'"
      border_radius: "use variable 'radius-xl'"
      padding: "use variable 'spacing-lg'"
      layout: row
      justify: space-around
      
      stat_1:
        layout: vertical
        align: center
        
        number:
          text: "47"
          font_size: "use variable 'font-h2'"
          font_weight: "use variable 'font-weight-bold'"
          color: "use variable 'surface'"
        
        label:
          text: "Atenciones"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'surface' at 80% opacity"
          margin_top: "use variable 'spacing-xs'"
      
      divider:
        width: 1px
        height: 50px
        background: "use variable 'surface' at 30% opacity"
      
      stat_2:
        layout: vertical
        align: center
        
        rating_row:
          layout: row
          align: center
          
          number:
            text: "4.5"
            font_size: "use variable 'font-h2'"
            font_weight: "use variable 'font-weight-bold'"
            color: "use variable 'surface'"
          
          star:
            icon: "star"
            size: "use variable 'icon-md'"
            color: "use variable 'warning'"
            margin_left: "use variable 'spacing-xs'"
        
        label:
          text: "Calificación"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'surface' at 80% opacity"
    
    month_section:
      padding_horizontal: "use variable 'spacing-lg'"
      
      section_header:
        margin_top: "use variable 'spacing-lg'"
        text: "ENERO 2026"
        font_size: "use variable 'font-caption'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'text-secondary'"
        letter_spacing: 1px
      
      history_cards:
        margin_top: "use variable 'spacing-md'"
        gap: "use variable 'spacing-sm'"
        
        card_structure:
          component: "[USE COMPONENT: CARD]"
          variant: "with_accent"
          accent_color: "[status_color]"
          padding: "use variable 'spacing-md'"
          
          top_row:
            layout: row
            align: center
            
            status_icon:
              size: 20px
              color: "[status_color]"
            
            badge:
              margin_left: "use variable 'spacing-sm'"
              component: "[USE COMPONENT: BADGE]"
              text: "[alert_id]"
              color: "use variable 'text-secondary'"
            
            type:
              margin_left: "use variable 'spacing-sm'"
              font_size: "use variable 'font-body'"
              font_weight: "use variable 'font-weight-semibold'"
              color: "use variable 'text-primary'"
          
          bottom_row:
            margin_top: "use variable 'spacing-sm'"
            layout: row
            justify: space-between
            align: center
            
            date:
              font_size: "use variable 'font-body-small'"
              color: "use variable 'text-secondary'"
            
            rating_stars:
              layout: row
              gap: 2px
              
              star:
                size: 18px
                filled_color: "use variable 'warning'"
                empty_color: "use variable 'border'"
          
          derived_badge:
            # Only for derived alerts
            position: "top-right"
            background: "'warning' at 15% opacity"
            border_radius: "use variable 'radius-sm'"
            padding: "spacing-xs" "spacing-sm"
            text: "Derivado"
            font_size: "use variable 'font-caption'"
            color: "use variable 'warning'"
        
        cards:
          - alert_id: "#0140"
            type: "Accidente de tránsito"
            status_color: "use variable 'success'"
            status_icon: "check-circle"
            date: "23 Ene, 16:45"
            rating: 5
          
          - alert_id: "#0138"
            type: "Robo a mano armada"
            status_color: "use variable 'success'"
            date: "22 Ene, 09:30"
            rating: 4
          
          - alert_id: "#0135"
            type: "Emergencia médica"
            status_color: "use variable 'success'"
            date: "20 Ene, 14:15"
            rating: 5
          
          - alert_id: "#0132"
            type: "Incendio"
            status_color: "use variable 'warning'"
            status_icon: "share"
            date: "18 Ene, 11:00"
            derived: true
      
      load_more:
        margin_top: "use variable 'spacing-lg'"
        align: center
        layout: row
        justify: center
        
        text:
          text: "Ver más"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-medium'"
          color: "use variable 'primary'"
        
        icon:
          name: "chevron-down"
          size: "use variable 'icon-sm'"
          color: "use variable 'primary'"
          margin_left: "use variable 'spacing-xs'"

  3_BOTTOM_NAV:
    component: "[USE COMPONENT: BOTTOM_NAV_OPERATOR]"
    active_tab: "Historial"
```

---

## O07 - PERFIL OPERADOR

```yaml
SCREEN_ID: O07
NAME: Perfil Operador
TYPE: Mobile
PURPOSE: Ver y gestionar perfil del operador

DIMENSIONS:
  width: 375px
  height: DYNAMIC (scrollable)

STRUCTURE:
  container:
    clip_content: ENABLED
    layout: vertical
    background: "use variable 'background'"
    border_radius: "use variable 'radius-xl'"
    scroll: ENABLED

LAYOUT:

  1_HEADER_PROFILE:
    background: "linear gradient from 'primary' to 'primary-dark'"
    padding_top: 44px
    padding_bottom: "use variable 'spacing-xl'"
    padding_horizontal: "use variable 'spacing-lg'"
    border_radius_bottom: "use variable 'radius-xl'"
    
    top_row:
      layout: row
      justify: space-between
      
      back_button:
        icon: "arrow-left"
        size: "use variable 'icon-lg'"
        color: "use variable 'surface'"
      
      title:
        text: "Mi Perfil"
        font_size: "use variable 'font-h4'"
        font_weight: "use variable 'font-weight-semibold'"
        color: "use variable 'surface'"
      
      settings_button:
        icon: "settings"
        size: "use variable 'icon-lg'"
        color: "use variable 'surface'"
    
    avatar_section:
      margin_top: "use variable 'spacing-xl'"
      align: center
      
      avatar:
        size: 88px
        shape: circle
        background: "use variable 'surface'"
        border: "4px solid 'surface'"
        shadow: "use variable 'shadow-lg'"
        layout: center
        emoji: "👮"
        emoji_size: 44px
      
      name:
        margin_top: "use variable 'spacing-md'"
        text: "Juan Carlos Pérez"
        font_size: "use variable 'font-h3'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'surface'"
      
      dni:
        margin_top: "use variable 'spacing-xs'"
        text: "DNI: 45678912"
        font_size: "use variable 'font-body-small'"
        color: "use variable 'surface' at 80% opacity"
      
      institution_badge:
        margin_top: "use variable 'spacing-md'"
        background: "use variable 'surface' at 20% opacity"
        border_radius: "use variable 'radius-full'"
        padding_vertical: "use variable 'spacing-sm'"
        padding_horizontal: "use variable 'spacing-md'"
        layout: row
        align: center
        
        emoji: "🚔"
        text:
          margin_left: "use variable 'spacing-sm'"
          text: "PNP Atalaya"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'surface'"

  2_INFO_SECTION:
    margin_top: "use variable 'spacing-lg'"
    padding_horizontal: "use variable 'spacing-lg'"
    
    section_title:
      text: "INFORMACIÓN"
      font_size: "use variable 'font-caption'"
      font_weight: "use variable 'font-weight-bold'"
      color: "use variable 'text-secondary'"
      letter_spacing: 1px
    
    info_cards:
      margin_top: "use variable 'spacing-md'"
      background: "use variable 'surface'"
      border_radius: "use variable 'radius-lg'"
      shadow: "use variable 'shadow-md'"
      overflow: hidden
      
      row_structure:
        padding: "use variable 'spacing-md'"
        layout: row
        align: center
        border_bottom: "1px solid 'border'"
        
        icon_container:
          size: 40px
          shape: circle
          background: "[icon_color] at 15% opacity"
          layout: center
          icon_size: "use variable 'icon-md'"
          icon_color: "[icon_color]"
        
        info:
          margin_left: "use variable 'spacing-md'"
          
          label:
            font_size: "use variable 'font-caption'"
            color: "use variable 'text-secondary'"
          
          value:
            font_size: "use variable 'font-body'"
            font_weight: "use variable 'font-weight-semibold'"
            color: "use variable 'text-primary'"
      
      rows:
        - icon: "building"
          icon_color: "use variable 'primary'"
          label: "Institución"
          value: "PNP Atalaya"
        
        - icon: "envelope"
          icon_color: "use variable 'success'"
          label: "Email"
          value: "juan.perez@pnp.gob.pe"
        
        - icon: "phone"
          icon_color: "use variable 'warning'"
          label: "Celular"
          value: "987 654 321"
        
        - icon: "calendar"
          icon_color: "#E91E63"
          label: "Miembro desde"
          value: "Enero 2024"
          border_bottom: none

  3_STATS_SECTION:
    margin_top: "use variable 'spacing-lg'"
    padding_horizontal: "use variable 'spacing-lg'"
    
    section_title:
      text: "ESTADÍSTICAS"
    
    stats_row:
      margin_top: "use variable 'spacing-md'"
      layout: row
      gap: "use variable 'spacing-md'"
      
      stat_card:
        flex: 1
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-lg'"
        padding: "use variable 'spacing-md'"
        shadow: "use variable 'shadow-md'"
        layout: vertical
        align: center
        
        number:
          font_size: "use variable 'font-h2'"
          font_weight: "use variable 'font-weight-bold'"
          color: "[accent_color]"
        
        label:
          font_size: "use variable 'font-caption'"
          color: "use variable 'text-secondary'"
          margin_top: "use variable 'spacing-xs'"
      
      stats:
        - number: "156"
          label: "Casos totales"
          accent_color: "use variable 'primary'"
        
        - number: "4.7"
          label: "Calificación"
          accent_color: "use variable 'warning'"
          icon: "star"

  4_ACTIONS_SECTION:
    margin_top: "use variable 'spacing-lg'"
    padding_horizontal: "use variable 'spacing-lg'"
    
    section_title:
      text: "OPCIONES"
    
    action_cards:
      margin_top: "use variable 'spacing-md'"
      background: "use variable 'surface'"
      border_radius: "use variable 'radius-lg'"
      shadow: "use variable 'shadow-md'"
      overflow: hidden
      
      rows:
        - icon: "settings"
          text: "Configuración"
          chevron: true
        
        - icon: "help-circle"
          text: "Ayuda y soporte"
          chevron: true
        
        - icon: "log-out"
          text: "Cerrar Sesión"
          color: "use variable 'error'"
          border_bottom: none

  5_APP_VERSION:
    margin_top: "use variable 'spacing-lg'"
    padding_bottom: "use variable 'spacing-lg'"
    align: center
    
    text: "SAVIA Operador v1.0.0"
    font_size: "use variable 'font-caption'"
    color: "use variable 'text-secondary'"

  6_BOTTOM_NAV:
    component: "[USE COMPONENT: BOTTOM_NAV_OPERATOR]"
    active_tab: "Perfil"
```

---

# PARTE 5: PANTALLAS WEB ADMIN (W01-W10 - 10 pantallas)

## W01 - LOGIN ADMINISTRADOR

```yaml
SCREEN_ID: W01
NAME: Login Administrador
TYPE: Web Desktop
PURPOSE: Inicio de sesión para administradores del sistema

DIMENSIONS:
  width: 1440px
  height: 900px (min)

STRUCTURE:
  layout: centered card on gradient background

LAYOUT:

  1_BACKGROUND:
    width: 100%
    height: 100vh
    background: "linear gradient from 'primary' to 'primary-dark'"
    
  2_LOGIN_CARD:
    position: center
    width: 440px
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"
    shadow: "use variable 'shadow-xl'"
    padding: "use variable 'spacing-2xl'"
    
    logo_section:
      align: center
      
      logo_container:
        width: 80px
        height: 80px
        shape: circle
        background: "use variable 'primary' at 10% opacity"
        layout: center
        
        logo_icon:
          size: 48px
          image: "SAVIA logo or shield icon"
          color: "use variable 'primary'"
      
      app_name:
        margin_top: "use variable 'spacing-md'"
        text: "SAVIA"
        font_size: "use variable 'font-h1'"
        font_weight: "use variable 'font-weight-bold'"
        color: "use variable 'primary'"
        letter_spacing: 2px
      
      subtitle:
        margin_top: "use variable 'spacing-xs'"
        text: "Panel de Administración"
        font_size: "use variable 'font-body'"
        color: "use variable 'text-secondary'"
    
    form_section:
      margin_top: "use variable 'spacing-xl'"
      
      email_field:
        label:
          text: "Correo electrónico"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-medium'"
          color: "use variable 'text-primary'"
        
        input:
          margin_top: "use variable 'spacing-xs'"
          width: 100%
          height: 48px
          background: "use variable 'background'"
          border_radius: "use variable 'radius-md'"
          border: "1px solid 'border'"
          padding_horizontal: "use variable 'spacing-md'"
          icon_left: "envelope"
          icon_color: "use variable 'text-secondary'"
          placeholder: "admin@savia.gob.pe"
          font_size: "use variable 'font-body'"
          focus_border: "2px solid 'primary'"
      
      password_field:
        margin_top: "use variable 'spacing-md'"
        
        label:
          text: "Contraseña"
        
        input:
          type: password
          icon_left: "lock"
          icon_right: "eye" # toggle visibility
          placeholder: "••••••••"
    
    options_row:
      margin_top: "use variable 'spacing-md'"
      layout: row
      justify: space-between
      align: center
      
      remember_checkbox:
        layout: row
        align: center
        
        checkbox:
          size: 18px
          border_radius: "use variable 'radius-sm'"
          border: "2px solid 'border'"
          checked_background: "use variable 'primary'"
          checked_icon: "check"
          checked_icon_color: "use variable 'surface'"
        
        label:
          margin_left: "use variable 'spacing-sm'"
          text: "Recordarme"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-secondary'"
      
      forgot_link:
        text: "¿Olvidaste tu contraseña?"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'primary'"
    
    login_button:
      margin_top: "use variable 'spacing-xl'"
      width: 100%
      height: 52px
      background: "use variable 'primary'"
      border_radius: "use variable 'radius-md'"
      shadow: "0 4px 12px 'primary' at 40% opacity"
      text: "INGRESAR"
      font_size: "use variable 'font-button'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'surface'"
      hover_background: "use variable 'primary-dark'"
    
    footer:
      margin_top: "use variable 'spacing-xl'"
      align: center
      
      text_1:
        text: "Sistema de Gestión de Alertas Vecinales"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
      
      text_2:
        margin_top: "use variable 'spacing-xs'"
        text: "COPROSEC Atalaya © 2026"
        font_size: "use variable 'font-caption'"
        color: "use variable 'border'"
```

---

## W02 - DASHBOARD PRINCIPAL

```yaml
SCREEN_ID: W02
NAME: Dashboard Principal
TYPE: Web Desktop
PURPOSE: Vista general del sistema para administradores

DIMENSIONS:
  width: 1440px
  height: DYNAMIC

STRUCTURE:
  layout: sidebar + main
  sidebar_active: "Dashboard"

LAYOUT:

  1_SIDEBAR:
    component: "[USE COMPONENT: WEB_SIDEBAR]"
    active_item: "Dashboard"

  2_MAIN_CONTENT:
    margin_left: 260px # sidebar width
    
    header:
      component: "[USE COMPONENT: WEB_HEADER]"
      title: "Dashboard"
      breadcrumb: "Inicio / Dashboard"
    
    content:
      padding: "use variable 'spacing-xl'"
      background: "use variable 'background'"
      
      date_row:
        layout: row
        justify: space-between
        
        label:
          text: "ALERTAS HOY"
          font_size: "use variable 'font-caption'"
          font_weight: "use variable 'font-weight-bold'"
          color: "use variable 'text-secondary'"
          letter_spacing: 1px
        
        date:
          layout: row
          align: center
          
          icon:
            name: "calendar"
            size: "use variable 'icon-sm'"
            color: "use variable 'text-secondary'"
          
          text:
            margin_left: "use variable 'spacing-xs'"
            text: "24 Enero 2026"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-medium'"
            color: "use variable 'text-secondary'"
      
      stats_cards:
        margin_top: "use variable 'spacing-md'"
        layout: row
        gap: "use variable 'spacing-lg'"
        
        card_structure:
          flex: 1
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          
          icon_container:
            size: 48px
            border_radius: "use variable 'radius-lg'"
            layout: center
            background: "[accent_color] at 15% opacity"
            icon_color: "[accent_color]"
          
          number:
            margin_top: "use variable 'spacing-md'"
            font_size: 36px
            font_weight: "use variable 'font-weight-bold'"
            color: "use variable 'text-primary'"
          
          label:
            margin_top: "use variable 'spacing-xs'"
            font_size: "use variable 'font-body-small'"
            color: "use variable 'text-secondary'"
          
          trend:
            margin_top: "use variable 'spacing-sm'"
            font_size: "use variable 'font-caption'"
            font_weight: "use variable 'font-weight-medium'"
        
        cards:
          - icon: "clipboard-list"
            accent: "use variable 'primary'"
            number: "45"
            label: "Total Alertas"
            trend: "↑ 15% vs ayer"
            trend_color: "use variable 'success'"
          
          - icon: "clock"
            accent: "use variable 'warning'"
            number: "12"
            label: "Pendientes"
            trend: "↓ 3"
            trend_color: "use variable 'success'"
          
          - icon: "check-circle"
            accent: "use variable 'success'"
            number: "28"
            label: "Resueltas"
            trend: "↑ 10"
            trend_color: "use variable 'success'"
          
          - icon: "alert-triangle"
            accent: "use variable 'error'"
            number: "5"
            label: "Críticas"
            trend: "↑ 2"
            trend_color: "use variable 'error'"
      
      map_section:
        margin_top: "use variable 'spacing-lg'"
        
        header_row:
          layout: row
          justify: space-between
          align: center
          
          title:
            text: "MAPA EN TIEMPO REAL"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-semibold'"
            color: "use variable 'text-primary'"
          
          refresh_button:
            layout: row
            align: center
            background: transparent
            
            icon:
              name: "refresh-cw"
              size: "use variable 'icon-sm'"
              color: "use variable 'primary'"
            
            text:
              margin_left: "use variable 'spacing-xs'"
              text: "Actualizar"
              font_size: "use variable 'font-body-small'"
              color: "use variable 'primary'"
        
        map_container:
          margin_top: "use variable 'spacing-md'"
          width: 100%
          height: 320px
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          shadow: "use variable 'shadow-md'"
          overflow: hidden
          
          map_content:
            background: "map placeholder"
            markers:
              red: "critical alerts"
              yellow: "in attention"
              green: "resolved"
          
          legend:
            position: bottom
            padding: "use variable 'spacing-md'"
            layout: row
            gap: "use variable 'spacing-lg'"
            
            legend_item:
              layout: row
              align: center
              
              dot:
                size: 10px
                shape: circle
              
              text:
                margin_left: "use variable 'spacing-xs'"
                font_size: "use variable 'font-body-small'"
                color: "use variable 'text-secondary'"
            
            items:
              - color: "use variable 'urgency-critical'"
                text: "Crítica (5)"
              - color: "use variable 'warning'"
                text: "En atención (8)"
              - color: "use variable 'success'"
                text: "Resuelta (28)"
      
      recent_alerts_section:
        margin_top: "use variable 'spacing-lg'"
        
        header_row:
          layout: row
          justify: space-between
          
          title:
            text: "ALERTAS ACTIVAS"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-semibold'"
          
          link:
            text: "Ver todas →"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-medium'"
            color: "use variable 'primary'"
        
        table_container:
          margin_top: "use variable 'spacing-md'"
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          shadow: "use variable 'shadow-md'"
          overflow: hidden
          
          table_header:
            background: "use variable 'background'"
            padding: "use variable 'spacing-md'" "use variable 'spacing-lg'"
            layout: row
            
            columns:
              font_size: "use variable 'font-caption'"
              font_weight: "use variable 'font-weight-semibold'"
              color: "use variable 'text-secondary'"
              
              items:
                - text: "#"
                  width: 80px
                - text: "Tipo"
                  width: 180px
                - text: "Ubicación"
                  flex: 1
                - text: "Estado"
                  width: 140px
                - text: "Tiempo"
                  width: 100px
                - text: "Acciones"
                  width: 100px
          
          table_rows:
            row_structure:
              padding: "use variable 'spacing-md'" "use variable 'spacing-lg'"
              border_bottom: "1px solid 'border'"
              layout: row
              align: center
              hover_background: "use variable 'background'"
              
              cell_id:
                font_size: "use variable 'font-body-small'"
                font_weight: "use variable 'font-weight-medium'"
                color: "use variable 'primary'"
              
              cell_type:
                layout: row
                align: center
                emoji: "[emoji]"
                text:
                  margin_left: "use variable 'spacing-sm'"
                  font_size: "use variable 'font-body-small'"
              
              cell_location:
                font_size: "use variable 'font-body-small'"
                color: "use variable 'text-primary'"
              
              cell_status:
                component: "[USE COMPONENT: BADGE]"
              
              cell_time:
                font_size: "use variable 'font-body-small'"
                color: "use variable 'text-secondary'"
              
              cell_actions:
                layout: row
                gap: "use variable 'spacing-sm'"
                
                icon_button:
                  size: "use variable 'icon-md'"
                  color: "use variable 'text-secondary'"
                  hover_color: "use variable 'primary'"
            
            rows:
              - id: "0145"
                emoji: "🚨"
                type: "Robo"
                location: "Av. Atalaya 234"
                status: {text: "En Atención", color: "warning"}
                time: "5 min"
              
              - id: "0144"
                emoji: "🚗"
                type: "Accidente"
                location: "Jr. Lima 567"
                status: {text: "Reportada", color: "info"}
                time: "12 min"
              
              - id: "0143"
                emoji: "🏥"
                type: "Médica"
                location: "Av. Ucayali 890"
                status: {text: "En Atención", color: "warning"}
                time: "18 min"
```

---

## W03 - GESTIÓN DE ALERTAS

```yaml
SCREEN_ID: W03
NAME: Gestión de Alertas
TYPE: Web Desktop
PURPOSE: Administrar todas las alertas del sistema

DIMENSIONS:
  width: 1440px
  height: DYNAMIC

STRUCTURE:
  layout: sidebar + main
  sidebar_active: "Alertas"

LAYOUT:

  1_SIDEBAR:
    component: "[USE COMPONENT: WEB_SIDEBAR]"
    active_item: "Alertas"

  2_MAIN_CONTENT:
    margin_left: 260px
    
    header:
      component: "[USE COMPONENT: WEB_HEADER]"
      title: "Gestión de Alertas"
      breadcrumb: "Inicio / Alertas"
    
    content:
      padding: "use variable 'spacing-xl'"
      
      filters_section:
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-xl'"
        padding: "use variable 'spacing-lg'"
        shadow: "use variable 'shadow-md'"
        
        filters_row:
          layout: row
          align: center
          gap: "use variable 'spacing-md'"
          
          search_input:
            width: 300px
            height: 44px
            background: "use variable 'background'"
            border_radius: "use variable 'radius-md'"
            border: none
            icon_left: "search"
            placeholder: "Buscar por ID, ubicación..."
          
          dropdown_type:
            width: 160px
            height: 44px
            background: "use variable 'background'"
            border_radius: "use variable 'radius-md'"
            text: "Tipo ▼"
            font_size: "use variable 'font-body-small'"
          
          dropdown_status:
            width: 160px
            text: "Estado ▼"
          
          dropdown_date:
            width: 160px
            text: "Fecha ▼"
          
          filter_button:
            width: 100px
            height: 44px
            background: "use variable 'primary'"
            border_radius: "use variable 'radius-md'"
            text: "Filtrar"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-semibold'"
            color: "use variable 'surface'"
          
          clear_link:
            layout: row
            align: center
            
            icon:
              name: "x"
              size: "use variable 'icon-sm'"
              color: "use variable 'text-secondary'"
            
            text:
              text: "Limpiar"
              font_size: "use variable 'font-body-small'"
              font_weight: "use variable 'font-weight-medium'"
              color: "use variable 'text-secondary'"
      
      results_row:
        margin_top: "use variable 'spacing-md'"
        layout: row
        justify: space-between
        align: center
        
        count:
          text: "Mostrando 156 alertas"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-secondary'"
        
        view_toggle:
          layout: row
          gap: "use variable 'spacing-sm'"
          
          icon_grid:
            icon: "grid"
            size: "use variable 'icon-md'"
            color: "use variable 'text-secondary'"
          
          icon_list:
            icon: "list"
            size: "use variable 'icon-md'"
            color: "use variable 'primary'"
      
      data_table:
        margin_top: "use variable 'spacing-md'"
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-xl'"
        shadow: "use variable 'shadow-md'"
        overflow: hidden
        
        table_header:
          background: "use variable 'background'"
          height: 56px
          padding_horizontal: "use variable 'spacing-lg'"
          layout: row
          align: center
          
          columns:
            - checkbox: {width: 40px}
            - text: "ID", width: 80px, sortable: true
            - text: "Tipo", width: 150px, sortable: true
            - text: "Ubicación", flex: 1
            - text: "Urgencia", width: 120px, sortable: true
            - text: "Estado", width: 140px, sortable: true
            - text: "Fecha", width: 140px, sortable: true
            - text: "Acciones", width: 100px
        
        table_rows:
          row_height: 64px
          hover_background: "use variable 'background'"
          border_bottom: "1px solid 'border'"
          
          rows:
            - checkbox: unchecked
              id: "#0145"
              id_color: "use variable 'primary'"
              emoji: "🚨"
              type: "Robo/Asalto"
              location: "Av. Atalaya 234"
              urgency: {text: "Crítica", color: "urgency-critical"}
              status: {text: "En Atención", color: "warning"}
              date: "24 Ene, 14:30"
              actions: ["eye", "edit"]
            
            - id: "#0144"
              emoji: "🚗"
              type: "Accidente"
              location: "Jr. Lima 567"
              urgency: {text: "Alta", color: "urgency-high"}
              status: {text: "Reportada", color: "info"}
              date: "24 Ene, 14:18"
            
            - id: "#0143"
              emoji: "🏥"
              type: "Emergencia médica"
              urgency: {text: "Alta", color: "urgency-high"}
              status: {text: "En Atención", color: "warning"}
            
            - id: "#0142"
              emoji: "🔥"
              type: "Incendio"
              urgency: {text: "Crítica", color: "urgency-critical"}
              status: {text: "Resuelta", color: "success"}
            
            - id: "#0141"
              emoji: "⚡"
              type: "Falla eléctrica"
              urgency: {text: "Media", color: "urgency-medium"}
              status: {text: "Cerrada", color: "text-secondary"}
            
            - id: "#0140"
              emoji: "💧"
              type: "Problema agua"
              urgency: {text: "Baja", color: "urgency-low"}
              status: {text: "Resuelta", color: "success"}
      
      pagination:
        margin_top: "use variable 'spacing-lg'"
        layout: row
        justify: space-between
        align: center
        
        info:
          text: "Mostrando 1-10 de 156"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-secondary'"
        
        controls:
          layout: row
          gap: "use variable 'spacing-xs'"
          
          page_button:
            size: 36px
            border_radius: "use variable 'radius-md'"
            font_size: "use variable 'font-body-small'"
            
            default: {background: "surface", color: "text-primary"}
            active: {background: "primary", color: "surface"}
            disabled: {opacity: 0.5}
          
          pages:
            - text: "◄", disabled: true
            - text: "1", active: true
            - text: "2"
            - text: "3"
            - text: "..."
            - text: "16"
            - text: "►"
```

---

## W04 - DETALLE DE ALERTA (ADMIN)

```yaml
SCREEN_ID: W04
NAME: Detalle de Alerta - Admin
TYPE: Web Desktop
PURPOSE: Ver detalle completo de una alerta con acciones administrativas

DIMENSIONS:
  width: 1440px
  height: DYNAMIC

STRUCTURE:
  layout: sidebar + main (2-column)
  sidebar_active: "Alertas"

LAYOUT:

  1_SIDEBAR:
    component: "[USE COMPONENT: WEB_SIDEBAR]"
    active_item: "Alertas"

  2_MAIN_CONTENT:
    margin_left: 260px
    
    header:
      height: 72px
      background: "use variable 'surface'"
      shadow: "use variable 'shadow-sm'"
      padding_horizontal: "use variable 'spacing-xl'"
      layout: row
      justify: space-between
      align: center
      
      left:
        layout: row
        align: center
        
        back_button:
          icon: "arrow-left"
          size: "use variable 'icon-lg'"
          color: "use variable 'text-primary'"
        
        title:
          margin_left: "use variable 'spacing-md'"
          text: "Alerta #0145"
          font_size: "use variable 'font-h2'"
          font_weight: "use variable 'font-weight-semibold'"
        
        breadcrumb:
          margin_left: "use variable 'spacing-lg'"
          text: "Inicio / Alertas / #0145"
          font_size: "use variable 'font-caption'"
          color: "use variable 'text-secondary'"
      
      right:
        layout: row
        gap: "use variable 'spacing-sm'"
        
        reassign_button:
          component: "[USE COMPONENT: BUTTON_SECONDARY]"
          height: 40px
          text: "Reasignar"
        
        edit_button:
          component: "[USE COMPONENT: BUTTON_SECONDARY]"
          height: 40px
          text: "Editar"
    
    content:
      padding: "use variable 'spacing-xl'"
      layout: row
      gap: "use variable 'spacing-lg'"
      
      left_column:
        flex: 0.6
        
        alert_header_card:
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          border_left: "6px solid 'urgency-critical'"
          
          top_row:
            layout: row
            justify: space-between
            align: start
            
            left:
              layout: row
              
              icon_container:
                size: 64px
                background: "'urgency-critical' at 15% opacity"
                border_radius: "use variable 'radius-xl'"
                layout: center
                emoji: "🚨"
                emoji_size: 36px
              
              info:
                margin_left: "use variable 'spacing-lg'"
                
                type:
                  text: "ROBO/ASALTO"
                  font_size: "use variable 'font-h2'"
                  font_weight: "use variable 'font-weight-bold'"
                  color: "use variable 'text-primary'"
                
                id:
                  text: "#ALT-2026-0145"
                  font_size: "use variable 'font-body-small'"
                  color: "use variable 'text-secondary'"
                  margin_top: "use variable 'spacing-xs'"
            
            right:
              layout: vertical
              align: end
              
              urgency_badge:
                background: "use variable 'urgency-critical'"
                border_radius: "use variable 'radius-md'"
                padding: "spacing-sm" "spacing-md"
                text: "CRÍTICA"
                font_size: "use variable 'font-caption'"
                font_weight: "use variable 'font-weight-bold'"
                color: "use variable 'surface'"
              
              status_badge:
                margin_top: "use variable 'spacing-sm'"
                component: "[USE COMPONENT: BADGE]"
                variant: "with_dot"
                color: "use variable 'warning'"
                text: "En Atención"
          
          description:
            margin_top: "use variable 'spacing-lg'"
            
            label:
              text: "Descripción"
              font_size: "use variable 'font-caption'"
              font_weight: "use variable 'font-weight-semibold'"
              color: "use variable 'text-secondary'"
            
            text_container:
              margin_top: "use variable 'spacing-sm'"
              background: "use variable 'background'"
              padding: "use variable 'spacing-md'"
              border_radius: "use variable 'radius-md'"
              
              text:
                font_size: "use variable 'font-body'"
                color: "use variable 'text-primary'"
                line_height: 24px
        
        map_card:
          margin_top: "use variable 'spacing-lg'"
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          
          label:
            text: "📍 Ubicación"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-semibold'"
          
          map:
            margin_top: "use variable 'spacing-sm'"
            height: 250px
            border_radius: "use variable 'radius-lg'"
            background: "map placeholder with red pin"
          
          address:
            margin_top: "use variable 'spacing-sm'"
            text: "Av. Atalaya 234, Atalaya, Ucayali"
            font_size: "use variable 'font-body'"
            font_weight: "use variable 'font-weight-medium'"
          
          coordinates:
            text: "-10.7312, -73.7565"
            font_size: "use variable 'font-body-small'"
            color: "use variable 'text-secondary'"
          
          link:
            margin_top: "use variable 'spacing-sm'"
            text: "Abrir en Google Maps"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-medium'"
            color: "use variable 'primary'"
        
        evidence_card:
          margin_top: "use variable 'spacing-lg'"
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          
          label:
            text: "📷 Evidencia (2 archivos)"
          
          images:
            margin_top: "use variable 'spacing-sm'"
            layout: row
            gap: "use variable 'spacing-sm'"
            
            thumbnail:
              size: 160x120px
              border_radius: "use variable 'radius-md'"
      
      right_column:
        flex: 0.4
        
        reporter_card:
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          
          label:
            text: "REPORTADO POR"
            font_size: "use variable 'font-caption'"
            font_weight: "use variable 'font-weight-bold'"
            color: "use variable 'text-secondary'"
          
          user_info:
            margin_top: "use variable 'spacing-md'"
            
            avatar:
              size: 56px
              shape: circle
              background: "use variable 'primary-light'"
              text: "EM"
              text_color: "use variable 'primary'"
            
            name:
              margin_top: "use variable 'spacing-md'"
              text: "Edwin Wilson Méndez"
              font_size: "use variable 'font-body'"
              font_weight: "use variable 'font-weight-semibold'"
            
            dni:
              text: "DNI: 12345678"
              font_size: "use variable 'font-body-small'"
              color: "use variable 'text-secondary'"
            
            phone:
              text: "987 654 321"
            
            date:
              text: "24 Ene 2026, 14:30"
          
          contact_button:
            margin_top: "use variable 'spacing-md'"
            component: "[USE COMPONENT: BUTTON_SECONDARY]"
            icon: "phone"
            text: "Contactar"
            width: 100%
        
        responder_card:
          margin_top: "use variable 'spacing-md'"
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          
          label:
            text: "ATENDIDO POR"
          
          operator_info:
            avatar_emoji: "👮"
            name: "Juan Carlos Pérez"
            institution: "PNP Atalaya"
            badge: "Operador"
            assigned: "24 Ene 2026, 14:35"
          
          buttons:
            layout: row
            gap: "use variable 'spacing-sm'"
            
            reassign:
              text: "Reasignar"
            
            contact:
              text: "Contactar"
        
        timeline_card:
          margin_top: "use variable 'spacing-md'"
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          
          label:
            text: "🕐 HISTORIAL"
          
          timeline:
            margin_top: "use variable 'spacing-md'"
            component: "[USE COMPONENT: TIMELINE]"
            
            items:
              - status: completed
                title: "Reportada"
                time: "14:30"
                description: "Por ciudadano"
              
              - status: completed
                title: "En Atención"
                time: "14:35"
                description: "Tomado por Juan Pérez"
              
              - status: pending
                title: "Pendiente resolución"
```

---


## W05 - GESTIÓN DE INSTITUCIONES

```yaml
SCREEN_ID: W05
NAME: Gestión de Instituciones
TYPE: Web Desktop
PURPOSE: Administrar instituciones de respuesta a emergencias

DIMENSIONS:
  width: 1440px
  height: DYNAMIC

STRUCTURE:
  layout: sidebar + main
  sidebar_active: "Instituciones"

LAYOUT:

  1_SIDEBAR:
    component: "[USE COMPONENT: WEB_SIDEBAR]"
    active_item: "Instituciones"

  2_MAIN_CONTENT:
    margin_left: 260px
    
    header:
      component: "[USE COMPONENT: WEB_HEADER]"
      title: "Gestión de Instituciones"
      breadcrumb: "Inicio / Instituciones"
      
      action_button:
        position: right
        background: "use variable 'primary'"
        border_radius: "use variable 'radius-md'"
        padding: "spacing-sm" "spacing-lg"
        layout: row
        align: center
        
        icon:
          name: "plus"
          size: "use variable 'icon-sm'"
          color: "use variable 'surface'"
        
        text:
          margin_left: "use variable 'spacing-sm'"
          text: "Nueva Institución"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-semibold'"
          color: "use variable 'surface'"
    
    content:
      padding: "use variable 'spacing-xl'"
      
      stats_row:
        layout: row
        gap: "use variable 'spacing-lg'"
        
        stat_card:
          flex: 1
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-lg'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          layout: vertical
          align: center
          
          emoji:
            size: 32px
          
          number:
            margin_top: "use variable 'spacing-sm'"
            font_size: "use variable 'font-h3'"
            font_weight: "use variable 'font-weight-bold'"
            color: "use variable 'text-primary'"
          
          label:
            font_size: "use variable 'font-body-small'"
            color: "use variable 'text-secondary'"
        
        stats:
          - emoji: "🚔"
            number: "1"
            label: "PNP"
          
          - emoji: "🦺"
            number: "1"
            label: "Serenazgo"
          
          - emoji: "🚒"
            number: "1"
            label: "Bomberos"
          
          - emoji: "🏥"
            number: "1"
            label: "Salud"
      
      filters_row:
        margin_top: "use variable 'spacing-lg'"
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-lg'"
        padding: "spacing-md" "spacing-lg"
        shadow: "use variable 'shadow-md'"
        layout: row
        gap: "use variable 'spacing-md'"
        
        search:
          width: 300px
          height: 44px
          background: "use variable 'background'"
          border_radius: "use variable 'radius-md'"
          icon_left: "search"
          placeholder: "Buscar institución..."
        
        type_dropdown:
          text: "Tipo ▼"
        
        status_dropdown:
          text: "Estado ▼"
      
      table:
        margin_top: "use variable 'spacing-md'"
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-xl'"
        shadow: "use variable 'shadow-md'"
        overflow: hidden
        
        header:
          background: "use variable 'background'"
          columns:
            - checkbox
            - "Nombre"
            - "Tipo"
            - "Teléfono"
            - "Dirección"
            - "Estado"
            - "Acciones"
        
        rows:
          - name: "PNP Atalaya"
            type: {emoji: "🚔", text: "PNP", color: "primary"}
            phone: "065-123456"
            address: "Av. Principal 123"
            status: {text: "Activo", color: "success"}
            actions: ["eye", "edit", "trash"]
          
          - name: "Serenazgo Atalaya"
            type: {emoji: "🦺", text: "Serenazgo", color: "success"}
            phone: "065-234567"
            address: "Jr. Lima 456"
            status: "Activo"
          
          - name: "Bomberos Voluntarios Atalaya"
            type: {emoji: "🚒", text: "Bomberos", color: "warning"}
            phone: "065-345678"
            address: "Av. Central 789"
            status: "Activo"
          
          - name: "Centro de Salud Atalaya"
            type: {emoji: "🏥", text: "Salud", color: "#E91E63"}
            phone: "065-456789"
            address: "Jr. Salud 101"
            status: "Activo"
          
          - name: "Defensa Civil Atalaya"
            type: {emoji: "🛡️", text: "Otro", color: "text-secondary"}
            phone: "065-567890"
            address: "Av. Defensa 202"
            status: {text: "Inactivo", color: "error"}
```

---

## W06 - MODAL CREAR/EDITAR INSTITUCIÓN

```yaml
SCREEN_ID: W06
NAME: Modal Crear/Editar Institución
TYPE: Web Modal
PURPOSE: Formulario para crear o editar una institución

DIMENSIONS:
  modal_width: 560px
  modal_height: DYNAMIC

STRUCTURE:
  overlay:
    background: "'text-primary' at 60% opacity"
    blur: optional
  
  modal:
    position: center
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"
    shadow: "0 24px 48px rgba(0,0,0,0.2)"
    overflow: hidden

LAYOUT:

  1_MODAL_HEADER:
    background: "use variable 'surface'"
    padding: "use variable 'spacing-lg'"
    border_bottom: "1px solid 'border'"
    layout: row
    justify: space-between
    align: center
    
    title:
      text: "Nueva Institución"
      font_size: "use variable 'font-h4'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'text-primary'"
    
    close_button:
      size: 36px
      shape: circle
      background: "use variable 'background'"
      icon: "x"
      icon_size: "use variable 'icon-md'"
      icon_color: "use variable 'text-secondary'"
      hover:
        background: "'error' at 15% opacity"
        icon_color: "use variable 'error'"

  2_MODAL_BODY:
    padding: "use variable 'spacing-lg'"
    max_height: 70vh
    overflow_y: auto
    
    name_field:
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Nombre de la institución *"
      placeholder: "Ej: PNP Atalaya"
    
    type_dropdown:
      margin_top: "use variable 'spacing-md'"
      label: "Tipo de institución *"
      height: 48px
      background: "use variable 'surface'"
      border: "1px solid 'border'"
      border_radius: "use variable 'radius-md'"
      selected: "🚔 PNP"
      options:
        - "🚔 PNP"
        - "🦺 Serenazgo"
        - "🚒 Bomberos"
        - "🏥 Salud"
        - "🛡️ Otro"
    
    two_column_row:
      margin_top: "use variable 'spacing-md'"
      layout: row
      gap: "use variable 'spacing-md'"
      
      phone_field:
        flex: 1
        component: "[USE COMPONENT: INPUT_FIELD]"
        label: "Teléfono"
        icon_left: "phone"
        placeholder: "065-123456"
      
      email_field:
        flex: 1
        component: "[USE COMPONENT: INPUT_FIELD]"
        label: "Email"
        icon_left: "envelope"
        placeholder: "contacto@institucion.gob.pe"
    
    address_field:
      margin_top: "use variable 'spacing-md'"
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Dirección"
      icon_left: "map-pin"
      placeholder: "Av. Principal 123, Atalaya"
    
    hours_field:
      margin_top: "use variable 'spacing-md'"
      component: "[USE COMPONENT: INPUT_FIELD]"
      label: "Horario de atención"
      icon_left: "clock"
      value: "24 horas"
    
    alert_types_section:
      margin_top: "use variable 'spacing-lg'"
      
      label:
        text: "Tipos de alerta que atiende *"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
        color: "use variable 'text-primary'"
      
      subtitle:
        margin_top: "use variable 'spacing-xs'"
        text: "Selecciona los tipos de emergencia que esta institución puede atender"
        font_size: "use variable 'font-caption'"
        color: "use variable 'text-secondary'"
      
      checkbox_grid:
        margin_top: "use variable 'spacing-sm'"
        layout: grid
        columns: 2
        gap: "use variable 'spacing-sm'"
        
        checkbox_item:
          height: 44px
          background: "use variable 'background'"
          border_radius: "use variable 'radius-md'"
          padding_horizontal: "use variable 'spacing-md'"
          layout: row
          align: center
          
          checkbox:
            size: 20px
            border: "2px solid 'border'"
            border_radius: "use variable 'radius-sm'"
            checked:
              background: "use variable 'primary'"
              icon: "checkmark"
              icon_color: "use variable 'surface'"
          
          label:
            margin_left: "use variable 'spacing-sm'"
            font_size: "use variable 'font-body-small'"
        
        items:
          - emoji: "🚨"
            text: "Robo/Asalto"
            checked: true
          
          - emoji: "🚗"
            text: "Accidente tránsito"
            checked: true
          
          - emoji: "🏥"
            text: "Emergencia médica"
            checked: false
          
          - emoji: "🔥"
            text: "Incendio"
            checked: false
          
          - emoji: "⚡"
            text: "Falla eléctrica"
            checked: false
          
          - emoji: "💧"
            text: "Problema de agua"
            checked: false
          
          - emoji: "🔍"
            text: "Pérdida/Hallazgo"
            checked: true
          
          - emoji: "❓"
            text: "Otro"
            checked: true
    
    status_field:
      margin_top: "use variable 'spacing-lg'"
      
      label:
        text: "Estado"
        font_size: "use variable 'font-body-small'"
        font_weight: "use variable 'font-weight-medium'"
      
      radio_row:
        margin_top: "use variable 'spacing-sm'"
        layout: row
        gap: "use variable 'spacing-lg'"
        
        radio_active:
          layout: row
          align: center
          
          radio:
            size: 20px
            border: "2px solid 'success'"
            background: "use variable 'success'"
            inner_dot: "surface"
          
          label:
            margin_left: "use variable 'spacing-sm'"
            text: "Activo"
            color: "use variable 'success'"
        
        radio_inactive:
          radio:
            border: "2px solid 'border'"
            background: transparent
          label:
            text: "Inactivo"
            color: "use variable 'text-primary'"

  3_MODAL_FOOTER:
    background: "use variable 'background'"
    padding: "spacing-md" "spacing-lg"
    border_top: "1px solid 'border'"
    layout: row
    justify: end
    gap: "use variable 'spacing-sm'"
    
    cancel_button:
      width: 120px
      height: 48px
      background: "use variable 'surface'"
      border: "1px solid 'border'"
      border_radius: "use variable 'radius-md'"
      text: "Cancelar"
      font_size: "use variable 'font-body'"
      font_weight: "use variable 'font-weight-medium'"
      color: "use variable 'text-secondary'"
    
    save_button:
      width: 140px
      height: 48px
      background: "use variable 'primary'"
      border_radius: "use variable 'radius-md'"
      text: "Guardar"
      font_size: "use variable 'font-body'"
      font_weight: "use variable 'font-weight-semibold'"
      color: "use variable 'surface'"
      shadow: "0 4px 12px 'primary' at 30% opacity"
```

---

## W07 - GESTIÓN DE USUARIOS

```yaml
SCREEN_ID: W07
NAME: Gestión de Usuarios
TYPE: Web Desktop
PURPOSE: Administrar usuarios del sistema (ciudadanos, operadores, admins)

DIMENSIONS:
  width: 1440px
  height: DYNAMIC

STRUCTURE:
  layout: sidebar + main
  sidebar_active: "Usuarios"

LAYOUT:

  1_SIDEBAR:
    component: "[USE COMPONENT: WEB_SIDEBAR]"
    active_item: "Usuarios"

  2_MAIN_CONTENT:
    margin_left: 260px
    
    header:
      component: "[USE COMPONENT: WEB_HEADER]"
      title: "Gestión de Usuarios"
      breadcrumb: "Inicio / Usuarios"
      action_button:
        text: "+ Nuevo Usuario"
        background: "use variable 'primary'"
    
    content:
      padding: "use variable 'spacing-xl'"
      
      tab_bar:
        background: "use variable 'surface'"
        border_radius: "radius-lg" "radius-lg" 0 0
        padding_horizontal: "use variable 'spacing-lg'"
        border_bottom: "1px solid 'border'"
        
        tabs:
          layout: row
          
          tab_structure:
            padding: "spacing-md" "spacing-lg"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-medium'"
            
            badge:
              margin_left: "use variable 'spacing-xs'"
              min_width: 24px
              height: 20px
              border_radius: "use variable 'radius-full'"
              font_size: 10px
            
            active_state:
              color: "use variable 'primary'"
              border_bottom: "3px solid 'primary'"
              badge_background: "'primary-light'"
              badge_color: "use variable 'primary'"
            
            default_state:
              color: "use variable 'text-secondary'"
              badge_background: "use variable 'background'"
              badge_color: "use variable 'text-secondary'"
          
          items:
            - text: "Todos"
              badge: "234"
              state: ACTIVE
            
            - text: "Operadores"
              badge: "12"
            
            - text: "Ciudadanos"
              badge: "218"
            
            - text: "Administradores"
              badge: "4"
      
      filters_row:
        background: "use variable 'surface'"
        padding: "spacing-md" "spacing-lg"
        border_bottom: "1px solid 'border'"
        layout: row
        gap: "use variable 'spacing-md'"
        
        search:
          width: 320px
          placeholder: "Buscar por nombre, DNI o email..."
        
        role_dropdown:
          text: "Rol ▼"
        
        status_dropdown:
          text: "Estado ▼"
        
        filter_button:
          text: "Filtrar"
          background: "use variable 'primary'"
        
        export_button:
          icon: "download"
          text: "Exportar"
          background: "use variable 'surface'"
          border: "1px solid 'border'"
      
      table:
        background: "use variable 'surface'"
        border_radius: "0 0 'radius-xl' 'radius-xl'"
        shadow: "use variable 'shadow-md'"
        
        header:
          columns:
            - checkbox
            - "Usuario" (wide)
            - "DNI"
            - "Email"
            - "Rol"
            - "Institución"
            - "Estado"
            - "Acciones"
        
        rows:
          row_structure:
            user_column:
              layout: row
              align: center
              
              avatar:
                size: 40px
                shape: circle
              
              info:
                margin_left: "use variable 'spacing-md'"
                
                name:
                  font_size: "use variable 'font-body-small'"
                  font_weight: "use variable 'font-weight-semibold'"
                
                registered:
                  font_size: "use variable 'font-caption'"
                  color: "use variable 'text-secondary'"
          
          data:
            - avatar: {emoji: "👮", bg: "primary-light"}
              name: "Juan Carlos Pérez"
              registered: "Registrado: 15 Ene 2024"
              dni: "45678912"
              email: "juan.perez@pnp.gob.pe"
              role: {text: "Operador", color: "primary"}
              institution: "PNP Atalaya"
              status: {dot_color: "success", text: "Activo"}
            
            - avatar: {emoji: "👮"}
              name: "María Elena García"
              dni: "78901234"
              email: "maria.garcia@serenazgo.gob.pe"
              role: "Operador"
              institution: "Serenazgo Atalaya"
              status: "Activo"
            
            - avatar: {initials: "EM", bg: "primary-light"}
              name: "Edwin Wilson Méndez"
              dni: "12345678"
              email: "edwin.mendez@email.com"
              role: {text: "Ciudadano", color: "text-secondary"}
              institution: "—"
              status: "Activo"
            
            - avatar: {initials: "AL"}
              name: "Ana María López"
              dni: "34567890"
              role: "Ciudadano"
              status: {dot_color: "error", text: "Inactivo"}
            
            - avatar: {emoji: "👔", bg: "warning at 15%"}
              name: "Carlos Alberto Admin"
              dni: "11111111"
              email: "carlos.admin@savia.gob.pe"
              role: {text: "Administrador", color: "warning"}
              institution: "COPROSEC"
              status: "Activo"
            
            - avatar: {emoji: "👮"}
              name: "Pedro Rodríguez"
              role: "Operador"
              institution: "Bomberos Atalaya"
      
      pagination:
        text: "Mostrando 1-10 de 234"
        pages: [1, 2, 3, "...", 24]
```

---

## W08 - MODAL CREAR/EDITAR USUARIO OPERADOR

```yaml
SCREEN_ID: W08
NAME: Modal Crear/Editar Usuario Operador
TYPE: Web Modal
PURPOSE: Formulario para crear o editar un usuario operador

DIMENSIONS:
  modal_width: 520px
  modal_height: DYNAMIC

STRUCTURE:
  overlay: "'text-primary' at 60% opacity"
  modal:
    background: "use variable 'surface'"
    border_radius: "use variable 'radius-xl'"
    shadow: "0 24px 48px rgba(0,0,0,0.2)"

LAYOUT:

  1_MODAL_HEADER:
    padding: "use variable 'spacing-lg'"
    border_bottom: "1px solid 'border'"
    layout: row
    align: center
    
    icon_container:
      size: 48px
      shape: circle
      background: "use variable 'primary-light'"
      layout: center
      emoji: "👮"
    
    text:
      margin_left: "use variable 'spacing-md'"
      
      title:
        text: "Nuevo Usuario Operador"
        font_size: "use variable 'font-h4'"
        font_weight: "use variable 'font-weight-semibold'"
      
      subtitle:
        text: "Crear cuenta para personal de respuesta"
        font_size: "use variable 'font-body-small'"
        color: "use variable 'text-secondary'"
    
    close_button:
      position: "top-right"
      size: 36px
      icon: "x"

  2_MODAL_BODY:
    padding: "use variable 'spacing-lg'"
    
    row_dni_celular:
      layout: row
      gap: "use variable 'spacing-md'"
      
      dni_field:
        flex: 1
        component: "[USE COMPONENT: INPUT_FIELD]"
        label: "DNI *"
        icon_left: "id-card"
        value: "45678912"
        helper: "8 dígitos"
      
      celular_field:
        flex: 1
        label: "Celular *"
        icon_left: "phone"
        placeholder: "987654321"
        helper: "9 dígitos"
    
    row_names:
      margin_top: "use variable 'spacing-md'"
      layout: row
      gap: "use variable 'spacing-md'"
      
      nombres_field:
        flex: 1
        label: "Nombres *"
        icon_left: "user"
        value: "Juan Carlos"
      
      apellidos_field:
        flex: 1
        label: "Apellidos *"
        value: "Pérez López"
    
    email_field:
      margin_top: "use variable 'spacing-md'"
      width: 100%
      label: "Correo electrónico *"
      icon_left: "envelope"
      value: "juan.perez@pnp.gob.pe"
    
    institution_dropdown:
      margin_top: "use variable 'spacing-md'"
      label: "Institución asignada *"
      icon_left: "building"
      selected: "🚔 PNP Atalaya"
    
    row_role_status:
      margin_top: "use variable 'spacing-md'"
      layout: row
      gap: "use variable 'spacing-md'"
      
      role_dropdown:
        flex: 1
        label: "Rol *"
        selected: "👮 Operador"
      
      status_radios:
        flex: 1
        label: "Estado"
        layout: row
        gap: "use variable 'spacing-lg'"
        
        active: {selected: true, color: "success"}
        inactive: {selected: false}
    
    email_credentials:
      margin_top: "use variable 'spacing-lg'"
      background: "'primary-light' at 30% opacity"
      border_radius: "use variable 'radius-md'"
      padding: "use variable 'spacing-md'"
      
      checkbox:
        checked: true
        label:
          text: "Enviar credenciales por email"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-medium'"
          color: "use variable 'primary'"
        
        subtitle:
          text: "El usuario recibirá un correo con instrucciones para acceder"
          font_size: "use variable 'font-caption'"
          color: "use variable 'text-secondary'"

  3_MODAL_FOOTER:
    background: "use variable 'background'"
    padding: "spacing-md" "spacing-lg"
    layout: row
    justify: end
    gap: "use variable 'spacing-sm'"
    
    cancel_button:
      text: "Cancelar"
      style: outline
    
    create_button:
      icon_left: "user-plus"
      text: "Crear Usuario"
      background: "use variable 'primary'"
```

---

## W09 - GESTIÓN DE CATEGORÍAS

```yaml
SCREEN_ID: W09
NAME: Gestión de Categorías
TYPE: Web Desktop
PURPOSE: Administrar categorías de alertas con drag-and-drop

DIMENSIONS:
  width: 1440px
  height: DYNAMIC

STRUCTURE:
  layout: sidebar + main
  sidebar_active: "Categorías"

LAYOUT:

  1_SIDEBAR:
    component: "[USE COMPONENT: WEB_SIDEBAR]"
    active_item: "Categorías"

  2_MAIN_CONTENT:
    margin_left: 260px
    
    header:
      component: "[USE COMPONENT: WEB_HEADER]"
      title: "Categorías de Alerta"
      breadcrumb: "Inicio / Categorías"
      action_button:
        text: "+ Nueva Categoría"
    
    content:
      padding: "use variable 'spacing-xl'"
      
      info_banner:
        background: "'primary-light' at 30% opacity"
        border_radius: "use variable 'radius-lg'"
        padding: "spacing-md" "spacing-lg"
        border_left: "4px solid 'primary'"
        layout: row
        align: center
        
        icon:
          name: "info"
          size: "use variable 'icon-lg'"
          color: "use variable 'primary'"
        
        text:
          margin_left: "use variable 'spacing-sm'"
          text: "Arrastra las filas para cambiar el orden de visualización en la aplicación"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'primary-dark'"
      
      table:
        margin_top: "use variable 'spacing-lg'"
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-xl'"
        shadow: "use variable 'shadow-md'"
        overflow: hidden
        
        header:
          columns:
            - {text: "⋮⋮", width: 40px}
            - {text: "Icono", width: 80px}
            - {text: "Nombre", width: 200px}
            - {text: "Nombre Corto", width: 120px}
            - {text: "Color", width: 120px}
            - {text: "Orden", width: 80px}
            - {text: "Estado", width: 100px}
            - {text: "Acciones", width: 100px}
        
        rows:
          row_structure:
            height: 64px
            hover: {background: "background", show_drag_handle: true}
            dragging: {shadow: "shadow-lg", opacity: 0.9}
            
            drag_handle:
              icon: "grip-vertical"
              color: "use variable 'border'"
            
            emoji:
              size: 32px
            
            name:
              font_size: "use variable 'font-body'"
              font_weight: "use variable 'font-weight-semibold'"
            
            short_name:
              font_size: "use variable 'font-body-small'"
              color: "use variable 'text-secondary'"
            
            color_swatch:
              size: 24px
              shape: circle
              border_radius: "use variable 'radius-full'"
            
            color_hex:
              font_size: "use variable 'font-caption'"
              font_family: monospace
              color: "use variable 'text-secondary'"
            
            order_badge:
              background: "use variable 'background'"
              border_radius: "use variable 'radius-sm'"
              padding: "spacing-xs" "spacing-sm"
            
            status_badge:
              text: "Activo"
              color: "use variable 'success'"
            
            actions:
              icons: ["edit", "trash"]
          
          data:
            - emoji: "🚨"
              name: "Robo/Asalto"
              short_name: "Robo"
              color: "#D32F2F"
              order: 1
            
            - emoji: "🚗"
              name: "Accidente de tránsito"
              short_name: "Accidente"
              color: "#F57C00"
              order: 2
            
            - emoji: "🏥"
              name: "Emergencia médica"
              short_name: "Médica"
              color: "#E91E63"
              order: 3
            
            - emoji: "🔥"
              name: "Incendio"
              short_name: "Incendio"
              color: "#FF5722"
              order: 4
            
            - emoji: "⚡"
              name: "Falla eléctrica"
              short_name: "Eléctrica"
              color: "#FFC107"
              order: 5
            
            - emoji: "💧"
              name: "Problema de agua"
              short_name: "Agua"
              color: "#2196F3"
              order: 6
            
            - emoji: "🔍"
              name: "Pérdida/Hallazgo"
              short_name: "Pérdida"
              color: "#9C27B0"
              order: 7
            
            - emoji: "❓"
              name: "Otro"
              short_name: "Otro"
              color: "#607D8B"
              order: 8
      
      save_order_button:
        margin_top: "use variable 'spacing-lg'"
        align: right
        visibility: "only when order changed"
        background: "use variable 'success'"
        border_radius: "use variable 'radius-md'"
        padding: "spacing-sm" "spacing-lg"
        icon: "check"
        text: "Guardar Orden"
        color: "use variable 'surface'"
      
      footer_info:
        margin_top: "use variable 'spacing-md'"
        text: "Total: 8 categorías · 8 activas · 0 inactivas"
        font_size: "use variable 'font-body-small'"
        color: "use variable 'text-secondary'"
```

---

## W10 - REPORTES ESTADÍSTICOS

```yaml
SCREEN_ID: W10
NAME: Reportes Estadísticos
TYPE: Web Desktop
PURPOSE: Ver reportes y estadísticas del sistema

DIMENSIONS:
  width: 1440px
  height: DYNAMIC

STRUCTURE:
  layout: sidebar + main
  sidebar_active: "Reportes"

LAYOUT:

  1_SIDEBAR:
    component: "[USE COMPONENT: WEB_SIDEBAR]"
    active_item: "Reportes"

  2_MAIN_CONTENT:
    margin_left: 260px
    
    header:
      component: "[USE COMPONENT: WEB_HEADER]"
      title: "Reportes Estadísticos"
      breadcrumb: "Inicio / Reportes"
      
      export_buttons:
        layout: row
        gap: "use variable 'spacing-sm'"
        
        pdf_button:
          icon: "file-text"
          text: "Exportar PDF"
          style: outline
        
        excel_button:
          icon: "table"
          text: "Exportar Excel"
          style: outline
    
    content:
      padding: "use variable 'spacing-xl'"
      
      date_filter:
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-lg'"
        padding: "spacing-md" "spacing-lg"
        shadow: "use variable 'shadow-md'"
        layout: row
        align: center
        gap: "use variable 'spacing-md'"
        
        label:
          text: "Período:"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-medium'"
        
        date_from:
          width: 150px
          height: 44px
          value: "01/01/2026"
          icon_right: "calendar"
        
        separator:
          text: "a"
        
        date_to:
          width: 150px
          value: "24/01/2026"
        
        generate_button:
          text: "Generar Reporte"
          background: "use variable 'primary'"
        
        quick_filters:
          layout: row
          gap: "use variable 'spacing-xs'"
          
          chip:
            background: "use variable 'background'"
            border_radius: "use variable 'radius-full'"
            padding: "spacing-xs" "spacing-md"
            font_size: "use variable 'font-body-small'"
            color: "use variable 'text-secondary'"
            
            selected:
              background: "use variable 'primary-light'"
              color: "use variable 'primary'"
          
          options:
            - "Hoy"
            - "Esta semana"
            - "Este mes" (selected)
            - "Este año"
      
      kpi_cards:
        margin_top: "use variable 'spacing-lg'"
        layout: row
        gap: "use variable 'spacing-lg'"
        
        card_structure:
          flex: 1
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          
          icon_container:
            size: 56px
            shape: circle
            background: "[accent] at 15% opacity"
            icon_color: "[accent]"
          
          number:
            margin_top: "use variable 'spacing-md'"
            font_size: 40px
            font_weight: "use variable 'font-weight-bold'"
            color: "use variable 'text-primary'"
          
          label:
            font_size: "use variable 'font-body-small'"
            color: "use variable 'text-secondary'"
          
          trend:
            margin_top: "use variable 'spacing-sm'"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-medium'"
        
        cards:
          - icon: "clipboard-list"
            accent: "primary"
            number: "132"
            label: "Total Alertas"
            trend: "↑ 23% vs mes anterior"
            trend_color: "success"
          
          - icon: "clock"
            accent: "warning"
            number: "15 min"
            label: "Tiempo Promedio Respuesta"
            trend: "↓ 3 min mejor"
            trend_color: "success"
          
          - icon: "check-circle"
            accent: "success"
            number: "89%"
            label: "Tasa de Resolución"
            trend: "↑ 5% vs mes anterior"
          
          - icon: "star"
            accent: "warning"
            number: "4.5"
            label: "Satisfacción Usuarios"
            trend: "= sin cambio"
            trend_color: "text-secondary"
      
      charts_row_1:
        margin_top: "use variable 'spacing-lg'"
        layout: row
        gap: "use variable 'spacing-lg'"
        
        chart_by_type:
          flex: 1
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          
          title:
            text: "ALERTAS POR TIPO"
            font_size: "use variable 'font-body-small'"
            font_weight: "use variable 'font-weight-semibold'"
          
          chart:
            type: horizontal_bar
            margin_top: "use variable 'spacing-lg'"
            
            bars:
              - label: "🚨 Robo"
                value: 45
                color: "urgency-critical"
              
              - label: "🚗 Accidente"
                value: 32
                color: "urgency-high"
              
              - label: "🏥 Médica"
                value: 28
                color: "alert-medical"
              
              - label: "🔥 Incendio"
                value: 15
                color: "alert-fire"
              
              - label: "Otros"
                value: 12
                color: "alert-other"
        
        chart_trend:
          flex: 1
          background: "use variable 'surface'"
          border_radius: "use variable 'radius-xl'"
          padding: "use variable 'spacing-lg'"
          shadow: "use variable 'shadow-md'"
          
          title:
            text: "TENDENCIA DIARIA (Enero 2026)"
          
          chart:
            type: line
            line_color: "primary"
            fill_color: "'primary-light' at 30% opacity"
            x_axis: [1, 5, 10, 15, 20, 24]
            y_axis: [0, 4, 8, 12]
            annotation: "Pico: 12 alertas (día 8)"
      
      charts_row_2:
        margin_top: "use variable 'spacing-lg'"
        layout: row
        gap: "use variable 'spacing-lg'"
        
        chart_by_status:
          flex: 1
          
          title: "DISTRIBUCIÓN POR ESTADO"
          
          chart:
            type: donut
            center_text: "132 Total"
            
            segments:
              - label: "Resueltas"
                value: 89
                percentage: "67%"
                color: "success"
              
              - label: "En Atención"
                value: 28
                percentage: "21%"
                color: "warning"
              
              - label: "Reportadas"
                value: 10
                percentage: "8%"
                color: "info"
              
              - label: "Cerradas"
                value: 5
                percentage: "4%"
                color: "text-secondary"
        
        chart_by_institution:
          flex: 1
          
          title: "ATENCIONES POR INSTITUCIÓN"
          
          chart:
            type: vertical_bar
            
            bars:
              - label: "PNP Atalaya"
                value: 58
                color: "primary"
              
              - label: "Serenazgo"
                value: 42
                color: "success"
              
              - label: "Bomberos"
                value: 18
                color: "warning"
              
              - label: "Salud"
                value: 14
                color: "alert-medical"
      
      heat_map_section:
        margin_top: "use variable 'spacing-lg'"
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-xl'"
        padding: "use variable 'spacing-lg'"
        shadow: "use variable 'shadow-md'"
        
        title:
          text: "MAPA DE CALOR - ZONAS CRÍTICAS"
          font_size: "use variable 'font-body-small'"
          font_weight: "use variable 'font-weight-semibold'"
        
        subtitle:
          text: "Concentración de alertas por ubicación"
          font_size: "use variable 'font-body-small'"
          color: "use variable 'text-secondary'"
        
        map:
          margin_top: "use variable 'spacing-md'"
          height: 300px
          border_radius: "use variable 'radius-lg'"
          
          heat_overlay:
            intense_zones: red/orange
            medium_zones: yellow
            low_zones: green/blue
          
          legend:
            layout: row
            gradient: "Alta densidad (red) → Baja densidad (green)"
      
      top_locations:
        margin_top: "use variable 'spacing-lg'"
        background: "use variable 'surface'"
        border_radius: "use variable 'radius-xl'"
        padding: "use variable 'spacing-lg'"
        shadow: "use variable 'shadow-md'"
        
        title:
          text: "TOP 5 UBICACIONES CON MÁS ALERTAS"
        
        table:
          margin_top: "use variable 'spacing-md'"
          
          columns:
            - "#"
            - "Ubicación"
            - "Alertas"
            - "% del Total"
          
          rows:
            - rank: 1
              location: "Av. Atalaya (cuadra 2-5)"
              alerts: 23
              percentage: "17.4%"
            
            - rank: 2
              location: "Jr. Lima (mercado)"
              alerts: 18
              percentage: "13.6%"
            
            - rank: 3
              location: "Av. Principal"
              alerts: 15
              percentage: "11.4%"
            
            - rank: 4
              location: "Jr. Ucayali"
              alerts: 12
              percentage: "9.1%"
            
            - rank: 5
              location: "Plaza de Armas"
              alerts: 9
              percentage: "6.8%"
```

---

# ✅ FIN DEL DOCUMENTO

## RESUMEN DE PANTALLAS

| MÓDULO | CÓDIGO | NOMBRE | TIPO |
|--------|--------|--------|------|
| **CIUDADANO** | C01 | Splash Screen | Mobile |
| | C02 | Login | Mobile |
| | C03 | Registro | Mobile |
| | C04 | Recuperar Contraseña | Mobile |
| | C05 | Home Ciudadano | Mobile |
| | C06 | Nueva Alerta - Tipo | Mobile |
| | C07 | Nueva Alerta - Descripción | Mobile |
| | C08 | Nueva Alerta - Ubicación | Mobile |
| | C09 | Nueva Alerta - Confirmación | Mobile |
| | C10 | Alerta Enviada (Success) | Mobile |
| | C11 | Mis Alertas (Lista) | Mobile |
| | C12 | Detalle de Mi Alerta | Mobile |
| | C13 | Calificar Atención | Mobile |
| | C14 | Mapa Alertas Cercanas | Mobile |
| | C15 | Perfil Ciudadano | Mobile |
| | C16 | Notificaciones | Mobile |
| **OPERADOR** | O01 | Home Operador | Mobile |
| | O02 | Alertas Asignadas | Mobile |
| | O03 | Detalle Alerta (Operador) | Mobile |
| | O04 | Actualizar Estado | Mobile |
| | O05 | Derivar Alerta | Mobile |
| | O06 | Historial de Atenciones | Mobile |
| | O07 | Perfil Operador | Mobile |
| **ADMIN WEB** | W01 | Login Admin | Desktop |
| | W02 | Dashboard Principal | Desktop |
| | W03 | Gestión de Alertas | Desktop |
| | W04 | Detalle de Alerta (Admin) | Desktop |
| | W05 | Gestión de Instituciones | Desktop |
| | W06 | Modal Crear/Editar Institución | Modal |
| | W07 | Gestión de Usuarios | Desktop |
| | W08 | Modal Crear/Editar Usuario | Modal |
| | W09 | Gestión de Categorías | Desktop |
| | W10 | Reportes Estadísticos | Desktop |

**TOTAL: 33 PANTALLAS**

---

## NOTAS FINALES

1. **SIEMPRE usar variables del theme** - Nunca hardcodear valores
2. **Altura DINÁMICA** - Solo el ancho es fijo (375px mobile, 1440px desktop)
3. **Componentes reutilizables** - Referenciar siempre con `[USE COMPONENT: ...]`
4. **Consistencia en bordes** - Todos usan el mismo sistema de radius
5. **Safe areas** - Siempre respetar en mobile (44px top, 34px bottom)

---

*Documento generado para SAVIA - Sistema de Alertas Vecinales Integrado de Atalaya*
*Universidad Continental - Taller de Proyectos I*
*Enero 2026*
