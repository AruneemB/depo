# depo

**Bulk GitHub repository deletion, done cleanly.**

---

GitHub has no native bulk-deletion interface. Removing 20+ repositories manually means navigating to each repo's settings, scrolling to the danger zone, and typing the full name — one by one. Depo eliminates that friction: sign in, select, confirm, delete.

Depo supports two modes: **delete in-app** (the browser calls the GitHub API directly) or **generate a `gh`/`curl` command** you can run locally without trusting the app with your token. Either way, nothing happens until you type an explicit count-based confirmation.

---

## Quick Start

> For GitHub OAuth App setup and environment variables, see [Getting Started](docs/GETTING-STARTED.md).

```bash
git clone https://github.com/AruneemB/depo.git
cd depo
npm install
cp .env.example .env.local
# Fill in GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SESSION_SECRET, NEXT_PUBLIC_APP_URL
npm run dev
```

---

## Documentation

| Guide | Description |
| ----- | ----------- |
| [Getting Started](docs/GETTING-STARTED.md) | GitHub OAuth App setup, environment variables, local dev, Vercel deployment |
| [Architecture](docs/ARCHITECTURE.md) | Request flow, pages, API routes, session strategy, tech stack, project structure |
| [API Reference](docs/API.md) | All four API routes — request/response shapes, auth, error codes |
| [Components](docs/COMPONENTS.md) | React components and library utilities — props, state, behaviors |
| [Security](docs/SECURITY.md) | Token storage, CSRF protection, scope rationale, rate limiting |
| [Development](docs/DEVELOPMENT.md) | Testing (Jest + Playwright), linting, type checking, mock patterns |
| [Roadmap](docs/ROADMAP.md) | v1 scope, non-goals, and future enhancements |

---

*One tool, one job: clear the clutter.*
