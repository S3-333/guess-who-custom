# 💾 Persistencia de Datos e I/O

## LocalStorage y Limitaciones

El tablero se guarda automáticamente usando la Web Storage API.

- **Estrategia de Guardado**: Serialización JSON.
- **El desafío de las imágenes**: Como `localStorage` solo acepta strings, convertimos las fotos de los usuarios a **Base64** vía `FileReader`.
  _Nota: Se debe vigilar el límite de ~5MB por navegador según la cantidad de fotos subidas por el usuario._

## Sistema de Importación/Exportación

El archivo `test_board.json` sirve como referencia de esquema.

```json
{
  "version": "1.0",
  "exportedAt": "ISO-TIMESTAMP",
  "cards": [{ "id": "uuid", "name": "...", "image": "data:image/..." }]
}
```

## Seguridad en Carga de Datos

`helpers.js` incluye validaciones `isValidImageFile` para prevenir inyecciones de archivos no deseados durante el proceso de importación.
