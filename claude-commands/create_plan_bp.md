---
description: Rebuild face-findr as a TypeScript + React beauty recommendation tool with LLM-backed personalization
---

# Implementation Plan: face-findr Modernization

## Objectives
- Rework `face-findr` into a TypeScript-first monorepo (React front end + Node/Express or Next.js backend) that delivers interactive beauty recommendations.
- Collect and maintain fresh Sephora and Ulta product data keyed by skin and hair traits.
- Guide users through a modal-driven intake flow that captures skin tone, concerns, hair texture, and goals.
- Generate personalized product suggestions by combining deterministic filters with an LLM wrapper for ranking and narrative guidance.
- Ship a demo-ready MVP with automated validation, observability, and deployment workflows.

## Current State Assessment
- Legacy stack: static Bootstrap page with p5.js/d3.js/Plotly interactions (`face-findr/index.html:1`), plus vendored p5 bundles and custom scripts (`face-findr/js/makeuppage.js:1`, `face-findr/js/top10_price.js:1`, `face-findr/js/top10_rating.js:1`).
- Data layer powered by CSV snapshots in `face-findr/prod_data/` consolidated into `makeup_data.json` by `face-findr/app.py:1`; notebooks (`Data Load.ipynb`, `Data_Functions_fromDB.ipynb`) document prior ETL work limited to four product categories.
- Hosting handled via minimal Express server (`face-findr/server.js:1`, `face-findr/package.json:1`, `face-findr/Procfile:1`) serving the repo root; Flask script is debug-enabled and not production safe.
- Security issues: Express exposes entire repository (`express.static(__dirname)`), Flask debug mode can leak code execution, undefined Flask routes crash, and top10 rating chart for eyeliner is wired to the wrong function (`face-findr/js/top10_rating.js:248`).
- No TypeScript, component system, structured API, or LLM integration today; multi-modal intake UX must be rebuilt.

## Target Architecture
- **Frontend**: React 18 + TypeScript, Vite or Next.js, component library (Radix UI + Tailwind or Material UI). State management with React Query/Zustand. Modal-based intake flow.
- **Backend**: Node.js 20 + TypeScript using Express or Next.js API routes. GraphQL optional; REST for MVP. Prisma ORM with Postgres (Supabase or managed service).
- **Data Pipeline**: Headless scraper (Playwright + TypeScript) or Python Scrapy service feeding Postgres via ingestion jobs; schedule via GitHub Actions or lightweight Airflow.
- **LLM Layer**: Wrapper (LangChain.js or custom) interfacing with provider (OpenAI, Anthropic, or Azure). Structured prompt template, deterministic filters ahead of LLM ranking.
- **Infra**: Monorepo managed via pnpm; shared `packages/` for types and utils. Dockerized services. CI via GitHub Actions. Deployment to Vercel (frontend) + Fly.io/Render for API or to a unified Next.js setup.

## Workstreams & Milestones

### 1. Foundations & Tooling
- Scaffold monorepo (`pnpm` workspaces) with `apps/frontend`, `apps/backend`, `packages/shared`.
- Configure TypeScript project references, ESLint, Prettier, Husky + lint-staged, Jest/Vitest, Playwright.
- Set up CI (lint, typecheck, unit tests, e2e smoke) and Pre-commit hooks.

### 2. Data Acquisition & Storage
- Audit existing Sephora/Ulta CSVs (`face-findr/prod_data/*.csv`) and `makeup_data.json` to map current fields, spot gaps (limited categories, stringified numbers), and design the new domain model (products, traits, compatibility tags).
- Decide scrape strategy: refresh existing Python scrapers or rebuild using Playwright + TS. Ensure legal compliance (rate limiting, robots.txt review).
- Design Postgres schema with Prisma migrations (products, brands, ingredients, compatibility tags, availability).
- Implement ingestion pipeline: fetch (scrape/API), normalize, deduplicate, persist; include converters to replace legacy JSON generation so `app.py` can be retired.
- Build data validation tests (schema conformity, freshness thresholds, sample product counts).

### 3. Backend Services
- Define REST endpoints: `/intake/options`, `/products/recommendations`, `/ingest/status`.
- Implement deterministic filtering service based on user traits (skin type, concerns, hair texture, allergies).
- Integrate Prisma models, caching (Redis or in-memory) for frequent reads, background jobs for scraping refresh.
- Add authentication placeholder (anonymous session IDs) and rate limiting.
- Instrument logging (pino) and monitoring (OpenTelemetry + exporter).

