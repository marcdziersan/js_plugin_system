import Plugin from '../plugin.js';

/**
 * ❌⭕ TicTacToe Plugin
 *
 * Dieses Plugin implementiert ein vollständiges Tic-Tac-Toe-Spiel im Browser.
 * Zwei Spieler (X und O) wechseln sich ab. Das Spiel endet mit einem Sieg oder Unentschieden.
 * Basiert auf einfachem DOM-Rendering und Zustandsspeicherung im Speicher.
 */
export default class TicTacToe extends Plugin {
  constructor() {
    super('TicTacToe');          // Registrierung mit Name
    this.board = Array(9).fill(null);  // 3x3 Feld (Index 0–8)
    this.currentPlayer = 'X';   // Aktueller Spieler
    this.gameOver = false;      // Spielstatus
  }

  /**
   * Initialisiert das Spiel:
   * - Fügt CSS-Stile ein
   * - Rendert das Spielfeld
   */
  init() {
    this.createStyles();
    this.render();
  }

  /**
   * Erstellt und injiziert CSS-Styles für das Spielbrett.
   */
  createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #tic-tac-toe {
        position: fixed;
        bottom: 20px;
        right: 340px;
        width: 200px;
        background: #1e1e1e;
        color: white;
        padding: 1rem;
        border-radius: 12px;
        font-family: sans-serif;
        z-index: 1000;
        text-align: center;
      }

      .ttt-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        margin: 0.5rem 0;
      }

      .ttt-cell {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        border: none;
        background: #2a2a2a;
        color: white;
        border-radius: 6px;
        cursor: pointer;
      }

      .ttt-cell.winner {
        background: #4caf50;
        font-weight: bold;
      }

      .ttt-info {
        margin-bottom: 0.5rem;
      }

      .ttt-reset {
        background: #333;
        border: none;
        color: #ccc;
        border-radius: 6px;
        padding: 0.4rem 1rem;
        cursor: pointer;
      }

      .ttt-reset:hover {
        color: white;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Baut das UI: Infoanzeige, Grid-Zellen und Reset-Button.
   */
  render() {
    const container = document.createElement('div');
    container.id = 'tic-tac-toe';

    // Info-Anzeige (Spieler / Status)
    this.info = document.createElement('div');
    this.info.className = 'ttt-info';
    this.updateInfo();

    // Spielfeld-Grid
    const grid = document.createElement('div');
    grid.className = 'ttt-grid';

    this.cells = [];

    // 9 Zellen erstellen
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement('button');
      btn.className = 'ttt-cell';
      btn.onclick = () => this.handleMove(i);
      this.cells.push(btn);
      grid.appendChild(btn);
    }

    // Reset-Button
    const reset = document.createElement('button');
    reset.className = 'ttt-reset';
    reset.textContent = 'Reset';
    reset.onclick = () => this.resetGame();

    container.append(this.info, grid, reset);
    document.body.appendChild(container);
  }

  /**
   * Aktualisiert den Status-Text.
   * @param {string=} text - Optionaler Text, sonst automatisch generiert
   */
  updateInfo(text) {
    this.info.textContent = text || (
      this.gameOver
        ? 'Spiel beendet'
        : `Spieler: ${this.currentPlayer}`
    );
  }

  /**
   * Verarbeitet einen Spielzug.
   * @param {number} index - Index (0–8) des Felds
   */
  handleMove(index) {
    if (this.gameOver || this.board[index]) return; // Blockiere ungültige Züge

    // Zeichen setzen
    this.board[index] = this.currentPlayer;
    this.cells[index].textContent = this.currentPlayer;

    // Gewinn prüfen
    const winner = this.checkWinner();
    if (winner) {
      this.gameOver = true;
      // Gewinner-Zellen hervorheben
      winner.indices.forEach(i => this.cells[i].classList.add('winner'));
      this.updateInfo(`Gewonnen: ${winner.player}`);
    } else if (!this.board.includes(null)) {
      // Keine freien Felder → Unentschieden
      this.gameOver = true;
      this.updateInfo('Unentschieden');
    } else {
      // Spieler wechseln
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      this.updateInfo();
    }
  }

  /**
   * Prüft, ob es einen Gewinner gibt.
   * @returns {{player: string, indices: number[]}|null}
   */
  checkWinner() {
    const wins = [
      [0,1,2], [3,4,5], [6,7,8], // Reihen
      [0,3,6], [1,4,7], [2,5,8], // Spalten
      [0,4,8], [2,4,6]           // Diagonalen
    ];

    for (const [a,b,c] of wins) {
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return { player: this.board[a], indices: [a, b, c] };
      }
    }

    return null;
  }

  /**
   * Setzt das Spiel zurück auf den Anfangszustand.
   */
  resetGame() {
    this.board = Array(9).fill(null);
    this.gameOver = false;
    this.currentPlayer = 'X';

    this.cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('winner');
    });

    this.updateInfo();
  }
}
