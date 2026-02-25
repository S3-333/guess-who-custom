/**
 * useBoard.js – Hook personalizado para manejar el tablero de cartas.
 *
 * ¿Por qué un custom hook?
 * Separar la lógica de estado de los componentes de presentación es
 * una buena práctica de React. El componente solo renderiza; el hook
 * maneja los datos. Esto hace el código reutilizable y testeable.
 *
 * Este hook maneja:
 * - La lista de cartas (cada una con id, nombre e imagen base64)
 * - Agregar, eliminar y actualizar cartas
 * - Persistencia en localStorage
 */
import { useState, useEffect, useCallback } from 'react'
import { generateId } from '../utils/helpers'

/** Clave usada para guardar el tablero en localStorage */
const STORAGE_KEY = 'guessWho_board'

/**
 * Crea una carta vacía con un ID único.
 * Usamos una función factory en lugar de un objeto literal
 * para garantizar que cada carta tenga su propio ID fresco.
 */
function createEmptyCard() {
  return {
    id: generateId(),   // ID único (timestamp + random)
    name: '',            // Nombre del personaje
    image: null,         // Base64 de la imagen (null = sin imagen)
  }
}

/**
 * useBoard – Hook que encapsula toda la lógica del tablero.
 * Retorna el estado y las funciones necesarias para que
 * el componente Editor pueda operar sobre las cartas.
 */
export function useBoard() {
  /**
   * useState: inicializa el estado con las cartas guardadas en
   * localStorage o con una carta vacía si no hay nada guardado.
   *
   * La función pasada a useState (lazy initialization) solo se
   * ejecuta UNA vez al montar el componente — es más eficiente
   * que calcular siempre aunque el estado no cambie.
   */
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      // Si hay datos guardados y son un array válido, los usamos
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (err) {
      console.warn('No se pudo leer el tablero guardado:', err)
    }
    // Si no hay datos, empezamos con 4 cartas vacías
    return Array.from({ length: 4 }, createEmptyCard)
  })

  /**
   * useEffect: cada vez que `cards` cambia, guardamos en localStorage.
   * Dependencia [cards]: solo se ejecuta cuando cards cambia.
   */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
    } catch (err) {
      console.warn('No se pudo guardar el tablero:', err)
    }
  }, [cards])

  /**
   * useCallback: memoiza las funciones para evitar que los componentes
   * hijos se re-rendericen innecesariamente cuando el padre re-renderiza.
   * Las funciones solo se recrean si cambian sus dependencias.
   */

  /** Agrega una carta vacía al final del tablero */
  const addCard = useCallback(() => {
    setCards(prev => [...prev, createEmptyCard()])
  }, [])

  /** Elimina una carta por su ID */
  const removeCard = useCallback((id) => {
    setCards(prev => prev.filter(card => card.id !== id))
  }, [])

  /**
   * Actualiza un campo específico de una carta.
   * @param {string} id - ID de la carta a actualizar
   * @param {Object} changes - Objeto con los campos a cambiar, ej: { name: 'Ana' }
   */
  const updateCard = useCallback((id, changes) => {
    setCards(prev =>
      prev.map(card => card.id === id ? { ...card, ...changes } : card)
    )
  }, [])

  /** Reemplaza todo el tablero (usado al importar un JSON) */
  const loadBoard = useCallback((newCards) => {
    setCards(newCards)
  }, [])

  /** Limpia completamente el tablero */
  const clearBoard = useCallback(() => {
    setCards(Array.from({ length: 4 }, createEmptyCard))
  }, [])

  return {
    cards,
    addCard,
    removeCard,
    updateCard,
    loadBoard,
    clearBoard,
  }
}
