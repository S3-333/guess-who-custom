# 🔄 Flujo del Juego (Máquina de Estados)

La lógica de juego en `useGame.js` implementa una **FSM (Finite State Machine)**. El comportamiento de la UI depende estrictamente de la propiedad `phase`.

## Fases de la Máquina de Estados

1.  **IDLE**: Estado inicial de configuración (Nombres).
2.  **SELECT (P1/P2)**: Fase de selección secreta. El sistema inyecta datos pero oculta el tablero del rival.
3.  **LOCK (P1/P2)**: Pantallas de transición críticas. Actúan como guardas de privacidad para evitar que el Jugador A vea el secreto del Jugador B.
4.  **PLAYING**: El núcleo del juego. Se activan las interacciones de descarte 3D.
5.  **TURN_SWITCH**: Cambio de turno activo.
6.  **FINISHED**: Estado final de evaluación de victoria.

## Reglas Técnicas de Flujo

- **Validación de Juego**: El editor bloquea el paso al modo juego a menos que existan `validCards.length >= 2`.
- **Atomicidad del Turno**: No se puede pasar el turno sin realizar una acción o confirmar el cambio en la pantalla de bloqueo.
