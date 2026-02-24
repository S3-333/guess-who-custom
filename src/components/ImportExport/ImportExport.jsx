/**
 * ImportExport.jsx – Componente para importar y exportar tableros.
 *
 * Funciones:
 * - Exportar el tablero actual como archivo .json (con imágenes en base64)
 * - Importar un tablero desde un archivo .json previamente guardado
 *
 * Decisión de diseño: lo mantenemos como un componente separado porque
 * la lógica de I/O es independiente del editor. Esto respeta el
 * principio de responsabilidad única (Single Responsibility Principle).
 *
 * Props:
 * - cards     {Array}    Cartas actuales del tablero
 * - onImport  {Function} Se llama con las cartas importadas
 */
import { useRef } from 'react'
import { downloadJSON, readJSONFromUser, readJSONFile } from '../../utils/helpers'
import './ImportExport.css'

// Iconos
import downloadIcon from '../../assets/icons/download.webp'
import importIcon from '../../assets/icons/import.webp'

const FILE_VERSION = '1.0'

export function ImportExport({ cards, onImport }) {
  const fileInputRef = useRef(null)

  /** Procesa el contenido del tablero una vez obtenido */
  const processImport = (data) => {
    if (!data.cards || !Array.isArray(data.cards)) {
      alert('El archivo no tiene el formato correcto de tablero.')
      return
    }

    const confirm = window.confirm(
      `¿Importar tablero con ${data.cards.length} cartas? Esto reemplazará el tablero actual.`
    )
    if (!confirm) return

    onImport(data.cards)
  }

  // ─── Exportar ─────────────────────────────────────────────────
  const handleExport = async () => {
    if (cards.length === 0) {
      alert('No hay cartas para exportar.')
      return
    }
    const exportData = {
      version: FILE_VERSION,
      exportedAt: new Date().toISOString(),
      cards,
    }
    // downloadJSON ahora maneja el diálogo de "Guardar como" si el navegador lo soporta
    await downloadJSON(exportData, `tablero_guess_who_${Date.now()}`)
  }

  // ─── Importar ─────────────────────────────────────────────────
  const handleImport = async () => {
    try {
      // Intentamos usar la API moderna (abre diálogo de archivo nativo)
      const data = await readJSONFromUser();
      
      if (data) {
        processImport(data);
      } else {
        // Si no hay API (Safari/Firefox antiguos), activamos el input oculto
        fileInputRef.current?.click();
      }
    } catch (err) {
      alert(`Error al importar: ${err.message}`);
    }
  }

  /** Handler para el input tradicional (Fallback) */
  const handleFileChangeFallback = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''

    try {
      const data = await readJSONFile(file)
      processImport(data)
    } catch (err) {
      alert(`Error al leer archivo: ${err.message}`)
    }
  }

  return (
    <div className="import-export">
      <button
        id="btn-export"
        className="btn btn-secondary"
        onClick={handleExport}
        title="Guardar tablero en tu computadora"
      >
        <img src={downloadIcon} alt="" className="btn-icon" /> Guardar Tablero
      </button>

      <button
        id="btn-import"
        className="btn btn-secondary"
        onClick={handleImport}
        title="Cargar un tablero guardado"
      >
        <img src={importIcon} alt="" className="btn-icon" /> Cargar Tablero
      </button>

      {/* Input oculto (Fallback para navegadores sin File System Access API) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChangeFallback}
        aria-hidden="true"
      />
    </div>
  )
}
