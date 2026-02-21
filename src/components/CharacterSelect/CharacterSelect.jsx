/**
 * CharacterSelect.jsx – Pantalla de selección de personaje secreto.
 *
 * Cada jugador usa esta pantalla para elegir qué personaje quiere
 * "ser" en el juego. La elección es secreta — el otro jugador no
 * debe ver esta pantalla.
 *
 * Props:
 * - cards       {Array}    Todas las cartas del tablero
 * - playerName  {string}   Nombre del jugador que está eligiendo
 * - playerNum   {number}   1 o 2
 * - onSelect    {Function} Callback con el ID de la carta elegida
 */
import { useState } from 'react'
import './CharacterSelect.css'

export function CharacterSelect({ cards, playerName, playerNum, onSelect }) {
  /**
   * Estado local para la carta seleccionada (antes de confirmar).
   * Usamos un estado intermedio para que el jugador pueda cambiar
   * de opinión antes de confirmar definitivamente.
   */
  const [selectedId, setSelectedId] = useState(null)

  const handleConfirm = () => {
    if (!selectedId) {
      alert('Seleccioná un personaje antes de continuar.')
      return
    }
    onSelect(selectedId)
  }

  return (
    <div className="char-select animate-fade-in">
      <header className="char-select__header">
        <div className={`char-select__player-badge char-select__player-badge--p${playerNum}`}>
          Jugador {playerNum}
        </div>
        <h1 className="char-select__title">{playerName}, elegí tu personaje</h1>
        <p className="char-select__subtitle">
          Elegí el personaje que el rival deberá adivinar. ¡Que el otro no vea tu pantalla!
        </p>
      </header>

      {/* Grid de selección — similar al tablero del editor */}
      <div className="char-select__grid">
        {cards.map(card => (
          <button
            key={card.id}
            id={`char-select-card-${card.id}`}
            className={`char-select__card ${selectedId === card.id ? 'char-select__card--selected' : ''}`}
            onClick={() => setSelectedId(card.id)}
            aria-pressed={selectedId === card.id}
            aria-label={`Elegir a ${card.name || 'Sin nombre'}`}
          >
            {/* Imagen del personaje */}
            <div className="char-select__card-image-wrapper">
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.name || 'Personaje'}
                  className="char-select__card-image"
                />
              ) : (
                <div className="char-select__card-no-image">?</div>
              )}
              {/* Indicador visual de selección */}
              {selectedId === card.id && (
                <div className="char-select__card-overlay">✓</div>
              )}
            </div>
            {/* Nombre del personaje */}
            <span className="char-select__card-name">
              {card.name || '(Sin nombre)'}
            </span>
          </button>
        ))}
      </div>

      {/* Botón de confirmación */}
      <footer className="char-select__footer">
        <button
          id="btn-confirm-character"
          className="btn btn-primary btn-lg"
          onClick={handleConfirm}
          disabled={!selectedId}
        >
          Confirmar personaje →
        </button>
      </footer>
    </div>
  )
}
