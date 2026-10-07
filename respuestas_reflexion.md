# Respuestas de reflexión · Edeiver Barranco Echeverria

### 1. ¿Qué experiencia previa tenías usando OpenSpec o SDD?

No había usado OpenSpec, pero sí había trabajado con SDD y con IA. En mi trabajo anterior migré con Claude Code un proyecto de React muy antiguo: actualicé el diseño, mejoré funcionalidades y lo optimicé para desplegarlo en Vercel. Para ese flujo creé skills: una que generaba la descripción y los criterios de aceptación de cada tarea, otra que corría las pruebas y generaba el mensaje del commit antes de subir a GitHub, y otra que grababa el navegador y generaba un video de la feature migrada para adjuntarlo en Jira. También he integrado LLMs en proyectos propios (Claude API en Kuiper, Groq en Centauri). Para esta prueba leí la guía y el README de OpenSpec, y aprendí el flujo `propose` → `apply` → `archive` haciéndolo.

### 2. ¿Cómo crees que cambia el rol de desarrollador React Native antes y después de conocer y aplicar este framework?

Llevo 7 años en React Native, casi siempre en productos de pagos, white-label y cripto, como Cobru o la primera versión de la billetera Bitcoin del Gobierno de El Salvador con Athena Bitcoin. Ahí aprendí que una regla de negocio mal entendida no es un detalle: termina como bug en producción, con plata de por medio. Antes, la historia se interpretaba en la cabeza del desarrollador y se iba directo al código; con SDD esa interpretación queda escrita y validada en una spec antes de programar. Mi rol pasa de escribir la mayoría del código a decidir, dirigir a la IA y verificar que lo construido sea exactamente lo especificado.

### 3. ¿Cómo crees que debería trabajar ahora un equipo que usa esta metodología?

La spec debería ser el punto de encuentro entre lo funcional y lo técnico: el PO o BA entrega el insumo, el desarrollador lo convierte en proposal y spec, y ambos validan esa spec antes de escribir código. Cada cambio vive en su carpeta de `openspec/changes`, se revisa en el PR igual que el código y se archiva al terminar, para que `openspec/specs` sea siempre la verdad actual. Las decisiones quedan en `design.md` y no en la cabeza de alguien, las pruebas salen de los escenarios, y hay una regla básica: nadie hace merge de código generado por IA sin haberlo leído.

### 4. ¿Qué ventajas y desventajas ves?

Ventajas: la IA trabaja con contexto preciso y se equivoca menos; los escenarios se vuelven pruebas casi directamente (aquí cada test lleva el nombre de su Scenario); y las decisiones quedan escritas y versionadas. Como tengo formación en gerencia de proyectos, me sentí muy cómodo: es como un modo de planificación antes de ejecutar. Desventajas: más trabajo al inicio y más archivos que mantener; si la spec está mal, la IA implementa el error con mucha seguridad; y exige disciplina para que spec y código no se desalineen. Me pasó al querer mostrar la hora en a. m./p. m.: no era solo un cambio de pantalla, también tocaba la spec.

### 5. ¿Cuándo usarías y cuándo no usarías este método?

Lo usaría en features con reglas de negocio, como integraciones de pagos, flujos con dinero o activos digitales, reservas o permisos, y en productos white-label, donde cada marca tiene variaciones que conviene dejar escritas en la spec. También cuando hay varios equipos involucrados o el trabajo se hace con IA, porque le pone límites claros. No lo usaría para un hotfix de una línea, un cambio puramente visual, un spike o un prototipo desechable, o algo exploratorio donde todavía no se sabe qué se quiere construir. Ahí escribir la spec cuesta más de lo que aporta.