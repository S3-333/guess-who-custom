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

// Iconos
import basketIcon from '../assets/icons/basket.webp'
import gameJoyIcon from '../assets/icons/game_joy.webp'

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
            Editor de Tablero
          </h1>
          <p className="editor-page__subtitle">
            Creá tus personajes arrastrando fotos y escribiendo nombres
          </p>
        </div>

        {/* Contador de cartas */}
        <div className="editor-page__stats">
          <span className="badge">
            {cards.length === 1 ? 'Solo tienes una carta' : 'Tienes ' + cards.length + ' cartas'}
          </span>
        </div>
      </header>

      {/* ─── Barra de acciones ─── */}
      <div className="editor-page__toolbar">
        {/* Acciones principales del tablero */}
        <div className="editor-page__toolbar-left">
          <button
            id="btn-clear-board"
            className="btn btn-ghost"
            onClick={handleClear}
          >
            <img src={basketIcon} alt="" className="btn-icon btn-icon--basket" /> Limpiar todo
          </button>
        </div>

        {/* Import / Export */}
        <div className="editor-page__toolbar-right">
          <ImportExport cards={cards} onImport={loadBoard} />
        </div>
      </div>

      {/* ─── Grid de cartas ─── */}
      <main className="editor-page__main">
        <CardGrid 
          cards={cards} 
          onUpdate={updateCard} 
          onRemove={removeCard} 
          onAdd={addCard}
        />
      </main>

      {/* ─── Footer con botón de juego ─── */}
      <footer className="editor-page__footer">
        <button
          id="btn-start-game"
          className="btn btn-primary btn-lg editor-page__play-btn"
          onClick={handlePlay}
          disabled={cards.length < 2}
          title={cards.length < 2 ? "Necesitás al menos 2 cartas para jugar" : "¡Empezar partida!"}
        >
          {cards.length < 2 ? 'Faltan Cartas' : '▶ ¡Jugar!'}
        </button>
        <p className="editor-page__footer-hint">
          El tablero se guarda automáticamente en tu dispositivo
        </p>
      </footer>
    </div>
  )
}
