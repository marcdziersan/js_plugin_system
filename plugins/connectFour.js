// Importiert die gemeinsame Plugin-Basisklasse
import Plugin from '../plugin.js';

/**
 * 🎮 ConnectFour Plugin
 * 
 * Bietet ein vollständiges 4-Gewinnt-Spiel mit 7x6 Feldern.
 * Zwei Spieler (Rot und Gelb) treten gegeneinander an.
 * Das Spiel prüft auf Gewinnbedingungen und unterstützt Neustarts.
 */
export default class ConnectFour extends Plugin {
  constructor() {
    super('ConnectFour');
    this.rows = 6; // Anzahl Reihen
    this.cols = 7; // Anzahl Spalten
    this.board = []; // Spielfeld-Matrix
    this.currentPlayer = 'R'; // Aktueller Spieler: 'R' = Rot, 'Y' = Gelb
    this.gameOver = false;
  }

  /**
   * Initialisiert das Plugin:
   * - Styles einfügen
   * - Spielfeld zurücksetzen
   * - UI rendern
   */
  init() {
    this.createStyles();
    this.resetBoard();
    this.render();
  }

  /**
   * Fügt das CSS für das Connect Four Spiel hinzu.
   */
  createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #connect-four {
        position: fixed;
        bottom: 20px;
        left: 260px;
        background: #1e1e1e;
        color: white;
        padding: 1rem;
        border-radius: 12px;
        font-family: sans-serif;
        z-index: 1000;
        width: max-content;
        text-align: center;
      }

      .cf-grid {
        display: grid;
        grid-template-columns: repeat(7, 40px);
        grid-gap: 6px;
        margin: 1rem 0;
      }

      .cf-cell {
        width: 40px;
        height: 40px;
        background: #333;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .cf-cell.R { background: red; }
      .cf-cell.Y { background: gold; }

      .cf-cell.winner {
        box-shadow: 0 0 8px 3px #4caf50;
      }

      .cf-info {
        margin-bottom: 0.5rem;
      }

      .cf-reset {
        background: #333;
        border: none;
        color: #ccc;
        border-radius: 6px;
        padding: 0.4rem 1rem;
        cursor: pointer;
      }

      .cf-reset:hover {
        color: white;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Leert das Spielfeld und setzt den Zustand zurück.
   */
  resetBoard() {
    this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
    this.currentPlayer = 'R';
    this.gameOver = false;
  }

  /**
   * Rendert das gesamte Spielfeld (UI).
   */
  render() {
    const container = document.createElement('div');
    container.id = 'connect-four';

    // Anzeige des aktuellen Spielers / Status
    this.info = document.createElement('div');
    this.info.className = 'cf-info';
    this.updateInfo();

    // Grid für die Spielfelder
    this.grid = document.createElement('div');
    this.grid.className = 'cf-grid';

    // Initiale Zellen erstellen
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'cf-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.onclick = () => this.handleMove(c);
        this.grid.appendChild(cell);
      }
    }

    // Reset-Button
    const reset = document.createElement('button');
    reset.className = 'cf-reset';
    reset.textContent = 'Reset';
    reset.onclick = () => {
      this.resetBoard();
      this.updateGrid();
      this.updateInfo();
    };

    container.append(this.info, this.grid, reset);
    document.body.appendChild(container);
    this.updateGrid(); // Erstbefüllung
  }

  /**
   * Aktualisiert die Statusanzeige über dem Grid.
   * @param {string=} text Optionaler Text, sonst Spielstatus.
   */
  updateInfo(text) {
    this.info.textContent = text || (
      this.gameOver
        ? 'Spiel beendet'
        : `Spieler: ${this.currentPlayer === 'R' ? '🔴 Rot' : '🟡 Gelb'}`
    );
  }

  /**
   * Behandelt einen Spielzug in einer Spalte.
   * @param {number} col Index der Spalte
   */
  handleMove(col) {
    if (this.gameOver) return;

    // Suche von unten nach oben die erste freie Zeile
    for (let row = this.rows - 1; row >= 0; row--) {
      if (!this.board[row][col]) {
        this.board[row][col] = this.currentPlayer;
        this.updateGrid();

        const win = this.checkWin(row, col);
        if (win) {
          this.gameOver = true;
          win.forEach(([r, c]) => {
            const idx = r * this.cols + c;
            this.grid.children[idx].classList.add('winner');
          });
          this.updateInfo(`Gewonnen: ${this.currentPlayer === 'R' ? '🔴 Rot' : '🟡 Gelb'}`);
        } else if (this.board.flat().every(cell => cell)) {
          this.gameOver = true;
          this.updateInfo('Unentschieden');
        } else {
          this.currentPlayer = this.currentPlayer === 'R' ? 'Y' : 'R';
          this.updateInfo();
        }

        break; // Zug abgeschlossen
      }
    }
  }

  /**
   * Aktualisiert die DOM-Zellen gemäß Spielfeld-Daten.
   */
  updateGrid() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const idx = r * this.cols + c;
        const cell = this.grid.children[idx];
        cell.className = 'cf-cell';
        if (this.board[r][c]) {
          cell.classList.add(this.board[r][c]); // 'R' oder 'Y'
        }
      }
    }
  }

  /**
   * Prüft, ob der aktuelle Zug zu einem Gewinn führt.
   * @param {number} row Zeile des letzten Zugs
   * @param {number} col Spalte des letzten Zugs
   * @returns {Array<[number, number]>|null} Liste gewinnender Koordinaten oder null
   */
  checkWin(row, col) {
    const player = this.board[row][col];
    const directions = [
      [[0, -1], [0, 1]],       // horizontal
      [[-1, 0], [1, 0]],       // vertikal
      [[-1, -1], [1, 1]],      // diagonal /
      [[-1, 1], [1, -1]]       // diagonal \
    ];

    for (let dir of directions) {
      let line = [[row, col]];

      for (let [dr, dc] of dir) {
        let r = row + dr, c = col + dc;
        while (
          r >= 0 && r < this.rows &&
          c >= 0 && c < this.cols &&
          this.board[r][c] === player
        ) {
          line.push([r, c]);
          r += dr;
          c += dc;
        }
      }

      if (line.length >= 4) return line;
    }

    return null;
  }
}
