import Plugin from '../plugin.js';
import { config } from '../config.js';

/**
 * 🧩 PluginManager Plugin
 *
 * Dieses Plugin bietet ein übersichtliches Kontrollpanel für das Plugin-System.
 * Es zeigt eine Liste aller Plugins als Toggles (Checkboxen) an.
 * Änderungen werden in localStorage gespeichert und führen zu einem Seitenreload,
 * um das Plugin-System entsprechend neu zu laden.
 */
export default class PluginManager extends Plugin {
  constructor() {
    super('PluginManager');      // Registrierung des Plugin-Namens
    this.key = 'enabled-plugins'; // Speicherort im localStorage
  }

  /**
   * Startpunkt: Lädt Status, rendert UI
   */
  init() {
    this.enabled = this.loadEnabled(); // Lade aktivierte Plugins
    this.renderPanel();                // Zeige Plugin-Panel an
  }

  /**
   * Lädt die aktivierten Plugins aus dem localStorage.
   * Fallback: Alle Plugins aus `config.plugins` aktivieren.
   * @returns {string[]} Liste aktiver Plugin-Namen
   */
  loadEnabled() {
    const saved = localStorage.getItem(this.key);
    return saved ? JSON.parse(saved) : [...config.plugins];
  }

  /**
   * Speichert die aktuelle Plugin-Auswahl in den localStorage.
   */
  saveEnabled() {
    localStorage.setItem(this.key, JSON.stringify(this.enabled));
  }

  /**
   * Erstellt und rendert das Control Panel mit Plugin-Toggles.
   * Fügt auch Styles direkt in das <head> ein.
   */
  renderPanel() {
    const panel = document.createElement('div');
    panel.id = 'plugin-manager';
    panel.innerHTML = `<h3>🧩 Plugins</h3>`;
    document.body.appendChild(panel);

    // Style für das Panel
    const style = document.createElement('style');
    style.textContent = `
      #plugin-manager {
        position: fixed;
        top: 70px;
        left: 20px;
        background: #1e1e1e;
        color: white;
        padding: 1rem;
        border-radius: 12px;
        font-family: sans-serif;
        z-index: 1100;
        width: 220px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      }

      #plugin-manager h3 {
        margin-bottom: 0.5rem;
      }

      .plugin-toggle {
        display: flex;
        justify-content: space-between;
        margin: 0.2rem 0;
        font-size: 0.9rem;
      }

      .plugin-toggle input {
        transform: scale(1.1);
      }
    `;
    document.head.appendChild(style);

    // Für jedes Plugin aus der Konfiguration ein Toggle generieren
    config.plugins.forEach(name => {
      const row = document.createElement('div');
      row.className = 'plugin-toggle';

      const label = document.createElement('label');
      label.textContent = name;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = this.enabled.includes(name); // Aktiv?

      // Reaktion auf Änderung
      checkbox.onchange = () => {
        if (checkbox.checked) {
          this.enabled.push(name); // hinzufügen
        } else {
          this.enabled = this.enabled.filter(p => p !== name); // entfernen
        }
        this.saveEnabled();
        window.location.reload(); // Reload, da Plugin unloading nicht möglich
      };

      row.append(label, checkbox);
      panel.appendChild(row);
    });
  }
}
