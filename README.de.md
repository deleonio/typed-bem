# Typed BEM

[![npm](https://img.shields.io/npm/v/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![license](https://img.shields.io/npm/l/typed-bem)](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![issues](https://img.shields.io/github/issues/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/issues)
[![pull requests](https://img.shields.io/github/issues-pr/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/pulls)
[![size](https://img.shields.io/bundlephobia/min/typed-bem)](https://bundlephobia.com/result?p=typed-bem)
![contributors](https://img.shields.io/github/contributors/deleonio/typed-bem-class-generator)

## Überblick

**Typed BEM** erweitert das bewährte [easy-bem](https://www.npmjs.com/package/easy-bem) Utility mit erstklassigem TypeScript-Support. Sie beschreiben die gültigen Blöcke, Elemente und Modifier einmal, und Typed BEM verwandelt diese Definition in:

- typsichere Class-Name-Factories,
- Hilfsfunktionen zum Zusammensetzen von Klassenlisten, und
- einen optionalen SCSS-Dateigenerator, der Ihr Schema widerspiegelt.

Durch die Zentralisierung Ihres BEM-Schemas in TypeScript beseitigen Sie Rätselraten, verhindern Tippfehler und halten Styles in Ihrem gesamten Projekt synchron.

## Referenzprojekt

Diese Bibliothek wird im [KoliBri](https://github.com/public-ui/kolibri)-Projekt verwendet - einer barrierefreien Web-Component-Bibliothek, die ein umfassendes Set von UI-Komponenten nach bewährten Accessibility-Praktiken bereitstellt. KoliBri demonstriert den praktischen Einsatz von Typed BEM zur Aufrechterhaltung konsistenter und typsicherer BEM-Klassennamen in einer großen Komponentenbibliothek.

## Hauptfunktionen

- **Typsichere API** – Ungültige Blöcke, Elemente oder Modifier werden während der Entwicklung statt zur Laufzeit erkannt.
- **Set-basierte Modifier** – Modellieren Sie erlaubte Modifier mit `Set<string>` für schnelle Lookups und präzise Literal-Unions.
- **SCSS-Generator** – Erstellen Sie Starter-SCSS-Dateien, die der gleichen Struktur wie Ihr TypeScript-Schema folgen.
- **Tree-Shakeable Hilfsfunktionen** – `generateBemClassNames`, `uniqueClassNames` und `generateBemScssFile` werden einzeln exportiert.
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

### 1. Beschreiben Sie Ihr Schema

Definieren Sie einen TypeScript-Typ, der die Blöcke, ihre Elemente und die erlaubten Modifier erfasst. Verwenden Sie `Set`, wenn Modifier erlaubt sind, und `null`, wenn sie es nicht sind.

```typescript
import { generateBemClassNames } from 'typed-bem';

type ButtonBem = {
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
};
```

### 2. Klassennamen generieren

`generateBemClassNames` liest Ihr Schema und gibt eine stark typisierte Hilfsfunktion zurück. Ungültige Kombinationen lösen sofort TypeScript-Fehler aus.

```typescript
const bem = generateBemClassNames<ButtonBem>();

bem('button');
// "button"

bem('button', { primary: true });
// "button button--primary"

bem('button', 'icon', { small: true });
// "button__icon button__icon--small"

// bem('button', { tertiary: true });      // TypeScript-Fehler: unbekannter Modifier
// bem('button', 'label');                  // TypeScript-Fehler: unbekanntes Element
```

### 3. Klassennamen zusammenführen

Verwenden Sie `uniqueClassNames`, um dynamische Klassennamen-Fragmente zu kombinieren und dabei Duplikate und falsy Werte zu entfernen.

```typescript
import { uniqueClassNames } from 'typed-bem';

const className = uniqueClassNames(
  'button',
  bem('button', 'icon', { small: props.isSmall }),
  props.className,
);
// -> jede Klasse erscheint nur einmal
```

### 4. SCSS-Gerüst generieren (optional)

Typed BEM kann Ihr Schema in eine SCSS-Datei spiegeln. Beim Erstellen von `Set`-Werten für Modifier casten Sie Array-Literale mit `as const`, damit die Literal-Typen erhalten bleiben.

```typescript
import { generateBemScssFile } from 'typed-bem/scss';

const buttonBemDefinition: ButtonBem = {
  button: {
    modifiers: new Set(['primary', 'secondary'] as const),
    elements: {
      icon: { modifiers: new Set(['small', 'large'] as const) },
      text: { modifiers: null },
    },
  },
};

generateBemScssFile(buttonBemDefinition, './button');
```

Der Generator schreibt eine Datei namens `button.scss` neben Ihr Skript:

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
```

## API-Referenz

### `generateBemClassNames`

```typescript
declare function generateBemClassNames<B extends BemBlocks<BemSchema>>(): TypedBemFunction<B>;
```

- **Gibt zurück** eine gecachte `bem`-Funktion.
- **Parameter**
  - `blockName` – ein Schlüssel aus Ihrem Schema.
  - `blockModifiersOrElementName` – entweder ein partieller Record von Block-Modifiern oder ein Element-Name.
  - `elementModifiers` – (optional) ein partieller Record von Element-Modifiern bei Targeting eines Elements.

### `uniqueClassNames`

```typescript
declare function uniqueClassNames(...chunks: (string | undefined | null | false)[]): string;
```

- Flacht die bereitgestellten Argumente zu einem einzigen Klassen-String ab.
- Ignoriert falsy Werte und leere Strings.
- Entfernt doppelte Klassennamen im Endergebnis.

### `generateBemScssFile`

```typescript
declare function generateBemScssFile<B extends BemBlocks<BemSchema>>(definition: B, outputPath: string): void;
```

- Schreibt `<outputPath>.scss` in das aktuelle Arbeitsverzeichnis.
- Akzeptiert das gleiche Schema-Objekt, das Sie zur Generierung von Klassennamen verwenden.
- Für Node.js-Umgebungen gedacht; importieren Sie es von `typed-bem/scss`.

## Lizenz

Typed BEM wird unter der [MIT-Lizenz](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE) vertrieben.
