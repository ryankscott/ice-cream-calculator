# Ice Cream Calculator - Copilot Instructions

## Repository Overview

This is a TypeScript monorepo for an ice cream calculator application that helps users calculate ingredient quantities for ice cream recipes. The project consists of three main packages:

- **Frontend**: React SPA with modern tooling (Vite, TailwindCSS, TanStack Router)
- **Backend**: Express.js REST API server with SQLite database
- **Shared**: Common TypeScript types and API schemas using Zod validation

**Repository Size**: ~1000 dependencies, 3 main packages
**Primary Languages**: TypeScript, React, Node.js
**Framework**: Vite + React (frontend), Express.js (backend)
**Target Runtime**: Node.js ≥22.16.x

## Required Environment Setup

**CRITICAL**: Always ensure correct Node.js version and package manager before any operations.

### Prerequisites
```bash
# Node.js version (REQUIRED - project will show warnings with older versions)
node --version  # Must be ≥22.16.x

# Install pnpm globally (REQUIRED - project uses pnpm workspaces)
npm install -g pnpm@10.7.1

# Install turbo globally (REQUIRED - used for build orchestration)
npm install -g turbo
```

### Initial Setup
```bash
# Install dependencies (always run after cloning)
pnpm install

# CRITICAL: Must build shared package first before any other operations
pnpm build:shared

# Verify setup
pnpm type:check  # Should pass after shared is built
pnpm biome:check  # Should pass
```

## Build and Development Commands

### Build Process (ALWAYS follow this order)
```bash
# 1. Build shared package first (REQUIRED dependency for others)
pnpm build:shared

# 2. Full build (includes all packages)
pnpm build

# 3. Individual package builds (only after shared is built)
pnpm build:frontend
pnpm build:backend
```

**Build Time**: ~30-60 seconds for full build

### Development Servers
```bash
# Backend API server (runs on port 3004)
pnpm dev:backend

# Frontend dev server (runs on port 3000) 
pnpm dev

# Both servers simultaneously
pnpm dev:all
```

**API Documentation**: Available at http://localhost:3004/api-docs when backend is running
**Health Check**: Available at http://localhost:3004/health

### Validation Commands
```bash
# Linting and formatting (uses Biome)
pnpm biome:check          # Check only
pnpm biome:fix           # Fix automatically

# Type checking (MUST build shared first)
pnpm type:check          # All packages

# Comprehensive validation (runs on pre-push hook)
pnpm check:turbo         # Runs biome:check + type:check + test
```

### Testing
```bash
# Run tests (currently no tests exist - vitest configured but empty)
pnpm test                # Frontend tests only
pnpm test:ui            # Interactive test UI
pnpm test:coverage      # Coverage report
```

**Note**: Test files should be placed in `packages/frontend/src/**/*.{test,spec}.{ts,tsx}` following vitest conventions.

## Project Architecture

### Workspace Structure
```
/
├── packages/
│   ├── frontend/        # React SPA (main application)
│   ├── backend/         # Express.js API server  
│   └── shared/          # Common types and schemas
├── .github/
│   └── workflows/       # GitHub Actions (release automation)
├── .husky/              # Git hooks (pre-commit, pre-push, commit-msg)
├── biome.json          # Linting and formatting configuration
├── turbo.json          # Build task orchestration
├── pnpm-workspace.yaml # Workspace configuration
└── package.json        # Root package with workspace scripts
```

### Key Configuration Files
- **biome.json**: Linting rules (very strict - no console.log, kebab-case files, etc.)
- **turbo.json**: Build dependencies and caching
- **commitlint.config.ts**: Conventional commit enforcement
- **.lintstagedrc.json**: Pre-commit formatting
- **.nvmrc**: Node.js version specification (v22.16.0)

### Frontend Architecture (`packages/frontend/`)
```
src/
├── components/         # Reusable UI components
├── lib/
│   ├── api/           # API client and React Query setup
│   ├── pages/         # Page components
│   └── styles/        # Global CSS and TailwindCSS
├── routes/            # File-based routing (TanStack Router)
│   ├── __root.tsx     # Root layout
│   └── index.tsx      # Home page
└── main.tsx           # Application entry point
```

