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
import { downloadJSON, readJSONFile } from '../../utils/helpers'
import './ImportExport.css'

/** Versión del formato de archivo para compatibilidad futura */
const FILE_VERSION = '1.0'

export function ImportExport({ cards, onImport }) {
  /**
   * useRef al input de archivo oculto, igual que en Card.jsx.
   * Esta es la técnica estándar en React para interactuar con
   * elementos del DOM que necesitan ser activados programáticamente.
   */
  const fileInputRef = useRef(null)

  // ─── Exportar ─────────────────────────────────────────────────
  const handleExport = () => {
    if (cards.length === 0) {
      alert('No hay cartas para exportar.')
      return
    }
    const exportData = {
      version: FILE_VERSION,
      exportedAt: new Date().toISOString(),
      cards, // Las imágenes ya están en base64 dentro de cada carta
    }
    downloadJSON(exportData, `tablero_guess_who_${Date.now()}`)
  }

  // ─── Importar ─────────────────────────────────────────────────
  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = '' // Reset para permitir reimportar el mismo archivo

    try {
      const data = await readJSONFile(file)

      // Validamos que el archivo tenga el formato correcto
      if (!data.cards || !Array.isArray(data.cards)) {
        alert('El archivo no tiene el formato correcto de tablero.')
        return
      }

      const confirm = window.confirm(
        `¿Importar tablero con ${data.cards.length} cartas? Esto reemplazará el tablero actual.`
      )
      if (!confirm) return

      onImport(data.cards)
    } catch (err) {
      alert(`Error al importar: ${err.message}`)
    }
  }

  return (
    <div className="import-export">
      <button
        id="btn-export"
        className="btn btn-secondary"
        onClick={handleExport}
        title="Guardar tablero como archivo JSON"
      >
        📤 Exportar tablero
      </button>

      <button
        id="btn-import"
        className="btn btn-secondary"
        onClick={() => fileInputRef.current?.click()}
        title="Cargar tablero desde archivo JSON"
      >
        📥 Importar tablero
      </button>

      {/* Input oculto para seleccionar archivo JSON */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
        aria-hidden="true"
      />
    </div>
  )
}
