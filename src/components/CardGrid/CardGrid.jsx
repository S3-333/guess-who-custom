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

export function CardGrid({ cards, onUpdate, onRemove }) {
  // Si no hay cartas, mostramos un mensaje vacío
  if (cards.length === 0) {
    return (
      <div className="card-grid__empty animate-fade-in">
        <p>No hay cartas en el tablero.</p>
        <p>Hacé click en <strong>"Agregar carta"</strong> para empezar.</p>
      </div>
    )
  }

  return (
    <div className="card-grid">
      {/*
       * Usamos `key={card.id}` para que React identifique cada carta
       * de forma única. Sin key, React puede confundir elementos al
       * reordenar o eliminar, causando bugs visuales.
       */}
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
