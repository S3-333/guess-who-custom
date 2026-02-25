# 🧠 Gestión de Estado y Flujo de Información

## Single Source of Truth (SSOT)

En este proyecto, la "Verdad" sobre el tablero vive en el componente raíz `App.jsx`.

### ¿Por qué Prop Drilling y no Context?

Hemos optado por **Prop Drilling controlado** por dos razones técnicas:

1.  **Profundidad Limitada**: Los datos solo viajan dos niveles hacia abajo (`App` -> `Page` -> `Component`).
2.  **Rendimiento**: Evitamos re-renders innecesarios en todo el árbol de componentes que un Context Provider global provocaría al actualizar un solo input de texto en el editor.

## Tipos de Estado

- **Global**: El tablero (`cards`) y el estado del juego (`game`). Gestionados por hooks en `App.jsx`.
- **Local**: Estados efímeros como inputs de texto en `EditorCard.jsx` o el `selectedId` provisional en la selección de personajes.

## Flujo de Datos

```javascript
// Ejemplo de actualización:
// [Editor] llama a updateCard(id, changes)
// -> [useBoard] actualiza el array con inmutabilidad
// -> [App] se re-renderiza
// -> [Editor] recibe nuevas props.
```
