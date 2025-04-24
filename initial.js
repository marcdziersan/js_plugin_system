// 🔑 Schlüssel im LocalStorage, unter dem aktivierte Plugins gespeichert werden
const PLUGIN_KEY = 'enabled-plugins';

// 📦 Liste aller verfügbaren Plugins (muss mit config.js übereinstimmen)
const ALL_PLUGINS = [
  'matrixRain',
  'themeSwitcher',
  'digitalClock',
  'calendar',
  'dateInfo',
  'todoList',
  'infoModal',
  'pluginManager',
  'ticTacToe',
  'connectFour',
  'minesGame',
  'eventPlanner',
  'chatNotes'
];

// 🟢 First-Run Initialisierung:
// Wenn im LocalStorage noch KEIN Eintrag für "enabled-plugins" vorhanden ist,
// bedeutet das: Erstes Laden → wir setzen einen Default-Zustand.
if (!localStorage.getItem(PLUGIN_KEY)) {
  const defaultState = ['pluginManager']; // Nur PluginManager aktiv
  localStorage.setItem(PLUGIN_KEY, JSON.stringify(defaultState));

  // Optionales Logging für Developer
  console.log('[Init] Plugin-System: First run → Nur PluginManager aktiviert');
}
