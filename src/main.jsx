/**
 * main.jsx – Punto de entrada de la aplicación React.
 *
 * React 18 usa `createRoot` en lugar del antiguo `ReactDOM.render`.
 * Esto habilita el modo concurrente (Concurrent Mode), que mejora
 * el rendimiento al priorizar actualizaciones de UI.
 *
 * StrictMode: envuelve la app para detectar problemas potenciales
 * durante el desarrollo (no afecta la producción).
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