### 4. LLM Recommendation Layer
- Select wrapper (LangChain.js or custom). Abstract provider selection via config.
- Engineer prompts combining user profile + top N filtered products; instruct LLM to select and justify best matches.
- Add guardrails: schema validation on LLM output (zod), fallback to deterministic ranking if LLM call fails.
- Implement offline evaluation harness using sample profiles to confirm quality and latency budgets.

### 5. Frontend Experience
- Create responsive layout with hero, feature explainer, and CTA to launch recommendations.
- Build multi-step modal flow: welcome → skin profile → hair profile → lifestyle/preferences → review.
- Hook to backend for trait options, submit profile, show streaming/loading state.
- Present results in cards with product imagery, ratings, purchase links, and LLM-generated rationale; allow filtering tweaks.
- Add analytics events for decision funnel, accessibility (ARIA for modals), dark/light themes optional.

### 6. Legacy Decommission & Hardening
- Replace Express static serving with a TypeScript backend/front end build output; ensure only intended public assets are exposed.
- Archive or migrate historical notebooks/media outside of deploy bundle; convert ETL notes into docs.
- Secure configuration: enforce Helmet, strict CSP, HTTPS redirects, request logging, and environment-based toggles; remove Flask debug surfaces.
- Add SAST/secret scanning (GitHub Advanced Security or gitleaks) and dependency auditing in CI.

### 7. Testing & Quality
- Unit tests: service logic, prompt builders, React components.
- Integration tests: API routes + Prisma against test DB, LLM wrapper with mocked provider.
- E2E tests: Playwright to simulate intake flow and recommendation display with mocked data.
- Load testing plan for recommendation endpoint (k6 or Artillery) once MVP stable.

### 8. Deployment & Rollout
- Dockerize backend and scraper services; configure environment variables (DB URL, LLM API keys).
- Provision managed Postgres (Supabase/Neon) and secrets management.
- Deploy frontend (Vercel) and backend (Fly.io/Render/Heroku alternative) with CI pipeline.
- Schedule recurring data refresh job; set up alerting for failures.
- Create runbook for model/provider outages, rate limit handling, and data drift.

## Deliverables
- Monorepo with documented README covering setup, scripts, env vars.
- Up-to-date Postgres schema and seed data export for demo.
- Automated scraper or ingestion workflow with monitoring.
- Fully functional React intake + recommendation UI.
- LLM prompt templates, evaluation results, fallback strategy documentation.
- CI/CD pipelines and deployment manifests.

## Risks & Mitigations
- **Scraping reliability**: Mitigate with rotating user agents, caching, respect robots, investigate first-party APIs.
- **LLM hallucinations**: Enforce schema validation, cite product data, maintain deterministic fallback.
- **Data freshness**: Implement staleness alerts and manual override scripts.
- **Compliance**: Review store terms of service; be ready to remove scraping endpoints if needed.
- **Performance**: Cache product catalog, precompute embeddings if we expand to similarity search.
- **Legacy security debt**: Track hardening tasks (static exposure, debug services) in backlog and include security regression tests in CI.

## Implementation Approach & Phase 1 Scope

### Phase 1 Goals
Deliver a working TypeScript/React intake experience backed by a minimal Node API that serves curated product recommendations from a modernized data model, with LLM integration stubbed but contract-ready.

### Key Activities
- **Monorepo bootstrap**: create `pnpm-workspace.yaml`, `package.json` in repo root, and initialize `apps/frontend`, `apps/backend`, `packages/shared` directories with baseline TS configs.
- **Frontend seed**:
  - Scaffold React app (`apps/frontend/src/`) with Vite or Next.js (decide during kickoff).
  - Create initial layout components (`App.tsx`, `components/ModalWizard.tsx`, `components/RecommendationCard.tsx`, `components/ProfileForm.tsx`).
  - Implement in-memory state for skin/hair inputs and mock recommendation results to validate UX.
