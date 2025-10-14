# Contributing to RBAC Authentication System

Thank you for your interest in contributing to **Opcode (Op) – RBAC Authentication System**! 🚀  

We welcome contributions from the OPCode Community. This guide will help you get started, follow best practices, and ensure your PRs are accepted smoothly.
---
## 1️⃣ Setting Up the Development Environment

1. **Clone the repository**
```bash
git clone https://github.com/<your-org>/rbac-auth.git
cd rbac-auth
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the project root (you can copy `.env.example`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rbac
JWT_SECRET=your-secret-key
```

4. **Run the project**
```bash
npm run dev
```

5. **Run tests**
```bash
npm test
```

6. **Run the linter**
```bash
npm run lint
```

## 2️⃣ Branching Strategy

Use clear and consistent branch names:
- `feature/` – New feature
- `fix/` – Bug fixes
- `docs/` – Documentation changes

Example:
```bash
git checkout -b feature/role-permission-api
```

## 3️⃣ Commit Message Format

Follow Conventional Commits:
```
<type>(<scope>): <subject>
```

Types:
- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation
- `style`: formatting, linting, missing semi-colons
- `refactor`: code change without adding feature or fixing bug
- `test`: adding tests
- `chore`: maintenance tasks

Example:
```
feat(roles): add assign-permissions endpoint
fix(auth): handle invalid JWT token errors
docs(contributing): add CONTRIBUTING.md guide
```

## 4️⃣ Development Workflow

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/<feature-name>`
3. Make your changes and commit them using the commit message format above.
4. Push your branch: `git push origin feature/<feature-name>`
5. Open a Pull Request (PR) against `main`.

## 5️⃣ Running Tests & Linter

Run unit & integration tests:
```bash
npm test
```

Check code formatting & linting:
```bash
npm run lint
```

Ensure all tests pass and linter shows no errors before opening a PR.

## 6️⃣ Pull Request Process

- PRs should be small and focused.
- Include a clear title and description.
- Reference the issue number (if applicable).
- PR will be reviewed by maintainers for:
  - Functionality
  - Code quality & readability
  - Tests & linter compliance
- Address review comments promptly.

## 7️⃣ Labels & Tags

- `documentation` – Docs improvements
- `good first issue` – Simple tasks for new contributors
- `feature` – New functionality
- `bug` – Bug fixes

## 8️⃣ Contribution Hints

- Hash passwords before storing 🔒
- Use JWT for stateless authentication 🔑
- Keep RBAC logic centralized in middlewares 🛂
- Keep business logic in services, not controllers 🧩
- Write meaningful commit messages 📚

