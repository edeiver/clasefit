# Bitácora de uso de IA

> **Resumen.** Recorrí el ciclo completo de OpenSpec (propose → validate `--strict` → apply en dos tandas → archive) dirigiendo a Claude Code fase por fase, con un commit por fase. Detecté **9 errores de IA**; los tres más importantes:
> 1. `tasks.md` dejó un Scenario de la spec sin prueba (hueco de trazabilidad), que cerré antes de seguir.
> 2. `tasks.md` pedía `npx expo lint`, que instala dependencias y contradecía el `proposal.md`.
> 3. El mockup de Stitch ocultaba "Reservar" en una clase ya reservada, lo que habría hecho imposible mostrar RN-02.
>
> Resultado: spec válida, 32 pruebas en verde (una por Scenario) y verificación manual en simulador.

## Herramientas que usé
- **Claude Code** (terminal, v2.1.287, modelo Opus 5.5, esfuerzo medium): ejecutar cada fase en el repo. Generó los artefactos de OpenSpec, el código, las pruebas y la configuración de release. Aprobé cada edición después de leerla.
- **OpenSpec 1.14.1** (schema `spec-driven`, contexto en `openspec/config.yaml` + `openspec/project.md`, comandos `/opsx:propose`, `/opsx:apply`, `archive`).
- **Claude (chat en la app de escritorio, con acceso a la carpeta del proyecto):** planear las fases, redactar y revisar prompts, revisar cada salida de Claude Code contra el insumo y la spec, llevar un registro de lo que pasaba y redactar borradores de esta bitácora, del README y de la reflexión (esta última a partir de mis respuestas, con mis ideas). Los revisé y ajusté yo.
- **ChatGPT:** segunda opinión y revisión. (1) Le pedí un plan alternativo y lo contrasté con el flujo principal: me quedé con la regla de prioridades (ciclo + reglas + tests primero; UI y bonus al final) y descarté lo que sobredimensionaba la entrega. (2) Yo mejoraba los prompts y le preguntaba "¿qué no tuve en cuenta? ¿dónde puede mejorar?". Los cambios que me parecían correctos los aplicaba yo.
- **Stitch (Google):** mockup visual de las 2 pantallas al final, con la app ya funcionando. Lo usé solo como referencia de estilos; no se usó su código.
- Expo SDK 57, EAS CLI, Jest + jest-expo, simulador de iOS para la verificación manual.

## Prompts clave (3 a 5)
| # | Fase | Prompt | Qué obtuve |
|---|---|---|---|
| 1 | 2 · Spec | `/opsx:propose add-class-booking` con el insumo como fuente de verdad, las 7 decisiones ya tomadas (cupos = `cupoTotal − ocupados − reservas de Laura`, reloj inyectable `now`, UTC-05:00 fijo, clase oculta si `inicio <= now`, RN-03 por día de clase, RN-04 permite a las 2 h exactas, orden RN-02 → RN-01 → RN-03) y la orden de no inventar reglas | `proposal.md`, `spec.md` (10 Requirements con Scenarios de límite al milisegundo), `design.md`, `tasks.md`. `openspec validate --strict` válido. Dejó 8 ambigüedades en Open Questions en vez de decidirlas sola |
| 2 | 2 · Ajuste | "I reviewed the artifacts. Apply ONLY these changes…": pasar mis decisiones de UI de Open Questions a Decisions, ajustar 2 escenarios y quitar `npx expo lint` de tasks | Aplicó exactamente los 3 cambios, sin tocar nada más. Validación `--strict` OK |
| 3 | 3a · Dominio | `/opsx:apply` solo grupos 1–4: dominio puro + pruebas, "one test per Scenario, using the exact Scenario name as the test title", `now` fijo en tests, sin `new Date()` en `src/domain`, sin dependencias | Dominio + 9 suites (28 tests) en verde. Cada `describe` = Requirement y cada `test` = Scenario: trazabilidad directa spec → prueba |
| 4 | 3b · Estado y UI | `/opsx:apply`: primero cerrar un hueco de trazabilidad (etiqueta de día + test del Scenario que faltaba), luego reducer, Context y pantallas, sin reimplementar reglas en la UI | Reducer puro que delega en el dominio, 2 pantallas, 11 suites (32 tests) en verde. Verificado a mano en el simulador |
| 5 | Pulido UI | "UI polish only, using the mockups as VISUAL reference" + reglas: no tocar dominio/reducer/datos/textos/tests, sin dependencias, datos reales, no copiar textos inventados del mockup | Nuevo diseño (encabezado, segmented control, secciones por día, pills, banner verde/rojo) sin tocar la lógica; 32/32 tests siguen en verde |