- **Backend seed**:
  - Set up Express or Next.js API (`apps/backend/src/server.ts` or `apps/frontend/app/api`) exposing `/intake/options` (mocked enums) and `/products/recommendations` (returns seeded JSON pulled from legacy data).
  - Introduce Prisma schema (`packages/shared/prisma/schema.prisma`) with initial tables and generate types.
  - Write ingestion script (`apps/backend/scripts/seedFromLegacy.ts`) that transforms `face-findr/prod_data/*.csv` into the new database format.
- **Data migration**:
  - Add `data/legacy/` folder to hold original CSV/JSON (read-only) and document provenance.
  - Create TypeScript transformer utilities in `packages/shared/src/legacyTransform.ts` to parse the legacy structure.
- **Testing & CI**:
  - Configure linting (`.eslintrc.cjs`), formatting (`.prettierrc`), typecheck scripts, and add initial Jest/Vitest suites covering the transformer and API pipeline.
  - Set up GitHub Actions workflow (`.github/workflows/ci.yml`) running lint/typecheck/test.
- **Security groundwork**:
  - Add Helmet and rate limiting middleware in backend scaffold.
  - Ensure environment-based config via `.env.example`, using `dotenv` in development.

### Files to Modify or Create (Phase 1)
- Remove or archive legacy entry points: `face-findr/index.html`, `face-findr/js/*.js`, `face-findr/server.js`, `face-findr/app.py` (retain in `legacy/` directory for reference).
- New root-level files: `pnpm-workspace.yaml`, root `package.json`, `.nvmrc`, `.editorconfig`, `.gitignore` updates.
- Frontend: `apps/frontend/package.json`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx`, component subdirectories, `src/styles/global.css`.
- Backend: `apps/backend/package.json`, `tsconfig.json`, `src/server.ts`, `src/routes/recommendations.ts`, `src/routes/intake.ts`, `scripts/seedFromLegacy.ts`.
- Shared: `packages/shared/package.json`, `tsconfig.json`, `src/types/index.ts`, `src/utils/legacyTransform.ts`.
- Prisma: `packages/shared/prisma/schema.prisma`, migration files under `apps/backend/prisma/migrations/`.
- DevOps: `.github/workflows/ci.yml`, `Dockerfile` (backend), `docker-compose.yml` for local Postgres, `Makefile` or `package.json` scripts orchestrating setup.
- Documentation: Update `README.md` with new setup steps, add `docs/architecture/phase1.md` summarizing decisions, and move security findings from research into `docs/security/legacy-audit.md`.

### Tooling Readiness Notes (Foundations Stage)
- Run `pnpm dlx husky install` to generate `.husky/_/husky.sh` so the existing `pre-commit` script functions; until that file exists the hook is inert.
- Add interim workspace-level `test` scripts (e.g., `vitest --version`) so the CI workflow’s `pnpm test` step passes while real tests are still under construction.
- Align formatting config by removing `*.md` from either `.prettierignore` or `.lintstagedrc` to avoid conflicting rules during this phase.
- If `eslint-plugin-prettier` is not being leveraged, drop it from the root devDependencies to keep the foundation lean; reintroduce later if desired.
- Replace `rm -rf` commands in package `clean` scripts with a cross-platform utility (`rimraf` or `del-cli`) to prevent failures on Windows contributors as the team ramps up.

## What We Are Not Doing
- Mobile-native apps (web-first responsive design only).
- Fine-tuning custom LLMs; relying on hosted models.
- Expanding beyond beauty products or additional retailers in initial release.
- Building user accounts or payment flows at this stage.

## Success Criteria

### Automated Verification
- [ ] `pnpm lint` passes (ESLint + Prettier check).
- [ ] `pnpm typecheck` succeeds for all packages.
- [ ] `pnpm test` (unit + integration) green with mocked LLM provider.
- [ ] `pnpm e2e` Playwright scenario completes against seeded test DB.
- [ ] Scheduled ingestion workflow completes in CI runner without errors.

### Manual Verification
- [ ] Intake modal flow captures skin and hair traits intuitively on desktop and mobile breakpoints.
- [ ] Recommendations list reflects both deterministic filters and LLM narrative; fallback messaging works when LLM disabled.
- [ ] Product links resolve to correct Sephora/Ulta pages with accurate metadata.
- [ ] Monitoring dashboard shows key metrics (ingestion status, recommendation latency).
- [ ] Stakeholder walkthrough validates UX copy, tone, and personalization quality.
