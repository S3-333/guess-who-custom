/**
 * Editor.jsx – Página del Editor de tablero.
 *
 * Esta es la página principal donde los usuarios crean y editan
 * las cartas del juego. Orquesta varios componentes:
 * - CardGrid: muestra las cartas
 * - ImportExport: permite guardar/cargar tableros
 *
 * El estado del tablero vive en el hook useBoard y se pasa
 * hacia abajo a los componentes hijos (props drilling controlado).
 *
 * Props:
 * - board    {Object}   El hook useBoard completo (cards + funciones)
 * - onPlay   {Function} Navegar al modo juego
 */
import { CardGrid } from '../components/CardGrid/CardGrid'
import { ImportExport } from '../components/ImportExport/ImportExport'
import './Editor.css'

export function Editor({ board, onPlay }) {
  const { cards, addCard, removeCard, updateCard, loadBoard, clearBoard } = board

  /**
   * Validación antes de entrar al modo juego:
   * Se necesitan al menos 2 cartas con nombre e imagen.
   */
  const handlePlay = () => {
    const validCards = cards.filter(c => c.name.trim() && c.image)
    if (validCards.length < 2) {
      alert('Necesitás al menos 2 cartas con nombre e imagen para jugar.')
      return
    }
    onPlay()
  }

  const handleClear = () => {
    if (window.confirm('¿Seguro que querés limpiar el tablero? Se perderán todas las cartas.')) {
      clearBoard()
    }
  }

  return (
    <div className="editor-page">
      {/* ─── Header ─── */}
      <header className="editor-page__header">
        <div className="editor-page__header-left">
          <h1 className="editor-page__title">
            <span className="editor-page__title-icon">🎭</span>
            Editor de Tablero
          </h1>
          <p className="editor-page__subtitle">
            Creá tus personajes arrastrando fotos y escribiendo nombres
          </p>
        </div>

        {/* Contador de cartas */}
        <div className="editor-page__stats">
          <span className="badge">
            {cards.length} {cards.length === 1 ? 'carta' : 'cartas'}
          </span>
        </div>
      </header>

      {/* ─── Barra de acciones ─── */}
      <div className="editor-page__toolbar">
        {/* Acciones del tablero */}
        <div className="editor-page__toolbar-left">
          <button
            id="btn-add-card"
            className="btn btn-primary"
            onClick={addCard}
          >
            + Agregar carta
          </button>
          <button
            id="btn-clear-board"
            className="btn btn-ghost"
            onClick={handleClear}
          >
            🗑 Limpiar todo
          </button>
        </div>

        {/* Import / Export */}
        <div className="editor-page__toolbar-right">
          <ImportExport cards={cards} onImport={loadBoard} />
        </div>
      </div>

      {/* ─── Grid de cartas ─── */}
      <main className="editor-page__main">
        <CardGrid cards={cards} onUpdate={updateCard} onRemove={removeCard} />
      </main>

      {/* ─── Footer con botón de juego ─── */}
      <footer className="editor-page__footer">
        <button
          id="btn-start-game"
          className="btn btn-primary btn-lg editor-page__play-btn"
          onClick={handlePlay}
          disabled={cards.length < 2}
        >
          ▶ ¡Jugar!
        </button>
        <p className="editor-page__footer-hint">
          El tablero se guarda automáticamente en tu dispositivo
        </p>
      </footer>
    </div>
  )
}
