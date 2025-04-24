import Plugin from '../plugin.js';

/**
 * 💣 MinesGame Plugin
 * 
 * Implementiert ein klassisches Minesweeper-Game:
 * - 8x8 Raster mit 10 zufällig verteilten Minen
 * - Zellen können aufgedeckt werden
 * - Zahlen zeigen Anzahl benachbarter Minen
 * - "Neustart"-Button zum Zurücksetzen
 */
export default class MinesGame extends Plugin {
  constructor() {
    super('MinesGame');
    this.rows = 8;
    this.cols = 8;
    this.mines = 10;
    this.board = [];       // Spielfeld mit Zahlen / Minen
    this.revealed = [];    // Welche Felder wurden schon aufgedeckt
    this.gameOver = false; // Statusflag
  }

  /**
   * Initialisiert das Spiel:
   * - Fügt Styles ein
   * - Erzeugt Spielfeld
   * - Rendert UI
   */
  init() {
    this.injectStyles();
    this.createGame();
    this.render();
  }

  /**
   * Fügt CSS-Styling für Spielfeld, Buttons und Layout ein.
   */
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #mines-game {
        position: fixed;
        left: 500px;
        bottom: 20px;
        background: #1e1e1e;
        color: white;
        padding: 1rem;
        border-radius: 12px;
        font-family: monospace;
        z-index: 1000;
        width: max-content;
        text-align: center;
      }

      .mines-grid {
        display: grid;
        grid-template-columns: repeat(8, 30px);
        gap: 4px;
        margin-top: 0.5rem;
      }

      .mines-cell {
        width: 30px;
        height: 30px;
        background: #333;
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 0.9rem;
        cursor: pointer;
      }

      .mines-cell.revealed {
        background: #555;
        cursor: default;
      }

      .mines-cell.mine {
        background: #e53935;
      }

      .mines-reset {
        margin-top: 0.5rem;
        background: #333;
        color: white;
        border: none;
        padding: 0.4rem 1rem;
        border-radius: 6px;
        cursor: pointer;
      }

      .mines-reset:hover {
        background: #4caf50;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Erzeugt das Spielbrett:
   * - Initialisiert Board und Revealed-Status
   * - Verteilt 10 Minen zufällig
   * - Erhöht Nachbarfelder entsprechend
   */
  createGame() {
    this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    this.revealed = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
    this.gameOver = false;

    let placed = 0;
    while (placed < this.mines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (this.board[r][c] !== 'M') {
        this.board[r][c] = 'M';
        placed++;

        // Nachbarn erhöhen
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (
              nr >= 0 && nr < this.rows &&
              nc >= 0 && nc < this.cols &&
              this.board[nr][nc] !== 'M'
            ) {
              this.board[nr][nc]++;
            }
          }
        }
      }
    }
  }

  /**
   * Rendert das UI mit Raster, Zellen und "Neustart"-Button.
   */
  render() {
    const container = document.createElement('div');
    container.id = 'mines-game';

    const title = document.createElement('h3');
    title.textContent = '💣 Mines';

    this.grid = document.createElement('div');
    this.grid.className = 'mines-grid';

    this.cells = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const btn = document.createElement('button');
        btn.className = 'mines-cell';
        btn.onclick = () => this.reveal(r, c);
        this.grid.appendChild(btn);
        this.cells.push({ btn, r, c });
      }
    }

    const reset = document.createElement('button');
    reset.className = 'mines-reset';
    reset.textContent = 'Neustart';
    reset.onclick = () => {
      this.createGame();
      this.updateUI();
    };

    container.append(title, this.grid, reset);
    document.body.appendChild(container);

    this.updateUI(); // Erste Anzeige
  }

  /**
   * Aktualisiert alle Zellen auf Basis des Spielstatus.
   */
  updateUI() {
    for (const { btn, r, c } of this.cells) {
      const val = this.board[r][c];
      const isRevealed = this.revealed[r][c];

      btn.className = 'mines-cell';
      if (isRevealed) {
        btn.classList.add('revealed');
        if (val === 'M') {
          btn.classList.add('mine');
          btn.textContent = '💥';
        } else if (val > 0) {
          btn.textContent = val;
        } else {
          btn.textContent = '';
        }
      } else {
        btn.textContent = '';
      }
    }
  }

  /**
   * Deckt das Feld [r, c] auf.
   * - Stoppt bei Game Over oder bereits sichtbarer Zelle
   * - Bei Mine: Spiel verloren
   * - Bei 0: Rekursive Aufdeckung von Nachbarfeldern
   */
  reveal(r, c) {
    if (this.gameOver || this.revealed[r][c]) return;

    this.revealed[r][c] = true;

    if (this.board[r][c] === 'M') {
      this.gameOver = true;
      this.revealAll();
      alert('💥 Boom! Spiel verloren.');
      return;
    }

    // Wenn Feld leer ist → Nachbarn aufdecken
    if (this.board[r][c] === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            this.reveal(nr, nc);
          }
        }
      }
    }

    this.updateUI();
  }

  /**
   * Deckt alle Felder auf (z. B. bei Spielende)
   */
  revealAll() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.revealed[r][c] = true;
      }
    }
    this.updateUI();
  }
}
