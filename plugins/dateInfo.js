// Importiert die gemeinsame Plugin-Basisklasse
import Plugin from '../plugin.js';

/**
 * 📆 DateInfo Plugin
 * 
 * Fügt unterhalb der Digitaluhr (`#digital-clock`) das aktuelle Datum sowie die Kalenderwoche ein.
 * ⚠️ Voraussetzung: Das Plugin `digitalClock.js` muss aktiv sein und ein DOM-Element mit `id="digital-clock"` erzeugen.
 * 
 * Abhängigkeit:
 * - Dieses Plugin sollte **nach `digitalClock` geladen werden**
 * - Verwendet DOM-Query auf `#digital-clock`
 */
export default class DateInfo extends Plugin {
  constructor() {
    super('DateInfo'); // Pluginname registrieren
  }

  /**
   * Initialisiert das Plugin:
   * - Wartet auf Existenz von `#digital-clock` im DOM
   * - Fügt dann die Datumskomponente ein
   */
  init() {
    const waitForClock = setInterval(() => {
      const clock = document.querySelector('#digital-clock');
      if (clock) {
        clearInterval(waitForClock);
        this.injectDateInfo(clock);
      }
    }, 100); // Prüft alle 100ms
  }

  /**
   * Fügt das Datum + Kalenderwoche unterhalb der Uhr ein.
   * @param {HTMLElement} clockElement - Referenz zur Digitaluhr
   */
  injectDateInfo(clockElement) {
    // Neues UI-Element direkt nach der Uhr einfügen
    const dateBox = document.createElement('div');
    dateBox.id = 'date-info';
    clockElement.insertAdjacentElement('afterend', dateBox);

    // Styles definieren
    const style = document.createElement('style');
    style.textContent = `
      #date-info {
        font-family: 'Courier New', monospace;
        font-size: 1rem;
        color: var(--clock-color, #ccc);
        background: rgba(0,0,0,0.4);
        padding: 0.3rem 1rem;
        border-radius: 8px;
        margin-top: 6px;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);

    // Datum aktualisieren
    const update = () => {
      const now = new Date();

      const formatted = now.toLocaleDateString(undefined, {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      const weekNumber = this.getWeekNumber(now);
      dateBox.textContent = `${formatted} — KW ${weekNumber}`;
    };

    update(); // Initialer Aufruf
    setInterval(update, 60_000); // Automatische Aktualisierung jede Minute
  }

  /**
   * Berechnet die ISO-Kalenderwoche für ein gegebenes Datum.
   * (Montag = Wochenstart, KW 1 beginnt mit dem ersten Donnerstag des Jahres)
   * @param {Date} date - Datum, für das die KW bestimmt werden soll
   * @returns {number} Kalenderwoche (1–53)
   */
  getWeekNumber(date) {
    const tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayNum = tempDate.getDay() || 7; // 0 (Sonntag) => 7
    tempDate.setDate(tempDate.getDate() + 4 - dayNum); // zurück auf Donnerstag der Woche

    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    const daysBetween = (tempDate - yearStart) / 86400000;

    return Math.ceil((daysBetween + 1) / 7);
  }
}
