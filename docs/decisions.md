# ⚖️ Decisiones Técnicas y Trade-offs

## 1. Vite vs CRA

**Decisión**: Vite.
**Razón**: Tiempos de Hot Module Replacement (HMR) casi instantáneos y una configuración de build mucho más limpia y moderna.

## 2. Vanilla CSS vs Tailwind

**Decisión**: Vanilla CSS con Variables.
**Razón**: El diseño "Chunky" requiere un control muy preciso de sombras proyectadas y animaciones 3D. Tailwind hubiera requerido configurar demasiadas clases arbitrarias (`[mask-shadow:...]`), perdiendo la ventaja de su sistema de diseño.

## 3. Estado Local-Only

**Decisión**: No usar Backend ni Firebase.
**Razón**: El proyecto prioriza la privacidad total y la velocidad. El juego es para dos personas compartiendo un dispositivo, eliminando la necesidad de sincronización en tiempo real vía sockets.

## 4. Imágenes en Base64

**Decisión**: Almacenar imágenes como strings en el JSON.
**Razón**: Facilita la portabilidad absoluta del tablero en un solo archivo, sin necesidad de un servidor de assets o buckets externos.
