# class-booking Specification

## Purpose
Permitir que el socio autenticado (Laura Gómez) vea las próximas clases grupales del gimnasio, las reserve y cancele sus reservas desde el celular, aplicando las reglas de negocio RN-01 a RN-04 del insumo funcional.

## Requirements

### Requirement: HU-01 Ver próximas clases
El sistema SHALL mostrar las clases de hoy, mañana y pasado mañana que aún no han empezado, ordenadas por fecha y hora de inicio. Cada clase MUST mostrar nombre, día, hora, instructor y cupos disponibles con el formato "X de Y cupos". Una clase sin cupos disponibles MUST mostrarse como "Llena" y MUST NOT ofrecer la acción de reservar.

#### Scenario: Listado ordenado de próximas clases
- **WHEN** el socio abre la pantalla de próximas clases con `now` = 2026-10-07 10:00 (America/Bogota)
- **THEN** se muestran las clases con inicio posterior a `now` de hoy, mañana y pasado mañana
- **AND** las clases aparecen ordenadas por fecha y hora de inicio ascendente (C-02, C-03, C-04, C-05, C-06, C-07, C-08, C-09, C-10)

#### Scenario: Datos mostrados por clase
- **WHEN** se muestra la clase C-02 (Funcional, Camila Ospina, hoy 18:00, cupoTotal 15, ocupados 9) y Laura no la ha reservado
- **THEN** la clase muestra su nombre "Funcional", el día "Hoy", la hora "18:00", el instructor "Camila Ospina"
- **AND** muestra "6 de 15 cupos"

#### Scenario: Clase que ya empezó no aparece
- **WHEN** el socio abre la pantalla con `now` = 2026-10-07 10:00 (America/Bogota)
- **THEN** la clase C-01 (hoy 06:00) no aparece en el listado

#### Scenario: Clase cuyo inicio es exactamente igual a now
- **WHEN** el socio abre la pantalla con `now` = 2026-10-07 18:00:00.000 (America/Bogota)
- **THEN** la clase C-02 (hoy 18:00) no aparece en el listado

#### Scenario: Clase un instante antes de su inicio
- **WHEN** el socio abre la pantalla con `now` = 2026-10-07 17:59:59.999 (America/Bogota)
- **THEN** la clase C-02 (hoy 18:00) aparece en el listado

#### Scenario: Clase sin cupos se muestra como Llena
- **WHEN** se muestra la clase C-03 (cupoTotal 12, ocupados 12)
- **THEN** la clase muestra "Llena"
- **AND** no se ofrece la acción de reservar para esa clase
- **AND** no se muestra el contador "X de Y cupos"

### Requirement: Cálculo de cupos disponibles
El sistema SHALL calcular los cupos disponibles de una clase como `cupoTotal - ocupados - reservas de Laura para esa clase`, y SHALL mostrar "X de Y cupos" donde X son los cupos disponibles e Y es `cupoTotal`. Una clase con 0 cupos disponibles MUST considerarse sin cupos.

#### Scenario: Cupos sin reservas de Laura
- **WHEN** la clase C-07 tiene cupoTotal 12, ocupados 5 y Laura no la ha reservado
- **THEN** los cupos disponibles son 7
- **AND** se muestra "7 de 12 cupos"

#### Scenario: Cupos con la reserva de Laura sumada
- **WHEN** la clase C-07 tiene cupoTotal 12, ocupados 5 y Laura la tiene reservada
- **THEN** los cupos disponibles son 6
- **AND** se muestra "6 de 12 cupos"

#### Scenario: Último cupo tomado por Laura deja la clase sin cupos
- **WHEN** la clase C-06 tiene cupoTotal 15, ocupados 14 y Laura la tiene reservada
- **THEN** los cupos disponibles son 0
- **AND** la clase se muestra como "Llena"

### Requirement: Cálculo del inicio de la clase
El sistema SHALL calcular el inicio de una clase como la fecha calendario de `now` en America/Bogota más `diaOffset` días, a la `hora` de la clase, usando el desfase fijo UTC-05:00 (sin horario de verano). El resultado MUST ser independiente de la zona horaria configurada en el dispositivo.

#### Scenario: Clase de hoy
- **WHEN** `now` = 2026-10-07 10:00 (America/Bogota) y la clase tiene `diaOffset` 0 y `hora` "18:00"
- **THEN** el inicio de la clase es 2026-10-07 18:00 -05:00 (2026-10-07T23:00:00Z)

#### Scenario: Clase de pasado mañana
- **WHEN** `now` = 2026-10-07 10:00 (America/Bogota) y la clase tiene `diaOffset` 2 y `hora` "08:00"
- **THEN** el inicio de la clase es 2026-10-09 08:00 -05:00

