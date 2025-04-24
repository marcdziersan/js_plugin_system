// Importiert die gemeinsame Plugin-Basisklasse
import Plugin from '../plugin.js';

/**
 * Das Calendar-Plugin zeigt einen Monatskalender als UI-Komponente an.
 * Es hebt den heutigen Tag hervor und wird im unteren linken Bereich angezeigt.
 */
export default class Calendar extends Plugin {
  constructor() {
    super('Calendar'); // Ruft die Plugin-Basisklasse mit Pluginname auf
    this.today = new Date(); // Speichert das heutige Datum
  }

  /**
   * Entry-Point des Plugins – wird von main.js automatisch aufgerufen.
   * Erstellt Container, lädt Styles und rendert die Ansicht.
   */
  init() {
    // Hauptcontainer im DOM erstellen
    this.container = document.createElement('div');
    this.container.id = 'calendar';
    document.body.appendChild(this.container);

    this.injectStyles();  // Styles einfügen
    this.renderView();    // Ansicht rendern
  }

  /**
   * Fügt CSS-Styles direkt ins Dokument ein.
   * Kümmert sich um Layout, Farben und Responsive-Grids.
   */
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #calendar {
        position: fixed;
        bottom: 20px;
        left: 20px;
        font-family: sans-serif;
        background: #1e1e1e;
        color: #fff;
        border-radius: 12px;
        padding: 1rem;
        max-width: 320px;
        z-index: 1000;
      }

      #calendar h2 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }

      .calendar-cell {
        text-align: center;
        padding: 0.4rem 0;
        background: #2a2a2a;
        border-radius: 4px;
        font-size: 0.85rem;
      }

      .today {
        background: #4caf50 !important;
        font-weight: bold;
        color: #fff;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Rendert den Titel (aktueller Monat + Jahr) und das Monatsraster.
   */
  renderView() {
    // Monatsüberschrift
    const title = document.createElement('h2');
    title.textContent = this.getTitle();
    this.container.appendChild(title);

    // Grid-Container für die Kalendertage
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Monatsansicht rendern
    this.renderMonth(grid);

    this.container.appendChild(grid);
  }

  /**
   * Gibt den formatierten Monatstitel zurück, z. B. "April 2025".
   * @returns {string}
   */
  getTitle() {
    const options = { month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('default', options).format(this.today);
  }

  /**
   * Generiert die Zellen für den Monat, inklusive leerer Starttage.
   * @param {HTMLElement} grid - Der Grid-Container
   */
  renderMonth(grid) {
    const date = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    const startDay = date.getDay(); // 0 (Sonntag) - 6 (Samstag)
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Leere Felder für den Monatsanfang (Offset)
    for (let i = 0; i < startDay; i++) {
      const blank = document.createElement('div');
      blank.className = 'calendar-cell';
      grid.appendChild(blank);
    }

    // Tageszellen 1...n
    for (let d = 1; d <= daysInMonth; d++) {
      const current = new Date(date.getFullYear(), date.getMonth(), d);
      const cell = this.createCell(current);
      grid.appendChild(cell);
    }
  }

  /**
   * Erstellt eine einzelne Kalendertag-Zelle.
   * Hebt den heutigen Tag visuell hervor.
   * @param {Date} date
   * @returns {HTMLElement}
   */
  createCell(date) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.textContent = date.getDate();

    const isToday =
      date.getFullYear() === this.today.getFullYear() &&
      date.getMonth() === this.today.getMonth() &&
      date.getDate() === this.today.getDate();

    if (isToday) cell.classList.add('today');

    return cell;
  }
}
