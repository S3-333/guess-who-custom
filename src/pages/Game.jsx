/**
 * Game.jsx – Página principal del modo juego.
 *
 * Esta página actúa como un "máquina de estados" visual:
 * dependiendo de `game.phase`, renderiza un componente diferente.
 *
 * Flujo de fases:
 * idle → setup → p1_select → p1_lock → p2_select → playing ←→ turn_switch → finished
 *
 * Props:
 * - cards     {Array}    Cartas del tablero (solo las válidas)
 * - game      {Object}   Estado del juego desde useGame
 * - actions   {Object}   Funciones del hook useGame
 * - onBack    {Function} Volver al editor
 */
import { useState } from 'react'
import { CharacterSelect } from '../components/CharacterSelect/CharacterSelect'
import { TurnScreen } from '../components/TurnScreen/TurnScreen'
import { PHASES } from '../hooks/useGame'
import './Game.css'

export function Game({ cards, game, actions, onBack }) {
  // Filtramos solo cartas que tengan nombre e imagen
  const validCards = cards.filter(c => c.name.trim() && c.image)

  // ─── PANTALLA DE CONFIGURACIÓN INICIAL (idle) ──────────────────
  if (game.phase === PHASES.IDLE) {
    return <GameSetup onStart={actions.startGame} onBack={onBack} />
  }

  // ─── SELECCIÓN DE PERSONAJE – JUGADOR 1 ───────────────────────
  if (game.phase === PHASES.P1_SELECT) {
    return (
      <CharacterSelect
        cards={validCards}
        playerName={game.p1Name}
        playerNum={1}
        onSelect={actions.p1SelectSecret}
      />
    )
  }

  // ─── PANTALLA DE BLOQUEO ENTRE P1 Y P2 ─────────────────────────
  if (game.phase === PHASES.P1_LOCK) {
    return (
      <TurnScreen
        playerName={game.p2Name}
        playerNum={2}
        message={`${game.p1Name} ya eligió. Turno de ${game.p2Name}.`}
        onContinue={actions.proceedToP2Select}
        variant="lock"
      />
    )
  }

  // ─── SELECCIÓN DE PERSONAJE – JUGADOR 2 ───────────────────────
  if (game.phase === PHASES.P2_SELECT) {
    return (
      <CharacterSelect
        cards={validCards}
        playerName={game.p2Name}
        playerNum={2}
        onSelect={actions.p2SelectSecret}
      />
    )
  }

  // ─── JUGANDO ──────────────────────────────────────────────────
  if (game.phase === PHASES.PLAYING) {
    return (
      <GameBoard
        cards={validCards}
        game={game}
        onDiscard={actions.discardCard}
        onGuess={actions.guessCharacter}
        actions={actions}
      />
    )
  }

  // ─── CAMBIO DE TURNO ──────────────────────────────────────────
  if (game.phase === PHASES.TURN_SWITCH) {
    const currentPlayerName = game.currentTurn === 1 ? game.p1Name : game.p2Name
    return (
      <TurnScreen
        playerName={currentPlayerName}
        playerNum={game.currentTurn}
        message={`Turno de ${currentPlayerName}`}
        onContinue={actions.confirmTurnSwitch}
        variant="turn"
      />
    )
  }

  // ─── FIN DE JUEGO ─────────────────────────────────────────────
  if (game.phase === PHASES.FINISHED) {
    const winnerName = game.winner === 1 ? game.p1Name : game.p2Name
    const secretCard = validCards.find(c =>
      c.id === (game.winner === 1 ? game.p2Secret : game.p1Secret)
    )
    return (
      <GameFinished
        winnerName={winnerName}
        winnerNum={game.winner}
        secretCard={secretCard}
        onRestart={actions.resetGame}
        onBack={onBack}
      />
    )
  }

  return null
}

// ─── SUB-COMPONENTES INTERNOS ──────────────────────────────────────────────────

