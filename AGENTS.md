# AGENTS.md — Build Standards & Conventions

This file defines the non-negotiable standards for every project in this repository.
All code generated, reviewed, or modified must conform to these rules without exception.

---

## Architecture

- **Atomic files always.** Every file does one thing. No monolithic files under any circumstances.
- **Separation of concerns.** UI, logic, data, and configuration live in separate files and folders.
- **Modular structure.** Build for reuse. If something is used twice, it becomes its own module.
- **No dead code.** Remove unused imports, variables, functions, and commented-out blocks before committing.
- **Flat over nested** where possible. Deep nesting is a signal to refactor.

---

## File & Folder Structure

Every project follows this base structure — adapt per stack but maintain the pattern:

```
project-name/
├── src/
│   ├── components/       # UI components (frontend)
│   ├── services/         # Business logic, API calls
│   ├── models/           # Data models / schemas
│   ├── utils/            # Reusable helper functions
│   ├── config/           # App configuration (no secrets)
│   └── main entry file
├── tests/                # All test files mirror src structure
├── .env.example          # Template showing required env vars (no values)
├── .gitignore            # Always includes .env, venv, node_modules
├── README.md             # Required on every project
└── package.json          # Always kept current
```

---

## Security

- **No keys, tokens, secrets, or credentials in any file. Ever.**
- All secrets live in environment variables only.
- `.env` is always in `.gitignore` before the first commit.

---

## GitHub Repo Description & Topics Standards

- Every project repository must have an official GitHub repository description and relevant topics set via `gh repo edit` upon creation.
- Repository description: A clear 1-sentence summary of the application's core purpose.
- Repository topics: 4 to 8 relevant tech stack and domain tags.