#### Scenario: Fecha calendario de Bogotá distinta de la fecha UTC
- **WHEN** `now` = 2026-10-07 23:30 (America/Bogota), que corresponde a 2026-10-08T04:30:00Z, y la clase tiene `diaOffset` 1 y `hora` "06:00"
- **THEN** el inicio de la clase es 2026-10-08 06:00 -05:00
- **AND** no 2026-10-09 06:00 -05:00

### Requirement: HU-02 Reservar una clase
El sistema SHALL permitir al socio reservar una próxima clase. Si la reserva cumple RN-01, RN-02 y RN-03, MUST registrarse, el cupo disponible MUST bajar en uno y se MUST mostrar "¡Listo! Tu cupo está reservado". Si alguna regla falla, la reserva MUST NOT registrarse y se MUST mostrar el mensaje de la regla que falló.

#### Scenario: Reserva exitosa
- **WHEN** Laura no tiene reservas y reserva la clase C-07 (cupoTotal 12, ocupados 5)
- **THEN** la reserva queda registrada
- **AND** la clase pasa de mostrar "7 de 12 cupos" a "6 de 12 cupos"
- **AND** se muestra el mensaje "¡Listo! Tu cupo está reservado"

#### Scenario: Reserva exitosa aparece en mis reservas
- **WHEN** Laura reserva la clase C-07 con éxito
- **THEN** la clase C-07 aparece en la pantalla de mis reservas

#### Scenario: Reserva rechazada no modifica el estado
- **WHEN** Laura intenta reservar una clase y falla alguna de RN-01, RN-02 o RN-03
- **THEN** no se registra ninguna reserva nueva
- **AND** los cupos disponibles de la clase no cambian
- **AND** se muestra el mensaje de la regla que falló

### Requirement: HU-03 Ver y cancelar mis reservas
El sistema SHALL mostrar las reservas de Laura ordenadas por inicio de clase, la más próxima primero, y "Aún no tienes reservas" cuando no tenga ninguna. Al cancelar, el sistema MUST pedir confirmación; si se confirma y RN-04 se cumple, la reserva MUST desaparecer y el cupo MUST liberarse.

#### Scenario: Sin reservas
- **WHEN** Laura no tiene reservas y abre la pantalla de mis reservas
- **THEN** se muestra "Aún no tienes reservas"

#### Scenario: Reservas ordenadas, la más próxima primero
- **WHEN** Laura tiene reservadas C-09 (pasado mañana 08:00), C-02 (hoy 18:00) y C-07 (mañana 18:00)
- **THEN** las reservas se muestran en el orden C-02, C-07, C-09

#### Scenario: Cancelar pide confirmación
- **WHEN** Laura elige cancelar una reserva
- **THEN** el sistema pide confirmación antes de cancelar

#### Scenario: Cancelación confirmada libera el cupo
- **WHEN** Laura tiene reservada C-07 (cupoTotal 12, ocupados 5), faltan más de 2 horas para su inicio y confirma la cancelación
- **THEN** la reserva desaparece de mis reservas
- **AND** la clase C-07 vuelve a mostrar "7 de 12 cupos"

#### Scenario: Cancelación no confirmada
- **WHEN** Laura elige cancelar una reserva y no confirma
- **THEN** la reserva se mantiene
- **AND** los cupos disponibles de la clase no cambian

#### Scenario: Última reserva cancelada
- **WHEN** Laura tiene una sola reserva y la cancela con éxito
- **THEN** se muestra "Aún no tienes reservas"

### Requirement: RN-01 No reservar una clase sin cupos
El sistema MUST rechazar la reserva de una clase cuyos cupos disponibles sean 0 y MUST mostrar el mensaje "Esta clase ya no tiene cupos."

#### Scenario: Clase llena desde los datos
- **WHEN** Laura intenta reservar la clase C-08 (cupoTotal 30, ocupados 30)
- **THEN** la reserva se rechaza
- **AND** se muestra "Esta clase ya no tiene cupos."

#### Scenario: Último cupo disponible
- **WHEN** Laura intenta reservar la clase C-10 (cupoTotal 12, ocupados 11) sin haberla reservado antes
- **THEN** la reserva se registra
- **AND** la clase queda con 0 cupos disponibles y se muestra "Llena"

### Requirement: RN-02 No reservar la misma clase dos veces
El sistema MUST rechazar la reserva de una clase que Laura ya tiene reservada y MUST mostrar el mensaje "Ya reservaste esta clase."

#### Scenario: Segunda reserva de la misma clase
- **WHEN** Laura ya tiene reservada la clase C-07 e intenta reservarla de nuevo
- **THEN** la reserva se rechaza
- **AND** se muestra "Ya reservaste esta clase."
- **AND** Laura sigue teniendo una sola reserva de C-07

#### Scenario: Reservar de nuevo tras cancelar
- **WHEN** Laura reservó la clase C-07, la canceló con éxito y vuelve a reservarla
- **THEN** la reserva se registra