<details>
<summary>Prompt #1 (propose), texto resumido: las secciones por artefacto van abreviadas</summary>

```
/opsx:propose add-class-booking

We are implementing the ClaseFit technical test.

IMPORTANT:
- Generate OpenSpec artifacts ONLY.
- Do NOT implement application code.
- Do NOT create screens, components, state, services, domain code, or tests.
- Do NOT modify files outside the OpenSpec change being created.
- Do NOT create any other OpenSpec changes.
- Do NOT silently invent or decide business rules.

SOURCE OF TRUTH
Read these files before generating anything:
- ./insumo-funcional/insumo_funcional_ClaseFit.md
- openspec/project.md
- openspec/config.yaml
- ./src/data/clases.json
The functional input is the source of truth for product behavior.
Do not add features or business rules that are not supported by it.

(… secciones por artefacto: proposal con ## Why / ## What Changes / ## Impact / ## Out of Scope;
spec con un Requirement por HU y por RN, Scenarios WHEN/THEN/AND, mensajes textuales;
design con ## Context / ## Decisions / ## Discarded alternative / ## Risks / Open Questions;
tasks pequeñas, lógica y pruebas antes de estado y pantallas, cada tarea de test referenciando sus Scenarios …)

REQUIRED BUSINESS DECISIONS (do NOT change them)
1. Available seats = cupoTotal - ocupados - Laura's bookings for that class. UI: "X de Y cupos".
2. Class start = Bogota calendar date of `now` + diaOffset, at `hora`, fixed UTC-05:00. Domain functions receive `now: Date`; no `new Date()` inside the domain.
3. A class is hidden when classStart <= now (boundary scenario for start == now).
4. RN-03 counts by CLASS date, not booking date.
5. RN-04: exactly 2 hours before → cancellation IS allowed; less than 2 hours → rejected. Document in design.md that the methodology guide example says "2 horas o menos" and we follow the functional input.
6. Validation order: RN-02, RN-01, RN-03.
7. useReducer + Context, in memory. No Redux/Zustand.

Write the OpenSpec artifacts in Spanish (keywords in English). Run `openspec validate add-class-booking --strict`, then STOP.
```
</details>

<details>
<summary>Texto completo del prompt #4 (apply 3b)</summary>

```
/opsx:apply add-class-booking

Groups 1-4 are done and reviewed. Do the following, in order:

A) Fix a traceability gap first:
   - Add to tasks.md: "3.7 Implementar en src/domain la etiqueta de día según diaOffset (0 → "Hoy", 1 → "Mañana", 2 → "Pasado mañana") según design.md" and "4.9 __tests__/classDetails.test.ts: Scenario "Datos mostrados por clase" (Requirement: HU-01)".
   - Implement 3.7 as a pure function in src/domain (no React).
   - Implement 4.9: one test titled exactly "Datos mostrados por clase" checking C-02 with now = 2026-10-07T10:00:00-05:00: nombre "Funcional", día "Hoy", hora "18:00", instructor "Camila Ospina", "6 de 15 cupos".

B) Then implement task groups 5 to 9 (reducer + its tests, Context, ClassCard, both screens, tab state in App.tsx, booking/cancel integration).

Rules:
- No new dependencies. Use only react-native core components (View, Text, FlatList, Pressable, Alert, StyleSheet).
- The UI must NOT reimplement any business rule: always call src/domain. Get `now` with new Date() only in the UI/state layer at the moment of render or action, and pass it to the domain.
- Show result messages ("¡Listo! Tu cupo está reservado" or the rule's error) in a simple inline banner on screen. Use Alert.alert only for the cancellation confirmation.
- Simple, clean UI. Do not spend effort on styling.
- Reducer tests: one test per Scenario, exact Scenario names as test titles.
- Mark completed tasks as [x] in tasks.md. Do NOT do 10.1 (I will verify manually).

When done, run `npm test` and `npx tsc --noEmit` and show me ONLY: files created/modified, Jest summary, tsc result. Then STOP.
```
</details>

