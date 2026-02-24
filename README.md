# 🕵️‍♂️ Guess Who Custom Editor & Game

¡Bienvenido a **Guess Who Custom**, una versión moderna, educativa y totalmente personalizable del clásico juego de mesa "¿Quién es quién?". Esta aplicación permite a los usuarios no solo jugar, sino también convertirse en creadores, diseñando sus propios tableros con fotos y nombres personalizados.

---

## ✨ Características Principales

### 🎨 Editor de Tableros Intuitivo

- **Creación Dinámica**: Añade, edita o elimina cartas de forma sencilla.
- **Personalización Total**: Arrastra fotos directamente y asigna nombres a tus personajes.
- **Guardado Local**: El progreso se guarda automáticamente en el dispositivo.

### 🎮 Experiencia de Juego Inmersiva

- **Modo Multijugador Local**: Diseñado para jugar en el mismo dispositivo con pantallas de bloqueo de seguridad entre turnos.
- **Tablero 3D Interactivo**: Fichas que se abaten físicamente sobre el tablero al ser descartadas, simulando la experiencia del juego real.
- **Animaciones Premium**: Sistema de candado animado para cambios de turno y efectos visuales pulidos.

### 💾 Sistema de Importación/Exportación

- **Portabilidad**: Exporta tus tableros personalizados como archivos `.json`.
- **Carga Instantánea**: Comparte tus archivos de tablero con amigos o cárgalos en cualquier momento.

---

## 🚀 Tecnologías Utilizadas

Este proyecto está construido con lo último en desarrollo web moderno:

- **[React 19](https://react.dev/)**: Para una interfaz reactiva y eficiente.
- **[Vite](https://vitejs.dev/)**: Como entorno de desarrollo ultra-rápido.
- **CSS Moderno**: Diseño "Chunky & Playful" utilizando variables CSS, Flexbox, Grid y animaciones 3D.
- **File System Access API**: Para una experiencia de guardado y carga de archivos más fluida.

---

## 🛠️ Instalación y Configuración

Para ejecutar este proyecto localmente, sigue estos pasos:

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/guess-who-custom.git
    cd guess-who-custom
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador:**
    Visita `http://localhost:5173` para empezar a crear.

---

## 📁 Estructura del Proyecto

```text
src/
├── assets/         # Imágenes, logos e iconos profesionales
├── components/     # Componentes reutilizables (Card, CardGrid, ImportExport, etc.)
├── hooks/          # Lógica de juego y estado (useBoard, useGame)
├── pages/          # Vistas principales (Editor, Game)
├── styles/         # Sistema de diseño global y tokens
└── utils/          # Funciones de ayuda y exportación JSON
```

---

## 🖌️ Diseño y Estética

El proyecto sigue una estética **"Chunky & Playful"**, diseñada específicamente para ser accesible y atractiva para un público infantil y familiar. Utiliza una paleta de colores vibrante, tipografías legibles y micro-animaciones que mejoran la experiencia de usuario (UX).

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. ¡Siéntete libre de usarlo, mejorarlo y compartirlo!

---

Hecho con ❤️
