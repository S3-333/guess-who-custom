import { useState, useEffect } from 'react'
import { GuessWhoLogo } from './GuessWhoLogo'
import '../assets/transition-code-svg.css' // ¡Crucial para los colores y animaciones!
import './Splash.css'

export function Splash({ onDismiss }) {
  const [svgActive, setSvgActive] = useState(false)

  useEffect(() => {
    // Activar la animación del SVG justo después del rebote inicial de la pantalla
    const timer = setTimeout(() => {
      setSvgActive(true)
    }, 1100) 
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="splash-screen" onClick={onDismiss}>
      <div className="splash-screen__content">
        <div className="splash-screen__logo-container">
          {/* La clase 'active' en el SVG es lo que busca el CSS externo */}
          <GuessWhoLogo className={`splash-screen__logo-svg ${svgActive ? 'active' : ''}`} />
        </div>
        <p className={`splash-screen__hint ${svgActive ? 'splash-screen__hint--visible' : ''}`}>
          Tocá en cualquier parte para comenzar
        </p>
      </div>
    </div>
  )
}
