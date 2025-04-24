import Plugin from '../plugin.js';

/**
 * 🌧️ MatrixRain Plugin
 * 
 * Erzeugt einen animierten, stilisierten Matrix-Code-Regen im Hintergrund.
 * Die Farbe passt sich automatisch anhand des aktuellen Themes (`data-theme`) an.
 * Das Canvas-Element wird "fixed" im Hintergrund des Viewports angezeigt.
 */
export default class MatrixRain extends Plugin {
  constructor() {
    super('MatrixRain'); // Plugin-Name für Identifikation & Verwaltung
  }

  /**
   * Initialisiert das Plugin:
   * - Erstellt das Canvas
   * - Fügt CSS-Styles ein
   * - Setzt Resize-/Zeichenlogik auf
   */
  init() {
    const characters = "ABCDEF0123456789"; // Verwendete Zeichen im Regen
    const fontSize = 16;                  // Schriftgröße in px
    let drops = [];                       // Y-Position jeder Spalte

    // 🎨 Canvas-Element erstellen und stylen
    const canvas = document.createElement("canvas");
    canvas.id = "matrix-rain";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // 🌈 Dynamische Farben via Theme (CSS-Variablen)
    const style = document.createElement("style");
    style.innerHTML = `
      :root { --matrix-color: #00ff00; }
      [data-theme="purple"] { --matrix-color: #b96eff; }
      [data-theme="green"] { --matrix-color: #00ff00; }
    `;
    document.head.appendChild(style);

    /**
     * Passt Canvas-Größe bei Fensteränderung an
     * Initialisiert `drops`-Array je Spalte
     */
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1); // jede Spalte startet bei Zeile 1
    }

    /**
     * Hauptzeichenschleife
     * - Verdunkelt das Canvas leicht
     * - Zeichnet neuen Buchstaben an jeder Drop-Position
     * - Simuliert Regen durch inkrementieren der Y-Position
     */
    function draw() {
      // 🔄 Hintergrund abdunkeln (Trail-Effekt)
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 📟 Schriftfarbe via CSS-Variable
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--matrix-color");
      ctx.font = `${fontSize}px monospace`;

      // 🧩 Schleife über alle Spalten
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Wenn das Zeichen über das Canvas hinausgeht und Zufall es bestimmt: zurücksetzen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++; // nächste Y-Position
      }

      // 🚀 Schleife fortsetzen
      requestAnimationFrame(draw);
    }

    // 🎬 Initialisierung
    resize();
    window.addEventListener("resize", resize); // Reaktion auf Größenänderung
    draw(); // Start der Animation
  }
}
