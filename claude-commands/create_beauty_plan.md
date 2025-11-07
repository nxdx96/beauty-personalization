---
description: Implementation plan for the Beauty Personalization static intake wizard
---

# Beauty Personalization Implementation Plan

## Context
- Source inspiration: `face-findr` demonstrates legacy p5.js/d3.js UI backed by static JSON built from Sephora/Ulta scrapes (`face-findr/index.html`, `js/makeuppage.js`, `app.py`, `prod_data/*.csv`).
- New goal: reimagine the experience with a modern TypeScript + React stack, starting with a static, no-database prototype that captures user skin and hair profiles through guided DOM interactions.
- Scope: Phase 1 focuses on a single-page wizard experience; future phases will incorporate data persistence, recommendation logic, and LLM integration.

## Objectives
- Provide a modular React foundation that can evolve from static data to dynamic recommendations.
- Deliver a frictionless user flow collecting skin type, skin concerns, desired improvements, hair type, hair concerns, and improvement goals.
- Keep the stack lightweight (Vite, React, TypeScript, CSS modules or Tailwind optional) with zero external databases for the initial milestone.

## Constraints
- No Postgres, Redis, or remote APIs in Phase 1.
- Deployment targets static hosting (Vercel/Netlify/GitHub Pages) with optional lightweight Node dev server during development.
- Reuse of legacy assets is optional; prioritize clean TypeScript models for future evolution.

## Phase 0: Project Foundations
- [x] Scaffold Vite + React + TypeScript app (`pnpm create vite` or similar) inside repo.
- [x] Configure project tooling:
  - [x] ESLint + Prettier with TypeScript rules.
  - [x] Vitest + React Testing Library for component tests.
  - [x] pnpm workspace scripts (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`).
- [x] Establish folder structure:
  - `src/components/`, `src/hooks/`, `src/styles/`, `src/lib/`.
  - `src/data/` for static JSON describing skin/hair options.
- [x] Add global design tokens (CSS variables or Tailwind config) to support consistent theming and accessible contrast.
- [x] Document setup in `README.md` (install, dev server, test commands).

## Phase 1: Static Guided Intake Wizard

### User Flow Requirements
1. Landing view with hero section and “Start Personalization” CTA.
2. Skin type selection view showing all available skin types (multi-select allowed).
3. Skin concerns view with toggle buttons (multi-select).
4. Skin improvement goals view (multi-select).
5. Hair type view (multi-select).
6. Hair concerns view (multi-select).
7. Hair improvement goals view (multi-select).
8. Final summary/confirmation screen displaying aggregated selections and a reset/restart option.

### Implementation Tasks
- [ ] **State management**
  - [ ] Define TypeScript interfaces for skin/hair traits (`SkinType`, `Concern`, `Improvement`, etc.).
  - [ ] Implement a reducer or Zustand hook to manage selections, supporting multi-select and step transitions.
  - [ ] Persist wizard progress in memory (optional: localStorage to retain between refreshes).
- [ ] **Data modeling**
  - [ ] Create static JSON arrays in `src/data/skin.ts` and `src/data/hair.ts` enumerating types, concerns, improvements with human-readable labels, IDs, and optional descriptions.
- [ ] **UI components**
  - [ ] `StartScreen` component with hero copy, CTA, and subtle animation prompting engagement.
  - [ ] Reusable `TraitButton`/`ToggleChip` component with active/inactive styling and accessibility attributes (`aria-pressed`, keyboard controls).
  - [ ] `StepHeader` showing current step, total steps, and optional progress indicator.
  - [ ] `SelectionGrid` layouts for presenting traits responsively (stack on mobile).
  - [ ] `SummaryPanel` to review choices, provide copy (“You told us your skin is…”), and offer “Start Over” CTA.
- [ ] **Navigation logic**
  - [ ] Implement a step controller that advances only when at least one choice is made (configurable for multi-select).
  - [ ] Provide Back and Next buttons (except on first/last steps).
  - [ ] Animate transitions between steps (CSS transitions or Framer Motion optional).
- [ ] **Styling & UX**
  - [ ] Create cohesive visual language inspired by modern beauty apps (color palette, typography, spacing).
  - [ ] Ensure components meet WCAG AA for text/buttons.
  - [ ] Include responsive breakpoints (mobile-first design).
- [ ] **Results preview (optional)**
  - [ ] Create placeholder recommendation panel with static copy referencing selections (no API calls yet).

### Testing & QA
- [ ] Unit tests for reducer/state hook verifying toggle logic and reset behavior.
- [ ] Component tests for:
  - [ ] Step rendering and button toggling.
  - [ ] Step progression when selection criteria met.
  - [ ] Summary view reflecting chosen traits.
- [ ] Accessibility smoke test: ensure keyboard navigation works across buttons and steps (can be manual for Phase 1).

## Future Phases (Preview)
- **Phase 2**: Introduce persistent storage (Prisma + Postgres) and enriched recommendation rules.
- **Phase 3**: Integrate LLM-backed narrative recommendations and dynamic product sourcing.
- **Phase 4**: Add user accounts, saved routines, and A/B tested personalization flows.

## Risks & Mitigations
- **Trait taxonomy drift**: Document the static data structure and plan migration strategy before connecting to live data sources.
- **UI complexity creep**: Lock Phase 1 scope to wizard + summary; defer product carousels until recommendations exist.
- **Accessibility debt**: Build with semantic elements and keyboard-first testing from the outset.

## Success Criteria

### Automated Verification
- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm test` (includes reducer and component tests)
- [x] `pnpm build`

### Manual Verification
- [ ] On mobile and desktop, user can start personalization, complete each step, and see a summary without errors.
- [ ] Buttons reflect selected/unselected states with clear visual feedback and remain keyboard accessible.
- [ ] Summary accurately lists all chosen skin/hair traits and offers a restart option.
- [ ] No external network calls or database writes occur during the flow (verified via dev tools).
