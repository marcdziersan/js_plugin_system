# 🧩 Boilerplate Plugin – Anleitung für Einsteiger

## 📘 Was ist ein Plugin?

Ein **Plugin** in diesem System ist ein kleines JavaScript-Modul, das eine Funktion oder ein Feature zur Website hinzufügt – z. B.:

- eine Uhr anzeigen  
- eine To-Do-Liste verwalten  
- ein Mini-Spiel laufen lassen  
- ein Theme ändern  
- oder etwas animieren 🎨

Diese Plugins sind modular aufgebaut – jedes ist **eine eigene Datei** und **arbeitet für sich selbst**, kann aber auch mit anderen Plugins zusammenarbeiten.

---

## ⚙️ Was ist `boilerplatePlugin.js`?

Dies ist eine **Vorlage (Boilerplate)**, die dir hilft, **schnell dein eigenes Plugin zu bauen**.

> Denk dran: Du musst kein Profi sein! Diese Vorlage gibt dir alles an die Hand, was du brauchst.

---

## 📁 Dateiüberblick

```plaintext
plugins/
├── boilerplatePlugin.js  ← ✨ Deine Plugin-Vorlage
├── plugin.js             ← Basis-Klasse (wird geerbt)
├── config.js             ← Liste aller Plugins
└── main.js               ← Lädt alle aktiven Plugins
```

---

## ✍️ Schritt-für-Schritt-Anleitung

### 1. 📄 Datei kopieren

Kopiere `boilerplatePlugin.js` z. B. zu:

```
plugins/catFacts.js
```

### 2. ✏️ Namen anpassen

```js
export default class CatFacts extends Plugin {
  constructor() {
    super('CatFacts');
  }

  init() {
    console.log('🐱 CatFacts Plugin gestartet!');
  }
}
```

> In `config.js` muss `'catFacts'` in die Pluginliste aufgenommen werden!

---

### 3. 🎨 UI bauen

```js
render() {
  const box = document.createElement('div');
  box.textContent = '🐱 Wusstest du? Katzen schlafen 70% des Tages.';
  box.style.position = 'fixed';
  box.style.bottom = '20px';
  box.style.right = '20px';
  box.style.background = '#222';
  box.style.color = 'white';
  box.style.padding = '1rem';
  box.style.borderRadius = '12px';
  document.body.appendChild(box);
}
```

---

## 🔧 So funktioniert die Vorlage

### 🔹 `constructor(name, options)`
- Jeder Plugin bekommt einen Namen
- Optional: Konfigurationsobjekt mit Einstellungen

```js
super('MyPlugin', { greeting: 'Hallo Welt!' });
```

### 🔹 `init()`
- Wird automatisch beim Start ausgeführt
- Hier baust du dein UI oder startest deine Logik

### 🔹 `injectStyles()`
- Fügt eigene CSS-Regeln ein

### 🔹 `render()`
- Fügt HTML ins DOM ein (z. B. ein Panel oder Spiel)

### 🔹 `handleClick()`
- Beispielhafte Event-Methode (z. B. Button-Klick)

---

## 🧪 Beispiel 1: Counter-Plugin

```js
export default class CounterPlugin extends Plugin {
  constructor() {
    super('CounterPlugin');
    this.count = 0;
  }

  init() {
    this.render();
  }

  render() {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.top = '20px';
    el.style.left = '20px';
    el.style.background = '#333';
    el.style.color = '#fff';
    el.style.padding = '1rem';
    el.style.borderRadius = '8px';

    const btn = document.createElement('button');
    btn.textContent = 'Zähle hoch';
    btn.onclick = () => {
      this.count++;
      label.textContent = `Anzahl: ${this.count}`;
    };

    const label = document.createElement('div');
    label.textContent = 'Anzahl: 0';

    el.append(label, btn);
    document.body.appendChild(el);
  }
}
```

---

## 🧪 Beispiel 2: Hintergrundfarbe ändern

```js
export default class BgColorChanger extends Plugin {
  constructor() {
    super('BgColorChanger');
  }

  init() {
    const btn = document.createElement('button');
    btn.textContent = '🔄 Hintergrund wechseln';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.left = '100px';
    btn.onclick = () => {
      const colors = ['#111', '#222', '#333', '#444'];
      document.body.style.background = colors[Math.floor(Math.random() * colors.length)];
    };
    document.body.appendChild(btn);
  }
}
```

---

## 🧪 Beispiel 3: Unsichtbares Plugin (z. B. Analytics)

```js
export default class Logger extends Plugin {
  constructor() {
    super('Logger');
  }

  init() {
    document.addEventListener('click', e => {
      console.log(`[Logger] Klick auf`, e.target);
    });
  }
}
```

---

## 💾 In `config.js` aktivieren

```js
export const config = {
  plugins: [
    'catFacts',
    'counterPlugin',
    'bgColorChanger',
    'logger'
    // usw.
  ],
  pluginPath: './plugins/',
};
```

---

## 🧠 Tipps für Anfänger

| Was du tun willst         | So geht's                                      |
|---------------------------|-----------------------------------------------|
| 🔘 Button einfügen        | `document.createElement('button')`            |
| 🎨 Farbe setzen           | `element.style.background = '#123456'`        |
| 📦 Daten speichern        | `localStorage.setItem('key', 'value')`        |
| 💾 Daten laden            | `localStorage.getItem('key')`                 |
| 🎯 Klicks verarbeiten     | `element.onclick = () => { ... }`             |
| ⌛ Zeitfunktion            | `setInterval(() => {...}, 1000)`              |

---

## 🛠️ Bonus: Deine Plugin-Checkliste ✅

- [ ] Neue Datei erstellt  
- [ ] `class` und `super()` angepasst  
- [ ] In `config.js` eingetragen  
- [ ] In `main.js` dynamisch geladen  
- [ ] Init-Logik in `init()` geschrieben  
- [ ] Optional: UI über `render()` eingebaut  
- [ ] Optional: CSS über `injectStyles()` ergänzt  

---

## ❓ Fragen?

Wenn du unsicher bist, was du machen darfst: **Du darfst alles!**  
Wenn dein Plugin nützlich ist, spaß macht oder einfach nur experimentell ist – **das System ist dafür gebaut.**

---  
**Viel Spaß beim Erstellen deiner eigenen Plugins!**  
Dein Plugin-System wartet nur darauf, erweitert zu werden 🚀