### Requirement: RN-03 Máximo 2 reservas por día de clase
El sistema MUST rechazar una reserva si Laura ya tiene 2 reservas de clases cuya fecha de inicio (en America/Bogota) es la misma fecha de la clase que intenta reservar, y MUST mostrar "Solo puedes reservar 2 clases por día." El límite se calcula por la fecha de la clase, no por la fecha en que se creó la reserva.

#### Scenario: Segunda reserva del mismo día de clase
- **WHEN** Laura tiene reservada C-05 (mañana) e intenta reservar C-07 (mañana)
- **THEN** la reserva se registra

#### Scenario: Tercera reserva del mismo día de clase
- **WHEN** Laura tiene reservadas C-05 y C-07 (ambas de mañana) e intenta reservar C-06 (mañana, con cupo)
- **THEN** la reserva se rechaza
- **AND** se muestra "Solo puedes reservar 2 clases por día."

#### Scenario: Varias reservas creadas hoy para distintos días de clase
- **WHEN** Laura, con `now` = 2026-10-07 10:00 (America/Bogota), crea hoy reservas para C-02 y C-04 (hoy) y C-05 (mañana), e intenta reservar C-07 (mañana)
- **THEN** la reserva de C-07 se registra, porque mañana solo tiene una reserva previa
- **AND** el hecho de que las cuatro reservas se hayan creado el mismo día no las hace contar juntas

#### Scenario: Reservas de días de clase distintos no cuentan para el límite
- **WHEN** Laura tiene reservadas C-05 y C-07 (mañana) e intenta reservar C-09 (pasado mañana)
- **THEN** la reserva se registra

#### Scenario: Cancelar libera el límite del día
- **WHEN** Laura tenía reservadas C-05 y C-07 (mañana), canceló C-07 con éxito e intenta reservar C-06 (mañana, con cupo)
- **THEN** la reserva se registra

### Requirement: RN-04 Cancelar solo hasta 2 horas antes del inicio
El sistema SHALL permitir cancelar una reserva cuando falten 2 horas o más para el inicio de la clase. Cuando falten menos de 2 horas, la cancelación MUST rechazarse, la reserva MUST mantenerse y se MUST mostrar "Ya no puedes cancelar: faltan menos de 2 horas."

#### Scenario: Faltan más de 2 horas
- **WHEN** Laura tiene reservada C-07 (inicio 2026-10-08 18:00 -05:00) y confirma la cancelación con `now` = 2026-10-08 10:00 -05:00
- **THEN** la cancelación se realiza

#### Scenario: Faltan exactamente 2 horas
- **WHEN** Laura tiene reservada C-07 (inicio 2026-10-08 18:00 -05:00) y confirma la cancelación con `now` = 2026-10-08 16:00:00.000 -05:00
- **THEN** la cancelación se realiza

#### Scenario: Faltan un poco menos de 2 horas
- **WHEN** Laura tiene reservada C-07 (inicio 2026-10-08 18:00 -05:00) y confirma la cancelación con `now` = 2026-10-08 16:00:00.001 -05:00
- **THEN** la cancelación se rechaza
- **AND** se muestra "Ya no puedes cancelar: faltan menos de 2 horas."
- **AND** la reserva se mantiene y los cupos no cambian

#### Scenario: La clase ya empezó
- **WHEN** Laura tiene reservada C-07 (inicio 2026-10-08 18:00 -05:00) e intenta cancelarla con `now` = 2026-10-08 18:10 -05:00
- **THEN** la cancelación se rechaza
- **AND** se muestra "Ya no puedes cancelar: faltan menos de 2 horas."

### Requirement: Orden de evaluación de reglas al reservar
Cuando varias reglas de reserva fallan a la vez, el sistema SHALL evaluarlas en el orden RN-02, RN-01, RN-03 y MUST mostrar solo el mensaje de la primera regla que falle.

#### Scenario: RN-02 tiene prioridad sobre RN-01
- **WHEN** Laura ya reservó C-06 (con lo que quedó con 0 cupos disponibles) e intenta reservarla de nuevo
- **THEN** la reserva se rechaza
- **AND** se muestra "Ya reservaste esta clase."

#### Scenario: RN-01 tiene prioridad sobre RN-03
- **WHEN** Laura tiene reservadas C-05 y C-07 (mañana) e intenta reservar C-08 (mañana, cupoTotal 30, ocupados 30)
- **THEN** la reserva se rechaza
- **AND** se muestra "Esta clase ya no tiene cupos."

#### Scenario: RN-02 tiene prioridad sobre RN-03
- **WHEN** Laura tiene reservadas C-05 y C-07 (mañana) e intenta reservar C-07 de nuevo
- **THEN** la reserva se rechaza
- **AND** se muestra "Ya reservaste esta clase."
