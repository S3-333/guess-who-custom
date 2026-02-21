/**
 * App.jsx – Componente raíz de la aplicación.
 *
 * Responsabilidades:
 * 1. Manejar la "página" activa (editor vs juego) — navegación simple sin router
 * 2. Instanciar los hooks de estado (useBoard, useGame)
 * 3. Pasar estado y funciones a las páginas hijas
 *
 * ¿Por qué no usamos React Router?
 * La app tiene solo 2 vistas (editor y juego). Agregar un router
 * sería sobreingeniería. Un simple estado `currentPage` con useState
 * es suficiente, legible y sin dependencias extra.
 *
 * Patrón de "prop drilling controlado":
 * El estado vive aquí arriba y baja por props.
 * Con 2 niveles de profundidad esto es perfectamente manejable.
 * Si la app creciera, podríamos considerar Context API.
 */
import { useState } from 'react'
import { useBoard } from './hooks/useBoard'
import { useGame } from './hooks/useGame'
import { Editor } from './pages/Editor'
import { Game } from './pages/Game'
import './styles/App.css'

/**
 * Las páginas posibles de la aplicación.
 * Usamos un objeto constante en vez de strings sueltos
 * para evitar errores tipográficos y facilitar el refactor.
 */
const PAGES = {
  EDITOR: 'editor',
  GAME:   'game',
}

function App() {
  /**
   * Estado de navegación: qué página estamos viendo.
   * Simple, claro y sin librerías externas.
   */
  const [currentPage, setCurrentPage] = useState(PAGES.EDITOR)

  /**
   * useBoard: hook que maneja el tablero de cartas.
   * Vive aquí arriba para poder pasar las cartas tanto al
   * Editor (para editar) como al Game (para jugar).
   */
  const board = useBoard()

  /**
   * useGame: hook que maneja toda la lógica del juego.
   * También vive en App para que persista si el usuario
   * navega entre páginas (aunque en la práctica el juego
   * resetea al volver al editor).
   */
  const {
    game,
    startGame,
    p1SelectSecret,
    proceedToP2Select,
    p2SelectSecret,
    discardCard,
    guessCharacter,
    confirmTurnSwitch,
    resetGame,
  } = useGame(board.cards)

  // Agrupamos las acciones del juego en un objeto para no
  // pasar 8 props separadas → más limpio y extensible
  const gameActions = {
    startGame,
    p1SelectSecret,
    proceedToP2Select,
    p2SelectSecret,
    discardCard,
    guessCharacter,
    confirmTurnSwitch,
    resetGame,
  }

  /** Navega al juego y resetea el estado previo */
  const handleGoToGame = () => {
    resetGame()
    setCurrentPage(PAGES.GAME)
  }

  /** Vuelve al editor desde el juego */
  const handleGoToEditor = () => {
    resetGame()
    setCurrentPage(PAGES.EDITOR)
  }

  return (
    <div className="app">
      {/* Navegación mínima / branding */}
      <nav className="app-nav" aria-label="Navegación principal">
        <button
          className={`app-nav__tab ${currentPage === PAGES.EDITOR ? 'app-nav__tab--active' : ''}`}
          onClick={handleGoToEditor}
          aria-current={currentPage === PAGES.EDITOR ? 'page' : undefined}
        >
          🎭 Editor
        </button>
        <div className="app-nav__brand">Guess Who</div>
        <button
          className={`app-nav__tab ${currentPage === PAGES.GAME ? 'app-nav__tab--active' : ''}`}
          onClick={handleGoToGame}
          disabled={board.cards.filter(c => c.name.trim() && c.image).length < 2}
          title={board.cards.filter(c => c.name.trim() && c.image).length < 2
            ? 'Necesitás al menos 2 cartas con imagen y nombre para jugar'
            : 'Ir al modo juego'
          }
        >
          🎮 Jugar
        </button>
      </nav>

      {/* Renderizado condicional de la página activa */}
      <main className="app-main">
        {currentPage === PAGES.EDITOR && (
          <Editor
            board={board}
            onPlay={handleGoToGame}
          />
        )}
        {currentPage === PAGES.GAME && (
          <Game
            cards={board.cards}
            game={game}
            actions={gameActions}
            onBack={handleGoToEditor}
          />
        )}
      </main>
    </div>
  )
}

export default App
