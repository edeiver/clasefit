# Checklist de release · ClaseFit

## Listo en el proyecto
- [x] Nombre, `slug` y versión en `app.json` (`ClaseFit`, `clasefit`, `1.0.0`)
- [x] `android.package` e `ios.bundleIdentifier` (`com.keppri.clasefit.edeiver`)
- [x] `eas.json` con perfiles preview (distribución interna, APK en Android) y production
- [x] Proyecto vinculado a EAS (`extra.eas.projectId` en `app.json`)
- [x] Números de build gestionados en remoto por EAS (`appVersionSource: "remote"`) con `autoIncrement` en production
- [ ] (Bonus) Build instalable · enlace: pendiente

## Falta para Google Play
- [ ] Cuenta de desarrollador de Google Play (pago único)
- [ ] Ficha de la tienda: descripción, ícono 512x512, imagen destacada y capturas de pantalla
- [ ] Política de privacidad publicada (URL)
- [ ] Formulario de seguridad de datos
- [ ] Cuestionario de clasificación de contenido
- [ ] Público objetivo y contenido
- [ ] AAB firmado generado con el perfil `production`
- [ ] Prueba cerrada antes de producción (requerida si la cuenta es personal y nueva)

## Falta para App Store
- [ ] Membresía del Apple Developer Program (pago anual)
- [ ] App creada en App Store Connect
- [ ] Bundle ID `com.keppri.clasefit.edeiver` registrado
- [ ] Certificados y perfiles de aprovisionamiento (EAS puede gestionarlos)
- [ ] Etiquetas de privacidad (App Privacy)
- [ ] Capturas de pantalla para cada tamaño de dispositivo requerido
- [ ] Distribución de prueba con TestFlight
- [ ] Envío a revisión de Apple

## Riesgos o bloqueos para publicar
- Las reservas se guardan en memoria: se pierden al cerrar la app.
- No hay backend real; los datos no se sincronizan ni persisten.
- Las fechas dependen del reloj del dispositivo.
- El ícono y el splash son los de la plantilla por defecto.
- No hay política de privacidad publicada.
- El perfil `development` requiere `expo-dev-client`, que no está instalado (ese perfil no se usa).
