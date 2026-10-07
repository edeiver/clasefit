# Tasks: add-class-booking

## 1. Tipos de dominio

- [x] 1.1 Crear `src/domain/types.ts` con los tipos `Clase` (id, nombre, instructor, diaOffset, hora, duracionMin, cupoTotal, ocupados) y `Reserva` (claseId), sin imports de React; verificar con `npx tsc --noEmit`
- [x] 1.2 Crear `src/domain/messages.ts` con los mensajes textuales del insumo funcional ("¡Listo! Tu cupo está reservado", "Aún no tienes reservas", "Llena", "Esta clase ya no tiene cupos.", "Ya reservaste esta clase.", "Solo puedes reservar 2 clases por día.", "Ya no puedes cancelar: faltan menos de 2 horas."); verificar comparándolos carácter por carácter con el insumo
- [x] 1.3 Crear un cargador tipado de `src/data/clases.json` que devuelva `Clase[]`; verificar con `npx tsc --noEmit`

## 2. Cálculo de fecha y hora

- [x] 2.1 Implementar en `src/domain/dates.ts` la obtención de la fecha calendario de Bogotá (UTC-05:00 fijo) a partir de `now: Date`, sin `new Date()` sin argumentos ni `Date.now()`; verificar con `grep` que no hay llamadas a la hora actual en `src/domain`
- [x] 2.2 Implementar el cálculo del inicio de clase (`fecha de Bogotá de now + diaOffset`, a la `hora`) y la clave de "día de clase" (fecha de Bogotá del inicio); verificar con `npx tsc --noEmit`
- [x] 2.3 Escribir `__tests__/dates.test.ts` cubriendo los Scenarios "Clase de hoy", "Clase de pasado mañana" y "Fecha calendario de Bogotá distinta de la fecha UTC" (Requirement: Cálculo del inicio de la clase); verificar con `npm test`

## 3. Reglas de negocio

- [x] 3.1 Implementar en `src/domain` el cálculo de cupos disponibles (`cupoTotal - ocupados - reservas de Laura`) y el indicador de clase sin cupos; verificar con `npx tsc --noEmit`
- [x] 3.2 Implementar el listado de próximas clases: filtra `inicio > now` y ordena por inicio ascendente; verificar con `npx tsc --noEmit`
- [x] 3.3 Implementar la validación de reserva en el orden RN-02 → RN-01 → RN-03, devolviendo éxito o el mensaje textual de la primera regla que falle; verificar con `npx tsc --noEmit`
- [x] 3.4 Implementar la validación de cancelación RN-04 (permitida si `inicio - now >= 2 h`, rechazada si `< 2 h`) con su mensaje textual; verificar con `npx tsc --noEmit`
- [x] 3.5 Implementar el listado de mis reservas ordenado por inicio de clase, la más próxima primero; verificar con `npx tsc --noEmit`
- [x] 3.6 Verificar que `src/domain` no importa `react` ni `react-native` (`grep -r "from 'react" src/domain` sin resultados)
- [x] 3.7 Implementar en src/domain la etiqueta de día según diaOffset (0 → "Hoy", 1 → "Mañana", 2 → "Pasado mañana") según design.md

## 4. Tests unitarios de reglas de negocio

