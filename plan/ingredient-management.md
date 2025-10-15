# Ingredient Management Implementation Plan

## Overview
Goal: introduce a persistent ingredient catalog (TypeORM + SQLite backend) with RESTful Express APIs, Zod validation, and frontend integration, all validated via Vitest.

## Phase 0 – Foundations ✅
- Audit current repo structure; split client/server directories if needed.
- Install backend deps: `express`, `zod`, `@asteasolutions/zod-to-openapi`, `reflect-metadata`, `typeorm`, `sqlite3`, and supporting types.
- Ensure Vitest config can cover backend code (Node environment or separate config).

## Phase 1 – OpenAPI Source of Truth ✅
- Drafted the OpenAPI 3.1 specification in `schema/ingredients.yaml` with Spectral linting via `pnpm openapi:lint`.
- Added `scripts/generate-from-openapi.mjs` to emit TypeScript types (`src/server/generated/openapi-types.ts`), Zod schemas (`src/server/generated/zod-schemas.ts`), TypeORM entities, and the bootstrap migration from the spec.
- Regenerated entities/migration so `src/server/data-source.ts` now consumes spec-derived definitions; legacy manual versions were removed.
- Seed fixtures (`src/server/fixtures/suppliers.sample.json`) align with schema IDs.
- Vitest entity check remains as a smoke test (skipped if sqlite bindings unavailable).

## Phase 2 – Service & Validation ✅
- Added strict Zod parsers in `src/server/validation` backed by the generated schemas for all create/update/status/list flows.
- Implemented repository-backed `IngredientService` and `SupplierService` with timestamp management, supplier existence guarding, and status transitions.
- Introduced Vitest coverage for the services (skipping when native sqlite bindings are missing) to exercise happy paths and failure scenarios.

## Phase 3 – Express API
- Bootstrap Express app with JSON middleware, error handler, and routers.
- Implement routes:
  - `GET /api/ingredients` with query filters (status, category, supplier).
  - `GET /api/ingredients/:id`.
  - `POST /api/ingredients` & `PUT /api/ingredients/:id` using Zod validation.
  - `PATCH /api/ingredients/:id/status` to toggle active/inactive.
  - `DELETE /api/ingredients/:id` (decide on soft vs hard delete).
- Add minimal supplier CRUD endpoints required for managing FK relationships.
- Use Supertest + Vitest to exercise REST endpoints end to end.

## Phase 4 – OpenAPI Schema
- Convert Zod schemas to OpenAPI components via `zod-to-openapi`.
- Generate `schema/openapi.yaml` and optional `/api/docs.json` route.
- Document generation script (`pnpm openapi:generate`) and test against Swagger UI locally (optional).
- Add Vitest snapshot test to ensure OpenAPI spec generation remains stable.

## Phase 5 – Frontend Integration
- Create shared API client using fetch or Axios with types inferred from OpenAPI (or Zod).
- Build UI components: ingredient table view, detail drawer/form, and status badges.
- Implement forms with validation mirrored from Zod schemas.
- Add Vitest + React Testing Library tests for new components (form validation, list rendering).
- Wire client data fetching to backend endpoints with caching (TanStack Query).

## Phase 6 – Documentation & Ops
- Update `AGENTS.md` and `README.md` with setup instructions (migrations, server start, testing).
- Add combined dev script (`pnpm dev:server`, `pnpm dev:client`, or `pnpm dev:all`).
- Configure CI steps to run migrations, backend/frontend tests, linting, and OpenAPI generation.

## Phase 7 – Polish & Rollout
- Backfill sample data for demo mode.
- Review security (input sanitization, rate limiting) and add TODOs or issues if out of scope.
- Conduct code review and tracking tasks, splitting each phase into separate PRs for manageable increments.
