# StockSight UI

A stock market visualization and analysis frontend built with **Angular 19** and **Tailwind CSS v4**.

## Tech Stack

- **Angular 19** — standalone components (no NgModules), signal-ready
- **Tailwind CSS v4** — CSS-first configuration via `@theme` blocks, no `tailwind.config.js`
- **Angular CLI 19.2** — esbuild-based application builder

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open `http://localhost:4200/` in your browser. The app reloads automatically on file changes.

## Commands

| Command | Description |
|---|---|
| `npm start` | Dev server at `http://localhost:4200` |
| `npm run build` | Production build → `dist/stocksight-ui/` |
| `npm test` | Unit tests via Karma |
| `npm run lint` | ESLint |

## Code Scaffolding

Generate a new standalone component:

```bash
ng generate component component-name
```

## Tailwind CSS

Tailwind v4 is configured via PostCSS (`postcss.config.mjs`). Custom design tokens go directly in `src/styles.css` using `@theme` blocks:

```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(55% 0.2 260);
}
```

No `tailwind.config.js` is needed — v4 uses CSS-based theming.

## Building

```bash
npm run build
```

Artifacts are output to `dist/stocksight-ui/`.

## Running Tests

```bash
npm test          # unit tests (Karma)
ng e2e            # e2e tests (add a framework of your choice)
```
