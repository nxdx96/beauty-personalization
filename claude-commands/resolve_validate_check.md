---
description: Playbook for resolving validation gaps raised by /validate_plan on create_plan_bp.md
---

# Resolve Validation Gaps for `create_plan_bp.md`

This document captures the outstanding issues reported by `/validate_plan` and outlines the step-by-step actions required to close them. Follow the phases below in order. Pause whenever user input or confirmation is needed, then resume from the next unchecked item.

## 1. Summary of Current Validation Findings

As of the latest `/validate_plan` run:

- **ESLint configuration missing** � `pnpm lint` fails because `@typescript-eslint/recommended` cannot be resolved in `apps/backend` and `packages/shared`.
- **TypeScript errors** � `pnpm typecheck` fails due to unresolved workspace imports, null handling in the product cache, implicit `any` usages, and missing type declarations for `cors`.
- **Vitest configuration broken** � `pnpm test` fails because `vitest.config.ts` included escaped newlines and could not be parsed; shared tests therefore did not run.
- **Seed script unresolved** � `pnpm --filter @beauty-personalization/backend seed:legacy` failed to import `@beauty-personalization/shared`.
- **Placeholder commands** � `pnpm e2e` was undefined; CI expectations needed either a stub command or an update to the plan.
- **Manual verification pending** � UI/UX checks for the wizard and security review have not been performed.

## 2. Remediation Steps

Work through these fixes sequentially. Mark each checkbox when complete.

### 2.1 ESLint Setup

- [x] Add `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` as dependencies in each package that runs lint (root already has them; ensure workspace packages inherit or reference correctly).
- [x] Confirm `.eslintrc.cjs` is accessible to workspaces (verify `root: true` plus proper package-level config).
- [x] Re-run `pnpm lint` and ensure ESLint executes in every package without configuration errors.

### 2.2 TypeScript Configuration

- [x] Configure workspace resolution so `@beauty-personalization/shared` is reachable from backend scripts (paths mapping plus adjusted `tsconfig` settings).
- [x] Update `apps/backend/src/data/products.ts` to guarantee non-null caching and typed callbacks (default collections, explicit parameter types).
- [x] Install `@types/cors` (or add a declaration) to satisfy the backend import.
- [x] Run `pnpm typecheck` and confirm no TypeScript errors remain.

### 2.3 Testing Configuration

- [x] Rewrite `vitest.config.ts` using real newlines instead of escaped characters.
- [x] Ensure `packages/shared/package.json` can be consumed by Vitest (via path mapping and updated scripts).
- [x] Run `pnpm --filter @beauty-personalization/shared test` (or `pnpm test`) and confirm Vitest completes successfully.
- [ ] Decide on broader test coverage (e.g., React Testing Library) and note follow-ups if beyond current scope.

### 2.4 Seed Script & Data Flow

- [x] Adjust `apps/backend/scripts/seedFromLegacy.ts` to resolve the shared package (after paths/build fix).
- [x] Re-run `pnpm --filter @beauty-personalization/backend seed:legacy` and confirm `data/processed/products.json` is generated without errors.
- [ ] Document any additional ingestion steps if the workflow evolves.

### 2.5 Automation Expectations

- [x] Provide an interim `pnpm e2e` command (even a stub that exits 0 with a TODO) or update `create_plan_bp.md` to clarify that e2e tests are planned for future phases.
- [x] Re-run the full automated suite (`pnpm lint`, `pnpm typecheck`, `pnpm test`, seed script command) and ensure all succeed.

### 2.6 Manual Verification

- [ ] Launch the dev servers (`pnpm dev` in the root or separate frontend/backend commands).
- [ ] Walk through the modal wizard, verifying:
  - Step navigation (skin -> hair -> summary) on desktop and mobile viewport.
  - Recommendation results appear when the backend is seeded.
  - Accessibility basics (focus trapping, ARIA labels, keyboard navigation).
- [ ] Verify rate limiting and Helmet headers via HTTP inspection.
- [ ] Record any UX or accessibility follow-ups for the next iteration.

## 3. Coordination Guidance

- If user decisions are needed (e.g., how to structure path mapping, whether to add stub commands, or how to approach e2e coverage), pause and request input. Continue once answers are received.
- Track any deviations from the original plan and update `create_plan_bp.md` (or the plan's "Next Steps") accordingly.

## 4. Completion Checklist

Before re-running `/validate_plan`, confirm:

- [x] All automated commands succeed without errors.
- [ ] Manual verification steps are complete or appropriately delegated.
- [ ] `create_plan_bp.md` reflects any changes in scope or tooling decisions.
- [ ] Commits are prepared (if applicable) and clean.

Once all boxes are checked, rerun `/validate_plan` to ensure the report comes back green.
