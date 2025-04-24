export const config = {
  /**
   * 📦 Liste aller verfügbaren Plugins
   *
   * Diese Array enthält die **Namen** aller Plugins im System.
   * - Die Namen müssen exakt mit den Dateinamen (ohne `.js`) im Plugin-Ordner übereinstimmen.
   * - Die Reihenfolge kann verwendet werden, um Priorität/Initialreihenfolge festzulegen.
   * - Diese Liste dient auch dem PluginManager zur Anzeige aller Umschalter.
   */
  plugins: [
    'matrixRain',     // 🌧️ Visueller Hintergrundeffekt
    'themeSwitcher',  // 🎨 Setzt das Farb-Theme per data-theme
    'digitalClock',   // 🕒 Echtzeituhr oben rechts
    'calendar',       // 📅 Monatskalender mit Tageshighlight
    'dateInfo',       // 🧾 Datum + Kalenderwoche unter der Uhr
    'todoList',       // ✅ To-Do-Liste mit CRUD & Filter
    'infoModal',      // ℹ️ Doku-Fenster mit Strukturübersicht
    'pluginManager',  // 🧩 Plugin-Umschalter (Zentrale)
    'ticTacToe',      // ❌⭕ Zweispieler-Spiel im 3x3 Feld
    'connectFour',    // 🔴🟡 Vier Gewinnt
    'minesGame',      // 💣 Minesweeper-Klon
    'eventPlanner',   // 📆 Mini-Kalender mit Einträgen
    'chatNotes'       // 💬 Notizzettel / Copy-Paste-Puffer
  ],

  /**
   * 📁 Pfad zum Plugin-Ordner
   *
   * Gibt den Basispfad an, unter dem alle Plugin-Dateien gefunden werden.
   * Wird in `main.js` verwendet, um Skripte zur Laufzeit dynamisch zu importieren.
   * Muss auf das Verzeichnis mit den Plugin-Dateien verweisen.
   *
   * Beispiel:
   * → './plugins/' + 'todoList' + '.js' = './plugins/todoList.js'
   */
  pluginPath: './plugins/',
};
