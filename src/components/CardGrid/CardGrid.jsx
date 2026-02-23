/**
 * CardGrid.jsx – Grid responsivo de cartas del Editor.
 *
 * Responsabilidad única: renderizar la cuadrícula de cartas.
 * La cantidad de columnas se ajusta automáticamente con CSS Grid
 * (auto-fill + minmax), sin necesidad de JavaScript o media queries.
 *
 * Props:
 * - cards     {Array}    Lista de cartas
 * - onUpdate  {Function} Delega al hook useBoard
 * - onRemove  {Function} Delega al hook useBoard
 */
import { Card } from '../Card/Card'
import './CardGrid.css'

export function CardGrid({ cards, onUpdate, onRemove, onAdd }) {
  return (
    <div className="card-grid">
      {/* Listado de cartas existentes */}
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}

      {/* Botón especial para agregar nueva carta al final */}
      <button 
        className="card-grid__add-btn animate-pop-in"
        onClick={onAdd}
        title="Agregar nuevo personaje"
        aria-label="Agregar nueva carta"
      >
        <div className="card-grid__add-icon">＋</div>
        <span className="card-grid__add-text">Nuevo Personaje</span>
      </button>
    </div>
  )
}
