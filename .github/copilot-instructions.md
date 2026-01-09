# GitHub Copilot / AI Agent Instructions for GhostShell Docs

Purpose: give an AI coding agent everything immediately useful to be productive in this repository — architecture, developer workflows, conventions, and concrete examples.

## Quick summary
- This repo contains the documentation frontend (Vite + React + TypeScript) that describes and ships the GhostShell Chrome extension UX and usage docs. The extension runtime itself expects a local **Python/Flask** backend (not bundled here) that executes security scripts.
- Two server roles:
  - Node static server (this repo): `client` (Vite) -> `dist/public` served by `server/index.ts` (bundled to `dist/index.js`).
  - Extension runtime server (external): `server.py` (Flask) — runs on `http://localhost:5000` by default and executes scripts like `gen_attestations.sh`.

## Important files to read first
- `client/src/pages/Home.tsx` — project-specific usage, commands, troubleshooting, and expected script names/endpoints (attestation, merkle, drift, compliance).
- `docs_content.md` — canonical docs mirrored by the site (useful to copy/paste examples and troubleshooting steps).
- `server/index.ts` — Node static server and production serving behavior.
- `vite.config.ts` — path aliases and important Vite plugins (aliases: `@` → `client/src`, `@shared` → `shared`).
- `package.json` — build/dev scripts and package manager (`pnpm` is configured).
- `Dockerfile`, `compose.yaml`/`compose.debug.yaml` — containerization and VS Code tasks.
- `patches/` — includes a patched dependency (`wouter@3.7.1`), check before upgrading that package.

## Developer workflows (concrete commands)
- Local dev (front-end):
  - Install: `pnpm install` (project uses pnpm as package manager)
  - Run dev site: `pnpm dev` (alias for `vite --host`) — Vite serves from `client` on port 3000 by default.
- Build (production site + server bundle):
  - `pnpm build` → runs `vite build` and then `esbuild server/index.ts` into `dist/`.
  - Serve production bundle: `NODE_ENV=production node dist/index.js` (or `pnpm start`).
- Quick checks:
  - Typecheck: `pnpm run check` (runs `tsc --noEmit`)
  - Format: `pnpm run format` (Prettier)
- Docker: The workspace contains tasks: `docker-build` and `docker-run` (release/debug). Use the VS Code task runner or `docker build`/`docker run` with the provided `Dockerfile`.

## Chrome extension runtime setup (local testing)
- The docs and UI assume the extension is loaded from an unpacked folder (e.g., `~/ghostshell-extension`). Files expected in that package:
  - `manifest.json`, `popup.html`, `popup.js`, `styles.css`, `server.py`.
- Start the Python backend (outside this repo):
  - `pip install flask flask-cors`
  - `python3 server.py` (server listens on `http://127.0.0.1:5000` by default)
- Ensure your scripts live next to `server.py` and are executable: `chmod +x *.sh`. Default script names are in `client/src/pages/Home.tsx` and `docs_content.md` (`gen_attestations.sh`, `verify_merkle_proof.py`, `drift_check.sh`, `gen_verification_report.sh`).
- **Flask endpoint contract** (expected by extension UI):
  - `GET /attestation` → Execute `gen_attestations.sh`, return JSON: `{"output": "script_output", "status": "success|error"}`
  - `GET /merkle` → Execute `verify_merkle_proof.py`, return JSON: `{"output": "script_output", "status": "success|error"}`
  - `GET /drift` → Execute `drift_check.sh`, return JSON: `{"output": "script_output", "status": "success|error"}`
  - `GET /compliance` → Execute `gen_verification_report.sh`, return JSON: `{"output": "script_output", "status": "success|error"}`
  - CORS headers required: `Access-Control-Allow-Origin: *`
- **Test endpoints locally**:
  ```bash
  curl http://localhost:5000/attestation
  curl http://localhost:5000/merkle
  curl http://localhost:5000/drift
  curl http://localhost:5000/compliance
  ```
- Troubleshooting tips (from docs): check browser console (F12), tail server logs, verify Flask is bound to `127.0.0.1:5000`.

## Conventions & patterns
- Imports use path aliases: `@/...` (client source) and `@shared/...` (shared code).
- UI components are in `client/src/components/ui` and are small Radix/Tailwind-based wrappers — follow their prop/name patterns when adding new controls.
- `vite-plugin-manus-runtime` is used — be careful when changing runtime behavior or env handling; envs are read from the repo root (see `vite.config.ts: envDir`).
- TypeScript: `tsconfig.json` sets `noEmit` (use `pnpm build` to emit bundles).
- Tests: `vitest` is a devDependency but there is no `test` script; add a `test` script when adding unit tests.

## Integration points & gotchas
- Two servers: Node static assets (this repo) vs Flask runtime (extension). Don't conflate ports: docs app typically runs on `3000`, Flask backend expects `5000`. The extension expects the Flask endpoints (e.g., `/attestation`) on `localhost:5000`.
- Build output: client build → `dist/public`. Server bundling step writes Node server bundle to `dist/index.js`. Production server serves static content from `dist/public`.
- Pinned/Patched dependencies: check `pnpm.patchedDependencies` and `patches/` before upgrading related packages.
- **Frontend code that triggers Flask calls**: `client/src/pages/Home.tsx` has operation definitions with `command` fields and API endpoint names. Any changes to `operations` array should match Flask endpoint routes exactly.
- **Environment assumptions**: Dev Vite runs on port 3000, Flask backend hardcoded to port 5000 in `docs_content.md` examples. Changing either port requires updates in multiple places (docs, Home.tsx, Flask server config).

## When to open a PR vs local edit notes
- Small UI tweaks and documentation fixes: branch, update `client` files and `docs_content.md`, and include preview steps in PR description.
- Larger changes (routing, major dependency upgrades): run a full `pnpm build`, verify `dist/` output and the server (`NODE_ENV=production node dist/index.js`), and mention any patched dependency changes.

## Example tasks to ask the repo owner about (if unclear)
- Do you want the Python `server.py` to be tracked in this repo or intentionally kept external? (Docs imply it can be generated; confirm preferred workflow.)
- Are there canonical test fixtures for the extension scripts to enable automated tests for the Flask endpoints?

## Build notes & local test server stub
- Build warnings observed locally: `%VITE_ANALYTICS_ENDPOINT%` and `%VITE_ANALYTICS_WEBSITE_ID%` are referenced in `index.html`. If you use analytics, set these via environment or a `.env` in the repo root (Vite reads envs from `envDir`). If you do not use analytics, it's safe to leave them undefined during development.
- Bundle size: Some chunks exceeded 500KB after minification during the production build. Recommended options: use dynamic `import()` to code-split large dependencies, or configure `build.rollupOptions.output.manualChunks` to split heavy libraries.
- Local test server stub (optional): A minimal Flask server is included at `extension/server.py`. It implements the documented endpoints (`/attestation`, `/merkle`, `/drift`, `/compliance`), returns JSON `{"output":..., "status":"success|error"}`, and sets CORS headers. Placeholder scripts live in `extension/scripts/`. Run the server with `python3 extension/server.py` and test with `bash tests/integration.sh`.
- Security note: The included test server binds to `127.0.0.1:5000`. It's intended for local development only — **do not** expose it to the internet.

---
If you'd like, I can open a PR adding this file (or update an existing `.github/copilot-instructions.md` if you prefer a different tone or additional details). What should I add or emphasize next?