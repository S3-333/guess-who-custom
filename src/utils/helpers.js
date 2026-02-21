/**
 * helpers.js – Utilidades puras (sin efectos secundarios).
 *
 * Las funciones utilitarias son independientes de React y
 * pueden usarse en cualquier parte del proyecto.
 * Las mantenemos puras: misma entrada → misma salida, sin mutaciones.
 */

/**
 * Genera un ID único combinando timestamp y número aleatorio.
 * No usamos crypto.randomUUID() por compatibilidad con más navegadores.
 * @returns {string} ID único
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Convierte un File (imagen) a una cadena Base64.
 * Usamos Base64 para poder guardar imágenes en localStorage y JSON,
 * ya que ambos solo aceptan texto.
 *
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} Base64 de la imagen
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => resolve(e.target.result) // e.target.result = data:image/...;base64,...
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file) // Convierte el archivo a Base64
  })
}

/**
 * Valida que un archivo sea una imagen aceptada.
 * @param {File} file
 * @returns {boolean}
 */
export function isValidImageFile(file) {
  const accepted = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  return file && accepted.includes(file.type)
}

/**
 * Descarga un objeto JavaScript como archivo .json.
 *
 * ⚠️ Decisión técnica importante:
 * El elemento <a> DEBE estar adjunto al DOM antes de llamar a .click().
 * Chrome en Windows ignora el click si el elemento no está en el árbol DOM.
 * Usamos `style.display='none'` para que no sea visible y `body.removeChild`
 * para limpiarlo inmediatamente después.
 *
 * Además, `URL.revokeObjectURL` va dentro de un setTimeout para asegurarnos
 * de que el navegador haya iniciado la descarga antes de liberar la URL.
 *
 * @param {Object} data - Datos a exportar
 * @param {string} filename - Nombre del archivo (sin extensión)
 */
export function downloadJSON(data, filename = 'tablero') {
  const json = JSON.stringify(data, null, 2) // Formato legible con indentación
  const blob = new Blob([json], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href            = url
  a.download        = `${filename}.json`
  a.style.display   = 'none'

  // ✅ Adjuntamos al DOM → Chrome/Windows puede procesar el click
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  // ✅ Liberamos la URL después de que el navegador inicie la descarga
  setTimeout(() => URL.revokeObjectURL(url), 150)
}

/**
 * Lee un archivo .json y retorna el objeto parseado.
 * @param {File} file
 * @returns {Promise<Object>}
 */
export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => {
      try {
        resolve(JSON.parse(e.target.result))
      } catch {
        reject(new Error('El archivo no es un JSON válido'))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })
}

/**
 * Trunca un texto si excede la longitud máxima.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 20) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}
