import Plugin from '../plugin.js';

/**
 * 🧩 BoilerplatePlugin
 * 
 * Diese Vorlage dient als Ausgangspunkt für eigene Plugins.
 * Einfach kopieren, umbenennen und in `config.js` eintragen.
 */
export default class BoilerplatePlugin extends Plugin {
  constructor() {
    super('BoilerplatePlugin', {
      // Optional: Plugin-Konfiguration hier definieren
      greeting: 'Hallo Welt!',
      position: 'top-right', // Beispiel: Positionierung der UI
    });

    this.container = null; // wird für DOM-Element gespeichert
  }

  /**
   * Wird beim Laden des Plugins automatisch aufgerufen.
   * Hier wird der UI-Aufbau, Event-Bindung etc. erledigt.
   */
  init() {
    this.injectStyles();
    this.render();
    console.log(`[BoilerplatePlugin] Initialisiert mit Optionen:`, this.options);
  }

  /**
   * Fügt CSS-Regeln für dieses Plugin in den <head> ein
   */
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #boilerplate-plugin {
        position: fixed;
        ${this.options.position === 'top-right' ? 'top: 20px; right: 20px;' : ''}
        background: #1e1e1e;
        color: white;
        padding: 1rem;
        border-radius: 12px;
        font-family: sans-serif;
        z-index: 1000;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      }

      #boilerplate-plugin button {
        background: #4caf50;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        color: white;
      }

      #boilerplate-plugin button:hover {
        background: #66bb6a;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Baut die DOM-Struktur dieses Plugins
   */
  render() {
    const container = document.createElement('div');
    container.id = 'boilerplate-plugin';

    const title = document.createElement('h3');
    title.textContent = '🧩 Boilerplate Plugin';

    const message = document.createElement('p');
    message.textContent = this.options.greeting;

    const button = document.createElement('button');
    button.textContent = 'Aktion!';
    button.onclick = () => this.handleClick();

    container.append(title, message, button);
    document.body.appendChild(container);

    this.container = container;
  }

  /**
   * Beispielhafte Event-Methode (Button Click)
   */
  handleClick() {
    alert('🎉 Plugin-Button wurde gedrückt!');
    // Optional: Hier eigene Logik integrieren
  }

  /**
   * Beispielhafte Methode für spätere Erweiterung
   */
  doSomethingCustom() {
    console.log('✏️ Hier kann benutzerdefinierte Logik implementiert werden.');
  }
}