/**
 * GameSetup – Formulario de configuración antes de jugar.
 * Permite personalizar los nombres de los jugadores.
 */
function GameSetup({ onStart, onBack }) {
  const [p1Name, setP1Name] = useState('Jugador 1')
  const [p2Name, setP2Name] = useState('Jugador 2')

  return (
    <div className="game-setup animate-fade-in">
      <div className="game-setup__card animate-slide-up">

        <div className="game-setup__icon">🎮</div>
        <h1 className="game-setup__title">Configurar partida</h1>
        <p className="game-setup__subtitle">Ingresá los nombres de los jugadores</p>

        <div className="game-setup__form">
          <div className="game-setup__field">
            <label className="game-setup__label game-setup__label--p1">
              Jugador 1
            </label>
            <input
              id="input-p1-name"
              type="text"
              className="input"
              value={p1Name}
              onChange={e => setP1Name(e.target.value)}
              placeholder="Nombre del jugador 1"
              maxLength={20}
            />
          </div>
          <div className="game-setup__field">
            <label className="game-setup__label game-setup__label--p2">
              Jugador 2
            </label>
            <input
              id="input-p2-name"
              type="text"
              className="input"
              value={p2Name}
              onChange={e => setP2Name(e.target.value)}
              placeholder="Nombre del jugador 2"
              maxLength={20}
            />
          </div>
        </div>

        <div className="game-setup__actions">
          <button
            id="btn-game-start"
            className="btn btn-primary btn-lg"
            onClick={() => onStart(p1Name, p2Name)}
            disabled={!p1Name.trim() || !p2Name.trim()}
          >
            🚀 ¡Empezar!
          </button>
          <button
            className="btn btn-ghost"
            onClick={onBack}
          >
            ← Volver al editor
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * GameBoard – El tablero activo durante la partida.
 * Muestra las cartas del jugador actual y permite:
 * - Descartar cartas (toggle)
 * - Adivinar el personaje del rival
 * - Pasar el turno
 */
function GameBoard({ cards, game, onDiscard, onGuess, actions }) {
  const isP1Turn = game.currentTurn === 1
  const currentPlayerName = isP1Turn ? game.p1Name : game.p2Name
  const rivalName = isP1Turn ? game.p2Name : game.p1Name
  const discarded = isP1Turn ? game.p1Discarded : game.p2Discarded

  // Personaje secreto del jugador actual
  const mySecret = cards.find(c => c.id === (isP1Turn ? game.p1Secret : game.p2Secret))

  /**
   * Pasar el turno sin adivinar.
   * Usamos guessCharacter con un ID que nunca existirá → falla la adivinanza
   * → el hook cambia la fase a TURN_SWITCH y alterna el turno.
   * Es el mecanismo más limpio sin añadir una acción extra al hook.
   */
  const handlePassTurn = () => {
    actions.guessCharacter('__pass_turn__')
  }

  return (
    <div className="game-board animate-fade-in">
      {/* ─── Header del juego ─── */}
      <header className="game-board__header">
        <div className="game-board__player-info">
          <span className={`game-board__turn-badge game-board__turn-badge--p${game.currentTurn}`}>
            Turno de {currentPlayerName}
          </span>
          <span className="game-board__rival-hint">
            Intentá adivinar el personaje de {rivalName}
          </span>
        </div>

        {/* Mi personaje secreto */}
        {mySecret && (
          <div className="game-board__my-secret">
            <span className="game-board__my-secret-label">Mi personaje:</span>
            <div className="game-board__my-secret-card">
              {mySecret.image && (
                <img
                  src={mySecret.image}
                  alt={mySecret.name}
                  className="game-board__my-secret-img"
                />
              )}
              <span className="game-board__my-secret-name">{mySecret.name}</span>
            </div>
          </div>
        )}
      </header>

      {/* ─── Instrucción ─── */}
      <p className="game-board__instruction">
        💡 Click en una carta para <strong>descartarla</strong>.
        Cuando estés seguro de quién es, hacé click en <strong>"Adivinar"</strong>.
      </p>

      {/* ─── Grid del tablero de juego ─── */}
      <div className="game-board__grid">
        {cards.map(card => {
          const isDiscarded = discarded.includes(card.id)
          const isMySecret  = card.id === (isP1Turn ? game.p1Secret : game.p2Secret)

          return (
            <div
              key={card.id}
              className={`
                game-card
                ${isDiscarded ? 'game-card--discarded' : ''}
                ${isMySecret  ? 'game-card--mine' : ''}
              `}
              onClick={() => onDiscard(card.id)}
              title={isMySecret && !isDiscarded ? 'Este es tu personaje (click para descartar)' : isDiscarded ? 'Descartado (click para restaurar)' : 'Click para descartar'}
            >
              {/* Imagen */}
              <div className="game-card__image-wrapper">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.name}
                    className="game-card__image"
                  />
                ) : (
                  <div className="game-card__no-image">?</div>
                )}
                {/* Overlay de descartado */}
                {isDiscarded && (
                  <div className="game-card__discarded-overlay">
                    <span className="game-card__discarded-x">✕</span>
                  </div>
                )}
                {/* Indicador "mi personaje" */}
                {isMySecret && (
                  <div className="game-card__mine-overlay">⭐</div>
                )}
              </div>
              {/* Nombre */}
              <span className="game-card__name">{card.name}</span>

              {/* Botón de adivinar (solo si no está descartado, permitiendo adivinar el propio si se desea) */}
              {!isDiscarded && (
                <button
                  className="btn btn-secondary btn-sm game-card__guess-btn"
                  onClick={(e) => {
                    e.stopPropagation() // No propagar el click al div padre
                    if (window.confirm(`¿Adivinás que el personaje de ${rivalName} es "${card.name}"?`)) {
                      const rivalSecret = isP1Turn ? game.p2Secret : game.p1Secret
                      if (card.id !== rivalSecret) {
                        alert(`¡Incorrecto! El personaje de ${rivalName} no es ${card.name}.\n\nPierdes tu turno y la carta se descarta.`)
                      }
                      onGuess(card.id)
                    }
                  }}
                  aria-label={`Adivinar: ${card.name}`}
                >
                  🎯 Adivinar
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* ─── Footer del juego ─── */}
      <footer className="game-board__footer">
        <div className="game-board__footer-stats">
          <span className="badge">
            {discarded.length} descartadas de {cards.length}
          </span>
        </div>
        <button
          id="btn-pass-turn"
          className="btn btn-secondary"
          onClick={handlePassTurn}
        >
          Pasar turno →
        </button>
      </footer>
    </div>
  )
}

/**
 * GameFinished – Pantalla de victoria.
 */
function GameFinished({ winnerName, winnerNum, secretCard, onRestart, onBack }) {
  return (
    <div className="game-finished animate-fade-in">
      <div className="game-finished__content animate-slide-up">
        <div className="game-finished__trophy">🏆</div>
        <h1 className="game-finished__title">¡{winnerName} ganó!</h1>
        <p className="game-finished__subtitle">
          Adivinó correctamente el personaje secreto del rival
        </p>

        {secretCard && (
          <div className="game-finished__secret">
            <p className="game-finished__secret-label">El personaje era:</p>
            <div className="game-finished__secret-card">
              {secretCard.image && (
                <img
                  src={secretCard.image}
                  alt={secretCard.name}
                  className="game-finished__secret-img"
                />
              )}
              <span className="game-finished__secret-name">{secretCard.name}</span>
            </div>
          </div>
        )}

        <div className="game-finished__actions">
          <button
            id="btn-play-again"
            className="btn btn-primary btn-lg"
            onClick={onRestart}
          >
            🔄 Jugar de nuevo
          </button>
          <button
            className="btn btn-secondary"
            onClick={onBack}
          >
            ← Volver al editor
          </button>
        </div>
      </div>
    </div>
  )
}
