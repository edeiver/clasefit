# ClaseFit · Contexto del proyecto

## Propósito

ClaseFit es un MVP de reservas de clases grupales de un gimnasio.

- **Insumo funcional (fuente de verdad):** `./insumo-funcional/insumo_funcional_ClaseFit.md`
- Solo se implementan las funcionalidades definidas en el insumo funcional.
- **Fuera de alcance:** login, pagos, instructores, administración, notificaciones, backend.

## Stack

| Tecnología | Versión |
|---|---|
| Expo SDK (plantilla blank-typescript) | ~57.0.27 |
| React Native | 0.86.3 |
| React | 19.2.3 |
| TypeScript | ~6.0.3 |
| Jest | ~29.7.0 |
| jest-expo | ~57.0.5 |

Solo datos locales, sin backend.

## Estructura de carpetas

```
src/
  domain/        # lógica de negocio pura, sin imports de React
  state/         # estado con useReducer + Context
  screens/       # pantallas
  components/    # componentes de UI reutilizables
  data/
    clases.json  # datos de clases
__tests__/       # (en la raíz) tests del dominio
```

## Convenciones

- Las reglas de negocio son funciones puras que reciben `now: Date` como parámetro; **nunca** llamar `new Date()` dentro de `src/domain`.
- Zona horaria: **America/Bogota** (UTC-05:00, sin horario de verano).
- Los mensajes al usuario se copian **textualmente** del insumo funcional.

## Navegación

Sin Expo Router. Dos pantallas alternadas con un estado de pestañas simple en `App.tsx`.

## Idioma

Los artefactos de OpenSpec se escriben en español, manteniendo en inglés las palabras clave de OpenSpec (SHALL/MUST, WHEN/THEN/AND, Requirement, Scenario).

## Reglas para artefactos de OpenSpec

- **Proposal:** indicar siempre qué queda fuera de alcance.
- **Specs:** cada regla de negocio RN-01..RN-04 debe tener su propio Requirement con Scenarios, incluyendo casos límite. No agregar reglas que no estén en el insumo funcional.
- **Tasks:** tareas pequeñas, cada una verificable.

## Cómo ejecutar

```bash
npx expo start   # iniciar la app
npm test         # ejecutar los tests
```
