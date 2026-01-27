# 📋 PRODUCT REQUIREMENTS DOCUMENT (PRD)
# SAVIA - Sistema de Alertas Vecinales Integrado de Atalaya

---

## 📑 TABLA DE CONTENIDOS

1. [Información General](#1-información-general)
2. [Visión y Objetivos](#2-visión-y-objetivos)
3. [Contexto del Problema](#3-contexto-del-problema)
4. [Alcance del Proyecto](#4-alcance-del-proyecto)
5. [Usuarios y Stakeholders](#5-usuarios-y-stakeholders)
6. [Requerimientos Funcionales](#6-requerimientos-funcionales)
7. [Requerimientos No Funcionales](#7-requerimientos-no-funcionales)
8. [Historias de Usuario](#8-historias-de-usuario)
9. [Arquitectura Técnica](#9-arquitectura-técnica)
10. [Modelo de Datos](#10-modelo-de-datos)
11. [APIs y Endpoints](#11-apis-y-endpoints)
12. [Diseño de Interfaces](#12-diseño-de-interfaces)
13. [Plan de Desarrollo](#13-plan-de-desarrollo)
14. [Criterios de Aceptación](#14-criterios-de-aceptación)
15. [Riesgos y Mitigaciones](#15-riesgos-y-mitigaciones)
16. [Métricas de Éxito](#16-métricas-de-éxito)
17. [Glosario](#17-glosario)

---

# 1. INFORMACIÓN GENERAL

## 1.1 Datos del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre del Proyecto** | SAVIA - Sistema de Alertas Vecinales Integrado de Atalaya |
| **Versión del Documento** | 1.0 |
| **Fecha de Creación** | 27 de Enero de 2026 |
| **Última Actualización** | 27 de Enero de 2026 |
| **Autor** | Edwin Wilson Méndez Echevarría |
| **Curso** | Taller de Proyectos I (9no Periodo) |
| **Universidad** | Universidad Continental |
| **Docente** | Oscar Edgardo Rios Cassana |
| **Carrera** | Ingeniería de Sistemas e Informática |

## 1.2 Control de Versiones del Documento

| Versión | Fecha | Autor | Descripción del Cambio |
|---------|-------|-------|------------------------|
| 0.1 | 15/01/2026 | Edwin Méndez | Borrador inicial |
| 0.5 | 20/01/2026 | Edwin Méndez | Definición de requisitos |
| 1.0 | 27/01/2026 | Edwin Méndez | Versión completa para PA2 |

## 1.3 Aprobaciones

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Product Owner | Edwin Méndez | _____________ | ___/___/2026 |
| Stakeholder Principal | COPROSEC Atalaya | _____________ | ___/___/2026 |
| Asesor Académico | Oscar Rios | _____________ | ___/___/2026 |

---

# 2. VISIÓN Y OBJETIVOS

## 2.1 Declaración de Visión

> **"Ser el sistema de referencia para la gestión de emergencias vecinales en Atalaya, transformando la comunicación ciudadana de métodos informales a un sistema georeferenciado, trazable y eficiente que salve vidas y proteja a la comunidad."**

## 2.2 Problema a Resolver

Actualmente, la comunicación de emergencias en Atalaya se realiza a través del grupo de WhatsApp "Emergencias Atalaya" (~900 miembros), lo cual presenta múltiples deficiencias:

- **Sin georreferenciación**: No se puede ubicar exactamente dónde ocurre la emergencia
- **Sin trazabilidad**: No hay registro de quién atendió, cuándo ni cómo se resolvió
- **Información desordenada**: Los mensajes se pierden entre conversaciones irrelevantes
- **Sin métricas**: No hay datos para análisis ni mejora del servicio
- **Sin asignación formal**: Las instituciones no tienen un mecanismo claro de derivación

## 2.3 Propuesta de Solución

SAVIA propone un ecosistema de tres componentes integrados:

```
┌─────────────────────────────────────────────────────────────────┐
│                        ECOSISTEMA SAVIA                         │
├─────────────────┬─────────────────────┬─────────────────────────┤
│   📱 APP MÓVIL  │   📱 APP MÓVIL      │   💻 PANEL WEB          │
│   CIUDADANO     │   OPERADOR          │   ADMINISTRADOR         │
├─────────────────┼─────────────────────┼─────────────────────────┤
│ • Reportar      │ • Ver alertas       │ • Dashboard             │
│   emergencias   │   asignadas         │ • Gestión completa      │
│ • Ver alertas   │ • Tomar casos       │ • Reportes              │
│   cercanas      │ • Actualizar        │ • Configuración         │
│ • Seguimiento   │   estados           │ • Usuarios              │
│ • Calificar     │ • Derivar           │ • Instituciones         │
│   atención      │ • Navegar           │ • Categorías            │
└─────────────────┴─────────────────────┴─────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │    FIREBASE     │
                    │    (Backend)    │
                    └─────────────────┘
```

## 2.4 Objetivos del Proyecto

### Objetivo General
Desarrollar un sistema integral de gestión de alertas vecinales que permita a los ciudadanos de Atalaya reportar emergencias de manera georreferenciada y a las instituciones de seguridad atenderlas de forma eficiente y trazable.

### Objetivos Específicos

| # | Objetivo | Métrica de Éxito | Plazo |
|---|----------|------------------|-------|
| O1 | Digitalizar el proceso de reporte de emergencias | 100% de alertas con coordenadas GPS | MVP1 |
| O2 | Reducir tiempo de respuesta a emergencias | Tiempo promedio < 15 minutos | MVP2 |
| O3 | Proporcionar trazabilidad completa de cada caso | 100% de alertas con historial completo | MVP1 |
| O4 | Generar métricas para toma de decisiones | Dashboard con 10+ KPIs | MVP3 |
| O5 | Mejorar satisfacción ciudadana | Rating promedio > 4.0/5.0 | MVP2 |

## 2.5 Beneficios Esperados

### Para Ciudadanos
- Reporte de emergencias en < 60 segundos
- Ubicación automática por GPS
- Seguimiento en tiempo real de su caso
- Transparencia en la atención recibida

### Para Operadores
- Información completa del incidente al momento
- Navegación integrada al lugar
- Comunicación directa con el ciudadano
- Registro automático de acciones

### Para Administradores (COPROSEC)
- Visibilidad total de la situación de seguridad
- Métricas para asignación de recursos
- Reportes para informes a autoridades
- Gestión centralizada de instituciones

---

# 3. CONTEXTO DEL PROBLEMA

## 3.1 Situación Actual

### 3.1.1 Ubicación Geográfica
- **Provincia**: Atalaya
- **Departamento**: Ucayali
- **País**: Perú
- **Población aproximada**: 53,000 habitantes (área urbana ~35,000)
- **Extensión**: 38,924.43 km² (la más grande de Ucayali)

### 3.1.2 Sistema Actual de Emergencias

```
FLUJO ACTUAL (WhatsApp "Emergencias Atalaya")
═════════════════════════════════════════════

Ciudadano                 Grupo WhatsApp              Instituciones
    │                          │                           │
    ├──── Escribe mensaje ────►│                           │
    │     "Robo en la esquina  │                           │
    │      de mi casa"         │                           │
    │                          ├──── ~900 personas ───────►│
    │                          │     ven el mensaje        │
    │                          │                           │
    │                          │     ¿Quién responde?      │
    │                          │     ¿Dónde exactamente?   │
    │                          │     ¿Ya lo atendieron?    │
    │                          │                           │
    └────── SIN RESPUESTA ─────┴───────────────────────────┘
              (muchas veces)

PROBLEMAS IDENTIFICADOS:
❌ No hay coordenadas exactas
❌ No se sabe quién atenderá
❌ No hay confirmación de atención
❌ Mensajes se pierden en la conversación
❌ No hay registro histórico útil
❌ No hay métricas de rendimiento
```

### 3.1.3 Instituciones Involucradas

| Institución | Rol | Contacto Actual |
|-------------|-----|-----------------|
| PNP Atalaya | Seguridad ciudadana, robos, delitos | 065-XXXXXX |
| Serenazgo Municipal | Apoyo en seguridad, patrullaje | 065-XXXXXX |
| Bomberos Voluntarios | Incendios, rescates | 116 |
| Centro de Salud | Emergencias médicas | 065-XXXXXX |
| Defensa Civil | Desastres naturales | 115 |

### 3.1.4 Estadísticas del Problema (Estimadas)

| Métrica | Valor Actual | Fuente |
|---------|--------------|--------|
| Mensajes diarios en grupo | ~50-100 | Observación |
| % mensajes que son emergencias reales | ~20-30% | Estimación |
| Tiempo promedio de respuesta | Desconocido | No medible |
| Alertas que quedan sin atender | Desconocido | No registrado |
| Satisfacción ciudadana | Baja (cualitativo) | Entrevistas |

## 3.2 Análisis de Antecedentes

### 3.2.1 Soluciones Similares en Perú

| Sistema | Ubicación | Características | Limitaciones |
|---------|-----------|-----------------|--------------|
| Alerta Surco | Lima (Surco) | App para vecinos, botón de pánico | Solo para distrito con presupuesto alto |
| Vecino Vigilante | Lima (varios) | Grupos organizados, no digital | Manual, sin tecnología |
| 105 PNP | Nacional | Línea de emergencias | Sin geolocalización, solo llamadas |

### 3.2.2 Soluciones Internacionales de Referencia

| Sistema | País | Fortalezas Aplicables |
|---------|------|----------------------|
| **SOSAFE** | Chile | Alertas comunitarias, mapas en tiempo real, sistema de calificación |
| Citizen | USA | Alertas por proximidad, notificaciones push |
| Nextdoor | USA | Red social vecinal, alertas locales |

### 3.2.3 Lecciones Aprendidas de SOSAFE (Chile)

SOSAFE es la referencia principal por similitud de contexto latinoamericano:

**Funcionalidades adoptadas:**
- ✅ Categorías de alerta predefinidas
- ✅ Georreferenciación obligatoria
- ✅ Historial y trazabilidad
- ✅ Sistema de calificación
- ✅ Notificaciones por proximidad

**Adaptaciones para Atalaya:**
- Simplificación de interfaz (menor alfabetización digital)
- Funcionamiento con conectividad limitada
- Integración con instituciones locales específicas
- Español como único idioma

## 3.3 Justificación del Proyecto

### 3.3.1 Justificación Técnica
- Firebase permite desarrollo rápido con bajo costo
- React Native posibilita app multiplataforma
- Arquitectura serverless elimina costos de servidores
- Tecnologías modernas con amplia documentación

### 3.3.2 Justificación Social
- Mejora la seguridad ciudadana de ~35,000 habitantes
- Empodera a la ciudadanía en la gestión de emergencias
- Genera datos para políticas públicas de seguridad
- Fortalece la confianza en instituciones

### 3.3.3 Justificación Económica
- Costo de desarrollo: ~$0 (desarrollador estudiante + herramientas gratuitas)
- Costo de operación: ~$50/mes (Firebase Blaze plan)
- ROI social: Invaluable (potencialmente salva vidas)

---

# 4. ALCANCE DEL PROYECTO

## 4.1 Dentro del Alcance (In Scope)

### 4.1.1 Aplicación Móvil Ciudadano
| Funcionalidad | Prioridad | MVP |
|---------------|-----------|-----|
| Registro y autenticación | Alta | 1 |
| Crear alerta con ubicación GPS | Alta | 1 |
| Seleccionar tipo y urgencia | Alta | 1 |
| Adjuntar fotos/evidencia | Media | 1 |
| Ver mis alertas enviadas | Alta | 1 |
| Ver estado de mis alertas | Alta | 1 |
| Ver alertas cercanas en mapa | Media | 2 |
| Recibir notificaciones | Alta | 1 |
| Calificar atención recibida | Media | 2 |
| Perfil de usuario | Baja | 2 |

### 4.1.2 Aplicación Móvil Operador
| Funcionalidad | Prioridad | MVP |
|---------------|-----------|-----|
| Login con credenciales institucionales | Alta | 1 |
| Ver alertas pendientes | Alta | 1 |
| Tomar un caso | Alta | 1 |
| Ver detalle de alerta | Alta | 1 |
| Actualizar estado | Alta | 1 |
| Navegar al lugar (GPS) | Media | 2 |
| Derivar a otra institución | Media | 2 |
| Ver historial de casos atendidos | Media | 2 |
| Agregar notas/evidencia | Media | 2 |

### 4.1.3 Panel Web Administrativo
| Funcionalidad | Prioridad | MVP |
|---------------|-----------|-----|
| Dashboard con estadísticas | Alta | 2 |
| Gestión de alertas (CRUD) | Alta | 2 |
| Gestión de usuarios | Alta | 2 |
| Gestión de instituciones | Alta | 2 |
| Gestión de categorías | Media | 2 |
| Reportes estadísticos | Media | 3 |
| Mapa de calor | Baja | 3 |
| Exportación de datos | Baja | 3 |

### 4.1.4 Backend y Servicios
| Componente | Descripción |
|------------|-------------|
| Firebase Authentication | Autenticación de usuarios |
| Cloud Firestore | Base de datos en tiempo real |
| Firebase Storage | Almacenamiento de imágenes |
| Cloud Functions | Lógica de negocio serverless |
| Firebase Cloud Messaging | Notificaciones push |

## 4.2 Fuera del Alcance (Out of Scope)

| Funcionalidad | Razón de Exclusión |
|---------------|-------------------|
| Llamadas de emergencia VoIP | Complejidad técnica, requiere infraestructura |
| Chat en tiempo real ciudadano-operador | Complejidad, requiere moderación |
| Integración con CAD policial | No existe sistema CAD en Atalaya |
| Botón de pánico por hardware | Requiere dispositivos físicos |
| Análisis predictivo con IA | Fuera del alcance académico |
| App para iOS nativa | Se usará React Native para ambas |
| Modo offline completo | Complejidad de sincronización |
| Multi-idioma | Solo español para Atalaya |
| Múltiples municipalidades | Solo Atalaya en esta versión |

## 4.3 Supuestos

| # | Supuesto | Impacto si es Falso |
|---|----------|---------------------|
| S1 | Los ciudadanos tienen smartphones con Android 8+ | Excluye parte de la población |
| S2 | Hay cobertura de internet móvil en área urbana | Sistema no funciona sin conexión |
| S3 | Las instituciones asignarán personal para operar | No habrá quién atienda alertas |
| S4 | COPROSEC apoyará la adopción del sistema | Baja adopción ciudadana |
| S5 | Firebase Free/Blaze tier es suficiente inicialmente | Costos inesperados |

## 4.4 Restricciones

| # | Restricción | Descripción |
|---|-------------|-------------|
| R1 | Presupuesto | $0 para desarrollo, máximo $50/mes operación |
| R2 | Tiempo | MVP1 debe estar listo para febrero 2026 |
| R3 | Equipo | Desarrollador único (estudiante) |
| R4 | Tecnología | Stack definido: React Native + Firebase + Next.js |
| R5 | Infraestructura | Solo servicios cloud (sin servidores físicos) |

## 4.5 Dependencias

| # | Dependencia | Tipo | Responsable |
|---|-------------|------|-------------|
| D1 | Cuenta de Firebase activa | Técnica | Edwin Méndez |
| D2 | Cuenta de desarrollador Google Play | Técnica | Edwin Méndez |
| D3 | Aprobación de COPROSEC | Organizacional | COPROSEC |
| D4 | Listado de instituciones y contactos | Información | COPROSEC |
| D5 | Dispositivos de prueba | Técnica | Edwin Méndez |

---

# 5. USUARIOS Y STAKEHOLDERS

## 5.1 Stakeholders

### 5.1.1 Mapa de Stakeholders

```
                        ALTO INTERÉS
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           │   COPROSEC      │    CIUDADANOS   │
           │   (Sponsor)     │    (Usuarios)   │
           │                 │                 │
     BAJO  ├─────────────────┼─────────────────┤ ALTO
     PODER │                 │                 │ PODER
           │   UNIVERSIDAD   │   OPERADORES    │
           │   (Académico)   │   (Usuarios)    │
           │                 │                 │
           └─────────────────┼─────────────────┘
                             │
                        BAJO INTERÉS
```

### 5.1.2 Detalle de Stakeholders

| Stakeholder | Rol | Interés | Poder | Estrategia |
|-------------|-----|---------|-------|------------|
| COPROSEC Atalaya | Sponsor, beneficiario principal | Alto | Alto | Involucrar en decisiones clave |
| Ciudadanos de Atalaya | Usuarios finales (reportan) | Alto | Medio | Diseño centrado en usuario |
| Operadores (PNP, Serenazgo) | Usuarios finales (atienden) | Medio | Alto | Capacitación y soporte |
| Universidad Continental | Evaluación académica | Medio | Bajo | Cumplir requisitos del curso |
| Municipalidad de Atalaya | Posible adopción futura | Bajo | Alto | Informar avances |

## 5.2 Usuarios del Sistema

### 5.2.1 Persona: Ciudadano

```
┌─────────────────────────────────────────────────────────────┐
│  👤 PERSONA: CIUDADANO                                      │
├─────────────────────────────────────────────────────────────┤
│  Nombre: María García López                                 │
│  Edad: 35 años                                              │
│  Ocupación: Comerciante en mercado local                    │
│  Ubicación: Centro de Atalaya                               │
├─────────────────────────────────────────────────────────────┤
│  📱 TECNOLOGÍA                                              │
│  • Smartphone Android gama baja (Xiaomi Redmi 9)            │
│  • Usa principalmente WhatsApp y Facebook                   │
│  • Alfabetización digital: Media                            │
│  • Conexión: Datos móviles (plan limitado)                  │
├─────────────────────────────────────────────────────────────┤
│  😤 FRUSTRACIONES                                           │
│  • "Cuando reporto algo en WhatsApp, nadie responde"        │
│  • "No sé si la policía ya viene o no"                      │
│  • "A veces no sé cómo explicar dónde estoy"                │
│  • "Tengo miedo de represalias por reportar"                │
├─────────────────────────────────────────────────────────────┤
│  🎯 OBJETIVOS                                               │
│  • Reportar emergencias de forma rápida y segura            │
│  • Saber que alguien está atendiendo mi caso                │
│  • Sentirse parte de una comunidad segura                   │
├─────────────────────────────────────────────────────────────┤
│  📋 ESCENARIO DE USO TÍPICO                                 │
│  María está en su puesto del mercado cuando ve a dos        │
│  sujetos sospechosos merodeando. Quiere alertar pero no     │
│  sabe exactamente cómo describir la ubicación ni está       │
│  segura de si alguien responderá.                           │
└─────────────────────────────────────────────────────────────┘
```

### 5.2.2 Persona: Operador

```
┌─────────────────────────────────────────────────────────────┐
│  👮 PERSONA: OPERADOR                                       │
├─────────────────────────────────────────────────────────────┤
│  Nombre: Juan Carlos Pérez Ríos                             │
│  Edad: 42 años                                              │
│  Ocupación: Suboficial PNP Atalaya                          │
│  Experiencia: 15 años en la institución                     │
├─────────────────────────────────────────────────────────────┤
│  📱 TECNOLOGÍA                                              │
│  • Smartphone Android institucional                         │
│  • Usa radio policial principalmente                        │
│  • Alfabetización digital: Media-Baja                       │
│  • Prefiere interfaces simples                              │
├─────────────────────────────────────────────────────────────┤
│  😤 FRUSTRACIONES                                           │
│  • "Llegan reportes incompletos, sin dirección exacta"      │
│  • "No sé qué casos ya tomó otro compañero"                 │
│  • "No hay registro de lo que hice en cada caso"            │
│  • "Las aplicaciones complicadas me confunden"              │
├─────────────────────────────────────────────────────────────┤
│  🎯 OBJETIVOS                                               │
│  • Recibir información clara y completa de emergencias      │
│  • Llegar rápido al lugar correcto                          │
│  • Registrar su trabajo de forma sencilla                   │
│  • Coordinar con otras instituciones cuando sea necesario   │
├─────────────────────────────────────────────────────────────┤
│  📋 ESCENARIO DE USO TÍPICO                                 │
│  Juan está de patrullaje cuando recibe una notificación.    │
│  Necesita ver rápidamente qué pasó, dónde exactamente,      │
│  y navegar hasta allí. Al llegar, debe poder actualizar     │
│  el estado para que el ciudadano sepa que ya llegó ayuda.   │
└─────────────────────────────────────────────────────────────┘
```

### 5.2.3 Persona: Administrador

```
┌─────────────────────────────────────────────────────────────┐
│  👔 PERSONA: ADMINISTRADOR                                  │
├─────────────────────────────────────────────────────────────┤
│  Nombre: Carlos Alberto Mendoza                             │
│  Edad: 50 años                                              │
│  Cargo: Secretario Técnico COPROSEC                         │
│  Responsabilidad: Coordinación de seguridad ciudadana       │
├─────────────────────────────────────────────────────────────┤
│  💻 TECNOLOGÍA                                              │
│  • Laptop de oficina, acceso a internet                     │
│  • Usa Excel para reportes actuales                         │
│  • Alfabetización digital: Media                            │
├─────────────────────────────────────────────────────────────┤
│  😤 FRUSTRACIONES                                           │
│  • "No tengo datos confiables para mis informes"            │
│  • "No sé cuántas emergencias atendemos realmente"          │
│  • "No puedo medir el desempeño de las instituciones"       │
│  • "Los reportes manuales toman mucho tiempo"               │
├─────────────────────────────────────────────────────────────┤
│  🎯 OBJETIVOS                                               │
│  • Tener visibilidad de todas las emergencias               │
│  • Generar reportes para autoridades superiores             │
│  • Identificar zonas problemáticas                          │
│  • Evaluar el desempeño de las instituciones                │
└─────────────────────────────────────────────────────────────┘
```

## 5.3 Matriz de Roles y Permisos

| Funcionalidad | Ciudadano | Operador | Admin |
|---------------|:---------:|:--------:|:-----:|
| Crear alerta | ✅ | ❌ | ✅ |
| Ver sus propias alertas | ✅ | ✅ | ✅ |
| Ver todas las alertas | ❌ | ✅ (asignadas) | ✅ |
| Tomar caso | ❌ | ✅ | ✅ |
| Actualizar estado | ❌ | ✅ | ✅ |
| Derivar alerta | ❌ | ✅ | ✅ |
| Cerrar alerta | ❌ | ✅ | ✅ |
| Calificar atención | ✅ | ❌ | ❌ |
| Ver dashboard | ❌ | ❌ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |
| Gestionar instituciones | ❌ | ❌ | ✅ |
| Gestionar categorías | ❌ | ❌ | ✅ |
| Exportar reportes | ❌ | ❌ | ✅ |

---


---

# 6. REQUERIMIENTOS FUNCIONALES

## 6.1 Módulo: Autenticación y Usuarios (AUTH)

### RF-AUTH-001: Registro de Ciudadano
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-AUTH-001 |
| **Nombre** | Registro de ciudadano |
| **Descripción** | El sistema debe permitir a los ciudadanos crear una cuenta proporcionando DNI, nombres, apellidos, celular, email (opcional) y contraseña |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Actor** | Ciudadano |
| **Precondición** | Usuario no registrado previamente |
| **Flujo Principal** | 1. Usuario accede a pantalla de registro<br>2. Ingresa DNI (8 dígitos)<br>3. Ingresa nombres y apellidos<br>4. Ingresa número de celular (9 dígitos)<br>5. Ingresa email (opcional)<br>6. Crea contraseña (mínimo 8 caracteres)<br>7. Confirma contraseña<br>8. Acepta términos y condiciones<br>9. Sistema valida datos<br>10. Sistema crea cuenta<br>11. Sistema envía a pantalla de login |
| **Flujo Alternativo** | 9a. Si DNI ya registrado → Mostrar error "DNI ya existe"<br>9b. Si celular ya registrado → Mostrar error<br>9c. Si contraseñas no coinciden → Mostrar error |
| **Postcondición** | Usuario registrado en el sistema |
| **Reglas de Negocio** | RN-001: DNI debe ser único<br>RN-002: Celular debe ser único<br>RN-003: Contraseña mínimo 8 caracteres |

### RF-AUTH-002: Login de Ciudadano
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-AUTH-002 |
| **Nombre** | Inicio de sesión ciudadano |
| **Descripción** | El sistema debe permitir a ciudadanos registrados iniciar sesión con email/celular y contraseña |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Validaciones** | - Email/celular existente<br>- Contraseña correcta<br>- Cuenta activa |

### RF-AUTH-003: Login de Operador
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-AUTH-003 |
| **Nombre** | Inicio de sesión operador |
| **Descripción** | El sistema debe permitir a operadores iniciar sesión con credenciales institucionales asignadas por administrador |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Validaciones** | - Credenciales válidas<br>- Cuenta activa<br>- Rol = Operador |

### RF-AUTH-004: Login de Administrador
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-AUTH-004 |
| **Nombre** | Inicio de sesión administrador |
| **Descripción** | El sistema debe permitir a administradores iniciar sesión en el panel web |
| **Prioridad** | Alta |
| **MVP** | 2 |

### RF-AUTH-005: Recuperación de Contraseña
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-AUTH-005 |
| **Nombre** | Recuperar contraseña |
| **Descripción** | El sistema debe permitir recuperar contraseña mediante envío de enlace al email registrado |
| **Prioridad** | Media |
| **MVP** | 1 |

### RF-AUTH-006: Cierre de Sesión
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-AUTH-006 |
| **Nombre** | Cerrar sesión |
| **Descripción** | El sistema debe permitir cerrar sesión desde cualquier módulo |
| **Prioridad** | Alta |
| **MVP** | 1 |

---

## 6.2 Módulo: Gestión de Alertas - Ciudadano (ALC)

### RF-ALC-001: Crear Nueva Alerta
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALC-001 |
| **Nombre** | Crear alerta de emergencia |
| **Descripción** | El sistema debe permitir al ciudadano crear una alerta de emergencia con tipo, descripción, urgencia, ubicación y evidencia opcional |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Actor** | Ciudadano autenticado |
| **Precondición** | Usuario logueado |
| **Flujo Principal** | **Paso 1 - Tipo:**<br>1. Usuario presiona "Reportar Emergencia"<br>2. Selecciona tipo de incidente (8 categorías)<br>3. Presiona "Siguiente"<br><br>**Paso 2 - Descripción:**<br>4. Escribe descripción (máx 200 caracteres)<br>5. Selecciona nivel de urgencia (4 niveles)<br>6. Presiona "Siguiente"<br><br>**Paso 3 - Ubicación:**<br>7. Sistema obtiene ubicación GPS automáticamente<br>8. Usuario puede ajustar pin en mapa<br>9. Usuario puede buscar dirección<br>10. Presiona "Siguiente"<br><br>**Paso 4 - Confirmación:**<br>11. Opcionalmente adjunta fotos (máx 3)<br>12. Revisa resumen de alerta<br>13. Presiona "Enviar Alerta"<br>14. Sistema crea alerta<br>15. Sistema notifica a operadores<br>16. Muestra pantalla de éxito con ID |
| **Postcondición** | Alerta creada con estado "Reportada" |
| **Datos Capturados** | - Tipo de incidente<br>- Descripción<br>- Nivel de urgencia<br>- Coordenadas GPS<br>- Dirección aproximada<br>- Fotos (0-3)<br>- Fecha/hora automática<br>- ID de ciudadano |

### RF-ALC-002: Ver Mis Alertas
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALC-002 |
| **Nombre** | Listar alertas propias |
| **Descripción** | El sistema debe mostrar al ciudadano todas las alertas que ha creado, con filtros por estado |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Información Mostrada** | - ID de alerta<br>- Tipo de incidente (icono + texto)<br>- Ubicación resumida<br>- Estado actual (badge color)<br>- Fecha de creación<br>- Calificación (si aplica) |
| **Filtros** | - Todas<br>- Activas (Reportada, En Atención)<br>- Cerradas (Resuelta, Cerrada) |

### RF-ALC-003: Ver Detalle de Mi Alerta
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALC-003 |
| **Nombre** | Ver detalle de alerta propia |
| **Descripción** | El sistema debe mostrar el detalle completo de una alerta del ciudadano, incluyendo historial de estados |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Información Mostrada** | - Todos los datos de la alerta<br>- Mapa con ubicación<br>- Fotos adjuntas<br>- Timeline de estados<br>- Operador asignado (si hay)<br>- Institución que atiende |

### RF-ALC-004: Ver Alertas Cercanas
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALC-004 |
| **Nombre** | Mapa de alertas cercanas |
| **Descripción** | El sistema debe mostrar un mapa con alertas activas cercanas a la ubicación del ciudadano |
| **Prioridad** | Media |
| **MVP** | 2 |
| **Funcionalidades** | - Mapa centrado en ubicación del usuario<br>- Pins de colores según urgencia<br>- Filtro por radio (200m, 500m, 1km, 2km)<br>- Filtro por tipo/urgencia<br>- Lista de alertas debajo del mapa |
| **Restricción** | Solo muestra alertas públicas, sin datos personales del reportante |

### RF-ALC-005: Calificar Atención
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALC-005 |
| **Nombre** | Calificar atención recibida |
| **Descripción** | El sistema debe permitir al ciudadano calificar la atención una vez que su alerta sea marcada como "Resuelta" |
| **Prioridad** | Media |
| **MVP** | 2 |
| **Flujo** | 1. Sistema detecta alerta resuelta<br>2. Envía notificación de calificación<br>3. Ciudadano abre calificación<br>4. Selecciona 1-5 estrellas<br>5. Opcionalmente escribe comentario<br>6. Envía calificación |
| **Datos** | - Rating (1-5 estrellas)<br>- Comentario (opcional, máx 300 chars)<br>- Fecha de calificación |

---

## 6.3 Módulo: Gestión de Alertas - Operador (ALO)

### RF-ALO-001: Ver Alertas Pendientes
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALO-001 |
| **Nombre** | Listar alertas pendientes |
| **Descripción** | El sistema debe mostrar al operador todas las alertas pendientes (estado "Reportada") ordenadas por urgencia y tiempo |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Ordenamiento** | 1. Por urgencia (Crítica > Alta > Media > Baja)<br>2. Por antigüedad (más antigua primero) |
| **Información** | - ID, Tipo, Ubicación<br>- Urgencia (badge color)<br>- Tiempo desde reporte<br>- Distancia desde operador |

### RF-ALO-002: Ver Mis Casos Activos
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALO-002 |
| **Nombre** | Listar casos asignados |
| **Descripción** | El sistema debe mostrar las alertas que el operador ha tomado y están en proceso |
| **Prioridad** | Alta |
| **MVP** | 1 |

### RF-ALO-003: Tomar Caso
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALO-003 |
| **Nombre** | Asignarse una alerta |
| **Descripción** | El sistema debe permitir al operador tomar un caso pendiente, asignándose como responsable |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Flujo** | 1. Operador ve alerta pendiente<br>2. Presiona "Tomar Caso"<br>3. Sistema verifica que no esté tomada<br>4. Sistema asigna operador<br>5. Cambia estado a "En Atención"<br>6. Notifica al ciudadano<br>7. Registra en historial |
| **Postcondición** | - Alerta estado = "En Atención"<br>- operatorId = ID del operador<br>- Timestamp de asignación |

### RF-ALO-004: Ver Detalle de Alerta
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALO-004 |
| **Nombre** | Ver detalle completo de alerta |
| **Descripción** | El sistema debe mostrar toda la información de la alerta incluyendo datos del reportante |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Información** | - Tipo, descripción, urgencia<br>- Ubicación con mapa<br>- Fotos adjuntas<br>- Datos del ciudadano (nombre, teléfono)<br>- Distancia y tiempo estimado<br>- Historial de estados |

### RF-ALO-005: Actualizar Estado
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALO-005 |
| **Nombre** | Cambiar estado de alerta |
| **Descripción** | El sistema debe permitir al operador actualizar el estado de una alerta asignada |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Estados Permitidos** | - En camino<br>- En el lugar<br>- Atendiendo<br>- Resuelto |
| **Datos Adicionales** | - Nota de actualización (opcional)<br>- Foto de evidencia (opcional) |
| **Notificación** | Cada cambio notifica al ciudadano |

### RF-ALO-006: Derivar Alerta
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALO-006 |
| **Nombre** | Derivar a otra institución |
| **Descripción** | El sistema debe permitir derivar una alerta a otra institución competente |
| **Prioridad** | Media |
| **MVP** | 2 |
| **Flujo** | 1. Operador selecciona "Derivar"<br>2. Selecciona institución destino<br>3. Escribe motivo de derivación<br>4. Confirma derivación<br>5. Sistema notifica a institución destino<br>6. Alerta aparece en pendientes de esa institución |

### RF-ALO-007: Navegar a Ubicación
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALO-007 |
| **Nombre** | Abrir navegación GPS |
| **Descripción** | El sistema debe abrir Google Maps o Waze con la ruta hacia la ubicación de la alerta |
| **Prioridad** | Media |
| **MVP** | 2 |

### RF-ALO-008: Ver Historial de Atenciones
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ALO-008 |
| **Nombre** | Ver casos atendidos |
| **Descripción** | El sistema debe mostrar el historial de alertas atendidas por el operador |
| **Prioridad** | Media |
| **MVP** | 2 |
| **Información** | - Lista de alertas cerradas<br>- Filtro por mes<br>- Estadísticas personales (total atendidos, rating promedio) |

---

## 6.4 Módulo: Panel Administrativo (ADM)

### RF-ADM-001: Dashboard Principal
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ADM-001 |
| **Nombre** | Dashboard de estadísticas |
| **Descripción** | El sistema debe mostrar un dashboard con KPIs y estadísticas en tiempo real |
| **Prioridad** | Alta |
| **MVP** | 2 |
| **KPIs** | - Total alertas hoy<br>- Alertas pendientes<br>- Alertas resueltas<br>- Alertas críticas activas<br>- Tiempo promedio de respuesta<br>- Satisfacción promedio |
| **Visualizaciones** | - Mapa en tiempo real<br>- Gráfico de tendencia diaria<br>- Lista de alertas activas |

### RF-ADM-002: Gestión de Alertas (CRUD)
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ADM-002 |
| **Nombre** | Administrar alertas |
| **Descripción** | El sistema debe permitir ver, filtrar, editar y cerrar cualquier alerta |
| **Prioridad** | Alta |
| **MVP** | 2 |
| **Funcionalidades** | - Listado paginado<br>- Filtros (tipo, estado, fecha, urgencia, institución)<br>- Búsqueda por ID o ubicación<br>- Ver detalle completo<br>- Reasignar operador<br>- Cerrar manualmente |

### RF-ADM-003: Gestión de Usuarios
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ADM-003 |
| **Nombre** | Administrar usuarios |
| **Descripción** | El sistema debe permitir crear, editar, activar/desactivar usuarios (ciudadanos, operadores, admins) |
| **Prioridad** | Alta |
| **MVP** | 2 |
| **Funcionalidades** | - Listar todos los usuarios<br>- Filtrar por rol<br>- Crear operador/admin<br>- Asignar institución a operador<br>- Activar/desactivar cuenta<br>- Reset de contraseña |

### RF-ADM-004: Gestión de Instituciones
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ADM-004 |
| **Nombre** | Administrar instituciones |
| **Descripción** | El sistema debe permitir crear y editar instituciones de respuesta |
| **Prioridad** | Alta |
| **MVP** | 2 |
| **Datos** | - Nombre<br>- Tipo (PNP, Serenazgo, Bomberos, Salud, Otro)<br>- Teléfono<br>- Email<br>- Dirección<br>- Tipos de alerta que atiende<br>- Estado (activo/inactivo) |

### RF-ADM-005: Gestión de Categorías
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ADM-005 |
| **Nombre** | Administrar categorías de alerta |
| **Descripción** | El sistema debe permitir configurar las categorías de alertas |
| **Prioridad** | Media |
| **MVP** | 2 |
| **Datos** | - Nombre<br>- Nombre corto<br>- Icono/emoji<br>- Color<br>- Orden de visualización<br>- Estado (activo/inactivo) |

### RF-ADM-006: Reportes Estadísticos
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-ADM-006 |
| **Nombre** | Generar reportes |
| **Descripción** | El sistema debe generar reportes estadísticos con filtros de fecha |
| **Prioridad** | Media |
| **MVP** | 3 |
| **Reportes** | - Alertas por tipo<br>- Alertas por urgencia<br>- Alertas por estado<br>- Alertas por institución<br>- Tiempo de respuesta<br>- Mapa de calor<br>- Top zonas problemáticas |
| **Exportación** | PDF, Excel |

---

## 6.5 Módulo: Notificaciones (NOT)

### RF-NOT-001: Notificación a Operadores
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-NOT-001 |
| **Nombre** | Push a operadores por nueva alerta |
| **Descripción** | El sistema debe enviar notificación push a operadores de la institución correspondiente cuando se crea una alerta |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Contenido** | - Título: "🚨 Nueva alerta [TIPO]"<br>- Cuerpo: "Urgencia: [NIVEL] - [DIRECCIÓN_CORTA]"<br>- Acción: Abrir detalle |

### RF-NOT-002: Notificación a Ciudadano
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-NOT-002 |
| **Nombre** | Push a ciudadano por cambio de estado |
| **Descripción** | El sistema debe notificar al ciudadano cada vez que su alerta cambia de estado |
| **Prioridad** | Alta |
| **MVP** | 1 |
| **Eventos** | - Alerta tomada por operador<br>- Operador en camino<br>- Operador en el lugar<br>- Alerta resuelta<br>- Alerta derivada |

### RF-NOT-003: Notificación de Alertas Cercanas
| Campo | Descripción |
|-------|-------------|
| **ID** | RF-NOT-003 |
| **Nombre** | Push por alerta cercana |
| **Descripción** | El sistema debe notificar a ciudadanos cuando hay una alerta crítica cerca de su ubicación |
| **Prioridad** | Baja |
| **MVP** | 3 |
| **Configuración** | - Solo alertas urgencia Crítica o Alta<br>- Radio: 500m<br>- Máximo 1 notificación por hora |

---

# 7. REQUERIMIENTOS NO FUNCIONALES

## 7.1 Rendimiento (RNF-PERF)

| ID | Requerimiento | Métrica | Valor Objetivo |
|----|---------------|---------|----------------|
| RNF-PERF-001 | Tiempo de carga inicial de app | Tiempo | < 3 segundos |
| RNF-PERF-002 | Tiempo de envío de alerta | Tiempo | < 5 segundos |
| RNF-PERF-003 | Tiempo de actualización de lista | Tiempo | < 2 segundos |
| RNF-PERF-004 | Tiempo de carga de mapa | Tiempo | < 4 segundos |
| RNF-PERF-005 | Notificaciones push | Tiempo | < 10 segundos desde evento |

## 7.2 Escalabilidad (RNF-SCAL)

| ID | Requerimiento | Valor |
|----|---------------|-------|
| RNF-SCAL-001 | Usuarios concurrentes | Mínimo 500 simultáneos |
| RNF-SCAL-002 | Alertas por día | Hasta 1,000 alertas/día |
| RNF-SCAL-003 | Almacenamiento de imágenes | Hasta 10GB iniciales |
| RNF-SCAL-004 | Crecimiento horizontal | Firebase auto-scale |

## 7.3 Disponibilidad (RNF-AVAIL)

| ID | Requerimiento | Valor |
|----|---------------|-------|
| RNF-AVAIL-001 | Uptime del sistema | 99.5% mensual |
| RNF-AVAIL-002 | Tiempo máximo de caída | < 4 horas/mes |
| RNF-AVAIL-003 | Recuperación ante fallas | < 1 hora (Firebase SLA) |

## 7.4 Seguridad (RNF-SEC)

| ID | Requerimiento | Descripción |
|----|---------------|-------------|
| RNF-SEC-001 | Autenticación | Firebase Authentication con tokens JWT |
| RNF-SEC-002 | Autorización | Reglas de Firestore por rol |
| RNF-SEC-003 | Encriptación en tránsito | HTTPS/TLS 1.2+ obligatorio |
| RNF-SEC-004 | Encriptación en reposo | Firestore encriptado por defecto |
| RNF-SEC-005 | Protección de datos personales | Cumplir con Ley 29733 (Perú) |
| RNF-SEC-006 | Contraseñas | Mínimo 8 caracteres, hash bcrypt |
| RNF-SEC-007 | Sesiones | Tokens con expiración de 7 días |
| RNF-SEC-008 | Rate limiting | Máximo 100 requests/minuto por usuario |

## 7.5 Usabilidad (RNF-USE)

| ID | Requerimiento | Descripción |
|----|---------------|-------------|
| RNF-USE-001 | Crear alerta | Completar en máximo 4 pasos/60 segundos |
| RNF-USE-002 | Curva de aprendizaje | Usuario nuevo opera sin capacitación |
| RNF-USE-003 | Feedback visual | Indicadores de carga en todas las acciones |
| RNF-USE-004 | Mensajes de error | Claros y con acción sugerida |
| RNF-USE-005 | Idioma | Español (Perú) |
| RNF-USE-006 | Tamaño de fuente | Mínimo 14px, botones tocables > 44px |

## 7.6 Compatibilidad (RNF-COMP)

| ID | Requerimiento | Valor |
|----|---------------|-------|
| RNF-COMP-001 | Android mínimo | Android 8.0 (API 26) |
| RNF-COMP-002 | iOS mínimo | iOS 13.0 (si se publica) |
| RNF-COMP-003 | Navegadores web | Chrome 90+, Firefox 88+, Edge 90+ |
| RNF-COMP-004 | Resoluciones móvil | 320px - 428px ancho |
| RNF-COMP-005 | Resoluciones web | 1280px - 1920px ancho |

## 7.7 Mantenibilidad (RNF-MAINT)

| ID | Requerimiento | Descripción |
|----|---------------|-------------|
| RNF-MAINT-001 | Código documentado | JSDoc en funciones principales |
| RNF-MAINT-002 | Arquitectura | Separación por capas/módulos |
| RNF-MAINT-003 | Control de versiones | Git con conventional commits |
| RNF-MAINT-004 | Logs | Registro de errores en Firebase Crashlytics |
| RNF-MAINT-005 | Configuración | Variables de entorno, sin hardcoding |

## 7.8 Conectividad (RNF-CONN)

| ID | Requerimiento | Descripción |
|----|---------------|-------------|
| RNF-CONN-001 | Conexión requerida | Internet para todas las funciones |
| RNF-CONN-002 | Manejo de desconexión | Mostrar mensaje claro al usuario |
| RNF-CONN-003 | Reconexión | Auto-retry cada 5 segundos |
| RNF-CONN-004 | Timeout | 30 segundos máximo por request |

---


---

# 8. HISTORIAS DE USUARIO

## 8.1 Épica 1: Autenticación (EP-AUTH)

### HU-AUTH-001: Registro de Ciudadano
```
COMO ciudadano de Atalaya
QUIERO crear una cuenta en SAVIA
PARA poder reportar emergencias en mi zona

CRITERIOS DE ACEPTACIÓN:
✅ Puedo ingresar mi DNI (8 dígitos, validación de formato)
✅ Puedo ingresar mis nombres y apellidos
✅ Puedo ingresar mi número de celular (9 dígitos)
✅ Puedo ingresar mi email (opcional)
✅ Puedo crear una contraseña (mínimo 8 caracteres)
✅ Debo aceptar términos y condiciones para continuar
✅ Si mi DNI ya está registrado, veo mensaje de error
✅ Si mi celular ya está registrado, veo mensaje de error
✅ Al completar registro exitoso, veo mensaje de confirmación
✅ Soy redirigido al login después de registrarme

ESTIMACIÓN: 5 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-AUTH-002: Login de Ciudadano
```
COMO ciudadano registrado
QUIERO iniciar sesión con mi email/celular y contraseña
PARA acceder a las funcionalidades de la app

CRITERIOS DE ACEPTACIÓN:
✅ Puedo ingresar email o número de celular
✅ Puedo ingresar mi contraseña
✅ Si credenciales son correctas, accedo al Home
✅ Si credenciales son incorrectas, veo mensaje de error
✅ Puedo ver/ocultar mi contraseña
✅ Puedo acceder a "Olvidé mi contraseña"
✅ Puedo ir a pantalla de registro

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-AUTH-003: Recuperar Contraseña
```
COMO ciudadano que olvidó su contraseña
QUIERO solicitar un enlace de recuperación
PARA poder acceder nuevamente a mi cuenta

CRITERIOS DE ACEPTACIÓN:
✅ Puedo ingresar mi email registrado
✅ Si el email existe, recibo instrucciones de recuperación
✅ Si el email no existe, veo mensaje informativo
✅ El enlace de recuperación expira en 24 horas
✅ Puedo crear una nueva contraseña desde el enlace

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Media
MVP: 1
```

### HU-AUTH-004: Login de Operador
```
COMO operador de una institución de emergencias
QUIERO iniciar sesión con mis credenciales institucionales
PARA poder atender alertas ciudadanas

CRITERIOS DE ACEPTACIÓN:
✅ Puedo ingresar email institucional
✅ Puedo ingresar contraseña asignada
✅ Si credenciales son válidas, accedo al Home de Operador
✅ Veo mi nombre e institución en la app
✅ Solo puedo acceder si mi cuenta está activa

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

---

## 8.2 Épica 2: Crear Alerta (EP-ALC)

### HU-ALC-001: Crear Alerta - Seleccionar Tipo
```
COMO ciudadano autenticado
QUIERO seleccionar el tipo de emergencia que estoy reportando
PARA que las autoridades correctas sean notificadas

CRITERIOS DE ACEPTACIÓN:
✅ Veo todas las categorías disponibles (8 tipos)
✅ Cada categoría tiene icono y nombre descriptivo
✅ Solo puedo seleccionar una categoría
✅ La categoría seleccionada se resalta visualmente
✅ Puedo avanzar al siguiente paso solo si seleccioné una categoría
✅ Veo indicador de progreso (Paso 1 de 4)

CATEGORÍAS:
- 🚨 Robo/Asalto
- 🚗 Accidente de tránsito
- 🏥 Emergencia médica
- 🔥 Incendio
- ⚡ Falla eléctrica
- 💧 Problema de agua
- 🔍 Pérdida/Hallazgo
- ❓ Otro

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-ALC-002: Crear Alerta - Descripción y Urgencia
```
COMO ciudadano creando una alerta
QUIERO describir la situación y su nivel de urgencia
PARA que los operadores entiendan la gravedad

CRITERIOS DE ACEPTACIÓN:
✅ Veo el tipo seleccionado en el paso anterior
✅ Puedo escribir descripción (máximo 200 caracteres)
✅ Veo contador de caracteres restantes
✅ Debo seleccionar nivel de urgencia obligatoriamente
✅ Cada nivel tiene descripción de cuándo usarlo
✅ Al seleccionar urgencia, veo información contextual
✅ Veo indicador de progreso (Paso 2 de 4)

NIVELES DE URGENCIA:
- 🟢 Baja: Situación controlada, no hay peligro inmediato
- 🟡 Media: Requiere atención pronto, no es crítico
- 🟠 Alta: Situación en curso con riesgo potencial
- 🔴 Crítica: Peligro inminente para la vida

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-ALC-003: Crear Alerta - Ubicación
```
COMO ciudadano creando una alerta
QUIERO indicar la ubicación exacta de la emergencia
PARA que los operadores sepan dónde acudir

CRITERIOS DE ACEPTACIÓN:
✅ El mapa se centra automáticamente en mi ubicación GPS
✅ Veo un pin rojo en el centro del mapa
✅ Puedo mover el mapa para ajustar la ubicación
✅ Veo la dirección aproximada debajo del mapa
✅ Puedo presionar "Usar mi ubicación actual" para recentrar
✅ Puedo buscar una dirección manualmente
✅ Veo las coordenadas GPS seleccionadas
✅ Puedo hacer zoom in/out en el mapa
✅ Veo indicador de progreso (Paso 3 de 4)

ESTIMACIÓN: 5 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-ALC-004: Crear Alerta - Confirmación y Envío
```
COMO ciudadano creando una alerta
QUIERO revisar la información y adjuntar evidencia antes de enviar
PARA asegurarme que todo está correcto

CRITERIOS DE ACEPTACIÓN:
✅ Puedo adjuntar hasta 3 fotos (opcional)
✅ Puedo tomar foto con cámara o elegir de galería
✅ Puedo eliminar fotos antes de enviar
✅ Veo resumen completo de la alerta (tipo, urgencia, ubicación, descripción)
✅ Veo advertencia de que las autoridades serán notificadas
✅ Al presionar "Enviar Alerta", se crea la alerta
✅ Veo pantalla de confirmación con ID de alerta
✅ Recibo notificación de confirmación
✅ Puedo ver el estado de mi alerta desde la confirmación
✅ Veo indicador de progreso (Paso 4 de 4 - 100%)

ESTIMACIÓN: 5 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-ALC-005: Ver Confirmación de Alerta Enviada
```
COMO ciudadano que acaba de enviar una alerta
QUIERO ver confirmación de que fue recibida
PARA tener tranquilidad de que llegó correctamente

CRITERIOS DE ACEPTACIÓN:
✅ Veo animación/icono de éxito
✅ Veo mensaje "¡Alerta enviada!"
✅ Veo el ID único de mi alerta
✅ Veo información de qué pasará después
✅ Puedo presionar "Ver estado de alerta"
✅ Puedo volver al Home

ESTIMACIÓN: 2 Story Points
PRIORIDAD: Alta
MVP: 1
```

---

## 8.3 Épica 3: Seguimiento de Alertas (EP-SEG)

### HU-SEG-001: Ver Mis Alertas
```
COMO ciudadano autenticado
QUIERO ver todas las alertas que he reportado
PARA hacer seguimiento de su estado

CRITERIOS DE ACEPTACIÓN:
✅ Veo lista de todas mis alertas ordenadas por fecha (más reciente primero)
✅ Cada alerta muestra: ID, tipo (icono), ubicación, estado, fecha
✅ El estado se muestra con badge de color
✅ Puedo filtrar por: Todas, Activas, Cerradas
✅ Puedo tocar una alerta para ver su detalle
✅ Si no tengo alertas, veo mensaje "No has reportado alertas aún"

ESTADOS Y COLORES:
- 🔵 Reportada: Azul
- 🟡 En Atención: Amarillo
- 🟢 Resuelta: Verde
- ⚫ Cerrada: Gris

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-SEG-002: Ver Detalle de Mi Alerta
```
COMO ciudadano
QUIERO ver el detalle completo de una alerta que reporté
PARA conocer su estado actual y quién la está atendiendo

CRITERIOS DE ACEPTACIÓN:
✅ Veo todos los datos de la alerta (tipo, descripción, urgencia)
✅ Veo mapa con la ubicación marcada
✅ Veo las fotos que adjunté
✅ Veo timeline con historial de estados
✅ Si está siendo atendida, veo nombre del operador e institución
✅ Si fue resuelta, veo opción de calificar

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-SEG-003: Recibir Notificación de Cambio de Estado
```
COMO ciudadano que reportó una alerta
QUIERO recibir notificaciones cuando cambie el estado
PARA estar informado del progreso

CRITERIOS DE ACEPTACIÓN:
✅ Recibo push cuando operador toma mi caso
✅ Recibo push cuando operador está en camino
✅ Recibo push cuando operador llegó al lugar
✅ Recibo push cuando mi alerta fue resuelta
✅ Al tocar notificación, abro el detalle de la alerta
✅ La notificación muestra icono y texto descriptivo

ESTIMACIÓN: 5 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-SEG-004: Calificar Atención Recibida
```
COMO ciudadano cuya alerta fue resuelta
QUIERO calificar la atención que recibí
PARA que el sistema mejore con mi feedback

CRITERIOS DE ACEPTACIÓN:
✅ Recibo notificación invitándome a calificar
✅ Puedo seleccionar de 1 a 5 estrellas
✅ Puedo escribir un comentario opcional (máx 300 caracteres)
✅ Veo referencia de qué alerta estoy calificando
✅ Al enviar calificación, veo confirmación
✅ Solo puedo calificar una vez por alerta
✅ Puedo omitir la calificación

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Media
MVP: 2
```

---

## 8.4 Épica 4: Atención de Alertas - Operador (EP-OPE)

### HU-OPE-001: Ver Alertas Pendientes
```
COMO operador de una institución de emergencias
QUIERO ver las alertas pendientes de atención
PARA poder tomar casos y atenderlos

CRITERIOS DE ACEPTACIÓN:
✅ Veo lista de alertas con estado "Reportada"
✅ Las alertas se ordenan por urgencia (crítica primero) y luego por tiempo
✅ Cada alerta muestra: ID, tipo, ubicación, urgencia, tiempo transcurrido
✅ Las alertas críticas tienen indicador visual destacado
✅ Veo la distancia desde mi ubicación actual
✅ Puedo tocar para ver detalle
✅ Puedo tomar caso desde la lista

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-OPE-002: Tomar un Caso
```
COMO operador
QUIERO tomar un caso pendiente
PARA asignarme como responsable de atenderlo

CRITERIOS DE ACEPTACIÓN:
✅ Puedo presionar "Tomar Caso" desde lista o detalle
✅ Sistema verifica que la alerta no haya sido tomada
✅ Si ya fue tomada, veo mensaje informativo
✅ Si no está tomada, me asigna automáticamente
✅ El estado cambia a "En Atención"
✅ El ciudadano recibe notificación
✅ Veo confirmación de asignación

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-OPE-003: Ver Detalle de Alerta
```
COMO operador
QUIERO ver toda la información de una alerta
PARA entender la situación antes de atender

CRITERIOS DE ACEPTACIÓN:
✅ Veo tipo, descripción y nivel de urgencia
✅ Veo mapa con ubicación exacta
✅ Veo distancia y tiempo estimado de llegada
✅ Veo fotos adjuntas (si hay)
✅ Veo datos del ciudadano (nombre, teléfono)
✅ Veo historial de estados
✅ Puedo llamar al ciudadano directamente
✅ Puedo abrir navegación GPS

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-OPE-004: Actualizar Estado de Alerta
```
COMO operador atendiendo una alerta
QUIERO actualizar el estado
PARA que el ciudadano sepa el progreso

CRITERIOS DE ACEPTACIÓN:
✅ Veo opciones de estado disponibles
✅ Puedo seleccionar: En camino, En el lugar, Atendiendo, Resuelto
✅ Puedo agregar nota de actualización (opcional)
✅ Puedo adjuntar foto de evidencia (opcional)
✅ Al guardar, el estado se actualiza
✅ El ciudadano recibe notificación del cambio
✅ El cambio queda registrado en el historial

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 1
```

### HU-OPE-005: Navegar a la Ubicación
```
COMO operador que tomó un caso
QUIERO navegar hasta la ubicación de la emergencia
PARA llegar lo más rápido posible

CRITERIOS DE ACEPTACIÓN:
✅ Puedo presionar botón "Navegar"
✅ Se abre Google Maps con la ruta
✅ Puedo elegir Waze como alternativa
✅ La navegación usa las coordenadas exactas de la alerta

ESTIMACIÓN: 2 Story Points
PRIORIDAD: Media
MVP: 2
```

### HU-OPE-006: Derivar Alerta
```
COMO operador
QUIERO derivar una alerta a otra institución
PARA que sea atendida por quien corresponde

CRITERIOS DE ACEPTACIÓN:
✅ Puedo seleccionar "Derivar" desde el detalle
✅ Veo lista de instituciones disponibles
✅ No puedo derivar a mi propia institución
✅ Debo escribir motivo de derivación
✅ Al confirmar, la alerta se reasigna
✅ La institución destino recibe notificación
✅ El ciudadano recibe notificación de derivación

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Media
MVP: 2
```

---

## 8.5 Épica 5: Administración (EP-ADM)

### HU-ADM-001: Ver Dashboard
```
COMO administrador del sistema
QUIERO ver un dashboard con estadísticas
PARA tener visión general del estado de las emergencias

CRITERIOS DE ACEPTACIÓN:
✅ Veo KPIs principales: Total alertas, Pendientes, Resueltas, Críticas
✅ Veo mapa con alertas activas en tiempo real
✅ Veo gráfico de tendencia de alertas
✅ Veo lista de alertas activas más recientes
✅ Puedo hacer clic en una alerta para ver detalle
✅ Los datos se actualizan en tiempo real

ESTIMACIÓN: 5 Story Points
PRIORIDAD: Alta
MVP: 2
```

### HU-ADM-002: Gestionar Usuarios
```
COMO administrador
QUIERO crear, editar y desactivar usuarios
PARA controlar quién puede acceder al sistema

CRITERIOS DE ACEPTACIÓN:
✅ Veo lista de todos los usuarios
✅ Puedo filtrar por rol (Ciudadano, Operador, Admin)
✅ Puedo buscar por nombre, DNI o email
✅ Puedo crear nuevo operador/admin
✅ Puedo asignar institución a operador
✅ Puedo activar/desactivar cuenta
✅ Puedo resetear contraseña

ESTIMACIÓN: 5 Story Points
PRIORIDAD: Alta
MVP: 2
```

### HU-ADM-003: Gestionar Instituciones
```
COMO administrador
QUIERO crear y editar instituciones
PARA que puedan recibir alertas

CRITERIOS DE ACEPTACIÓN:
✅ Veo lista de instituciones
✅ Puedo crear nueva institución
✅ Puedo editar datos de institución existente
✅ Puedo asignar tipos de alerta que atiende
✅ Puedo activar/desactivar institución
✅ Veo cuántos operadores tiene cada institución

ESTIMACIÓN: 3 Story Points
PRIORIDAD: Alta
MVP: 2
```

### HU-ADM-004: Generar Reportes
```
COMO administrador
QUIERO generar reportes estadísticos
PARA informar a autoridades superiores

CRITERIOS DE ACEPTACIÓN:
✅ Puedo seleccionar rango de fechas
✅ Veo alertas por tipo (gráfico de barras)
✅ Veo alertas por estado (gráfico de dona)
✅ Veo tendencia de alertas (gráfico de línea)
✅ Veo mapa de calor de zonas problemáticas
✅ Veo ranking de zonas con más alertas
✅ Puedo exportar a PDF y Excel

ESTIMACIÓN: 8 Story Points
PRIORIDAD: Media
MVP: 3
```

---

## 8.6 Resumen de Historias de Usuario

| Épica | Código | Historia | Story Points | MVP |
|-------|--------|----------|--------------|-----|
| AUTH | HU-AUTH-001 | Registro de ciudadano | 5 | 1 |
| AUTH | HU-AUTH-002 | Login de ciudadano | 3 | 1 |
| AUTH | HU-AUTH-003 | Recuperar contraseña | 3 | 1 |
| AUTH | HU-AUTH-004 | Login de operador | 3 | 1 |
| ALC | HU-ALC-001 | Crear alerta - Tipo | 3 | 1 |
| ALC | HU-ALC-002 | Crear alerta - Descripción | 3 | 1 |
| ALC | HU-ALC-003 | Crear alerta - Ubicación | 5 | 1 |
| ALC | HU-ALC-004 | Crear alerta - Confirmación | 5 | 1 |
| ALC | HU-ALC-005 | Confirmación enviada | 2 | 1 |
| SEG | HU-SEG-001 | Ver mis alertas | 3 | 1 |
| SEG | HU-SEG-002 | Ver detalle de alerta | 3 | 1 |
| SEG | HU-SEG-003 | Notificaciones de estado | 5 | 1 |
| SEG | HU-SEG-004 | Calificar atención | 3 | 2 |
| OPE | HU-OPE-001 | Ver alertas pendientes | 3 | 1 |
| OPE | HU-OPE-002 | Tomar caso | 3 | 1 |
| OPE | HU-OPE-003 | Ver detalle (operador) | 3 | 1 |
| OPE | HU-OPE-004 | Actualizar estado | 3 | 1 |
| OPE | HU-OPE-005 | Navegar a ubicación | 2 | 2 |
| OPE | HU-OPE-006 | Derivar alerta | 3 | 2 |
| ADM | HU-ADM-001 | Dashboard | 5 | 2 |
| ADM | HU-ADM-002 | Gestionar usuarios | 5 | 2 |
| ADM | HU-ADM-003 | Gestionar instituciones | 3 | 2 |
| ADM | HU-ADM-004 | Generar reportes | 8 | 3 |
| **TOTAL** | | **24 Historias** | **84 SP** | |

### Por MVP:
- **MVP1**: 46 Story Points (14 historias)
- **MVP2**: 27 Story Points (7 historias)
- **MVP3**: 11 Story Points (3 historias)

---

# 9. ARQUITECTURA TÉCNICA

## 9.1 Visión General de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITECTURA SAVIA                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│    │  📱 App      │    │  📱 App      │    │  💻 Panel    │                 │
│    │  Ciudadano   │    │  Operador    │    │  Admin Web   │                 │
│    │              │    │              │    │              │                 │
│    │ React Native │    │ React Native │    │   Next.js    │                 │
│    │   + Expo     │    │   + Expo     │    │   + React    │                 │
│    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                 │
│           │                   │                   │                          │
│           └───────────────────┼───────────────────┘                          │
│                               │                                              │
│                               ▼                                              │
│    ┌─────────────────────────────────────────────────────────────────┐      │
│    │                     FIREBASE SERVICES                            │      │
│    ├─────────────┬─────────────┬─────────────┬───────────────────────┤      │
│    │             │             │             │                       │      │
│    │ 🔐 Auth     │ 🗄️ Firestore│ 📁 Storage  │ 📨 Cloud Messaging   │      │
│    │             │             │             │                       │      │
│    │ - Email/    │ - Real-time │ - Imágenes  │ - Push notifications │      │
│    │   Password  │   Database  │ - Evidencias│ - Topics por rol     │      │
│    │ - JWT       │ - NoSQL     │ - Thumbnails│                       │      │
│    │   Tokens    │ - Offline   │             │                       │      │
│    │             │             │             │                       │      │
│    └─────────────┴─────────────┴─────────────┴───────────────────────┘      │
│                               │                                              │
│                               ▼                                              │
│    ┌─────────────────────────────────────────────────────────────────┐      │
│    │                    CLOUD FUNCTIONS                               │      │
│    │                                                                  │      │
│    │  • onAlertCreated → Notificar operadores                        │      │
│    │  • onAlertUpdated → Notificar ciudadano                         │      │
│    │  • onUserCreated → Welcome email                                │      │
│    │  • scheduledCleanup → Limpieza de datos antiguos                │      │
│    │                                                                  │      │
│    └─────────────────────────────────────────────────────────────────┘      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Stack Tecnológico

### 9.2.1 Frontend Móvil

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React Native | 0.83+ | Framework de desarrollo móvil |
| Expo | SDK 55 | Herramientas y servicios para RN |
| TypeScript | 5.9+ | Tipado estático |
| React Navigation | 7.x | Navegación entre pantallas |
| React Native Maps | 1.26+ | Integración con mapas |
| React Native Firebase | 23.x | SDK de Firebase |
| Zustand | 5.x | Estado global |
| React Hook Form | 7.71+ | Manejo de formularios |
| Zod | 4.x | Validación de esquemas |
| date-fns | 4.x | Manejo de fechas |
| Expo Image Picker | 55.x | Selección de imágenes |
| Expo Location | 55.x | Geolocalización |
| Expo Notifications | 55.x | Notificaciones push |

### 9.2.2 Frontend Web (Admin Panel)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.x | Framework React con SSR |
| TypeScript | 5.9+ | Tipado estático |
| Tailwind CSS | 4.x | Framework CSS utility-first |
| Shadcn/ui | Latest | Componentes UI |
| React Query | 5.90+ | Data fetching y cache |
| Recharts | 3.x | Gráficos y visualizaciones |
| React Table | 8.21+ | Tablas con sorting/filtering |
| Leaflet | 1.9.4 | Mapas interactivos |
| Firebase Admin SDK | 13.x | Acceso server-side |

### 9.2.3 Backend (Firebase)

| Servicio | Propósito | Plan |
|----------|-----------|------|
| Firebase Authentication | Autenticación de usuarios | Spark (Free) |
| Cloud Firestore | Base de datos NoSQL | Spark → Blaze |
| Firebase Storage | Almacenamiento de archivos | Spark → Blaze |
| Cloud Functions | Lógica serverless | Blaze |
| Cloud Messaging (FCM) | Notificaciones push | Free |
| Firebase Hosting | Hosting del admin web | Spark (Free) |
| Firebase Crashlytics | Monitoreo de errores | Free |
| Firebase Analytics | Analíticas de uso | Free |

### 9.2.4 Herramientas de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| VS Code | Editor de código |
| Android Studio | Emulador y builds Android |
| Xcode | Emulador y builds iOS (si aplica) |
| Postman / Insomnia | Testing de APIs |
| Firebase Emulator Suite | Testing local |
| Git + GitHub | Control de versiones |
| ESLint + Prettier | Linting y formateo |

## 9.3 Arquitectura de Aplicaciones Móviles

### 9.3.1 Estructura de Carpetas (React Native + Expo)

```
savia-mobile/
├── app/                          # Expo Router (screens)
│   ├── (auth)/                   # Grupo de pantallas de auth
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (citizen)/                # Grupo ciudadano (tabs)
│   │   ├── _layout.tsx           # Tab navigator
│   │   ├── index.tsx             # Home
│   │   ├── map.tsx               # Mapa alertas cercanas
│   │   ├── alerts/
│   │   │   ├── index.tsx         # Mis alertas
│   │   │   └── [id].tsx          # Detalle alerta
│   │   ├── notifications.tsx
│   │   └── profile.tsx
│   ├── (operator)/               # Grupo operador (tabs)
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home operador
│   │   ├── alerts/
│   │   │   ├── index.tsx         # Alertas asignadas
│   │   │   └── [id].tsx          # Detalle con acciones
│   │   ├── history.tsx
│   │   └── profile.tsx
│   ├── new-alert/                # Flujo crear alerta (stack)
│   │   ├── _layout.tsx
│   │   ├── type.tsx              # Paso 1
│   │   ├── description.tsx       # Paso 2
│   │   ├── location.tsx          # Paso 3
│   │   └── confirm.tsx           # Paso 4
│   └── _layout.tsx               # Root layout
│
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                   # Componentes base (Button, Input, Card...)
│   │   ├── alerts/               # Componentes de alertas
│   │   ├── maps/                 # Componentes de mapas
│   │   └── shared/               # Header, Loading, Empty...
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useAlerts.ts
│   │   ├── useLocation.ts
│   │   └── useNotifications.ts
│   │
│   ├── services/                 # Servicios y APIs
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── storage.ts
│   │   └── notifications.ts
│   │
│   ├── store/                    # Estado global (Zustand)
│   │   ├── authStore.ts
│   │   ├── alertStore.ts
│   │   └── index.ts
│   │
│   ├── types/                    # Tipos TypeScript
│   │   ├── auth.types.ts
│   │   ├── alert.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                    # Utilidades
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   │
│   └── theme/                    # Sistema de diseño
│       ├── colors.ts
│       ├── typography.ts
│       ├── spacing.ts
│       └── index.ts
│
├── assets/                       # Recursos estáticos
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── app.json                      # Configuración Expo
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### 9.3.2 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUJO DE DATOS - CREAR ALERTA               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   UI Component                                                   │
│       │                                                          │
│       │ 1. Usuario completa formulario                           │
│       ▼                                                          │
│   React Hook Form + Zod                                          │
│       │                                                          │
│       │ 2. Validación local                                      │
│       ▼                                                          │
│   Custom Hook (useCreateAlert)                                   │
│       │                                                          │
│       │ 3. Prepara datos                                         │
│       ▼                                                          │
│   Firebase Service (firestore.ts)                                │
│       │                                                          │
│       │ 4. addDoc() a Firestore                                  │
│       ▼                                                          │
│   Cloud Firestore                                                │
│       │                                                          │
│       │ 5. Trigger onCreate                                      │
│       ▼                                                          │
│   Cloud Function (onAlertCreated)                                │
│       │                                                          │
│       │ 6. Envía notificación                                    │
│       ▼                                                          │
│   Firebase Cloud Messaging                                       │
│       │                                                          │
│       │ 7. Push a operadores                                     │
│       ▼                                                          │
│   App Operador recibe notificación                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 9.4 Arquitectura del Panel Web Admin

### 9.4.1 Estructura de Carpetas (Next.js 14 App Router)

```
savia-admin/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Layout con sidebar
│   │   ├── page.tsx                # Dashboard principal
│   │   ├── alerts/
│   │   │   ├── page.tsx            # Lista de alertas
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Detalle de alerta
│   │   ├── users/
│   │   │   ├── page.tsx            # Lista de usuarios
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Detalle/editar usuario
│   │   ├── institutions/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   └── reports/
│   │       └── page.tsx
│   ├── api/                        # API Routes (si se necesitan)
│   │   └── [...]/
│   ├── layout.tsx                  # Root layout
│   └── globals.css
│
├── src/
│   ├── components/
│   │   ├── ui/                     # Shadcn components
│   │   ├── dashboard/
│   │   ├── alerts/
│   │   ├── users/
│   │   └── shared/
│   │
│   ├── lib/
│   │   ├── firebase-admin.ts       # Firebase Admin SDK
│   │   ├── firebase-client.ts      # Firebase Client SDK
│   │   └── utils.ts
│   │
│   ├── hooks/
│   ├── types/
│   └── services/
│
├── public/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 9.5 Arquitectura de Firebase

### 9.5.1 Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============ FUNCIONES AUXILIARES ============
    
    // Verificar si usuario está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Obtener datos del usuario actual
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    // Verificar rol del usuario
    function hasRole(role) {
      return isAuthenticated() && getUserData().role == role;
    }
    
    // Verificar si es el propietario del documento
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // ============ COLECCIÓN: USERS ============
    match /users/{userId} {
      // Cualquiera autenticado puede leer su propio perfil
      allow read: if isOwner(userId);
      
      // Solo el propio usuario puede actualizar ciertos campos
      allow update: if isOwner(userId) && 
        !request.resource.data.diff(resource.data).affectedKeys()
          .hasAny(['role', 'institutionId', 'isActive']);
      
      // Solo admins pueden crear usuarios operadores/admins
      allow create: if hasRole('admin');
      
      // Ciudadanos se pueden auto-registrar (vía Cloud Function)
      
      // Admins pueden leer/escribir todo
      allow read, write: if hasRole('admin');
    }
    
    // ============ COLECCIÓN: ALERTS ============
    match /alerts/{alertId} {
      // Ciudadanos pueden crear alertas
      allow create: if isAuthenticated() && 
        request.resource.data.citizenId == request.auth.uid &&
        request.resource.data.status == 'reported';
      
      // Ciudadanos pueden leer sus propias alertas
      allow read: if isAuthenticated() && 
        resource.data.citizenId == request.auth.uid;
      
      // Operadores pueden leer alertas de su institución o pendientes
      allow read: if hasRole('operator') && (
        resource.data.status == 'reported' ||
        resource.data.institutionId == getUserData().institutionId
      );
      
      // Operadores pueden actualizar alertas asignadas
      allow update: if hasRole('operator') && (
        resource.data.operatorId == request.auth.uid ||
        resource.data.status == 'reported'
      );
      
      // Admins tienen acceso total
      allow read, write: if hasRole('admin');
    }
    
    // ============ COLECCIÓN: INSTITUTIONS ============
    match /institutions/{institutionId} {
      // Todos los autenticados pueden leer instituciones
      allow read: if isAuthenticated();
      
      // Solo admins pueden modificar
      allow write: if hasRole('admin');
    }
    
    // ============ COLECCIÓN: CATEGORIES ============
    match /categories/{categoryId} {
      // Todos los autenticados pueden leer
      allow read: if isAuthenticated();
      
      // Solo admins pueden modificar
      allow write: if hasRole('admin');
    }
    
    // ============ COLECCIÓN: RATINGS ============
    match /ratings/{ratingId} {
      // Solo el ciudadano puede crear rating de su alerta
      allow create: if isAuthenticated() && 
        request.resource.data.citizenId == request.auth.uid;
      
      // Todos pueden leer ratings (para estadísticas)
      allow read: if isAuthenticated();
    }
  }
}
```

### 9.5.2 Cloud Functions

```typescript
// functions/src/index.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// ============ TRIGGER: Nueva Alerta Creada ============
export const onAlertCreated = functions.firestore
  .document('alerts/{alertId}')
  .onCreate(async (snapshot, context) => {
    const alertData = snapshot.data();
    const alertId = context.params.alertId;
    
    // Determinar institución destino según tipo de alerta
    const categoryDoc = await db.collection('categories')
      .doc(alertData.categoryId)
      .get();
    
    const institutionIds = categoryDoc.data()?.institutionIds || [];
    
    // Obtener tokens de operadores de esas instituciones
    const operatorsSnapshot = await db.collection('users')
      .where('role', '==', 'operator')
      .where('institutionId', 'in', institutionIds)
      .where('isActive', '==', true)
      .get();
    
    const tokens: string[] = [];
    operatorsSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.fcmToken) {
        tokens.push(userData.fcmToken);
      }
    });
    
    if (tokens.length > 0) {
      // Enviar notificación
      const notification = {
        title: `🚨 Nueva alerta: ${alertData.categoryName}`,
        body: `Urgencia: ${alertData.urgencyLevel} - ${alertData.address || 'Ver ubicación'}`,
      };
      
      await messaging.sendEachForMulticast({
        tokens,
        notification,
        data: {
          alertId,
          type: 'new_alert',
        },
        android: {
          priority: 'high',
        },
      });
    }
    
    return null;
  });

// ============ TRIGGER: Alerta Actualizada ============
export const onAlertUpdated = functions.firestore
  .document('alerts/{alertId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const alertId = context.params.alertId;
    
    // Solo notificar si cambió el estado
    if (before.status === after.status) {
      return null;
    }
    
    // Obtener token del ciudadano
    const citizenDoc = await db.collection('users')
      .doc(after.citizenId)
      .get();
    
    const citizenToken = citizenDoc.data()?.fcmToken;
    
    if (!citizenToken) {
      return null;
    }
    
    // Mapear estado a mensaje
    const statusMessages: Record<string, string> = {
      'in_progress': 'Un operador ha tomado tu alerta',
      'on_the_way': 'El operador va en camino',
      'on_site': 'El operador llegó al lugar',
      'resolved': '¡Tu alerta ha sido resuelta!',
    };
    
    const message = statusMessages[after.status];
    
    if (message) {
      await messaging.send({
        token: citizenToken,
        notification: {
          title: `Alerta #${alertId.slice(-6)}`,
          body: message,
        },
        data: {
          alertId,
          type: 'status_update',
          newStatus: after.status,
        },
      });
    }
    
    return null;
  });

// ============ FUNCIÓN: Registrar Ciudadano ============
export const registerCitizen = functions.https.onCall(async (data, context) => {
  // Validar datos
  const { dni, firstName, lastName, phone, email, password } = data;
  
  if (!dni || !firstName || !lastName || !phone || !password) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan campos requeridos'
    );
  }
  
  // Verificar DNI único
  const existingDni = await db.collection('users')
    .where('dni', '==', dni)
    .get();
  
  if (!existingDni.empty) {
    throw new functions.https.HttpsError(
      'already-exists',
      'El DNI ya está registrado'
    );
  }
  
  // Crear usuario en Auth
  const userRecord = await admin.auth().createUser({
    email: email || `${phone}@savia.temp`,
    password,
    displayName: `${firstName} ${lastName}`,
  });
  
  // Crear documento en Firestore
  await db.collection('users').doc(userRecord.uid).set({
    dni,
    firstName,
    lastName,
    phone,
    email: email || null,
    role: 'citizen',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { uid: userRecord.uid };
});
```

---

# 10. MODELO DE DATOS

## 10.1 Diagrama Entidad-Relación

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MODELO DE DATOS - SAVIA                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐         ┌──────────────────┐
    │    CATEGORIES    │         │   INSTITUTIONS   │
    ├──────────────────┤         ├──────────────────┤
    │ id (PK)          │         │ id (PK)          │
    │ name             │◄───────►│ name             │
    │ shortName        │   N:M   │ type             │
    │ emoji            │         │ phone            │
    │ color            │         │ email            │
    │ order            │         │ address          │
    │ isActive         │         │ isActive         │
    │ institutionIds[] │         │ createdAt        │
    └──────────────────┘         └────────┬─────────┘
             │                            │
             │ 1:N                        │ 1:N
             │                            │
             ▼                            ▼
    ┌──────────────────┐         ┌──────────────────┐
    │     ALERTS       │         │      USERS       │
    ├──────────────────┤         ├──────────────────┤
    │ id (PK)          │         │ id (PK)          │
    │ categoryId (FK)  │         │ dni              │
    │ categoryName     │         │ firstName        │
    │ description      │         │ lastName         │
    │ urgencyLevel     │◄───────►│ phone            │
    │ status           │   N:1   │ email            │
    │ location         │         │ role             │
    │ address          │         │ institutionId(FK)│
    │ imageUrls[]      │         │ isActive         │
    │ citizenId (FK)   │────────►│ fcmToken         │
    │ operatorId (FK)  │────────►│ createdAt        │
    │ institutionId(FK)│         └──────────────────┘
    │ timeline[]       │
    │ createdAt        │
    │ updatedAt        │
    └────────┬─────────┘
             │
             │ 1:1
             ▼
    ┌──────────────────┐
    │     RATINGS      │
    ├──────────────────┤
    │ id (PK)          │
    │ alertId (FK)     │
    │ citizenId (FK)   │
    │ operatorId (FK)  │
    │ rating           │
    │ comment          │
    │ createdAt        │
    └──────────────────┘
```

## 10.2 Colecciones de Firestore

### 10.2.1 Colección: `users`

```typescript
interface User {
  // Identificador (igual al UID de Firebase Auth)
  id: string;
  
  // Datos personales
  dni: string;                    // 8 dígitos, único
  firstName: string;              // Nombres
  lastName: string;               // Apellidos
  phone: string;                  // 9 dígitos, único
  email: string | null;           // Opcional para ciudadanos
  
  // Rol y permisos
  role: 'citizen' | 'operator' | 'admin';
  
  // Solo para operadores
  institutionId?: string;         // FK a institutions
  
  // Estado
  isActive: boolean;              // true = puede usar el sistema
  
  // Notificaciones
  fcmToken?: string;              // Token para push notifications
  
  // Auditoría
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}

// Ejemplo de documento
{
  "id": "abc123xyz",
  "dni": "12345678",
  "firstName": "María",
  "lastName": "García López",
  "phone": "987654321",
  "email": "maria.garcia@email.com",
  "role": "citizen",
  "isActive": true,
  "fcmToken": "fCm_token_here...",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T10:30:00Z"
}
```

### 10.2.2 Colección: `alerts`

```typescript
interface Alert {
  // Identificador
  id: string;
  
  // Tipo de alerta
  categoryId: string;             // FK a categories
  categoryName: string;           // Denormalizado para queries
  categoryEmoji: string;          // Denormalizado
  
  // Descripción
  description: string;            // Máximo 200 caracteres
  
  // Urgencia
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Ubicación
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;                // Dirección aproximada (geocoding)
  
  // Evidencia
  imageUrls: string[];            // URLs de Firebase Storage (máx 3)
  
  // Estado
  status: 'reported' | 'in_progress' | 'on_the_way' | 'on_site' | 'resolved' | 'closed';
  
  // Relaciones
  citizenId: string;              // FK a users (quien reportó)
  operatorId?: string;            // FK a users (quien atiende)
  institutionId?: string;         // FK a institutions
  
  // Timeline (historial de estados)
  timeline: {
    status: string;
    timestamp: Timestamp;
    userId: string;
    note?: string;
  }[];
  
  // Calificación (denormalizada)
  rating?: number;
  
  // Auditoría
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Ejemplo de documento
{
  "id": "alert_2026_0145",
  "categoryId": "cat_robbery",
  "categoryName": "Robo/Asalto",
  "categoryEmoji": "🚨",
  "description": "Intento de robo en la esquina. Sujeto con cuchillo.",
  "urgencyLevel": "critical",
  "location": {
    "latitude": -10.7312,
    "longitude": -73.7565
  },
  "address": "Av. Atalaya 234, esquina Jr. Ucayali",
  "imageUrls": [
    "https://storage.firebase.com/..../img1.jpg"
  ],
  "status": "in_progress",
  "citizenId": "user_abc123",
  "operatorId": "user_operator_456",
  "institutionId": "inst_pnp_atalaya",
  "timeline": [
    {
      "status": "reported",
      "timestamp": "2026-01-24T14:30:00Z",
      "userId": "user_abc123"
    },
    {
      "status": "in_progress",
      "timestamp": "2026-01-24T14:35:00Z",
      "userId": "user_operator_456",
      "note": "Tomando el caso"
    }
  ],
  "createdAt": "2026-01-24T14:30:00Z",
  "updatedAt": "2026-01-24T14:35:00Z"
}
```

### 10.2.3 Colección: `institutions`

```typescript
interface Institution {
  id: string;
  name: string;                   // "PNP Atalaya"
  type: 'pnp' | 'serenazgo' | 'bomberos' | 'salud' | 'defensa_civil' | 'otro';
  phone: string;
  email?: string;
  address: string;
  
  // Tipos de alerta que atiende
  categoryIds: string[];
  
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Ejemplo
{
  "id": "inst_pnp_atalaya",
  "name": "PNP Atalaya",
  "type": "pnp",
  "phone": "065-123456",
  "email": "comisaria.atalaya@pnp.gob.pe",
  "address": "Av. Principal 123, Atalaya",
  "categoryIds": ["cat_robbery", "cat_accident", "cat_violence"],
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

### 10.2.4 Colección: `categories`

```typescript
interface Category {
  id: string;
  name: string;                   // "Robo/Asalto"
  shortName: string;              // "Robo"
  emoji: string;                  // "🚨"
  color: string;                  // "#D32F2F"
  order: number;                  // Para ordenar en UI
  isActive: boolean;
  
  // Instituciones que atienden este tipo
  institutionIds: string[];
  
  createdAt: Timestamp;
}

// Datos iniciales
const INITIAL_CATEGORIES = [
  { id: "cat_robbery", name: "Robo/Asalto", shortName: "Robo", emoji: "🚨", color: "#D32F2F", order: 1 },
  { id: "cat_accident", name: "Accidente de tránsito", shortName: "Accidente", emoji: "🚗", color: "#F57C00", order: 2 },
  { id: "cat_medical", name: "Emergencia médica", shortName: "Médica", emoji: "🏥", color: "#E91E63", order: 3 },
  { id: "cat_fire", name: "Incendio", shortName: "Incendio", emoji: "🔥", color: "#FF5722", order: 4 },
  { id: "cat_electrical", name: "Falla eléctrica", shortName: "Eléctrica", emoji: "⚡", color: "#FFC107", order: 5 },
  { id: "cat_water", name: "Problema de agua", shortName: "Agua", emoji: "💧", color: "#2196F3", order: 6 },
  { id: "cat_lost", name: "Pérdida/Hallazgo", shortName: "Pérdida", emoji: "🔍", color: "#9C27B0", order: 7 },
  { id: "cat_other", name: "Otro", shortName: "Otro", emoji: "❓", color: "#607D8B", order: 8 },
];
```

### 10.2.5 Colección: `ratings`

```typescript
interface Rating {
  id: string;
  alertId: string;                // FK a alerts
  citizenId: string;              // FK a users
  operatorId: string;             // FK a users
  institutionId: string;          // FK a institutions
  
  rating: number;                 // 1-5 estrellas
  comment?: string;               // Máximo 300 caracteres
  
  createdAt: Timestamp;
}
```

## 10.3 Índices de Firestore

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "alerts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "urgencyLevel", "order": "DESCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "alerts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "citizenId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "alerts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "operatorId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "alerts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "institutionId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "role", "order": "ASCENDING" },
        { "fieldPath": "institutionId", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    }
  ]
}
```

---


---

# 11. APIS Y ENDPOINTS

## 11.1 Firebase SDK - Operaciones Principales

> **Nota**: Al usar Firebase, no hay endpoints REST tradicionales. Las operaciones se realizan mediante el SDK de Firebase directamente desde el cliente.

### 11.1.1 Autenticación

```typescript
// Registro de ciudadano (vía Cloud Function)
const registerCitizen = async (data: RegisterData) => {
  const result = await functions().httpsCallable('registerCitizen')(data);
  return result.data;
};

// Login
const login = async (email: string, password: string) => {
  const result = await auth().signInWithEmailAndPassword(email, password);
  return result.user;
};

// Logout
const logout = async () => {
  await auth().signOut();
};

// Recuperar contraseña
const resetPassword = async (email: string) => {
  await auth().sendPasswordResetEmail(email);
};
```

### 11.1.2 Alertas - Ciudadano

```typescript
// Crear alerta
const createAlert = async (alertData: CreateAlertInput): Promise<string> => {
  const docRef = await firestore().collection('alerts').add({
    ...alertData,
    citizenId: auth().currentUser!.uid,
    status: 'reported',
    timeline: [{
      status: 'reported',
      timestamp: firestore.FieldValue.serverTimestamp(),
      userId: auth().currentUser!.uid,
    }],
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
  return docRef.id;
};

// Obtener mis alertas
const getMyAlerts = (status?: AlertStatus) => {
  let query = firestore()
    .collection('alerts')
    .where('citizenId', '==', auth().currentUser!.uid)
    .orderBy('createdAt', 'desc');
  
  if (status) {
    query = query.where('status', '==', status);
  }
  
  return query;
};

// Escuchar alerta en tiempo real
const subscribeToAlert = (alertId: string, callback: (alert: Alert) => void) => {
  return firestore()
    .collection('alerts')
    .doc(alertId)
    .onSnapshot((doc) => {
      callback({ id: doc.id, ...doc.data() } as Alert);
    });
};

// Calificar atención
const rateAlert = async (alertId: string, rating: number, comment?: string) => {
  const alert = await firestore().collection('alerts').doc(alertId).get();
  const alertData = alert.data();
  
  await firestore().collection('ratings').add({
    alertId,
    citizenId: auth().currentUser!.uid,
    operatorId: alertData?.operatorId,
    institutionId: alertData?.institutionId,
    rating,
    comment: comment || null,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  
  // Actualizar rating en alerta
  await firestore().collection('alerts').doc(alertId).update({
    rating,
  });
};
```

### 11.1.3 Alertas - Operador

```typescript
// Obtener alertas pendientes
const getPendingAlerts = () => {
  return firestore()
    .collection('alerts')
    .where('status', '==', 'reported')
    .orderBy('urgencyLevel', 'desc')
    .orderBy('createdAt', 'asc');
};

// Obtener mis casos activos
const getMyActiveCases = () => {
  return firestore()
    .collection('alerts')
    .where('operatorId', '==', auth().currentUser!.uid)
    .where('status', 'in', ['in_progress', 'on_the_way', 'on_site'])
    .orderBy('createdAt', 'desc');
};

// Tomar caso
const takeCase = async (alertId: string) => {
  const userData = await getUserData(auth().currentUser!.uid);
  
  await firestore().collection('alerts').doc(alertId).update({
    status: 'in_progress',
    operatorId: auth().currentUser!.uid,
    institutionId: userData.institutionId,
    updatedAt: firestore.FieldValue.serverTimestamp(),
    timeline: firestore.FieldValue.arrayUnion({
      status: 'in_progress',
      timestamp: new Date(),
      userId: auth().currentUser!.uid,
      note: 'Caso tomado',
    }),
  });
};

// Actualizar estado
const updateAlertStatus = async (
  alertId: string, 
  newStatus: AlertStatus, 
  note?: string
) => {
  await firestore().collection('alerts').doc(alertId).update({
    status: newStatus,
    updatedAt: firestore.FieldValue.serverTimestamp(),
    timeline: firestore.FieldValue.arrayUnion({
      status: newStatus,
      timestamp: new Date(),
      userId: auth().currentUser!.uid,
      note: note || null,
    }),
  });
};

// Derivar alerta
const transferAlert = async (
  alertId: string, 
  newInstitutionId: string, 
  reason: string
) => {
  await firestore().collection('alerts').doc(alertId).update({
    status: 'reported', // Vuelve a pendiente
    operatorId: null,
    institutionId: null,
    updatedAt: firestore.FieldValue.serverTimestamp(),
    timeline: firestore.FieldValue.arrayUnion({
      status: 'transferred',
      timestamp: new Date(),
      userId: auth().currentUser!.uid,
      note: `Derivado a ${newInstitutionId}: ${reason}`,
    }),
  });
};
```

### 11.1.4 Administración

```typescript
// Dashboard - Estadísticas
const getDashboardStats = async (dateRange?: DateRange) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const alertsRef = firestore().collection('alerts');
  
  const [total, pending, resolved, critical] = await Promise.all([
    alertsRef.where('createdAt', '>=', today).get(),
    alertsRef.where('status', '==', 'reported').get(),
    alertsRef.where('status', '==', 'resolved').where('createdAt', '>=', today).get(),
    alertsRef.where('urgencyLevel', '==', 'critical').where('status', 'in', ['reported', 'in_progress']).get(),
  ]);
  
  return {
    totalToday: total.size,
    pending: pending.size,
    resolvedToday: resolved.size,
    criticalActive: critical.size,
  };
};

// CRUD Usuarios
const getUsers = (filters?: UserFilters) => {
  let query = firestore().collection('users').orderBy('createdAt', 'desc');
  
  if (filters?.role) {
    query = query.where('role', '==', filters.role);
  }
  
  return query;
};

const createOperator = async (data: CreateOperatorInput) => {
  // Usar Cloud Function para crear con Auth + Firestore
  const result = await functions().httpsCallable('createOperator')(data);
  return result.data;
};

const updateUser = async (userId: string, data: Partial<User>) => {
  await firestore().collection('users').doc(userId).update({
    ...data,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

const toggleUserStatus = async (userId: string, isActive: boolean) => {
  await firestore().collection('users').doc(userId).update({ isActive });
};

// CRUD Instituciones
const getInstitutions = () => {
  return firestore().collection('institutions').orderBy('name');
};

const createInstitution = async (data: CreateInstitutionInput) => {
  const docRef = await firestore().collection('institutions').add({
    ...data,
    isActive: true,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
  return docRef.id;
};

const updateInstitution = async (id: string, data: Partial<Institution>) => {
  await firestore().collection('institutions').doc(id).update({
    ...data,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};
```

## 11.2 Subida de Imágenes

```typescript
// Subir imagen de evidencia
const uploadAlertImage = async (
  alertId: string, 
  imageUri: string, 
  index: number
): Promise<string> => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  
  const path = `alerts/${alertId}/evidence_${index}_${Date.now()}.jpg`;
  const ref = storage().ref(path);
  
  await ref.put(blob);
  const downloadUrl = await ref.getDownloadURL();
  
  return downloadUrl;
};

// Subir avatar de usuario
const uploadUserAvatar = async (userId: string, imageUri: string): Promise<string> => {
  const path = `users/${userId}/avatar.jpg`;
  // ... similar al anterior
};
```

---

# 12. DISEÑO DE INTERFACES

## 12.1 Sistema de Diseño

El sistema de diseño completo está documentado en:
- **Archivo**: `SAVIA_System_Design_COMPLETO.md`
- **Ubicación**: `/Volumes/Datos/Trabajo/Sistemas/savia/`

### 12.1.1 Resumen de Tokens de Diseño

| Categoría | Tokens Principales |
|-----------|-------------------|
| **Colores Primarios** | `primary: #1976D2`, `primary-dark: #1565C0`, `primary-light: #BBDEFB` |
| **Colores de Estado** | `success: #4CAF50`, `warning: #FF9800`, `error: #F44336`, `info: #2196F3` |
| **Tipografía** | Font family: Inter, tamaños de 12px a 32px |
| **Espaciado** | Escala de 4px (xs) a 48px (2xl) |
| **Bordes** | radius de 4px (sm) a 16px (xl) |

### 12.1.2 Componentes Reutilizables

| Componente | Uso |
|------------|-----|
| `Button` | Primary, Secondary, Outline, Danger |
| `Input` | Text, Password, Search, con iconos |
| `Card` | Containers con sombra y bordes |
| `Badge` | Estados, categorías, contadores |
| `Header` | Navegación superior |
| `BottomNav` | Navegación inferior (tabs) |
| `AlertCard` | Lista de alertas |
| `UrgencySelector` | Selector de 4 niveles |
| `CategoryGrid` | Grid de 8 categorías |
| `Timeline` | Historial de estados |
| `Map` | Mapas interactivos |

## 12.2 Pantallas del Sistema

El catálogo completo de pantallas (33 total) está documentado en:
- **Archivo**: `SAVIA_UI_SPECS_COMPLETO.md`
- **Ubicación**: `/Volumes/Datos/Trabajo/Sistemas/savia/`

### 12.2.1 Resumen de Pantallas

| Módulo | Cantidad | Pantallas |
|--------|----------|-----------|
| **App Ciudadano** | 16 | Splash, Login, Registro, Recuperar, Home, Nueva Alerta (4 pasos), Confirmación, Mis Alertas, Detalle, Calificar, Mapa, Perfil, Notificaciones |
| **App Operador** | 7 | Home, Alertas Asignadas, Detalle, Actualizar Estado, Derivar, Historial, Perfil |
| **Panel Web Admin** | 10 | Login, Dashboard, Gestión Alertas, Detalle Alerta, Instituciones, Modal Institución, Usuarios, Modal Usuario, Categorías, Reportes |

---

# 13. PLAN DE DESARROLLO

## 13.1 Metodología

- **Enfoque**: Ágil con Scrum adaptado (1 desarrollador)
- **Sprints**: 1 semana de duración
- **Ceremonias**: Planning semanal, Review al final
- **Herramientas**: GitHub Projects para Kanban

## 13.2 Roadmap por MVP

### 13.2.1 MVP 1: Flujo Básico (4 semanas)

**Objetivo**: Ciudadano puede reportar alerta y operador puede atenderla.

| Semana | Sprint | Entregables |
|--------|--------|-------------|
| 1 | Sprint 1 | - Setup proyecto (Expo + Firebase)<br>- Autenticación ciudadano<br>- Autenticación operador |
| 2 | Sprint 2 | - Flujo crear alerta (4 pasos)<br>- Geolocalización<br>- Subida de imágenes |
| 3 | Sprint 3 | - Lista mis alertas (ciudadano)<br>- Lista alertas pendientes (operador)<br>- Tomar caso + actualizar estado |
| 4 | Sprint 4 | - Notificaciones push<br>- Timeline de estados<br>- Testing e2e<br>- Deploy beta |

**Historias Incluidas**: HU-AUTH-001 a 004, HU-ALC-001 a 005, HU-SEG-001 a 003, HU-OPE-001 a 004

### 13.2.2 MVP 2: Panel Admin + Mejoras (3 semanas)

**Objetivo**: Admin puede gestionar el sistema y nuevas funcionalidades móvil.

| Semana | Sprint | Entregables |
|--------|--------|-------------|
| 5 | Sprint 5 | - Setup Next.js admin<br>- Login admin<br>- Dashboard básico |
| 6 | Sprint 6 | - CRUD Usuarios<br>- CRUD Instituciones<br>- Gestión alertas |
| 7 | Sprint 7 | - Calificación ciudadano<br>- Mapa alertas cercanas<br>- Derivar alertas<br>- Navegación GPS |

**Historias Incluidas**: HU-SEG-004, HU-OPE-005 a 006, HU-ADM-001 a 003

### 13.2.3 MVP 3: Reportes y Optimización (2 semanas)

**Objetivo**: Reportes estadísticos y mejoras de rendimiento.

| Semana | Sprint | Entregables |
|--------|--------|-------------|
| 8 | Sprint 8 | - Reportes estadísticos<br>- Gráficos y visualizaciones<br>- Exportación PDF/Excel |
| 9 | Sprint 9 | - Mapa de calor<br>- Notificaciones por proximidad<br>- Optimización y QA final |

**Historias Incluidas**: HU-ADM-004, RF-NOT-003

## 13.3 Cronograma Detallado

```
ENERO 2026
═══════════════════════════════════════════════════════════════
Sem 1 (6-12)   │██████████│ Sprint 1: Setup + Auth
Sem 2 (13-19)  │██████████│ Sprint 2: Crear Alerta
Sem 3 (20-26)  │██████████│ Sprint 3: Gestión Alertas
Sem 4 (27-2)   │██████████│ Sprint 4: Notificaciones + Deploy

FEBRERO 2026
═══════════════════════════════════════════════════════════════
Sem 5 (3-9)    │██████████│ Sprint 5: Admin Panel Setup
Sem 6 (10-16)  │██████████│ Sprint 6: CRUD Admin
Sem 7 (17-23)  │██████████│ Sprint 7: Mejoras Móvil

MARZO 2026
═══════════════════════════════════════════════════════════════
Sem 8 (24-2)   │██████████│ Sprint 8: Reportes
Sem 9 (3-9)    │██████████│ Sprint 9: Optimización + Launch
```

## 13.4 Hitos del Proyecto

| # | Hito | Fecha Objetivo | Criterio de Cumplimiento |
|---|------|----------------|--------------------------|
| H1 | Proyecto configurado | 12 Ene 2026 | Expo + Firebase conectados, builds funcionando |
| H2 | Auth completo | 12 Ene 2026 | Login/Registro ciudadano y operador funcional |
| H3 | Crear alerta funcional | 19 Ene 2026 | Flujo de 4 pasos completo con GPS e imágenes |
| H4 | MVP 1 desplegado | 02 Feb 2026 | App en TestFlight/Play Console interno |
| H5 | Panel admin básico | 16 Feb 2026 | Dashboard + CRUD funcionando |
| H6 | MVP 2 completo | 23 Feb 2026 | Todas las funcionalidades MVP 2 |
| H7 | Reportes listos | 02 Mar 2026 | Exportación PDF/Excel funcionando |
| H8 | Launch público | 09 Mar 2026 | App publicada en Play Store |

## 13.5 Product Backlog Priorizado

| # | Historia/Tarea | Prioridad | SP | MVP | Estado |
|---|----------------|-----------|-----|-----|--------|
| 1 | Setup Expo + Firebase | Alta | 3 | 1 | 🔴 Pendiente |
| 2 | HU-AUTH-001: Registro ciudadano | Alta | 5 | 1 | 🔴 Pendiente |
| 3 | HU-AUTH-002: Login ciudadano | Alta | 3 | 1 | 🔴 Pendiente |
| 4 | HU-AUTH-004: Login operador | Alta | 3 | 1 | 🔴 Pendiente |
| 5 | HU-ALC-001: Crear alerta - Tipo | Alta | 3 | 1 | 🔴 Pendiente |
| 6 | HU-ALC-002: Crear alerta - Descripción | Alta | 3 | 1 | 🔴 Pendiente |
| 7 | HU-ALC-003: Crear alerta - Ubicación | Alta | 5 | 1 | 🔴 Pendiente |
| 8 | HU-ALC-004: Crear alerta - Confirmación | Alta | 5 | 1 | 🔴 Pendiente |
| 9 | HU-SEG-001: Ver mis alertas | Alta | 3 | 1 | 🔴 Pendiente |
| 10 | HU-OPE-001: Ver alertas pendientes | Alta | 3 | 1 | 🔴 Pendiente |
| 11 | HU-OPE-002: Tomar caso | Alta | 3 | 1 | 🔴 Pendiente |
| 12 | HU-OPE-004: Actualizar estado | Alta | 3 | 1 | 🔴 Pendiente |
| 13 | HU-SEG-003: Notificaciones push | Alta | 5 | 1 | 🔴 Pendiente |
| 14 | Cloud Functions setup | Alta | 5 | 1 | 🔴 Pendiente |
| 15 | HU-ADM-001: Dashboard | Alta | 5 | 2 | 🔴 Pendiente |
| ... | ... | ... | ... | ... | ... |

---

# 14. CRITERIOS DE ACEPTACIÓN GLOBALES

## 14.1 Definition of Done (DoD)

Una historia de usuario se considera **DONE** cuando:

- [ ] Código implementado y funcionando
- [ ] Tests unitarios escritos y pasando (>70% coverage)
- [ ] Código revisado (self-review para trabajo individual)
- [ ] Sin errores de lint (ESLint)
- [ ] Documentación actualizada si aplica
- [ ] Funcionalidad probada en dispositivo físico
- [ ] UX validada (flujos completos sin fricción)
- [ ] Commit con mensaje descriptivo (conventional commits)
- [ ] PR mergeado a develop/main

## 14.2 Criterios de Aceptación de MVP

### MVP 1
- [ ] Ciudadano puede registrarse y loguearse
- [ ] Ciudadano puede crear alerta con GPS e imágenes
- [ ] Ciudadano recibe notificación cuando su alerta es tomada
- [ ] Operador puede ver alertas pendientes
- [ ] Operador puede tomar caso y actualizar estado
- [ ] Ciudadano ve cambios de estado en tiempo real
- [ ] App funciona en Android 8+

### MVP 2
- [ ] Admin puede acceder a panel web
- [ ] Admin ve dashboard con KPIs
- [ ] Admin puede gestionar usuarios y instituciones
- [ ] Ciudadano puede calificar atención
- [ ] Ciudadano ve mapa de alertas cercanas
- [ ] Operador puede derivar alertas

### MVP 3
- [ ] Admin puede generar reportes con rango de fechas
- [ ] Reportes exportables a PDF y Excel
- [ ] Mapa de calor funcional
- [ ] Notificaciones por proximidad configurables

---

# 15. RIESGOS Y MITIGACIONES

## 15.1 Matriz de Riesgos

| ID | Riesgo | Probabilidad | Impacto | Nivel | Mitigación |
|----|--------|--------------|---------|-------|------------|
| R1 | Baja adopción ciudadana | Media | Alto | 🔴 Alto | Campaña de lanzamiento con COPROSEC, capacitación |
| R2 | Operadores no usan la app | Media | Alto | 🔴 Alto | Interfaz simple, capacitación, gamificación |
| R3 | Problemas de conectividad | Alta | Medio | 🟠 Medio | Mensajes claros, retry automático |
| R4 | Costos Firebase exceden presupuesto | Baja | Alto | 🟠 Medio | Monitoreo de uso, optimizar queries |
| R5 | Retraso en desarrollo | Media | Medio | 🟠 Medio | Buffer en cronograma, priorización estricta |
| R6 | Vulnerabilidades de seguridad | Baja | Alto | 🟠 Medio | Security rules estrictas, auditoría |
| R7 | Falsos positivos (alertas falsas) | Media | Bajo | 🟡 Bajo | Sistema de reporte, posible penalización |
| R8 | GPS impreciso | Media | Medio | 🟠 Medio | Permitir ajuste manual, geocoding |

## 15.2 Plan de Contingencia

| Riesgo | Acción de Contingencia |
|--------|------------------------|
| R1: Baja adopción | Pilotar con grupo pequeño, iterar según feedback |
| R2: Operadores no usan | Hacer app obligatoria institucionalmente |
| R4: Costos altos | Migrar a plan Blaze con alertas de presupuesto |
| R5: Retrasos | Reducir alcance de MVP3, entregar funcionalidades core |

---

# 16. MÉTRICAS DE ÉXITO

## 16.1 KPIs del Producto

| Métrica | Baseline | Meta MVP1 | Meta MVP2 | Meta MVP3 |
|---------|----------|-----------|-----------|-----------|
| Usuarios registrados | 0 | 100 | 500 | 2,000 |
| Alertas creadas/mes | 0 | 50 | 200 | 500 |
| Tiempo promedio de respuesta | N/A | < 20 min | < 15 min | < 10 min |
| Tasa de resolución | N/A | 60% | 80% | 90% |
| Satisfacción (rating promedio) | N/A | 3.5/5 | 4.0/5 | 4.5/5 |
| Operadores activos | 0 | 5 | 10 | 15 |
| Instituciones integradas | 0 | 2 | 4 | 5 |

## 16.2 KPIs Técnicos

| Métrica | Objetivo |
|---------|----------|
| Uptime del sistema | > 99.5% |
| Tiempo de carga de app | < 3 segundos |
| Crash-free users | > 99% |
| Errores por día | < 10 |
| Latencia de notificaciones | < 10 segundos |

## 16.3 Cómo Medir

| KPI | Herramienta |
|-----|-------------|
| Usuarios registrados | Firebase Auth dashboard |
| Alertas creadas | Firestore queries / Admin Panel |
| Tiempo de respuesta | Cálculo: promedio(timestamp_tomado - timestamp_creado) |
| Satisfacción | Promedio de ratings en colección |
| Uptime | Firebase Status + Crashlytics |
| Tiempo de carga | Firebase Performance Monitoring |

---

# 17. GLOSARIO

| Término | Definición |
|---------|------------|
| **Alerta** | Reporte de emergencia o incidente creado por un ciudadano |
| **Ciudadano** | Usuario que reporta emergencias (rol en el sistema) |
| **Operador** | Personal de institución que atiende alertas |
| **Administrador** | Usuario con acceso total al panel de gestión |
| **COPROSEC** | Comité Provincial de Seguridad Ciudadana |
| **Institución** | Entidad que atiende emergencias (PNP, Serenazgo, etc.) |
| **Urgencia** | Nivel de prioridad de una alerta (Baja, Media, Alta, Crítica) |
| **Timeline** | Historial de cambios de estado de una alerta |
| **Derivar** | Transferir una alerta a otra institución |
| **MVP** | Producto Mínimo Viable |
| **Push Notification** | Notificación que llega al dispositivo del usuario |
| **Georreferenciación** | Asociar coordenadas GPS a una ubicación |
| **FCM** | Firebase Cloud Messaging (servicio de notificaciones) |
| **CRUD** | Create, Read, Update, Delete (operaciones básicas) |

---

# 18. ANEXOS

## 18.1 Referencias de Documentos

| Documento | Ubicación | Descripción |
|-----------|-----------|-------------|
| System Design | `/savia/SAVIA_System_Design_COMPLETO.md` | Arquitectura técnica detallada |
| UI Specs | `/savia/SAVIA_UI_SPECS_COMPLETO.md` | Especificaciones de 33 pantallas |
| Sílabo del curso | Aula Virtual UC | Requisitos académicos |
| PA1 | Entregado | Documento de iniciación del proyecto |
| PA2 | En desarrollo | Documento de diseño y planificación |

## 18.2 Historial de Revisiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 27/01/2026 | Documento inicial completo |

---

**FIN DEL DOCUMENTO**

---

*PRD SAVIA v1.0*
*Elaborado por: Edwin Wilson Méndez Echevarría*
*Universidad Continental - Taller de Proyectos I*
*Enero 2026*
