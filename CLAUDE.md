# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VestWise (vestwise.app) — stock option vesting tracker. Client-only React + TypeScript website that lets users fill in grant details via a form and displays metrics and graphs for the vesting schedule.

## Tech Stack

- React 19 + TypeScript (strict mode, `noUnusedLocals`/`noUnusedParameters` enabled)
- Vite 7 (build tool)
- Bun (package manager & runtime)
- shadcn/ui v4 (base-nova style, built on Base UI + Tailwind CSS v4)
- No backend — all logic runs client-side

## Common Commands

```bash
bun run dev          # Start dev server
bun run build        # Type-check + production build (runs tsc -b first)
bun run lint         # Run ESLint
bun run typecheck    # Type-check without emitting (tsc --noEmit)
bun run format       # Format all .ts/.tsx with Prettier
bun run preview      # Preview production build locally
```

No test framework is configured yet.

## Architecture

- **Form layer**: Collects VSOP grant details (grant date, total shares, vesting period, cliff, etc.)
- **Calculation layer**: Pure functions that compute vesting schedules, milestones, and metrics from grant inputs
- **Visualization layer**: Charts and summary metrics displaying vested/unvested shares over time

All state is local — no API calls, no database. Grant data lives in component state or URL params.

## Conventions

- Path alias: `@/` maps to `src/` (configured in both tsconfig and vite)
- Add shadcn components via: `bunx shadcn@latest add <component>`
- UI primitives live in `src/components/ui/`; app components in `src/components/`
