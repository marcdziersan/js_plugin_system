export default class Plugin {
  /**
   * Erstellt eine neue Plugin-Instanz
   * 
   * @param {string} name - Der eindeutige Plugin-Name (z. B. "todoList", "calendar")
   * @param {Object} [options={}] - Optionales Konfigurationsobjekt für Plugin-spezifische Einstellungen
   */
  constructor(name, options = {}) {
    this.name = name;       // Interner Bezeichner für das Plugin
    this.options = options; // Plugin-spezifische Konfiguration (optional)
  }

  /**
   * Platzhalter-Methode für die Initialisierung
   * 
   * Wird bei allen Plugins automatisch von `main.js` aufgerufen (wenn vorhanden).
   * Plugins sollen diese Methode in ihrer Klasse überschreiben.
   */
  init() {
    console.warn(`Plugin ${this.name} hat keine init() Methode implementiert.`);
  }
}
