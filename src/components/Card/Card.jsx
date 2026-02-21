/**
 * Card.jsx – Carta individual del tablero.
 *
 * Este componente es responsable de:
 * 1. Mostrar la imagen y el nombre de un personaje
 * 2. Permitir cambiar la imagen via drag & drop o click
 * 3. Permitir editar el nombre
 * 4. Mostrar el botón de eliminar
 *
 * Props:
 * - card      {Object}   Datos de la carta { id, name, image }
 * - onUpdate  {Function} Llamada cuando cambia nombre o imagen
 * - onRemove  {Function} Llamada cuando se elimina la carta
 *
 * Decisión de diseño: este componente maneja su propio estado
 * de "dragOver" (estilo visual al arrastrar) porque es puramente
 * visual y no necesita subir al estado global.
 */
import { useState, useRef, useCallback } from 'react'
import { fileToBase64, isValidImageFile } from '../../utils/helpers'
import './Card.css'

export function Card({ card, onUpdate, onRemove }) {
  /**
   * Estado local para el efecto visual de drag-over.
   * Solo afecta la apariencia de esta carta, no necesita
   * propagarse hacia arriba.
   */
  const [isDragOver, setIsDragOver] = useState(false)

  /**
   * useRef: referencia al input[type="file"] oculto.
   * Lo oculto visualmente y lo activo programáticamente
   * para tener control total sobre el estilo del botón.
   */
  const fileInputRef = useRef(null)

  /**
   * Procesa un archivo de imagen: valida, convierte a Base64
   * y actualiza la carta. Es async porque fileToBase64 devuelve
   * una Promise.
   */
  const handleImageFile = useCallback(async (file) => {
    if (!isValidImageFile(file)) {
      alert('Solo se aceptan imágenes (JPG, PNG, GIF, WEBP, SVG)')
      return
    }
    try {
      const base64 = await fileToBase64(file)
      onUpdate(card.id, { image: base64 })
    } catch (err) {
      console.error('Error al procesar la imagen:', err)
    }
  }, [card.id, onUpdate])

  // ─── Handlers de Drag & Drop ───────────────────────────────────

  const handleDragOver = useCallback((e) => {
    e.preventDefault() // Necesario para habilitar el drop
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0] // Solo tomamos el primer archivo
    if (file) handleImageFile(file)
  }, [handleImageFile])

  // ─── Handler para input de archivo ──────────────────────────────

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) handleImageFile(file)
    // Reseteamos el valor del input para poder seleccionar el mismo
    // archivo dos veces seguidas si el usuario lo necesita
    e.target.value = ''
  }, [handleImageFile])

  // ─── Handler para el nombre ──────────────────────────────────────

  const handleNameChange = useCallback((e) => {
    onUpdate(card.id, { name: e.target.value })
  }, [card.id, onUpdate])

  return (
    <article
      className={`card-editor ${isDragOver ? 'card-editor--drag-over' : ''}`}
      aria-label={`Carta: ${card.name || 'Sin nombre'}`}
    >
      {/* ─── Zona de imagen con drag & drop ─── */}
      <div
        className="card-editor__image-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Arrastrar imagen o hacer click para seleccionar"
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        {card.image ? (
          <img
            src={card.image}
            alt={card.name || 'Personaje'}
            className="card-editor__image"
          />
        ) : (
          <div className="card-editor__placeholder">
            <span className="card-editor__placeholder-icon">🖼️</span>
            <span className="card-editor__placeholder-text">
              {isDragOver ? 'Suelta la imagen' : 'Arrastrá o clickeá'}
            </span>
          </div>
        )}
        {/* Input file oculto — se activa con el click en la zona */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* ─── Nombre del personaje ─── */}
      <div className="card-editor__footer">
        <input
          type="text"
          className="input card-editor__name-input"
          placeholder="Nombre del personaje"
          value={card.name}
          onChange={handleNameChange}
          maxLength={30}
          aria-label="Nombre del personaje"
        />
        {/* ─── Botón eliminar ─── */}
        <button
          className="btn btn-danger btn-sm card-editor__remove-btn"
          onClick={() => onRemove(card.id)}
          aria-label={`Eliminar carta ${card.name || ''}`}
          title="Eliminar carta"
        >
          ✕
        </button>
      </div>
    </article>
  )
}
