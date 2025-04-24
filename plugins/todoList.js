import Plugin from '../plugin.js';

/**
 * 📝 TodoList Plugin
 *
 * Aufgabenliste mit vollständigem Funktionsumfang:
 * - Create, Read, Update, Delete
 * - Filter nach "alle", "offen", "erledigt"
 * - Drag & Drop Sortierung
 * - Fälligkeitsdatum
 * - LocalStorage Speicherung
 */
export default class TodoList extends Plugin {
  constructor() {
    super('TodoList');
    this.todos = [];                             // Hauptdatenarray
    this.storageKey = 'plugin-todo-list';        // Speicher-Schlüssel
    this.filter = 'all';                         // aktiver Filter (all | open | done)
  }

  /**
   * Initialisiert das Plugin
   */
  init() {
    this.load();   // Lade gespeicherte Todos
    this.render(); // UI aufbauen
  }

  /**
   * Lädt ToDos aus dem localStorage
   */
  load() {
    const saved = localStorage.getItem(this.storageKey);
    this.todos = saved ? JSON.parse(saved) : [];
  }

  /**
   * Speichert ToDos in den localStorage
   */
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

    /**
   * Rendert das gesamte UI inkl. Input, Liste, Filter, Style und Drag & Drop
   */
  render() {
    const container = document.createElement('div');
    container.id = 'todo-list';
    document.body.appendChild(container);

      // CSS Style einfügen
    const style = document.createElement('style');
    style.textContent = `
      #todo-list {
        position: fixed;
        right: 20px;
        bottom: 100px;
        width: 300px;
        background: #1e1e1e;
        color: white;
        font-family: sans-serif;
        border-radius: 12px;
        padding: 1rem;
        z-index: 1000;
      }

      #todo-list input[type="text"] {
        width: 100%;
        padding: 0.4rem;
        margin-bottom: 0.5rem;
        border-radius: 6px;
        border: none;
      }

      .todo-item {
        display: flex;
        flex-direction: column;
        background: #2a2a2a;
        margin: 4px 0;
        padding: 0.4rem;
        border-radius: 6px;
        cursor: grab;
      }

      .todo-item.done .todo-text {
        text-decoration: line-through;
        opacity: 0.6;
      }

      .todo-text {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .todo-buttons button {
        background: transparent;
        color: #ccc;
        border: none;
        margin-left: 4px;
        cursor: pointer;
      }

      .todo-buttons button:hover {
        color: white;
      }

      .todo-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        margin-top: 0.3rem;
        opacity: 0.8;
      }

      .todo-filters {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .todo-filters button {
        flex: 1;
        margin: 0 2px;
        background: #333;
        color: #aaa;
        border: none;
        padding: 0.3rem;
        border-radius: 6px;
        cursor: pointer;
      }

      .todo-filters button.active {
        background: #4caf50;
        color: white;
      }

      input[type="date"] {
        background: #1e1e1e;
        border: 1px solid #555;
        color: white;
        border-radius: 4px;
        padding: 0.2rem;
      }
    `;
    document.head.appendChild(style);

    // Titel
    const title = document.createElement('h3');
    title.textContent = '📝 ToDo';

    // Filter (All / Open / Done)
    const filters = document.createElement('div');
    filters.className = 'todo-filters';
    ['all', 'open', 'done'].forEach(type => {
      const btn = document.createElement('button');
      btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      if (type === this.filter) btn.classList.add('active');
      btn.onclick = () => {
        this.filter = type;
        this.renderList();
        [...filters.children].forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
      filters.appendChild(btn);
    });

    // Eingabe-Feld
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Neue Aufgabe...';
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.addTodo(input.value.trim());
        input.value = '';
      }
    });

    // Container für ToDo-Liste
    const list = document.createElement('div');
    list.className = 'todo-items';
    this.listContainer = list;

    container.append(title, filters, input, list);
    this.renderList();

    // Drag & Drop via Sortable.js (muss extern geladen werden)
    new Sortable(list, {
      animation: 150,
      onEnd: evt => {
        const [moved] = this.todos.splice(evt.oldIndex, 1);
        this.todos.splice(evt.newIndex, 0, moved);
        this.save();
      }
    });
  }

    /**
   * Rendert nur die Aufgabenliste (nach Filter gefiltert)
   */
  renderList() {
    this.listContainer.innerHTML = '';
    const visibleTodos = this.todos.filter(todo => {
      if (this.filter === 'open') return !todo.done;
      if (this.filter === 'done') return todo.done;
      return true;
    });

    visibleTodos.forEach((todo, index) => {
      const item = document.createElement('div');
      item.className = 'todo-item' + (todo.done ? ' done' : '');

      // Aufgaben-Text mit Buttons
      const textWrap = document.createElement('div');
      textWrap.className = 'todo-text';

      const span = document.createElement('span');
      span.textContent = todo.text;
      span.ondblclick = () => this.editTodo(span, index);  // Inline-Edit per Doppelklick

      const buttons = document.createElement('div');
      buttons.className = 'todo-buttons';
      buttons.innerHTML = `
        <button title="Toggle">&#10003;</button>
        <button title="Delete">&#10005;</button>
      `;
      buttons.querySelector('button[title="Toggle"]').onclick = () => this.toggleTodo(index);
      buttons.querySelector('button[title="Delete"]').onclick = () => this.deleteTodo(index);

      textWrap.append(span, buttons);

      // Metainformation (Fälligkeitsdatum)
      const meta = document.createElement('div');
      meta.className = 'todo-meta';
      meta.innerHTML = `
        <span>Fällig:</span>
        <input type="date" value="${todo.date || ''}" />
      `;
      meta.querySelector('input').onchange = (e) => {
        this.todos[index].date = e.target.value;
        this.save();
      };

      item.append(textWrap, meta);
      this.listContainer.appendChild(item);
    });
  }

    /**
   * Fügt einen neuen Todo-Eintrag hinzu
   * @param {string} text - Beschreibung der Aufgabe
   */
  addTodo(text) {
    this.todos.push({ text, done: false, date: '' });
    this.save();
    this.renderList();
  }

    /**
   * Öffnet ein Input-Feld zum Editieren einer Aufgabe
   * @param {HTMLElement} span - Das angezeigte Text-Element
   * @param {number} index - Index des ToDos
   */
  editTodo(span, index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.onblur = () => {
      this.todos[index].text = input.value;
      this.save();
      this.renderList();
    };
    input.onkeydown = (e) => {
      if (e.key === 'Enter') input.blur();
    };
    span.replaceWith(input);
    input.focus();
  }

    /**
   * Wechselt den Status einer Aufgabe (erledigt/offen)
   * @param {number} index
   */
  toggleTodo(index) {
    this.todos[index].done = !this.todos[index].done;
    this.save();
    this.renderList();
  }

    /**
   * Löscht eine Aufgabe
   * @param {number} index
   */
  deleteTodo(index) {
    this.todos.splice(index, 1);
    this.save();
    this.renderList();
  }
}
