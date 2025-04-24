import Plugin from '../plugin.js';

/**
 * 📅 EventPlanner Plugin
 *
 * Bietet eine einfache Kalenderansicht mit Tagesfiltern,
 * Event-Formular, Reminder-Funktion, Tagging und Export (JSON + iCal).
 */
export default class EventPlanner extends Plugin {
  constructor() {
    super('EventPlanner');
    this.storageKey = 'event-planner-data'; // Lokaler Storage Key
    this.events = []; // Array gespeicherter Events
    this.selectedDate = null; // Aktuell ausgewählter Tag für Filter
  }

  /**
   * Initialisiert das Plugin: Daten laden, Styles einfügen, UI bauen, Reminder prüfen
   */
  init() {
    this.load();
    this.injectStyles();
    this.render();
    this.checkTodayReminders();
  }

  /**
   * Lädt gespeicherte Events aus dem LocalStorage
   */
  load() {
    const saved = localStorage.getItem(this.storageKey);
    this.events = saved ? JSON.parse(saved) : [];
  }

  /**
   * Speichert aktuelle Events in den LocalStorage
   */
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.events));
  }

  /**
   * Fügt CSS für Layout und Style in den <head> ein
   */
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #event-planner {
        position: fixed;
        right: 20px;
        top: 350px;
        width: 320px;
        background: #1e1e1e;
        color: white;
        padding: 1rem;
        border-radius: 12px;
        font-family: sans-serif;
        z-index: 1000;
      }

      #event-planner h3 {
        margin-bottom: 0.5rem;
      }

      .event-form input, .event-form textarea, .event-form select {
        width: 100%;
        margin-bottom: 0.5rem;
        padding: 0.4rem;
        border: none;
        border-radius: 6px;
        background: #333;
        color: white;
      }

      .event-form button {
        width: 100%;
        padding: 0.4rem;
        border: none;
        border-radius: 6px;
        background: #4caf50;
        color: white;
        cursor: pointer;
        margin-bottom: 1rem;
      }

      .event-item {
        background: #2a2a2a;
        padding: 0.5rem;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }

      .event-item small {
        display: block;
        opacity: 0.7;
      }

      .event-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 0.3rem;
      }

      .event-actions button {
        background: transparent;
        border: none;
        color: #ccc;
        cursor: pointer;
        font-size: 0.8rem;
      }

      .event-actions button:hover {
        color: white;
      }

      .calendar-view {
        display: flex;
        gap: 4px;
        overflow-x: auto;
        margin-bottom: 0.5rem;
      }

      .calendar-day {
        background: #333;
        border-radius: 6px;
        padding: 0.4rem;
        text-align: center;
        cursor: pointer;
        min-width: 40px;
        flex-shrink: 0;
      }

      .calendar-day.active {
        background: #4caf50;
        font-weight: bold;
      }

      .event-export {
        display: flex;
        gap: 6px;
        justify-content: space-between;
        margin-top: 0.5rem;
      }

      .event-export button {
        flex: 1;
        background: #555;
        border: none;
        padding: 0.3rem;
        border-radius: 6px;
        cursor: pointer;
        color: white;
        font-size: 0.8rem;
      }

      .event-tags {
        font-size: 0.75rem;
        color: #9cf;
        margin-top: 0.3rem;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Haupt-UI aufbauen: Titel, Formular, Kalender, Liste, Export-Buttons
   */
  render() {
    const container = document.createElement('div');
    container.id = 'event-planner';

    const title = document.createElement('h3');
    title.textContent = '📅 Event Planner';

    const form = document.createElement('div');
    form.className = 'event-form';

    const dateInput = document.createElement('input');
    dateInput.type = 'date';

    const textInput = document.createElement('textarea');
    textInput.rows = 2;
    textInput.placeholder = 'Beschreibung...';

    const tagInput = document.createElement('input');
    tagInput.type = 'text';
    tagInput.placeholder = 'Tags (z.B. work, private)';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Hinzufügen';
    addBtn.onclick = () => {
      if (!dateInput.value.trim() || !textInput.value.trim()) return;
      this.events.push({
        id: Date.now(),
        date: dateInput.value,
        text: textInput.value.trim(),
        tags: tagInput.value.trim().split(',').map(t => t.trim()).filter(t => t)
      });
      this.save();
      this.renderCalendar(calendar);
      this.renderList(list);
      dateInput.value = '';
      textInput.value = '';
      tagInput.value = '';
    };

    form.append(dateInput, textInput, tagInput, addBtn);

    const calendar = document.createElement('div');
    calendar.className = 'calendar-view';

    const list = document.createElement('div');

    const exportRow = document.createElement('div');
    exportRow.className = 'event-export';

    const exportJSON = document.createElement('button');
    exportJSON.textContent = '⬇️ JSON';
    exportJSON.onclick = () => this.exportJSON();

    const exportICS = document.createElement('button');
    exportICS.textContent = '⬇️ iCal';
    exportICS.onclick = () => this.exportICS();

    exportRow.append(exportJSON, exportICS);

    this.renderCalendar(calendar);
    this.renderList(list);

    container.append(title, form, calendar, list, exportRow);
    document.body.appendChild(container);
  }

  /**
   * Baut die Mini-Kalenderansicht auf (nur aktive Tage)
   */
  renderCalendar(container) {
    container.innerHTML = '';
    const days = [...new Set(this.events.map(e => e.date))].sort();

    days.forEach(date => {
      const btn = document.createElement('div');
      btn.className = 'calendar-day';
      btn.textContent = new Date(date).getDate();
      if (this.selectedDate === date) btn.classList.add('active');
      btn.onclick = () => {
        this.selectedDate = this.selectedDate === date ? null : date;
        this.renderCalendar(container);
        this.renderList(document.querySelector('#event-planner .event-form + .calendar-view + div'));
      };
      container.appendChild(btn);
    });
  }

  /**
   * Rendert die Event-Liste gefiltert nach Datum (optional)
   */
  renderList(container) {
    container.innerHTML = '';

    const filtered = this.selectedDate
      ? this.events.filter(e => e.date === this.selectedDate)
      : [...this.events];

    const sorted = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(event => {
      const item = document.createElement('div');
      item.className = 'event-item';

      const date = new Date(event.date).toLocaleDateString();
      item.innerHTML = `
        <strong>${event.text}</strong>
        <small>${date}</small>
        ${event.tags?.length ? `<div class="event-tags">#${event.tags.join(' #')}</div>` : ''}
      `;

      const actions = document.createElement('div');
      actions.className = 'event-actions';

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.onclick = () => this.editEvent(event.id);

      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.onclick = () => {
        this.events = this.events.filter(e => e.id !== event.id);
        this.save();
        this.renderCalendar(document.querySelector('.calendar-view'));
        this.renderList(container);
      };

      actions.append(editBtn, delBtn);
      item.appendChild(actions);

      container.appendChild(item);
    });
  }

  /**
   * Öffnet ein Prompt zur Bearbeitung eines Events
   * @param {number} id - Event-ID
   */
  editEvent(id) {
    const event = this.events.find(e => e.id === id);
    const newText = prompt('Neue Beschreibung:', event.text);
    if (newText !== null) {
      event.text = newText.trim();
      this.save();
      this.renderList(document.querySelector('#event-planner .event-form + .calendar-view + div'));
    }
  }

  /**
   * Prüft, ob heute ein Event fällig ist – zeigt ggf. Benachrichtigung an
   */
  checkTodayReminders() {
    const today = new Date().toISOString().split('T')[0];
    const todaysEvents = this.events.filter(e => e.date === today);
    if (todaysEvents.length > 0) {
      setTimeout(() => {
        alert(`🔔 Heute fällig:\n\n${todaysEvents.map(e => `• ${e.text}`).join('\n')}`);
      }, 1000);
    }
  }

  /**
   * Exportiert Events als JSON-Datei
   */
  exportJSON() {
    const blob = new Blob([JSON.stringify(this.events, null, 2)], { type: 'application/json' });
    this.downloadBlob(blob, 'events.json');
  }

  /**
   * Exportiert Events als iCalendar-Datei (.ics)
   */
  exportICS() {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventPlanner//EN'
    ];

    this.events.forEach(e => {
      const dt = e.date.replace(/-/g, '');
      lines.push(
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${dt}`,
        `SUMMARY:${e.text}`,
        `DESCRIPTION:${e.tags?.join(', ') || ''}`,
        `UID:${e.id}@eventplanner.local`,
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\n')], { type: 'text/calendar' });
    this.downloadBlob(blob, 'events.ics');
  }

  /**
   * Hilfsfunktion zum Herunterladen von Dateien
   * @param {Blob} blob - Dateiinhalt
   * @param {string} filename - Zielname
   */
  downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
}
