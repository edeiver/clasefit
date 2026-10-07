# ClaseFit

MVP de reservas de clases grupales para un gimnasio de barrio (Sede Laureles, Medellín). La socia autenticada, Laura Gómez, puede ver las próximas clases, reservar, ver sus reservas y cancelar. Prueba técnica del Programa Espartanos de KEPPRI, hecha con Spec-Driven Development (OpenSpec) y asistentes de IA.

**Stack:** React Native 0.86 · Expo SDK 57 · TypeScript · Jest (jest-expo) · datos locales, reservas en memoria.

## Cómo correr la app

Requisitos: Node.js 20 o superior y Expo Go en el celular (o simulador de iOS / emulador de Android).

```bash
npm install
npx expo start
```

Escanea el QR con Expo Go, o presiona `i` (simulador de iOS) / `a` (emulador de Android).

APK de Android (perfil `preview`, EAS Build): https://expo.dev/accounts/edeiver/projects/clasefit/builds/c42317a5-8ef0-41be-b538-5266f488a4d7

## Cómo correr las pruebas

```bash
npm test             # 11 suites, 32 pruebas
npx tsc --noEmit     # verificación de tipos
```

Cada `describe` lleva el nombre del Requirement y cada `test` el nombre exacto del Scenario de la spec, así que cada prueba se puede rastrear hasta `openspec/specs/class-booking/spec.md`.

### Verificación manual (simulador de iOS)

Los escenarios de interfaz que no tienen prueba automática se verificaron a mano (tarea 10.1 de `tasks.md`):

| Acción | Resultado esperado | ✓ |
|---|---|---|
| Ver Próximas clases | Clases ordenadas por día y hora; las llenas muestran "Llena" sin botón | ✅ |
| Reservar una clase con cupo | "¡Listo! Tu cupo está reservado" y el cupo baja en uno | ✅ |
| Reservar la misma clase otra vez | "Ya reservaste esta clase." (RN-02) | ✅ |
| Reservar una 3.ª clase el mismo día | "Solo puedes reservar 2 clases por día." (RN-03) | ✅ |
| Reservar el último cupo | La clase pasa a "Llena" (RN-01) | ✅ |
| Mis reservas | Ordenadas, la más próxima primero | ✅ |
| Cancelar → "No" | La reserva se mantiene | ✅ |
| Cancelar → "Sí" | Desaparece y el cupo se libera; se puede volver a reservar ese día | ✅ |

RN-04 solo se puede ver en vivo entre 2 h y el inicio de una clase; está cubierta por las pruebas con reloj inyectado (`__tests__/rn04.test.ts`, incluido el límite de 2 h exactas).

## Estructura

```
src/
  domain/        reglas de negocio puras (sin React): fechas, cupos, RN-01..RN-04, listados
  state/         useReducer + Context; el reducer delega toda validación al dominio
  screens/       Próximas clases y Mis reservas
  components/    ClassCard
  data/          clases.json (insumo funcional)
__tests__/       pruebas unitarias derivadas de los escenarios de la spec
openspec/
  project.md, config.yaml                         contexto del proyecto para la IA
  specs/class-booking/spec.md                     spec vigente (tras archivar)
  changes/archive/2026-10-07-add-class-booking/   proposal, design, tasks y spec delta
insumo-funcional/  insumo original entregado por el equipo funcional
```

## Decisiones principales (detalle en `design.md`)

- **Reloj inyectable:** todas las funciones del dominio reciben `now: Date`; nunca llaman `new Date()`. Así se prueban los límites (clase que empieza exactamente ahora, cancelación a 2 h exactas).
- **Zona horaria:** America/Bogota con desfase fijo UTC-05:00 (Colombia no tiene horario de verano); el resultado no depende de la zona del dispositivo.
- **Cupos disponibles** = `cupoTotal − ocupados − reservas de Laura`.
- **RN-03** cuenta por el día de la clase, no por el día en que se reservó.
- **RN-04:** a exactamente 2 horas del inicio **sí** se puede cancelar; con menos, no. Se sigue el insumo funcional; el ejemplo de la guía metodológica ("2 horas o menos") difiere.
- **Orden de validación al reservar:** RN-02 → RN-01 → RN-03.
- **Sin librerías de estado ni de navegación:** `useReducer` + Context y un estado de pestañas en `App.tsx`. Se descartaron Redux/Zustand y Expo Router por innecesarios para 2 pantallas.

## Entregables de la prueba

- [`bitacora_ia.md`](bitacora_ia.md): herramientas, prompts clave y errores de la IA detectados.
- [`respuestas_reflexion.md`](respuestas_reflexion.md)
- [`checklist_release.md`](checklist_release.md): qué está listo y qué falta para Google Play y App Store.
- Release: `app.json` (`com.keppri.clasefit.edeiver`) y `eas.json` con perfiles `preview` (APK) y `production`.

## Limitaciones conocidas

- Las reservas viven en memoria: se pierden al cerrar la app.
- Las fechas se calculan desde el reloj del dispositivo, como pide el insumo.
- RN-04 no se puede ver en vivo salvo entre 2 h y el inicio de una clase; está cubierta por las pruebas con reloj inyectado.
