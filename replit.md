# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

The workspace includes **TrakLift**, a standalone React/Vite lifting tracker web app at the root preview path. TrakLift is frontend-only and stores onboarding state and lift entries in browser localStorage through a shared client-side store. The root route is a public landing page; the tracker experience lives at `/app` after onboarding.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **TrakLift frontend**: React + Vite + Tailwind, localStorage persistence, Recharts for progress visualization

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/traklift run dev` — run the TrakLift web app locally through its configured workflow
- `pnpm exec playwright test -c artifacts/traklift/playwright.config.ts` — run TrakLift browser regression tests for saving lifts to History and reading them in Progress

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
