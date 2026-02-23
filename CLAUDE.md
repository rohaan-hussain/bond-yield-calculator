# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root (tooling only)

```bash
npm install          # Install root dev dependencies (Husky, lint-staged, Prettier)
npm run format       # Format all files with Prettier
npm run format:check # Check formatting without writing
```

### Backend (NestJS — run from `backend/`)

```bash
npm install
npm run start:dev    # Watch mode on http://localhost:3001/api
npm run build        # Compile to dist/
npm run lint         # ESLint with auto-fix
npm run test         # Unit tests (Jest)
npm run test:e2e     # E2E tests
npm run test:cov     # Coverage report
```

Run a single test file:

```bash
cd backend && npx jest src/bond/bond.service.spec.ts
```

### Frontend (React/Vite — run from `frontend/`)

```bash
npm install
npm run dev          # Dev server on http://localhost:5173
npm run build        # Type-check + Vite build
npm run lint         # ESLint
npm test             # Jest + React Testing Library
```

Run a single test file:

```bash
cd frontend && npx jest src/components/calculator/BondCalculatorForm.test.tsx
```

## Architecture

This is a monorepo with separate `frontend/` and `backend/` packages. The root `package.json` manages only shared tooling (Prettier, Husky, lint-staged).

### Backend (`backend/src/`)

Standard NestJS structure with a single `BondModule`:

- `bond/bond.controller.ts` — single `POST /api/bond/calculate` endpoint
- `bond/bond.service.ts` — all calculation logic: current yield, YTM (Newton-Raphson iteration), total interest, bond status, cash flow schedule
- `bond/dto/calculate-bond.dto.ts` — request validation via `class-validator`
- `bond/interfaces/bond-result.interface.ts` — response shape types

The global `ValidationPipe` (configured in `main.ts`) enforces `whitelist: true` and `forbidNonWhitelisted: true`, so only DTO-declared fields pass through.

### Frontend (`frontend/src/`)

React 19 + Vite + Tailwind CSS 4 with React Router v7.

Data flow: `BondCalculatorForm` → Zod validation (`schemas/bondCalculator.schema.ts`) → `useBondCalculator` hook → `services/bondApi.ts` → axios instance (`services/api.ts`, base URL `/api`) → backend.

Key layers:

- **Pages**: `CalculatorPage` (main UI), `FaqPage` (static content from `data/faqData.ts`)
- **Hook**: `useBondCalculator` manages loading/error/result state and shows toast notifications via `sonner`
- **Schema**: Zod schema in `schemas/bondCalculator.schema.ts` mirrors the backend DTO — keep them in sync
- **Components**: `calculator/` has the form and results display; `ui/` has shared primitives; `layout/` wraps all pages via React Router's nested routes

The Vite dev server proxies `/api` requests to the backend at `localhost:3001` — both must be running simultaneously during development.

## Validation contract

Input field constraints are defined in two places that must stay in sync:

- Frontend: `frontend/src/schemas/bondCalculator.schema.ts` (Zod)
- Backend: `backend/src/bond/dto/calculate-bond.dto.ts` (class-validator)

`couponFrequency` accepts only `"annual"` or `"semi-annual"`.
