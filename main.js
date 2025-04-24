import { config } from './config.js'; // Zentrale Plugin-Definition

// 🔑 Schlüssel zum Speichern & Abrufen aktivierter Plugins im localStorage
const STORAGE_KEY = 'enabled-plugins';

/**
 * 📥 getEnabledPlugins()
 * 
 * Liest die Liste der aktivierten Plugins aus dem localStorage.
 * - Falls kein Eintrag vorhanden: Standardmäßig alle Plugins aktivieren.
 * - Rückgabe: Array von Plugin-Namen (Strings).
 *
 * @returns {string[]} Liste aktivierter Plugins
 */
function getEnabledPlugins() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  // Default (first run ohne initial.js): Alle aktivieren
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config.plugins));
  return [...config.plugins];
}

/**
 * 🔄 loadPlugin(pluginName)
 * 
 * Lädt ein einzelnes Plugin zur Laufzeit:
 * - Importiert das Modul dynamisch per ES Module Import (`import()`)
 * - Instanziiert die Plugin-Klasse
 * - Ruft optional `.init()` auf
 *
 * Fehler werden sauber abgefangen & geloggt.
 *
 * @param {string} pluginName - Dateiname / Plugin-Identifier
 */
async function loadPlugin(pluginName) {
  try {
    const module = await import(`${config.pluginPath}${pluginName}.js`);
    const PluginClass = module.default;
    const pluginInstance = new PluginClass();
    pluginInstance.init?.(); // Falls vorhanden
    console.log(`[PluginSystem] ${pluginName} loaded`);
  } catch (err) {
    console.error(`[PluginSystem] Failed to load ${pluginName}:`, err);
  }
}

// 🎛 Plugins aus LocalStorage lesen & laden
const enabled = getEnabledPlugins();
enabled.forEach(loadPlugin);
