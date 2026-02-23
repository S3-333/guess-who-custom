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
 * downloadJSON – Guarda un objeto asincrónicamente. 
 * Intenta usar showSaveFilePicker para permitir al usuario elegir la ruta.
 */
export async function downloadJSON(data, filename = 'tablero') {
  const json = JSON.stringify(data, null, 2);

  // Intentamos usar la API moderna de File System Access (Chrome/Edge)
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `${filename}.json`,
        types: [{
          description: 'Tablero de Guess Who',
          accept: { 'application/json': ['.json'] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      return; // Éxito con la API moderna
    } catch (err) {
      if (err.name === 'AbortError') return; // El usuario canceló
      console.error('Error usando SaveFilePicker:', err);
      // Fallback al método tradicional si falla por otra razón
    }
  }

  // MÉTODO FALLBACK (Tradicional): Descarga automática a "Descargas"
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * readJSONFile – Abre un selector de archivos y lee el JSON.
 * Ahora prefiere showOpenFilePicker para mayor control.
 */
export async function readJSONFromUser() {
  if ('showOpenFilePicker' in window) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{
          description: 'Archivo de Tablero (.json)',
          accept: { 'application/json': ['.json'] },
        }],
        multiple: false
      });
      const file = await handle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    } catch (err) {
      if (err.name === 'AbortError') return null;
      console.error('Error con OpenFilePicker:', err);
      throw err;
    }
  }
  return null; // Si no hay API, devolvemos null para usar el input tradicional
}

/** Lógica antigua de lectura para compatibilidad (usada si el input tradicional se activa) */
export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target.result));
      } catch {
        reject(new Error('El archivo no es un JSON válido'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
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