- [x] 4.1 `__tests__/availability.test.ts`: Scenarios "Cupos sin reservas de Laura", "Cupos con la reserva de Laura sumada" y "Último cupo tomado por Laura deja la clase sin cupos" (Requirement: Cálculo de cupos disponibles); verificar con `npm test`
- [x] 4.2 `__tests__/upcoming.test.ts`: Scenarios "Listado ordenado de próximas clases", "Clase que ya empezó no aparece", "Clase cuyo inicio es exactamente igual a now", "Clase un instante antes de su inicio" y "Clase sin cupos se muestra como Llena" (Requirement: HU-01 Ver próximas clases); verificar con `npm test`
- [x] 4.3 `__tests__/rn01.test.ts`: Scenarios "Clase llena desde los datos" y "Último cupo disponible" (Requirement: RN-01); verificar con `npm test`
- [x] 4.4 `__tests__/rn02.test.ts`: Scenarios "Segunda reserva de la misma clase" y "Reservar de nuevo tras cancelar" (Requirement: RN-02); verificar con `npm test`
- [x] 4.5 `__tests__/rn03.test.ts`: Scenarios "Segunda reserva del mismo día de clase", "Tercera reserva del mismo día de clase", "Varias reservas creadas hoy para distintos días de clase", "Reservas de días de clase distintos no cuentan para el límite" y "Cancelar libera el límite del día" (Requirement: RN-03); verificar con `npm test`
- [x] 4.6 `__tests__/rn04.test.ts`: Scenarios "Faltan más de 2 horas", "Faltan exactamente 2 horas", "Faltan un poco menos de 2 horas" y "La clase ya empezó" (Requirement: RN-04); verificar con `npm test`
- [x] 4.7 `__tests__/validationOrder.test.ts`: Scenarios "RN-02 tiene prioridad sobre RN-01", "RN-01 tiene prioridad sobre RN-03" y "RN-02 tiene prioridad sobre RN-03" (Requirement: Orden de evaluación de reglas al reservar); verificar con `npm test`
- [x] 4.8 `__tests__/myReservations.test.ts`: Scenario "Reservas ordenadas, la más próxima primero" (Requirement: HU-03); verificar con `npm test`
- [x] 4.9 __tests__/classDetails.test.ts: Scenario "Datos mostrados por clase" (Requirement: HU-01)

## 5. Estado (reducer)

- [x] 5.1 Crear `src/state/bookingReducer.ts` con estado inicial sin reservas y acciones `reservar` y `cancelar` que reciben `claseId` y `now`, delegan la validación al dominio y solo modifican el estado si es exitosa, exponiendo el mensaje resultante; verificar con `npx tsc --noEmit`
- [x] 5.2 Escribir `__tests__/bookingReducer.test.ts` cubriendo los Scenarios "Reserva exitosa" y "Reserva rechazada no modifica el estado" (HU-02) y "Cancelación confirmada libera el cupo" (HU-03); verificar con `npm test`

## 6. Context

- [x] 6.1 Crear `src/state/BookingContext.tsx` con el proveedor (`useReducer`) y un hook de acceso que lance error si se usa fuera del proveedor; verificar con `npx tsc --noEmit`
- [x] 6.2 Envolver la app con el proveedor en `App.tsx`; verificar que la app arranca con `npx expo start` sin errores

## 7. Pantalla de próximas clases

- [x] 7.1 Crear `src/components/ClassCard.tsx` que muestre nombre, día, hora, instructor y "X de Y cupos", o "Llena" sin acción de reservar cuando no hay cupos; verificar con `npx tsc --noEmit`
- [x] 7.2 Crear `src/screens/UpcomingClassesScreen.tsx` que obtenga `now` al renderizar y muestre el listado del dominio; verificar manualmente que C-01 no aparece cuando ya empezó y que C-03 y C-08 muestran "Llena"

## 8. Pantalla de mis reservas

- [x] 8.1 Crear `src/screens/MyReservationsScreen.tsx` con las reservas ordenadas (la más próxima primero) y el mensaje "Aún no tienes reservas" cuando no hay; verificar manualmente con y sin reservas
- [x] 8.2 Agregar en `App.tsx` el estado de pestañas simple para alternar entre próximas clases y mis reservas; verificar manualmente el cambio de pestaña

## 9. Integración de reserva y cancelación en la UI

- [x] 9.1 Conectar la acción de reservar de `ClassCard` al Context pasando `now` del momento de la acción, y mostrar "¡Listo! Tu cupo está reservado" o el mensaje de error devuelto; verificar manualmente reservando C-07 (cupos bajan de "7 de 12 cupos" a "6 de 12 cupos")
- [x] 9.2 Agregar la acción de cancelar en mis reservas con diálogo de confirmación; al confirmar, despachar la cancelación con `now` del momento y mostrar el mensaje de RN-04 si se rechaza; verificar manualmente que sin confirmar la reserva se mantiene
- [x] 9.3 Verificar manualmente que una reserva cancelada desaparece de mis reservas y libera el cupo en próximas clases

## 10. Verificación manual e integración final

- [x] 10.1 Verificar manualmente RN-01 (C-10: reservar el último cupo y comprobar "Llena"), RN-02 (reservar dos veces) y RN-03 (tercera reserva del mismo día de clase) con los mensajes textuales
- [x] 10.2 Ejecutar `npm test` y `npx tsc --noEmit` sin errores
