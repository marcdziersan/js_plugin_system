import Plugin from '../plugin.js';

/**
 * 📘 InfoModal Plugin
 * 
 * Fügt einen "ℹ️"-Button in die Oberfläche ein, der ein modales Informationsfenster öffnet.
 * Das Modal beschreibt den Aufbau des Plugin-Systems, listet alle vorhandenen Plugins auf
 * und zeigt Vor- und Nachteile der Architektur.
 */
export default class InfoModal extends Plugin {
  constructor() {
    super('InfoModal'); // Registrierung unter dem Namen "InfoModal"
  }

  /**
   * Entry-Point des Plugins.
   * Führt Style-Injection, Button-Rendering und Modalfenster-Setup aus.
   */
  init() {
    this.injectStyles();   // CSS einfügen
    this.createButton();   // Info-Button erzeugen
    this.createModal();    // Modal-Fenster erzeugen
  }

  /**
   * Fügt CSS-Styling für Button und Modal in das <head> ein.
   */
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #info-button {
        position: fixed;
        top: 50px;
        left: 20px;
        background: #4caf50;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1100;
      }

      #info-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1200;
      }

      #info-modal-content {
        background: #1e1e1e;
        color: #fff;
        padding: 2rem;
        border-radius: 12px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 40px rgba(0,0,0,0.8);
        font-family: sans-serif;
      }

      #info-modal-content h2 {
        margin-top: 1rem;
        color: #4caf50;
      }

      #info-modal-content ul {
        padding-left: 1.2rem;
        margin-bottom: 1rem;
      }

      #info-modal-close {
        position: absolute;
        top: 10%;
        right: 10%;
        background: transparent;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Erstellt den schwebenden Info-Button "ℹ️" links oben.
   */
  createButton() {
    const button = document.createElement('button');
    button.id = 'info-button';
    button.innerHTML = 'ℹ️';
    button.title = 'Projektinformationen';
    button.onclick = () => this.toggleModal(true); // Öffnet das Modal
    document.body.appendChild(button);
  }

  /**
   * Erstellt das Modal und füllt es mit Informationen zum Plugin-System.
   * Enthält Strukturübersicht, Plugin-Liste, Vor-/Nachteile.
   */
  createModal() {
    const modal = document.createElement('div');
    modal.id = 'info-modal';
    modal.innerHTML = `
      <div id="info-modal-content">
        <button id="info-modal-close" title="Schließen">&times;</button>
        <h1>📘 Plugin-System Dokumentation</h1>

        <h2>🔧 Struktur</h2>
        <ul>
          <li><strong>config.js</strong>: zentrale Plugin-Konfiguration</li>
          <li><strong>main.js</strong>: lädt Plugins dynamisch zur Laufzeit</li>
          <li><strong>plugin.js</strong>: Basisklasse für Plugins</li>
          <li><strong>plugins/</strong>: Plugin-Verzeichnis</li>
        </ul>

        <h2>🧩 Basic Plugins</h2>
        <ul>
          <li><strong>MatrixRain:</strong> animierter Hintergrundeffekt</li>
          <li><strong>ThemeSwitcher:</strong> setzt Farbthema via data-theme</li>
          <li><strong>DigitalClock:</strong> Echtzeituhr oben rechts</li>
          <li><strong>DateInfo:</strong> aktuelles Datum + Kalenderwoche</li>
          <li><strong>Calendar:</strong> Monatskalender mit Highlight für heute</li>
          <li><strong>TodoList:</strong> Aufgabenverwaltung mit CRUD & LocalStorage</li>
          <li><strong>InfoModal:</strong> dieses Informationsfenster</li>
        </ul>

        <h2>✅ Vorteile</h2>
        <ul>
          <li>📦 Modulares, erweiterbares Plugin-System</li>
          <li>🧠 Cleanes OOP-Design (ES6-Klassen)</li>
          <li>💾 LocalStorage für persistente Daten</li>
          <li>⚡ Leichtgewichtig, kein Build-System nötig</li>
          <li>🎨 Anpassbar via CSS-Variablen und Themes</li>
        </ul>

        <h2>⚠️ Nachteile</h2>
        <ul>
          <li>🧱 Keine asynchrone Plugin-Abhängigkeiten</li>
          <li>🛠️ Kein Plugin-Hot-Reloading (nur bei Vite etc.)</li>
          <li>📁 Nur Dateibasiertes Laden (kein CDN/Federation)</li>
          <li>🔐 Kein Berechtigungssystem oder Nutzerkontext</li>
        </ul>
      </div>
    `;

    // Modal schließen über X-Button
    modal.querySelector('#info-modal-close').onclick = () => this.toggleModal(false);

    // Modal schließen beim Klick außerhalb des Inhalts
    modal.onclick = e => {
      if (e.target === modal) this.toggleModal(false);
    };

    document.body.appendChild(modal);
  }

  /**
   * Zeigt oder versteckt das Modal-Fenster.
   * @param {boolean} show - true = anzeigen, false = ausblenden
   */
  toggleModal(show) {
    const modal = document.getElementById('info-modal');
    modal.style.display = show ? 'flex' : 'none';
  }
}
