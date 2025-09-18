# Typed BEM

[![npm](https://img.shields.io/npm/v/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![license](https://img.shields.io/npm/l/typed-bem)](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![issues](https://img.shields.io/github/issues/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/issues)
[![pull requests](https://img.shields.io/github/issues-pr/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/pulls)
[![size](https://img.shields.io/bundlephobia/min/typed-bem)](https://bundlephobia.com/result?p=typed-bem)
![contributors](https://img.shields.io/github/contributors/deleonio/typed-bem-class-generator)

## Überblick

**Typed BEM** erweitert das bewährte [easy-bem](https://www.npmjs.com/package/easy-bem) Utility mit erstklassiger TypeScript-Unterstützung. Sie beschreiben die gültigen Blöcke, Elemente und Modifier einmal, und Typed BEM wandelt diese Definition in folgende Funktionalitäten um:

- typsichere CSS-Klassennamen-Factories,
- Hilfsfunktionen zum Kombinieren von Klassenlisten, und
- einen optionalen SCSS-Dateigenerator, der Ihr Schema widerspiegelt.

Durch die Zentralisierung Ihres BEM-Schemas in TypeScript eliminieren Sie Rätselraten, verhindern Tippfehler und halten Styles über Ihr gesamtes Projekt hinweg synchron.

## Referenzprojekt

Diese Bibliothek wird im [KoliBri](https://github.com/public-ui/kolibri) Projekt verwendet - einer barrierefreien Web-Komponenten-Bibliothek, die eine umfassende Sammlung von UI-Komponenten nach Accessibility-Best-Practices bereitstellt. KoliBri demonstriert den praxisnahen Einsatz von Typed BEM zur Wartung konsistenter und typsicherer BEM-Klassennamen in einer großen Komponentenbibliothek.

## Hauptfunktionen

- **Typsichere API** – Erkennen Sie ungültige Blöcke, Elemente oder Modifier während der Entwicklung statt zur Laufzeit.
- **Set-basierte Modifier** – Modellieren Sie erlaubte Modifier mit `Set<string>` für schnelle Lookups und präzise Literal-Unions.
- **SCSS-Generator** – Erstellen Sie Starter-SCSS-Dateien, die dieselbe Struktur wie Ihr TypeScript-Schema befolgen.
- **Tree-Shakeable Helpers** – `generateBemClassNames`, `uniqueClassNames` und `generateBemScssFile` werden einzeln exportiert.
- **Leichtgewichtiger Footprint** – Direkt auf `easy-bem` aufgebaut ohne zusätzliche Runtime-Abhängigkeiten.

## Installation

Installieren Sie das Paket mit Ihrem bevorzugten Package Manager:

```bash
npm install typed-bem
# oder
pnpm add typed-bem
yarn add typed-bem
```

## Schnellstart

### 1. Schemas beschreiben

Definieren Sie einen TypeScript-Typ, der die Blöcke, ihre Elemente und die erlaubten Modifier erfasst. Verwenden Sie `Set`, wenn Modifier erlaubt sind, und `null`, wenn nicht. **Best Practice:** Definieren Sie alle Ihre Komponenten in einem zentralen Schema für bessere Wartbarkeit.

```typescript
import { generateBemClassNames } from 'typed-bem';

// Zentrale Schemas für alle Komponenten (empfohlener Ansatz)
type ComponentsSchema = {
	button: {
		modifiers: Set<'primary' | 'secondary'> | null;
		elements: {
			icon: {
				modifiers: Set<'small' | 'large'> | null;
			};
			text: {
				modifiers: null;
			};
		};
	};
	input: {
		modifiers: Set<'error' | 'success'> | null;
		elements: {
			label: {
				modifiers: Set<'required' | 'disabled'> | null;
			};
			field: {
				modifiers: null;
			};
		};
	};
};
```

### 2. Klassennamen generieren

`generateBemClassNames` liest Ihre Schemas und gibt einen stark typisierten Helfer zurück. Ungültige Kombinationen lösen sofort TypeScript-Fehler aus.

```typescript
// Erstellen Sie eine einzige BEM-Instanz für alle Komponenten
const bem = generateBemClassNames<ComponentsSchema>();

// Direkte Nutzung (funktioniert immer)
bem('button');
// "button"

bem('button', { primary: true });
// "button button--primary"

bem('button', 'icon', { small: true });
// "button__icon button__icon--small"

// bem('button', { tertiary: true });      // TypeScript-Fehler: unbekannter Modifier
// bem('button', 'label');                  // TypeScript-Fehler: unbekanntes Element
```

### 3. Alternative Kurzsyntax

Für Komponenten, bei denen Sie hauptsächlich mit einem Block oder Element arbeiten, können Sie die Methoden `forBlock()` und `forElement()` verwenden. Diese sind optionale Abkürzungen für mehr Komfort.

#### Blockgebundene Generatoren

```typescript
// Erstellen Sie block-spezifische Generatoren
const buttonBem = bem.forBlock('button');
const inputBem = bem.forBlock('input');

// Jetzt können Sie den Blocknamen weglassen!
buttonBem(); // "button"
buttonBem({ primary: true }); // "button button--primary"
buttonBem('icon', { small: true }); // "button__icon button__icon--small"

inputBem({ error: true }); // "input input--error"
inputBem('label', { required: true }); // "input__label input__label--required"
```

#### Elementgebundene Generatoren

```typescript
// Erstellen Sie element-spezifische Generatoren
const buttonIconBem = buttonBem.forElement('icon');
const inputLabelBem = inputBem.forElement('label');

// Ultra-kurze Syntax für häufig verwendete Elemente
buttonIconBem(); // "button__icon"
buttonIconBem({ small: true }); // "button__icon button__icon--small"

inputLabelBem({ required: true }); // "input__label input__label--required"
```

Diese Methoden sind besonders nützlich für wiederkehrende Aufgaben, aber nicht zwingend erforderlich.

### 4. Klassennamen zusammenführen

Verwenden Sie `uniqueClassNames`, um dynamische Klassennamenfragmente zu kombinieren und dabei Duplikate und falsy-Werte zu entfernen.

```typescript
import { uniqueClassNames } from 'typed-bem';

const className = uniqueClassNames(bem('button'), bem('button', 'icon', { small: props.isSmall }), props.className);
```

### 5. SCSS-Gerüst generieren (optional)

Typed BEM kann Ihr Schema in eine SCSS-Datei spiegeln. Beim Erstellen von `Set`-Werten für Modifier, casten Sie Array-Literale mit `as const`, damit die Literal-Typen intakt bleiben.

```typescript
import { generateBemScssFile } from 'typed-bem/scss';

const componentDefinition: ComponentsSchema = {
	button: {
		modifiers: new Set(['primary', 'secondary'] as const),
		elements: {
			icon: { modifiers: new Set(['small', 'large'] as const) },
			text: { modifiers: null },
		},
	},
	input: {
		modifiers: new Set(['error', 'success'] as const),
		elements: {
			label: { modifiers: new Set(['required', 'disabled'] as const) },
			field: { modifiers: null },
		},
	},
};

generateBemScssFile(componentDefinition, './components');
```

Der Generator schreibt eine Datei namens `components.scss` neben Ihr Skript:

```scss
.button {
	&--primary {
		// Styles für button--primary
	}
	&--secondary {
		// Styles für button--secondary
	}
	&__icon {
		&--small {
			// Styles für button__icon--small
		}
		&--large {
			// Styles für button__icon--large
		}
	}
	&__text {
		// Styles für button__text
	}
}

.input {
	&--error {
		// Styles für input--error
	}
	&--success {
		// Styles für input--success
	}
	&__label {
		&--required {
			// Styles für input__label--required
		}
		&--disabled {
			// Styles für input__label--disabled
		}
	}
	&__field {
		// Styles für input__field
	}
}
```

## Verwendungsmuster

### Zentrale Schema-Registrierung (Empfohlen)

Anstatt separate `generateBemClassNames`-Instanzen für jede Komponente zu erstellen, registrieren Sie alle Komponenten in einem zentralen Schema:

```typescript
// schema.ts - Zentrales BEM-Schema
type AppBemSchema = {
	header: {
		/* ... */
	};
	navigation: {
		/* ... */
	};
	button: {
		/* ... */
	};
	input: {
		/* ... */
	};
	modal: {
		/* ... */
	};
	// ... alle Ihre Komponenten
};

export const bem = generateBemClassNames<AppBemSchema>();
```

```typescript
// components/Button.tsx
import { bem } from '../schema';

const buttonBem = bem.forBlock('button');

export function Button({ variant, size, children }) {
  return (
    <button className={buttonBem({ [variant]: true })}>
      {children}
    </button>
  );
}
```

### Migration von direkter Verwendung

Die neue API ist vollständig rückwärtskompatibel. Sie können schrittweise migrieren:

```typescript
// Vorher (funktioniert weiterhin)
const oldStyle = bem('button', { primary: true });

// Nachher (bequemer für Einzel-Block-Komponenten)
const buttonBem = bem.forBlock('button');
const newStyle = buttonBem({ primary: true });
```

### Komponenten-spezifische Muster

```typescript
// Für Komponenten mit häufiger Element-Verwendung
const modalBem = bem.forBlock('modal');
const modalHeaderBem = modalBem.forElement('header');
const modalBodyBem = modalBem.forElement('body');
const modalFooterBem = modalBem.forElement('footer');

// Verwendung in Komponente
<div className={modalBem({ open: isOpen })}>
  <header className={modalHeaderBem()}>Titel</header>
  <main className={modalBodyBem()}>Inhalt</main>
  <footer className={modalFooterBem()}>Aktionen</footer>
</div>
```

## Vorteile der zentralen Registrierung

### 1. Konsistenz

- Alle Komponenten verwenden dasselbe BEM-Schema
- Keine Duplikate oder Inkonsistenzen zwischen Komponenten
- Zentrale Stelle für alle BEM-Definitionen

### 2. Performance

- Nur eine BEM-Instanz pro Anwendung
- Wiederverwendung der generierten CSS-Klassen
- Reduzierter Memory-Footprint

### 3. Wartbarkeit

- Einfache Übersicht über alle verfügbaren BEM-Blöcke
- Zentrale Stelle für Änderungen am BEM-Schema
- Bessere Code-Organisation

### 4. Ergonomie

- Block-gebundene Generatoren eliminieren Wiederholungen
- Element-gebundene Generatoren für häufig verwendete Elemente
- Intuitive API für verschiedene Verwendungsszenarien

## API-Referenz

### `generateBemClassNames`

```typescript
declare function generateBemClassNames<B extends BemBlocks<BemSchema>>(): TypedBemFunction<B>;
```

- **Gibt zurück** eine gecachte `bem`-Funktion mit zusätzlichen Methoden.
- **Parameter**
  - `blockName` – ein Schlüssel aus Ihrem Schema.
  - `blockModifiersOrElementName` – entweder ein partielles Record von Block-Modifiern oder ein Element-Name.
  - `elementModifiers` – (optional) ein partielles Record von Element-Modifiern beim Targeting eines Elements.

#### Erweiterte Methoden

- **`.forBlock(blockName)`** – Gibt einen block-gebundenen Generator zurück, der den Block-Namen nicht benötigt.
- **`.forElement(elementName)`** – Verfügbar auf block-gebundenen Generatoren, gibt einen element-gebundenen Generator zurück.

**Beispiel:**

```typescript
const bem = generateBemClassNames<Schema>();

// Direkte Verwendung
bem('button', { primary: true });

// Block-gebundene Verwendung
const buttonBem = bem.forBlock('button');
buttonBem({ primary: true });

// Element-gebundene Verwendung
const iconBem = buttonBem.forElement('icon');
iconBem({ small: true });
```

### `uniqueClassNames`

```typescript
declare function uniqueClassNames(...chunks: (string | undefined | null | false)[]): string;
```

- Flacht die bereitgestellten Argumente zu einem einzigen Klassen-String ab.
- Ignoriert falsy-Werte und leere Strings.
- Entfernt doppelte Klassennamen im finalen Ergebnis.

### `generateBemScssFile`

```typescript
declare function generateBemScssFile<B extends BemBlocks<BemSchema>>(definition: B, outputPath: string): void;
```

- Schreibt `<outputPath>.scss` im aktuellen Arbeitsverzeichnis.
- Akzeptiert dasselbe Schema-Objekt, das Sie zum Generieren von Klassennamen verwenden.
- Gedacht für Node.js-Umgebungen; importieren Sie es von `typed-bem/scss`.

## Lizenz

Typed BEM wird unter der [MIT-Lizenz](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE) verteilt.
