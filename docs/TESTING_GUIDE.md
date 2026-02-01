# Guía de Testing — SAVIA Mobile

## Stack de Testing

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `jest` | ~29.7.0 | Test runner |
| `jest-expo` | ~54.0.17 | Preset de Jest compatible con Expo SDK 54 |
| `@testing-library/react-native` | ^13.3.3 | Utilidades de render y queries para componentes RN |
| `react-test-renderer` | 19.1.0 | Peer dependency (misma versión que React) |
| `@types/jest` | ^30.0.0 | Tipos de TypeScript para Jest |

## Comandos

```bash
cd savia-mobile/

pnpm test              # Ejecutar todos los tests
pnpm test:watch        # Modo watch (re-ejecuta al guardar)
pnpm test:coverage     # Ejecutar con reporte de cobertura
pnpm test -- --testPathPattern="errorMessages"   # Ejecutar un archivo específico
```

## Archivos de Configuración

### `jest.config.js`
- **Preset**: `jest-expo` (transforma JSX, TypeScript, maneja assets de RN)
- **Alias**: `@/*` → `src/*` (misma resolución que en la app)
- **transformIgnorePatterns**: Lista de paquetes de `node_modules/` que Jest debe transformar (Firebase, Expo, Navigation, lucide, etc.)
- **collectCoverageFrom**: Incluye todo `src/`, excluye tipos, theme y constantes

### `jest.setup.js`
Mocks globales que se cargan antes de cada test. Mockea módulos que no funcionan en un entorno Node.js:

| Módulo | Qué se mockea |
|--------|--------------|
| `@/shared/config/firebase` | `auth`, `db`, `functions` como objetos vacíos |
| `firebase/auth` | `signInWithEmailAndPassword`, `onAuthStateChanged`, etc. |
| `firebase/firestore` | `getDoc`, `doc`, `setDoc`, `Timestamp`, etc. |
| `firebase/functions` | `getFunctions`, `httpsCallable` |
| `@react-navigation/*` | `useNavigation`, `useRoute`, navigators |
| `react-native-safe-area-context` | `SafeAreaView`, `useSafeAreaInsets` |
| `react-native-screens` | `enableScreens` |
| `@react-native-async-storage` | `getItem`, `setItem`, etc. |
| `expo-status-bar` | `StatusBar` como null |
| `expo-splash-screen` | `preventAutoHideAsync`, `hideAsync` |
| `expo-linear-gradient` | `LinearGradient` como View |
| `expo-font` / `@expo-google-fonts/inter` | `useFonts` retorna `[true, null]` |
| `lucide-react-native` | Proxy genérico: cualquier icono retorna un View con testID |

## Tests Existentes

### 1. `src/shared/utils/__tests__/errorMessages.test.ts` (7 tests)
**Valida**: función `getFirebaseErrorMessage()`
- Mapeo correcto de códigos auth → mensajes en español
- Mapeo de códigos functions → mensajes
- Manejo de códigos desconocidos, errores sin `code`, `null`, `undefined`

**Detecta regresiones si**: se modifica el mapa de errores, se cambia la firma de la función, o se elimina un código

### 2. `src/features/auth/schemas/__tests__/authSchemas.test.ts` (12 tests)
**Valida**: esquemas Zod (`loginSchema`, `registerSchema`, `forgotPasswordSchema`)
- Login: email válido/inválido/vacío, password vacío
- Registro: datos completos, DNI corto, DNI con letras, passwords no coinciden, términos no aceptados, teléfono inválido
- Forgot password: email válido/inválido

**Detecta regresiones si**: cambian las reglas de validación de formularios, se elimina un campo, o se altera un constraint

### 3. `src/shared/store/__tests__/authStore.test.ts` (5 tests)
**Valida**: Zustand store de autenticación (`useAuthStore`)
- `onAuthStateChanged(null)` → no autenticado
- Ciudadano autenticado → carga `userData`, sin `institutionData`
- Agente inactivo → `inactiveAccountError`, llama `signOut`, NO `isAuthenticated`
- Agente activo → carga `userData` + `institutionData`
- `reset()` limpia todo el estado

**Detecta regresiones si**: cambia la lógica de roles, el flujo de agentes inactivos, o la carga de datos de institución

### 4. `src/shared/components/__tests__/ButtonPrimary.test.tsx` (5 tests)
**Valida**: componente `ButtonPrimary`
- Renderiza el título
- `onPress` se ejecuta al presionar
- `disabled` bloquea el press
- `loading` oculta el texto y muestra spinner
- `loading` bloquea el press

**Detecta regresiones si**: cambia el comportamiento de disabled/loading, o se altera la estructura del componente

## Cómo Agregar Nuevos Tests

### Para utilidades/funciones puras
```
src/shared/utils/__tests__/nombreUtil.test.ts
```
No necesitan mocks adicionales. Solo importar y testear.

### Para esquemas Zod
```
src/features/{feature}/schemas/__tests__/nombreSchema.test.ts
```
Usar `schema.safeParse(data)` y verificar `result.success`.

### Para stores Zustand
```
src/shared/store/__tests__/nombreStore.test.ts
```
- Mockear los servicios que el store consume con `jest.mock()`
- Usar `store.getState().action()` para disparar acciones
- Verificar estado con `store.getState()`
- Limpiar con `jest.clearAllMocks()` y `store.getState().reset()` en `beforeEach`

### Para componentes
```
src/shared/components/__tests__/NombreComponente.test.tsx
```
```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MiComponente } from '@/shared/components/MiComponente';

it('renderiza correctamente', () => {
  render(<MiComponente prop="valor" />);
  expect(screen.getByText('valor')).toBeTruthy();
});
```

### Para screens (más complejo)
```
src/features/{feature}/screens/__tests__/NombreScreen.test.tsx
```
Generalmente requieren mockear navigation, hooks, y servicios. Usar mocks del setup global + mocks locales con `jest.mock()`.

## Si un test falla por módulo ESM no transformado

Error típico: `SyntaxError: Unexpected token 'export'`

**Solución**: agregar el paquete a `transformIgnorePatterns` en `jest.config.js`:
```javascript
'|nombre-del-paquete'
```

## Cuándo Ejecutar Tests

- **Obligatorio**: antes de mergear cualquier feature branch a `develop`
- **Recomendado**: durante desarrollo en modo watch (`pnpm test:watch`)
- **Opcional**: con coverage al cerrar un sprint (`pnpm test:coverage`)

## Convenciones

- Nombres de test en **español** (consistente con el proyecto)
- Usar `describe` para agrupar por función/componente
- Usar `it` con descripción que empiece con verbo: "renderiza", "rechaza", "retorna"
- Un archivo `__tests__/` por cada módulo testeado, al lado del código fuente
- Mocks globales en `jest.setup.js`, mocks específicos con `jest.mock()` local en el test
