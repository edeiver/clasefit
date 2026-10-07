# Design: add-class-booking

## Context

- Ver `proposal.md` (Why) para la motivación y `specs/class-booking/spec.md` para el comportamiento exigido.
- Proyecto Expo SDK 57 (plantilla blank-typescript), React 19.2, React Native 0.86, TypeScript ~6.0, Jest ~29.7 con `jest-expo`. Hoy `App.tsx` solo contiene la pantalla de la plantilla y `src/` solo tiene `src/data/clases.json`.
- `src/data/clases.json` es idéntico a `insumo-funcional/mock-data/clases.json` (la ruta que cita el insumo funcional). Contiene 10 clases con `diaOffset` 0–2, `hora` "HH:mm", `cupoTotal` y `ocupados`, e incluye casos a propósito: clases llenas (C-03, C-08), clases con un solo cupo (C-06, C-10) y días con más de 2 clases.
- Un único socio ya autenticado (Laura Gómez, `S-0001`); sin login ni backend. Las reservas viven en memoria.
- Zona horaria del producto: America/Bogota. La fecha real de una clase depende de la fecha actual del dispositivo.

## Decisions

### Estructura de carpetas

```
src/
  domain/       # tipos, cálculo de fechas y reglas de negocio (funciones puras, sin React)
  state/        # reducer + Context de reservas
  screens/      # pantalla de próximas clases y pantalla de mis reservas
  components/   # componentes de UI reutilizables (p. ej. tarjeta de clase)
  data/
    clases.json
__tests__/      # tests unitarios del dominio (en la raíz)
App.tsx         # alterna las dos pantallas con un estado de pestañas simple
```

Sigue la estructura ya definida en `openspec/project.md`; no se agregan capas nuevas.

### Dónde viven las reglas de negocio

- Todas las reglas (HU-01 filtrado/orden, cupos disponibles, RN-01..RN-04, orden de validación) viven en `src/domain` como **funciones puras**: mismas entradas → misma salida, sin efectos secundarios.
- `src/domain` **no importa React** ni React Native. Los componentes y pantallas solo llaman al dominio y muestran su resultado; ningún componente reimplementa una regla.
- Las funciones de validación devuelven un resultado explícito (éxito o error con el mensaje textual del insumo funcional), de forma que el reducer y la UI no necesiten conocer los textos ni el orden de las reglas.
- Los mensajes al usuario se definen una sola vez en el dominio, copiados textualmente del insumo funcional.

### `now: Date` inyectado

- Toda función del dominio que dependa del momento actual recibe `now: Date` como parámetro.
- **Nunca** se llama `new Date()` (ni `Date.now()`) dentro de `src/domain`. El instante actual se obtiene en la capa de UI/estado en el momento de la acción (al renderizar el listado, al reservar, al confirmar la cancelación) y se pasa al dominio.
- Esto permite que los tests fijen `now` y cubran los casos límite (inicio exactamente igual a `now`, exactamente 2 horas antes, etc.) de forma determinista.

### Cálculo de fechas y manejo de America/Bogota

- Inicio de clase = fecha calendario de `now` en America/Bogota + `diaOffset` días, a la `hora` de la clase.
- Se usa el **desfase fijo UTC-05:00** (Colombia no tiene horario de verano). Para obtener la fecha calendario de Bogotá se resta 5 horas al instante UTC de `now` y se leen año/mes/día en UTC; el inicio de la clase se construye como un instante UTC equivalente a `fecha + hora` en -05:00.
- No se depende de la zona horaria del dispositivo ni de `Intl`/librerías de zona horaria, para que el resultado sea igual en cualquier dispositivo y en Jest.
- Comparaciones derivadas:
  - Una clase aparece en próximas clases solo si `inicio > now` (si `inicio <= now`, no aparece).
  - RN-03 agrupa por la fecha calendario de Bogotá del **inicio de la clase**, nunca por la fecha de creación de la reserva. Por eso una reserva no necesita guardar su fecha de creación.
  - RN-04 permite cancelar si `inicio - now >= 2 horas` y rechaza si `inicio - now < 2 horas`. En exactamente 2 horas la cancelación **sí** se permite.
