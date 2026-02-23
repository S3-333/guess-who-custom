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
  const [isDragOver, setIsDragOver] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageFile = useCallback(async (file) => {
    if (!isValidImageFile(file)) {
      alert('Solo se aceptan imágenes (JPG, PNG, GIF, WEBP, SVG, AVIF)')
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
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }, [handleImageFile])

  // ─── Handler para input de archivo ──────────────────────────────

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) handleImageFile(file)
    e.target.value = ''
  }, [handleImageFile])

  // ─── Handler para el nombre ──────────────────────────────────────

  const handleNameChange = useCallback((e) => {
    onUpdate(card.id, { name: e.target.value })
  }, [card.id, onUpdate])

  // ─── Handler para eliminar con animación ───
  const handleRemove = () => {
    setIsRemoving(true)
    // El tiempo del timeout debe coincidir con la duración del CSS (0.3s)
    setTimeout(() => {
      onRemove(card.id)
    }, 300)
  }

  return (
    <article
      className={`card-editor 
        ${isDragOver ? 'card-editor--drag-over' : ''} 
        ${isRemoving ? 'card-editor--removing' : ''}
      `}
      aria-label={`Carta: ${card.name || 'Sin nombre'}`}
    >
      {/* ─── Zona de imagen con drag & drop ─── */}
      <div
        className="card-editor__image-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isRemoving && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Arrastrar imagen o hacer click para seleccionar"
        onKeyDown={(e) => e.key === 'Enter' && !isRemoving && fileInputRef.current?.click()}
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
          disabled={isRemoving}
          maxLength={30}
          aria-label="Nombre del personaje"
        />
        {/* ─── Botón eliminar ─── */}
        <button
          className="btn btn-danger btn-sm card-editor__remove-btn"
          onClick={(e) => {
            e.stopPropagation()
            handleRemove()
          }}
          disabled={isRemoving}
          aria-label={`Eliminar carta ${card.name || ''}`}
          title="Eliminar carta"
        >
          ✕
        </button>
      </div>
    </article>
  )
}
