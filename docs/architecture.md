# 🏛 Arquitectura del Sistema

## Visión General

Guess Who Custom sigue una arquitectura de **Estado Centralizado con hooks desacoplados**. El sistema se divide en cuatro capas claramente diferenciadas para maximizar la mantenibilidad:

1.  **Capa de Orquestación (`App.jsx`)**: Único punto de entrada que instancia la lógica y decide qué vista renderizar.
2.  **Capa de Lógica (Hooks)**: "Cerebros" de la aplicación. No renderizan nada; procesan datos y exponen estados/acciones.
3.  **Capa de Vistas (Pages)**: Organizan componentes de UI para formar pantallas completas.
4.  **Capa de Presentación (Components)**: Unidades atómicas y puras que reciben datos por props.

## Diagrama de Relación

```text
App (Orquestador)
 ├── Hooks (Cerebros)
 │    ├── useBoard (Persistencia + Datos)
 │    └── useGame  (Lógica de Partida)
 ├── Pages (Contenedores)
 │    ├── Editor
 │    └── Game
 └── Utils (Herramientas puras)
```

## Separación de Responsabilidades

- **Separación Lógica/UI**: Ningun componente de página conoce los detalles de cómo se guarda una carta o cómo se cambia un turno. Solo llaman a las funciones que los hooks les proveen.
- **Utils como Nucleo Funcional**: Las funciones en `helpers.js` son puras. Esto permite testear la lógica de conversión de archivos o generación de IDs sin necesidad de montar React.
