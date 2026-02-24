/**
 * useGame.js – Hook para manejar el estado global del modo juego.
 *
 * El estado del juego es el más complejo de la aplicación.
 * Aquí centralizamos toda la lógica de:
 * - Selección de personajes secretos
 * - Turnos (de quién es el turno ahora)
 * - Cartas descartadas de cada jugador
 * - Estado de la partida (selección, jugando, fin)
 *
 * ¿Por qué no useState múltiples en el componente?
 * Cuando el estado tiene muchas partes relacionadas, es más limpio
 * usar un único objeto de estado y actualizarlo con funciones
 * específicas. Así el componente queda más declarativo.
 */
import { useState, useCallback } from 'react'

/**
 * FASES DEL JUEGO – define el flujo de pantallas
 *
 * idle        → Antes de empezar
 * p1_select   → Jugador 1 elige su personaje secreto
 * p1_lock     → Pantalla de bloqueo antes de que vea P2
 * p2_select   → Jugador 2 elige su personaje secreto
 * playing     → Partida en curso
 * turn_switch → Pantalla de cambio de turno (para que el otro no vea)
 * finished    → Alguien ganó
 */
export const PHASES = {
  IDLE:        'idle',
  P1_SELECT:   'p1_select',
  P1_LOCK:     'p1_lock',
  P2_SELECT:   'p2_select',
  P2_LOCK:     'p2_lock',
  PLAYING:     'playing',
  TURN_SWITCH: 'turn_switch',
  FINISHED:    'finished',
}

/**
 * Estado inicial del juego – función para poder resetearlo fácilmente
 */
function initialState() {
  return {
    phase: PHASES.IDLE,

    // Personajes secretos (ID de la carta)
    p1Secret: null,
    p2Secret: null,

    // Turno actual: 1 o 2
    currentTurn: 1,

    // IDs de cartas descartadas por cada jugador
    // (el jugador decide que esa carta NO es el personaje del rival)
    p1Discarded: [],
    p2Discarded: [],

    // Nombre o etiqueta de cada jugador
    p1Name: 'Jugador 1',
    p2Name: 'Jugador 2',

    // ID de quién ganó (null si nadie ganó aún)
    winner: null,
  }
}

/**
 * useGame – Encapsula toda la lógica de la partida.
 * Recibe las cartas del tablero para poder validar aciertos.
 */
export function useGame(cards) {
  const [game, setGame] = useState(initialState)

  /** Helper interno para actualizar parcialmente el estado del juego */
  const update = useCallback((changes) => {
    setGame(prev => ({ ...prev, ...changes }))
  }, [])

  /** Inicia el flujo del juego: P1 elige primero */
  const startGame = useCallback((p1Name, p2Name) => {
    setGame({
      ...initialState(),
      phase: PHASES.P1_SELECT,
      p1Name: p1Name || 'Jugador 1',
      p2Name: p2Name || 'Jugador 2',
    })
  }, [])

  /** Jugador 1 confirma su personaje secreto */
  const p1SelectSecret = useCallback((cardId) => {
    update({ p1Secret: cardId, phase: PHASES.P1_LOCK })
  }, [update])

  /** Jugador 2 empieza a elegir (después de que P1 confirmó y pasó el lock) */
  const proceedToP2Select = useCallback(() => {
    update({ phase: PHASES.P2_SELECT })
  }, [update])

  /** Jugador 2 confirma su personaje secreto → pantalla de bloqueo previa al inicio */
  const p2SelectSecret = useCallback((cardId) => {
    update({ p2Secret: cardId, phase: PHASES.P2_LOCK })
  }, [update])

  /** Empieza el juego oficialmente (después del segundo lock) */
  const proceedToPlaying = useCallback(() => {
    update({ phase: PHASES.PLAYING, currentTurn: 1 })
  }, [update])

  /**
   * Descarta una carta del tablero del jugador actual.
   * "Descartar" significa que el jugador está seguro de que
   * esa carta NO es el personaje secreto del rival.
   */
  const discardCard = useCallback((cardId) => {
    setGame(prev => {
      if (prev.currentTurn === 1) {
        const already = prev.p1Discarded.includes(cardId)
        return {
          ...prev,
          p1Discarded: already
            ? prev.p1Discarded.filter(id => id !== cardId) // toggle off
            : [...prev.p1Discarded, cardId],                // toggle on
        }
      } else {
        const already = prev.p2Discarded.includes(cardId)
        return {
          ...prev,
          p2Discarded: already
            ? prev.p2Discarded.filter(id => id !== cardId)
            : [...prev.p2Discarded, cardId],
        }
      }
    })
  }, [])

  /**
   * El jugador actual intenta adivinar el personaje del rival.
   * Si acierta → gana. Si falla → pierde el turno (o se podría
   * implementar otra lógica de penalización).
   */
  const guessCharacter = useCallback((guessedCardId) => {
    setGame(prev => {
      const isP1Turn = prev.currentTurn === 1
      const rivalSecret = isP1Turn ? prev.p2Secret : prev.p1Secret

      if (guessedCardId === rivalSecret) {
        // ¡Acertó! — ese jugador gana
        return {
          ...prev,
          winner: isP1Turn ? 1 : 2,
          phase: PHASES.FINISHED,
        }
      } else {
        // Fallo: agregamos la carta a los descartes localmente y pasamos el turno
        const discardKey = isP1Turn ? 'p1Discarded' : 'p2Discarded'
        const isPassTurn = guessedCardId === '__pass_turn__'

        return {
          ...prev,
          phase: PHASES.TURN_SWITCH,
          currentTurn: isP1Turn ? 2 : 1,
          [discardKey]: isPassTurn || prev[discardKey].includes(guessedCardId)
            ? prev[discardKey]
            : [...prev[discardKey], guessedCardId]
        }
      }
    })
  }, [])

  /** Confirma el cambio de turno (el nuevo jugador tomó el control) */
  const confirmTurnSwitch = useCallback(() => {
    update({ phase: PHASES.PLAYING })
  }, [update])

  /** Reinicia completamente el juego */
  const resetGame = useCallback(() => {
    setGame(initialState())
  }, [])

  return {
    game,
    startGame,
    p1SelectSecret,
    proceedToP2Select,
    p2SelectSecret,
    proceedToPlaying,
    discardCard,
    guessCharacter,
    confirmTurnSwitch,
    resetGame,
  }
}