- Nota sobre RN-04: la guía de metodología contiene un ejemplo redactado como "2 horas o menos". La regla real del producto es la del insumo funcional: "Solo se puede cancelar hasta **2 horas antes** del inicio", con el mensaje "Ya no puedes cancelar: faltan menos de 2 horas.". Se sigue el insumo funcional: a exactamente 2 horas se puede cancelar; con menos de 2 horas, no.

### Cupos disponibles

- `cuposDisponibles = cupoTotal - ocupados - (reservas de Laura para esa clase)`. Como RN-02 impide duplicados, el último término es 0 o 1.
- La UI muestra "X de Y cupos" (X = disponibles, Y = `cupoTotal`) y "Llena" cuando X = 0.
- `ocupados` del JSON nunca se modifica; las reservas de Laura se suman a partir del estado.

### Orden de validación al reservar

Cuando varias reglas fallan a la vez, se evalúan en este orden y se devuelve solo el primer error:

1. **RN-02** — "Ya reservaste esta clase."
2. **RN-01** — "Esta clase ya no tiene cupos."
3. **RN-03** — "Solo puedes reservar 2 clases por día."

RN-02 va primero porque, si Laura ya ocupó el último cupo, el mensaje relevante para ella es que ya reservó, no que la clase está llena. RN-01 antes que RN-03 porque la falta de cupos es una propiedad de la clase, independiente de las demás reservas de Laura.

### Manejo de estado

- `useReducer` + React Context, en memoria. El estado contiene la lista de reservas de Laura (identificador de clase). Las clases se leen de `src/data/clases.json`.
- Acciones del reducer: reservar y cancelar. El reducer delega la validación al dominio (con el `now` recibido en la acción) y solo modifica el estado si la validación es exitosa; el resultado (mensaje de éxito o error) se expone a la UI para mostrarlo.
- No se usa Redux, Zustand ni otra librería de estado. No se agregan dependencias nuevas.
- La persistencia con AsyncStorage (bonus del insumo) no se incluye en este cambio.

### Navegación

- Sin Expo Router. `App.tsx` mantiene un estado de pestaña simple (próximas clases / mis reservas) y renderiza la pantalla correspondiente dentro del proveedor de Context.

### Decisiones de UI tomadas por el desarrollador

- Día: se muestra "Hoy", "Mañana" o "Pasado mañana" según `diaOffset` 0, 1, 2.
- Clase sin cupos: se muestra "Llena" en lugar de "X de Y cupos" y sin acción de reservar.
- RN-04 se evalúa al confirmar la cancelación, con el `now` de ese momento.
- Las reservas cuya clase ya empezó se siguen mostrando en "Mis reservas"; RN-04 rechaza su cancelación.
- Sin refresco automático por temporizador: `now` se obtiene en cada render y en cada acción.

## Discarded alternative

- **Redux / Zustand:** descartados por innecesarios para un MVP de dos pantallas con un único tipo de estado (las reservas de Laura). `useReducer` + Context cubre el caso sin agregar dependencias ni boilerplate.
- **Expo Router:** descartado porque la app tiene solo dos pantallas alternadas mediante un estado de pestañas simple en `App.tsx`; el enrutamiento por archivos no aporta valor aquí.

## Risks / Open Questions

- **Reserva de una clase que ya empezó:** ninguna regla del insumo la rechaza explícitamente ni define un mensaje; en la práctica no es alcanzable desde la UI porque esas clases no aparecen en el listado (HU-01).
- **Riesgo — dependencia del reloj del dispositivo:** la fecha real se calcula desde la fecha del dispositivo (según el insumo). Un reloj del dispositivo incorrecto produce un listado incorrecto; se acepta para el MVP sin backend.
- **Riesgo — reservas en memoria:** las reservas se pierden al cerrar la app; aceptado por el insumo ("Las reservas pueden vivir en memoria").
