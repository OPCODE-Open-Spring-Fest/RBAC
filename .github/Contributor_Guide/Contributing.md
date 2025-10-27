# Contributing to RBAC

Thank you for taking the time to contribute to **RBAC**! 🎉  
We appreciate your interest and contributions — whether it's fixing bugs, improving documentation, or adding new features.  

Before contributing, please make sure to read our [Code of Conduct](../../CODE_OF_CONDUCT.md).  
We expect all contributors to uphold it in all interactions related to this project.  

---

## 🧭 New to RBAC?

If you’re new here, start by exploring our [Project Tour](./Project_Tour.md) for an overview of the architecture, setup, and modules.  
To understand the code structure, check out the [README.md](../src/README.md) file inside the `src` directory.

---

## 💡 Ways to Contribute

There are many ways you can help make RBAC better!

### 🐞 Reporting Bugs
If you find a bug or an unexpected behavior:
1. Check existing [Issues](../../issues) to see if it’s already reported.  
2. If not, [submit a new bug report](../ISSUE_TEMPLATE/bug_report.yaml).  
3. Include clear steps to reproduce, expected vs actual behavior, and screenshots if relevant.

---

### 🚀 Suggesting Enhancements
Have an idea to improve RBAC? We’d love to hear it!  
- Submit a [Feature Request](../ISSUE_TEMPLATE/feature_request.yaml).  
- Describe the motivation, proposed solution, and any possible alternatives.  

---

### 🧑‍💻 Submitting a Pull Request (PR)

We welcome pull requests for fixes, features, and docs improvements.  

#### 🔄 Fork & Clone
1. Fork the repository:  
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/RBAC.git
   cd RBAC
   ```
2. Create a new branch for your feature or fix:  
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### 🧩 Make Your Changes
- Follow existing code style and conventions.  
- Add comments and documentation where needed.  
- Test your changes before committing.  

#### 🧾 Commit Your Changes
Use **conventional commit messages** (for example):
```
fix: resolve login redirect bug
docs: update API setup instructions
feat: add JWT-based role validation middleware
```

#### 📬 Push and Create a PR
Push your branch and open a pull request using the following URL:  
```
https://github.com/OPCODE-Open-Spring-Fest/RBAC/compare/main...YOUR_GITHUB_USERNAME:RBAC:BRANCH?quick_pull=1&template=pr.md
```

Your PR should:
- Clearly describe the changes.
- Reference related issues (e.g., “Closes #23”).
- Include screenshots or logs if relevant.

---

## ⚙️ Local Setup

To set up the project locally:

```bash
git clone https://github.com/OPCODE-Open-Spring-Fest/RBAC.git
cd RBAC
npm install
npm run dev
```

> 💡 Ensure Node.js and npm are installed before running the project.

---

## ✅ Code Guidelines

- Follow **ESLint** rules configured in the project.
- Write meaningful commit messages and pull request titles.
- Keep PRs focused — one purpose per PR.
- Update or add relevant documentation when changing code.

---

## 🧪 Testing

Run the test suite before submitting your PR:

```bash
npm test
```

If you add new functionality, include corresponding unit tests.

---

## 🧱 Branch Naming Convention

Please follow this format for branch names:
- `feat/<feature-name>` – for new features  
- `fix/<bug-name>` – for bug fixes  
- `docs/<file-update>` – for documentation  
- `refactor/<component>` – for refactoring  

Example:
```
feat/add-role-based-access
fix/login-redirect-error
docs/update-readme
```

---

## 🙌 Need Help?

If you’re stuck or need clarification:
- Open a **discussion** in the [GitHub Discussions](../../discussions) tab.
- Or ask in the issue thread related to your contribution.

---

## 💬 Attribution

This project follows open-source best practices.  
Inspired by contributing guides from [Contributor Covenant](https://www.contributor-covenant.org/) and [GitHub Docs](https://docs.github.com/en/get-started/quickstart/contributing-to-projects).
