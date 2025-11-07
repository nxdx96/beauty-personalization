# Beauty Personalization

Modern React + TypeScript workspace powering the Beauty Personalization intake wizard. Phase 0 focuses on tooling and project scaffolding so we can quickly iterate on the guided skin and hair questionnaire planned in `claude-commands/create_beauty_plan.md`.

## Getting Started

```bash
pnpm install
pnpm dev            # runs Vite dev server from apps/frontend
```

## Workspace Scripts

- `pnpm lint` - ESLint with TypeScript + React rules.
- `pnpm typecheck` - TypeScript compiler in no-emit mode.
- `pnpm test` - Vitest + Testing Library.
- `pnpm build` - TypeScript build followed by Vite production bundle.

All commands are defined in the workspace root `package.json` and delegate to the `apps/frontend` package.
