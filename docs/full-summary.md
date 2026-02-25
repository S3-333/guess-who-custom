🚀 Análisis Integral: Guess Who Custom
Este proyecto es una aplicación web SPA (Single Page Application) construida con React 19 y Vite, que moderniza el juego clásico de "¿Quién es quién?". Su arquitectura destaca por una separación clara entre la lógica de estado (business logic) y la interfaz de usuario (UI).

1. Arquitectura de Estado (Hooks Personalizados)
   La aplicación utiliza Custom Hooks para gestionar la complejidad sin sobrecargar los componentes.

📋

useBoard.js
(Gestión del Tablero)
Es el responsable de la "fábrica de personajes".

Persistencia: Utiliza localStorage con la clave guessWho_board. Cada vez que añades un nombre o imagen, se guarda automáticamente.
Estructura de Datos: Las cartas son objetos con

id
(generado por timestamp + random), name e image (almacenada en Base64 para permitir su persistencia en texto).
Funciones: addCard, removeCard, updateCard, loadBoard (para importación) y clearBoard.
🎮

useGame.js
(Motor de Juego)
Es una máquina de estados compleja que maneja el flujo de la partida.

Fases del Juego (PHASES): Gestiona un ciclo de vida que va desde IDLE -> P1_SELECT -> P1_LOCK -> P2_SELECT -> PLAYING -> TURN_SWITCH -> FINISHED.
Lógica de Turnos: Rastrea de quién es el turno (currentTurn) y qué cartas ha descartado cada jugador independientemente (p1Discarded, p2Discarded).
Validación: Compara el ID de la carta elegida al "Adivinar" con el ID secreto del rival para determinar el ganador. 2. Flujo de Navegación (

App.jsx
)
En lugar de usar una librería pesada como React Router, el proyecto implementa un enrutado condicional simple:

Un estado currentPage alterna entre la vista del

Editor
y la del

Game
.
Esto garantiza rapidez, ligereza y que el tablero configurado en el editor esté siempre disponible para ser inyectado en el modo juego. 3. Componentes Principales
✏️ El Editor (

Editor.jsx
)
Es el espacio creativo. Permite visualizar la CardGrid donde el usuario puede:

Subir imágenes (procesadas como dataURL por

helpers.js
).
Escribir nombres que se actualizan en tiempo real.
Acceder al componente

ImportExport
.
🕹️ El Modo Juego (

Game.jsx
)
Se divide en varios sub-componentes internos para manejar la experiencia:

GameSetup
: Formulario lúdico para ingresar nombres de jugadores.

CharacterSelect
: Pantalla secreta donde cada jugador elige su personaje.

GameBoard
: El core del juego. Incluye un tablero en perspectiva 3D donde las cartas tienen física visual (se abaten hacia atrás al ser descartadas).

TurnScreen
: Pantalla de seguridad que bloquea la visibilidad entre jugadores, incluyendo el candado animado que creamos para asegurar la privacidad del secreto. 4. Diseño y Estética ("Chunky & Playful")
El proyecto no utiliza frameworks de CSS (como Tailwind), sino Vanilla CSS con un sistema de tokens en

global.css
.

Estética Plástica: Uso de bordes gruesos (--border-width: 3px), radios grandes y sombras proyectadas (box-shadow: 0 4px 0 ...) para simular fichas de plástico.
Filtros de Color: Para no depender de múltiples archivos de imagen, los iconos

.webp
se colorean mediante filtros CSS (invert, sepia, etc.), permitiendo que un mismo icono sea azul, blanco o naranja según el contexto del botón.
Animaciones 3D: El uso de perspective y transform-style: preserve-3d en el tablero de juego eleva la experiencia por encima de una web plana tradicional. 5. Utilidades y I/O (

helpers.js
e

ImportExport.jsx
)
El proyecto implementa APIs modernas del navegador:

File System Access API: En navegadores compatibles, el botón de guardar abre un diálogo nativo de "Guardar como" (showSaveFilePicker). En otros, recurre al método tradicional de enlace de descarga.
Validación de Archivos: Filtra tipos MIME para asegurar que solo se suban imágenes válidas y JSONs de tablero correctos. 6. Resumen de Funcionamiento
Entrada: El usuario llega al Splash y entra al

Editor
.
Configuración: Crea sus cartas, las cuales se guardan en el navegador.
Preparación: Pulsa "Jugar", lo que activa

useGame
. Los jugadores eligen nombres y sus personajes secretos en pantallas privadas.
Batalla: Alternan turnos descartando sospechosos en el tablero 3D hasta que uno decide usar el botón animado de "Adivinar".
Resultado: El sistema revela el secreto del perdedor y corona al ganador.
Es un proyecto robusto, bien modularizado y con un enfoque muy fuerte en la UX (Experiencia de Usuario) y el feedback visual.
