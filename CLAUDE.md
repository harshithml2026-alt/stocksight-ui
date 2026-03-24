# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

StockSight UI — an Angular 19 standalone application with Tailwind CSS v4. A stock market research tool where users ask questions grounded in SEC data, backed by a Python API at `http://localhost:8000`.

## Commands

```bash
npm start           # runs Tailwind watch + ng serve concurrently → http://localhost:4200
npm run build       # compiles Tailwind then ng build → dist/stocksight-ui/
npm test            # unit tests via Karma
npm run lint        # ESLint
```

Run a single spec file:
```bash
npx ng test --include='**/foo.spec.ts'
```

## Tailwind CSS Setup

Angular 19's esbuild builder has **no PostCSS support** — `postcss.config.js` is silently ignored. Tailwind is run as a **separate CLI process**:

- Input: `src/tailwind.css` (edit this to add `@theme` tokens or global styles)
- Output: `src/styles.css` (generated — do not edit directly)
- `npm start` runs both `tailwindcss --watch` and `ng serve` via `concurrently`

## Architecture

**Routing** (`src/app/app.routes.ts`):
- `/` → `HomeComponent` — landing page with search bar
- `/chat/:id` → `ChatComponent` — chat session page

**AppComponent** is a pure router shell (`<router-outlet />`).

**Data flow for a new chat:**
1. User types a query on `HomeComponent` and clicks Ask
2. `HomeComponent` generates a UUID, navigates to `/chat/{uuid}` passing the query via router navigation state (`extras.state.query`)
3. `ChatComponent` reads the query in `ngOnInit` via `router.getCurrentNavigation()`, then calls `SessionService.sendMessage()`
4. On response, the real `session_id` from the backend replaces the UUID in the URL via `replaceUrl: true`

**SessionService** (`src/app/services/session.service.ts`) — all HTTP calls:
- `GET  /chat/sessions` — list sessions for the current IP
- `GET  /chat/sessions/:id` — load full session with messages
- `POST /chat/message` — `{ question, session_id? }` → `{ session_id, answer, sources }`
- `DELETE /chat/sessions/:id`

Backend base URL is hardcoded as `const API = 'http://localhost:8000'` in `SessionService`.

**Key component details:**
- `ChatComponent` — sidebar (collapsible) + message thread + fixed input bar. Sessions persisted by backend keyed to IP. `getCurrentNavigation()` only works during an active navigation — returns `null` on hard reload (handled gracefully).
- `TickerComponent` — auto-scrolling marquee of company logos fetched from Wikimedia Commons, rendered white via `filter: brightness(0) invert(1)`.
- `HomeComponent` — hero landing page with the ticker strip fixed below the navbar.

## API Contract (Backend)

```
POST /chat/message
Body:  { question: string, session_id: string | null }
Response: { session_id: string, answer: string, sources: any[] }

GET /chat/sessions
Response: Session[]  — { id, preview, createdAt }

GET /chat/sessions/:id
Response: SessionDetail — { ...Session, ip_address, updatedAt, messages: ChatMessage[] }

DELETE /chat/sessions/:id
```
