<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KELIAA — zone auth gelée

Inscription / Google / connexion = **chemin critique**. Voir :

- `.cursor/rules/auth-critical.mdc`
- `docs/AUTH_FROZEN.md`

**Sans** `AUTH UNLOCK` dans la demande utilisateur : ne pas modifier les fichiers listés dans la règle auth-critical. Les autres features (paiements, ops, etc.) ne doivent jamais casser ce flux. Après changement auth : `npm run test:smoke` + test manuel www.keliaa.org/register.
