import './HelpSection.css'
import targetIcon from '../../assets/icons/target.webp'
import gameJoyIcon from '../../assets/icons/game_joy.webp'

/**
 * HelpSection – Pantalla informativa con reglas y consejos.
 * 
 * @param {Function} onClose - Función para cerrar la pantalla
 */
export function HelpSection({ onClose }) {
  return (
    <div className="help-section" onClick={onClose}>
      <div className="help-section__container" onClick={e => e.stopPropagation()}>
        <button 
          className="help-section__close" 
          onClick={onClose}
          aria-label="Cerrar ayuda"
        >
          &times;
        </button>

        <header className="help-section__header">
          <h2 className="help-section__title">
            <img src={gameJoyIcon} alt="" className="help-section__icon-main icon--blue" />
            Guía del Juego
          </h2>
        </header>

        <div className="help-section__grid">
          {/* Reglas del Juego */}
          <section className="help-section__block">
            <h3 className="help-section__h3">
              <img src={targetIcon} alt="" className="btn-icon icon--blue" />
              ¿Cómo funciona?
            </h3>
            <div className="help-section__text">
              <p>Guess Who Custom es un juego de deducción para dos jugadores. El objetivo es adivinar el personaje secreto de tu rival antes de que él adivine el tuyo.</p>
              <ul className="help-section__list">
                <li className="help-section__item">
                  <span className="help-section__bullet">1.</span>
                  <span><strong>Configuración:</strong> Cada jugador elige un personaje secreto que el otro debe adivinar.</span>
                </li>
                <li className="help-section__item">
                  <span className="help-section__bullet">2.</span>
                  <span><strong>Turnos:</strong> Haz preguntas de "Sí" o "No" para descartar personajes en tu tablero.</span>
                </li>
                <li className="help-section__item">
                  <span className="help-section__bullet">3.</span>
                  <span><strong>Descarte:</strong> Haz click en las cartas para abatirlas y eliminarlas de tus sospechosos.</span>
                </li>
                <li className="help-section__item">
                  <span className="help-section__bullet">4.</span>
                  <span><strong>Victoria:</strong> ¡Cuando estés seguro, usa el botón "Adivinar" para ganar la partida!</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Consejos de Optimización */}
          <section className="help-section__block" style={{ borderLeftColor: 'var(--color-accent)' }}>
            <h3 className="help-section__h3">
              🚀 Consejos de Uso
            </h3>
            <div className="help-section__text">
              <p>Para que el juego funcione de forma fluida y los archivos de tablero no pesen demasiado, te recomendamos <strong>optimizar tus imágenes</strong> antes de subirlas al editor.</p>
              <p style={{ marginTop: '10px' }}>Reducir el peso de las fotos ayuda a que la carga sea instantánea y ahorra espacio en tu dispositivo.</p>
              
              <div className="help-section__links">
                <a href="https://squoosh.app/" target="_blank" rel="noopener noreferrer" className="help-section__link">Squoosh (Web)</a>
                <a href="https://tinypng.com/" target="_blank" rel="noopener noreferrer" className="help-section__link">TinyPNG (Web)</a>
                <a href="https://imageoptim.com/" target="_blank" rel="noopener noreferrer" className="help-section__link">ImageOptim (Mac)</a>
                <a href="https://imagemagick.org/" target="_blank" rel="noopener noreferrer" className="help-section__link">ImageMagick (Pro)</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
