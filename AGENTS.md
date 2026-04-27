# AGENTS.md

## Project Guardrails

This repository is for Bếp An Tâm, a Vietnamese food-management product. Coding agents must follow these project rules unless the user explicitly says otherwise.

## Frontend

- The frontend is a Next.js/React.js application in `apps/web`.
- Prefer TypeScript, Tailwind CSS, and shadcn/ui patterns for frontend work.
- Follow Next.js App Router conventions when adding routes, layouts, loading states, metadata, or server/client component boundaries.
- Do not call backend APIs directly from React components. Use a service/API layer instead.
- Do not rewrite the whole project when the requested change only requires frontend edits.

## Backend Contract

- Always follow the frontend-backend contract.
- Check existing DTOs, schemas, and shared contracts before adding or changing fields.
- Do not invent fields when the backend already has a DTO/schema/contract.
- If the backend returns food status, the frontend must only render that status.
- If the backend does not yet return food status, the frontend may use a temporary rule engine, but the code must include a clear TODO explaining that the status should come from the backend contract later.

## Copywriting

- Write user-facing copy in friendly Vietnamese.
- Do not overclaim food safety.
- Do not write "thực phẩm đã hỏng".
- Do not write "chắc chắn an toàn".
- Prefer careful wording such as "nên kiểm tra", "khuyến nghị tham chiếu", and "nên dùng sớm" when describing food status.

## Validation

- Always run available validation commands after code changes when the relevant `package.json` defines them.
- Prefer running `lint`, `typecheck`, and `build` scripts when present.
- If a script is missing, say so in the final response instead of pretending it ran.

## Scope Boundaries

- Do not edit backend, database, migrations, authentication, deployment, Docker, or CI configuration unless the user explicitly requests it or the frontend change truly requires it.
- Keep edits small and aligned with the existing monorepo structure.
