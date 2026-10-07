# Proposal: add-class-booking

## Why

Hoy las reservas de clases grupales del gimnasio se hacen por WhatsApp con la recepción, lo que genera sobrecupos y reservas olvidadas. El MVP de ClaseFit busca que el socio vea las próximas clases, reserve y cancele desde el celular, aplicando las reglas de negocio RN-01 a RN-04 del insumo funcional.

## What Changes

- Nueva capacidad `class-booking` (spec en `specs/class-booking/spec.md`) que cubre:
  - **HU-01 · Ver próximas clases:** listado de las clases de hoy, mañana y pasado mañana, ordenadas por fecha y hora, con nombre, día, hora, instructor y cupos disponibles ("X de Y cupos"); las clases que ya empezaron no aparecen y las clases sin cupos se muestran como "Llena" y no se pueden reservar.
  - **HU-02 · Reservar una clase:** al reservar, el cupo disponible baja en uno y se muestra "¡Listo! Tu cupo está reservado"; si falla alguna de RN-01 a RN-03 no se reserva y se muestra el mensaje correspondiente.
  - **HU-03 · Ver y cancelar mis reservas:** listado de las reservas del socio, la más próxima primero, con el mensaje "Aún no tienes reservas" cuando no hay; cancelación con confirmación, sujeta a RN-04.
  - **RN-01** (sin cupos), **RN-02** (no reservar dos veces la misma clase), **RN-03** (máximo 2 reservas por día de clase) y **RN-04** (cancelar solo hasta 2 horas antes del inicio), con los mensajes textuales del insumo funcional.
- Datos de clases locales desde `src/data/clases.json`; reservas del socio en memoria.
- Dos pantallas (próximas clases y mis reservas) alternadas con un estado de pestañas simple en `App.tsx`.

## Impact

- **Código nuevo:** `src/domain` (tipos, cálculo de fechas y reglas de negocio puras), `src/state` (useReducer + Context), `src/screens`, `src/components`, y tests del dominio en `__tests__/`.
- **Código modificado:** `App.tsx` (reemplaza la pantalla de la plantilla por las dos pestañas).
- **Datos:** se consume `src/data/clases.json` (idéntico a `insumo-funcional/mock-data/clases.json`).
- **Dependencias:** ninguna nueva; se usa React (useReducer + Context) y Jest/jest-expo ya instalados.
- **Specs:** se crea la capacidad `class-booking`; no se modifican capacidades existentes.

## Out of Scope

Según el insumo funcional, no entra en este cambio:

- Login (el socio "Laura Gómez" ya está autenticado).
- Pagos.
- Gestión de instructores.
- Administración.
- Notificaciones.
- Backend (los datos son locales).
