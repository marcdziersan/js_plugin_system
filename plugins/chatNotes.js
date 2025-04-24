// Importiert die Basisklasse für Plugins
import Plugin from '../plugin.js';

/**
 * 💬 ChatNotes Plugin
 * 
 * Dient als persönliches Notiz-"Chatfenster".
 * Unterstützt das Hinzufügen, Bearbeiten, Löschen und Kopieren von Notizen.
 * Speichert Daten lokal im Browser mit LocalStorage.
 */
export default class ChatNotes extends Plugin {
  constructor() {
    super('ChatNotes'); // Initialisiert den Plugin mit Namen
    this.storageKey = 'chat-notes'; // Key für LocalStorage
    this.notes = []; // Liste der Notizen
  }

  /**
   * Initialisiert das Plugin:
   * - Lädt gespeicherte Daten
   * - Integriert Styles
   * - Rendert die UI
   */
  init() {
    this.load();
    this.injectStyles();
    this.render();
  }

  /**
   * Lädt Notizen aus LocalStorage.
   */
  load() {
    const saved = localStorage.getItem(this.storageKey);
    this.notes = saved ? JSON.parse(saved) : [];
  }

  /**
   * Speichert aktuelle Notizen in LocalStorage.
   */
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
  }

  /**
   * Fügt CSS-Styles für das Plugin ins Dokument ein.
   * Umfasst Layout, Farben, Schrift und Responsiveness.
   */
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #chat-notes {
        position: fixed;
        bottom: 20px;
        right: 660px;
        width: 280px;
        background: #1e1e1e;
        color: white;
        font-family: monospace;
        border-radius: 12px;
        padding: 1rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        max-height: 60vh;
      }

      #chat-notes h3 {
        margin-bottom: 0.5rem;
      }

      .note-entry {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column-reverse;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .note {
        background: #2a2a2a;
        padding: 0.5rem;
        border-radius: 6px;
        font-size: 0.85rem;
        cursor: pointer;
        position: relative;
      }

      .note:hover {
        background: #333;
      }

      .note small {
        display: block;
        font-size: 0.7rem;
        opacity: 0.6;
        margin-top: 0.3rem;
      }

      .note-actions {
        position: absolute;
        top: 4px;
        right: 6px;
        display: flex;
        gap: 4px;
      }

      .note-actions button {
        background: none;
        border: none;
        color: #888;
        font-size: 0.8rem;
        cursor: pointer;
      }

      .note-actions button:hover {
        color: white;
      }

      .note-form {
        display: flex;
        gap: 4px;
      }

      .note-form input {
        flex: 1;
        padding: 0.4rem;
        border-radius: 6px;
        border: none;
        background: #333;
        color: white;
      }

      .note-form button {
        padding: 0.4rem;
        background: #4caf50;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        color: white;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Baut das DOM-Layout für das Plugin auf.
   * Enthält: Titel, Eingabefeld, Liste, Add-Button.
   */
  render() {
    const container = document.createElement('div');
    container.id = 'chat-notes';

    // Titel
    const title = document.createElement('h3');
    title.textContent = '💬 Chat Notes';

    // Liste
    const list = document.createElement('div');
    list.className = 'note-entry';
    this.listEl = list;

    // Eingabeformular
    const form = document.createElement('div');
    form.className = 'note-form';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Gedanke, Idee, Copy...';

    const addBtn = document.createElement('button');
    addBtn.textContent = '+';
    addBtn.onclick = () => {
      if (!input.value.trim()) return;
      this.notes.unshift({
        id: Date.now(),
        text: input.value.trim(),
        time: new Date().toISOString()
      });
      this.save();
      this.renderNotes();
      input.value = '';
    };

    form.append(input, addBtn);
    container.append(title, list, form);
    document.body.appendChild(container);

    this.renderNotes(); // initiale Notes anzeigen
  }

  /**
   * Rendert alle Notizen aus `this.notes` in die Liste.
   * Enthält Aktionen: Kopieren, Bearbeiten, Löschen.
   */
  renderNotes() {
    this.listEl.innerHTML = '';

    this.notes.forEach(note => {
      const el = document.createElement('div');
      el.className = 'note';
      el.textContent = note.text;

      const timestamp = new Date(note.time).toLocaleTimeString();
      const timeEl = document.createElement('small');
      timeEl.textContent = timestamp;

      const actions = document.createElement('div');
      actions.className = 'note-actions';

      // 📋 Kopieren
      const copyBtn = document.createElement('button');
      copyBtn.textContent = '📋';
      copyBtn.title = 'Kopieren';
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(note.text);
      };

      // ✏️ Bearbeiten
      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.title = 'Bearbeiten';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        const newText = prompt('Editiere Notiz:', note.text);
        if (newText !== null) {
          note.text = newText.trim();
          this.save();
          this.renderNotes();
        }
      };

      // 🗑️ Löschen
      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.title = 'Löschen';
      delBtn.onclick = (e) => {
        e.stopPropagation();
        this.notes = this.notes.filter(n => n.id !== note.id);
        this.save();
        this.renderNotes();
      };

      actions.append(copyBtn, editBtn, delBtn);
      el.append(timeEl, actions);
      this.listEl.appendChild(el);
    });
  }
}