## Errores de IA detectados
| # | Qué hizo mal | Cómo lo detecté | Cómo lo resolví |
|---|---|---|---|
| 1 | **ChatGPT (plan alternativo):** proponía una capa `docs/` (prompts, decisiones, errores) que duplicaba esta bitácora y `design.md`, commits de pruebas *después* de las features, el typo "ClassFit", y no vio que el ejemplo de la guía ("2 horas o menos") contradice el insumo en RN-04 | Revisé el plan contra el enunciado y la guía metodológica | Descarté la capa extra, reordené los commits (lógica + pruebas juntas), corregí el nombre y documenté la contradicción de RN-04 en `design.md` |
| 2 | **Prompt de la Fase 2 (versión revisada con ChatGPT):** usaba encabezados `# Why`, `# Context` en lugar de `## Why`; OpenSpec valida `## Why` / `## What Changes` | Comparé el prompt con el formato de OpenSpec y las plantillas antes de ejecutarlo | Cambié a `##` antes de correrlo; la validación `--strict` pasó a la primera |
| 3 | **Claude (chat):** me pasó comandos con comentarios `# …` al final de la línea; en zsh interactivo eso no es comentario y `eas login` falló con "Unexpected arguments" | Error en la terminal | Corrí el comando solo; de ahí en adelante, comandos sin comentarios |
| 4 | **Claude (chat):** el comando de instalación sugerido dejó `jest`, `jest-expo` y `@types/jest` en `dependencies` en vez de `devDependencies` | Revisé `package.json` después de la instalación | Los moví a `devDependencies` (mismas versiones) en la Fase 1 |
| 5 | **Contexto para la IA del template de Expo:** el `AGENTS.md` del SDK 57 le ordena a la IA "Use Expo Router for all navigation", lo que contradice mi diseño (sin router, `src/screens`) | Leí los archivos de contexto antes del primer prompt | Reemplacé solo esa sección de `AGENTS.md` en la Fase 1, antes de que la IA actuara |
| 6 | **Claude Code:** `tasks.md` pedía `npx expo lint`, que la primera vez instala ESLint, contradiciendo "Dependencias: ninguna nueva" del `proposal.md` (venía del `AGENTS.md` del template) | Comparé `tasks.md` contra `proposal.md` | Lo quité de la tarea 10.2 |
| 7 | **Claude Code:** `tasks.md` no asignó a ninguna prueba el Scenario "Datos mostrados por clase" (hueco de trazabilidad spec → test) | Crucé cada Scenario de `spec.md` contra los títulos de los tests | Agregué las tareas 3.7 (etiqueta de día en el dominio) y 4.9 (test del Scenario) |
| 8 | **Claude Code:** modificó `tsconfig.json` (`"types": ["jest"]`) sin que estuviera en el alcance | Revisé la lista de archivos tocados y `expo/tsconfig.base.json` | Verifiqué que era necesario (con TypeScript 6 los `@types` no se incluyen solos) y lo acepté |
| 9 | **Stitch:** la versión "refinada" del mockup inventó un botón "Ver detalles" (pantalla inexistente) y estados de reserva, ocultó "Reservar" en la clase ya reservada pese a la instrucción explícita (no se podría mostrar RN-02) y usaba íconos que exigen una dependencia. Ambas versiones inventaron clases que no están en `clases.json` | Comparé los mockups contra la spec y contra `clases.json` | Elegí la versión simple y solo adapté estilos, con los datos reales y los textos de la spec |

## Resultado de `openspec validate`
```
$ openspec validate add-class-booking --strict
Change 'add-class-booking' is valid

$ openspec archive add-class-booking
Task status: ✓ Complete
Specs to update:
  class-booking: create
✔ Proceed with spec updates? Yes
Applying changes to openspec/specs/class-booking/spec.md:
  + 10 added
Totals: + 10, ~ 0, - 0, → 0
Specs updated successfully.
Change 'add-class-booking' archived as '2026-10-07-add-class-booking'.

$ openspec validate --all
✓ spec/class-booking
Totals: 1 passed, 0 failed (1 items)
```

```
$ npm test
Test Suites: 11 passed, 11 total
Tests:       32 passed, 32 total
$ npx tsc --noEmit
(sin errores)
```