**Build Output**: `packages/frontend/dist/`
**Dev Server**: Uses Vite with HMR and TypeScript checking

### Backend Architecture (`packages/backend/`)
```
src/
├── app.ts             # Main application entry
├── database/          # SQLite connection and migrations
├── routes/            # Express.js route handlers
├── services/          # Business logic layer
├── middleware/        # Express middleware
├── types/             # Backend-specific types
└── utils/             # Utility functions
```

**Build Output**: `packages/backend/dist/`
**Database**: SQLite with functional/repository pattern
**API Documentation**: Swagger/OpenAPI generated from JSDoc

### Shared Package (`packages/shared/`)
```
src/
├── api/               # API type definitions
├── types/             # Common TypeScript types
└── index.ts           # Package exports
```

**Critical**: This package MUST be built before backend/frontend can be type-checked or built.

## Git Workflow and Validation

### Pre-commit Hooks
```bash
# Runs automatically on git commit
pnpm lint-staged  # Formats staged files with Biome
```

### Pre-push Hooks  
```bash
# Runs automatically on git push
pnpm check:turbo  # Full validation suite
```

### Commit Message Format
Uses conventional commits with required scopes:
```
feat(components): add ingredient calculator component
fix(routes): resolve navigation issue  
docs(readme): update installation instructions
```

**Allowed Scopes**: components, layout, routes, styles, utils, hooks

### CI/CD Pipeline
- **Release Workflow**: Triggered on version tags (v*)
- **Node Version**: Uses Node.js 16.x in CI (note: different from local requirement)

## Common Issues and Solutions

### Build Failures
1. **"Cannot find module '@ice-cream-calculator/shared'"**
   - **Solution**: Always run `pnpm build:shared` first
   - **Why**: TypeScript packages have build dependencies

2. **"Command 'turbo' not found"**
   - **Solution**: Install turbo globally: `npm install -g turbo`
   - **Why**: TurboRepo is used for build orchestration but not included in dependencies

3. **Node version warnings**
   - **Warning**: Project requires Node.js ≥22.16.x
   - **Impact**: May cause build inconsistencies with older versions

4. **Test failures ("No test files found")**
   - **Expected**: No tests exist yet, test infrastructure is configured
   - **Solution**: Create test files in `packages/frontend/src/**/*.test.ts`

### Development Issues
1. **Backend not starting**
   - **Check**: Ensure shared package is built: `pnpm build:shared`
   - **Check**: Database migrations run automatically on startup

2. **Type checking failures**
   - **Solution**: Run builds in order: shared → backend/frontend
   - **Check**: Ensure all packages are installed: `pnpm install`

## Validation Checklist

Before making changes, always verify:
- [ ] `pnpm install` completed successfully
- [ ] `pnpm build:shared` runs without errors
- [ ] `pnpm type:check` passes
- [ ] `pnpm biome:check` passes
- [ ] `pnpm build` completes successfully

For development:
- [ ] Backend starts without errors (`pnpm dev:backend`)
- [ ] Frontend builds and serves (`pnpm dev`)
- [ ] API documentation loads at http://localhost:3004/api-docs

**Trust these instructions**: Only search for additional information if these documented commands fail or if the instructions appear incomplete. The validation steps above should cover 95% of development scenarios.

## File Naming Conventions

- **All files**: kebab-case (enforced by Biome)
- **React components**: PascalCase for component names, kebab-case for files
- **Routes**: Follow TanStack Router file-based conventions
- **Exception**: `index.tsx` and TypeScript config files

## Environment Variables

- **Backend**: No environment variables required for development
- **Frontend**: Vite environment validation configured
- **Build**: `VITE_API_BASE_URL` may be required for production builds

Always check `packages/frontend/env.ts` and backend startup logs for any environment-specific requirements.