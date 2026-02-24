/**
 * TurnScreen.jsx – Pantalla de bloqueo entre turnos.
 *
 * ¿Por qué existe esta pantalla?
 * Cuando dos jugadores comparten la misma computadora, necesitamos
 * impedir que el jugador que acaba de jugar siga viendo el tablero
 * del rival mientras el otro toma el control.
 *
 * Esta pantalla muestra:
 * 1. Quién juega ahora
 * 2. Un botón para revelar el tablero (lo presiona el jugador correcto)
 *
 * Props:
 * - playerName  {string}   Nombre del jugador cuyo turno comienza
 * - playerNum   {number}   1 o 2
 * - message     {string}   Mensaje principal a mostrar
 * - onContinue  {Function} Callback para continuar
 * - variant     {string}   'lock' (bloqueo) | 'turn' (cambio de turno)
 */
import './TurnScreen.css'

// Iconos
import rightArrowIcon from '../../assets/icons/right_arrow.webp'
import padlockIcon from '../../assets/icons/padlock.webp'
import padlock2Icon from '../../assets/icons/padlock_2.webp'
import refreshIcon from '../../assets/icons/refresh.webp'
import gameJoyIcon from '../../assets/icons/game_joy.webp'

export function TurnScreen({ playerName, playerNum, message, onContinue, variant = 'turn' }) {
  return (
    <div className={`turn-screen turn-screen--${variant} animate-fade-in`}>
      <div className="turn-screen__content animate-slide-up">
        {/* Ícono animado según el contexto */}
        <div className="turn-screen__icon">
          {variant === 'lock' ? (
            <div className="padlock-anim icon--blue">
              <img src={padlock2Icon} alt="" className="padlock-anim__img padlock-anim__img--closed" />
              <img src={padlockIcon} alt="" className="padlock-anim__img padlock-anim__img--open" />
            </div>
          ) : (
            <img src={refreshIcon} alt="" className="turn-screen__icon-img icon--blue" />
          )}
        </div>

        {/* Badge del jugador */}
        <div className={`turn-screen__badge turn-screen__badge--p${playerNum}`}>
          {playerName}
        </div>

        {/* Mensaje principal */}
        <h1 className="turn-screen__title">{message}</h1>

        {/* Instrucción */}
        <p className="turn-screen__subtitle">
          {variant === 'lock'
            ? 'Dale el dispositivo al otro jugador'
            : 'Cuando estés listo, presioná el botón para ver tu tablero'}
        </p>

        {/* Separador visual */}
        <div className="turn-screen__divider" />

        {/* Botón de acción */}
        <button
          id="btn-continue-turn"
          className="btn btn-primary btn-lg turn-screen__btn"
          onClick={onContinue}
        >
          {variant === 'lock' ? (
            <>
              Continuar <img src={rightArrowIcon} alt="" className="btn-icon icon--white" style={{ marginLeft: '10px', marginRight: 0 }} />
            </>
          ) : (
            <>
              ¡Soy {playerName}, comenzar!
            </>
          )}
        </button>
      </div>
    </div>
  )
}
