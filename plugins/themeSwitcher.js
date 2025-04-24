import Plugin from '../plugin.js';

/**
 * 🎨 ThemeSwitcher Plugin
 * 
 * Dieses Plugin setzt ein globales Farb-Theme, indem es das `data-theme`-Attribut
 * am `<html>`-Element (document.documentElement) auf `'green'` setzt.
 * 
 * 📌 Abhängigkeiten:
 * - Plugins wie `MatrixRain` lesen die CSS-Variable `--matrix-color`
 *   abhängig von `data-theme`, z. B.:
 *     [data-theme="green"] { --matrix-color: #00ff00; }
 * 
 * Daher muss der ThemeSwitcher **vor diesen Plugins geladen oder aktiviert** werden,
 * damit Farbsysteme korrekt funktionieren.
 */
export default class ThemeSwitcher extends Plugin {
  constructor() {
    super('ThemeSwitcher'); // Registrierung als Plugin mit diesem Namen
  }

  /**
   * Setzt das Farb-Theme beim Start auf 'green'
   * (Wird am <html>-Element als Attribut gesetzt)
   */
  init() {
    document.documentElement.setAttribute('data-theme', 'green');
  }
}
