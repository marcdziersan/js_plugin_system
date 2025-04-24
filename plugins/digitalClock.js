// Importiert die gemeinsame Plugin-Basisklasse
import Plugin from '../plugin.js';

/**
 * 🕒 DigitalClock Plugin
 * 
 * Dieses Plugin zeigt eine digitale Uhr in der oberen rechten Ecke des Viewports an.
 * Die Uhr aktualisiert sich jede Sekunde und verwendet ein klassisches "Courier"-Monospace-Design.
 * 
 * Andere Plugins (wie DateInfo) können dieses UI-Element nutzen oder erweitern.
 */
export default class DigitalClock extends Plugin {
  constructor() {
    super('DigitalClock'); // Pluginname für Identifikation im System
  }

  /**
   * Initialisiert das Plugin:
   * - Erstellt das Clock-DOM-Element
   * - Fügt Styling hinzu
   * - Startet den Sekunden-Update-Loop
   */
  init() {
    // 🧱 1. Clock-Element im DOM erzeugen
    const clock = document.createElement('div');
    clock.id = 'digital-clock';
    document.body.appendChild(clock);

    // 🎨 2. Style per <style>-Tag ins <head> einfügen
    const style = document.createElement('style');
    style.textContent = `
      #digital-clock {
        position: fixed;
        top: 20px;
        right: 20px;
        font-family: 'Courier New', monospace;
        font-size: 2rem;
        color: var(--clock-color, #ffffff);
        background: rgba(0,0,0,0.5);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        z-index: 1000;
      }
    `;
    document.head.appendChild(style);

    // 🕒 3. Funktion zum Aktualisieren der Uhrzeit
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      clock.textContent = `${h}:${m}:${s}`;
    };

    // ▶️ 4. Erste Anzeige + Intervall starten
    updateTime(); // Initialer Aufruf
    setInterval(updateTime, 1000); // Alle 1000ms = 1s
  }
}
