# 📏 Convenciones y Estándares de Código

## Naming

- **Componentes**: `PascalCase` (ej: `CardGrid.jsx`).
- **Hooks**: `camelCase` con prefijo `use` (ej: `useBoard.js`).
- **Funciones/Variables**: `camelCase`.
- **CSS**: Metodología BEM simplificada (`.page__header`, `.page__title`).

## Estándares de Componentes

1.  **Desestructuración de Props**: Siempre al inicio de la función.
2.  **PropTypes**: Uso de JSDoc para documentar props (didáctico).
3.  **Orden de Hook**: `useState` > `useEffect` > `useCallback` > `useMemo`.

## Estilo de Código

- **Inmutabilidad**: Prohibido el uso de `.push()` o `.splice()` en estados. Siempre `[...]` o `.map()/.filter()`.
- **Limpieza**: Borrar `console.log` y comentarios temporales antes de cada commit.
