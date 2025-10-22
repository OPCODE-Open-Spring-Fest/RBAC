# RBAC (Role Based Access Control)

Repository for OpenSpringFest (OSF)

# 🔐 RBAC Authentication System

A secure and extendable **Role-Based Access Control (RBAC)** authentication system built with **Node.js, Express, and MongoDB**.  
This project is developed and maintained under **Opcode, IIIT Bhagalpur** 🚀.

---

## 🌟 Features

- ✅ User authentication with **JWT**
- ✅ Secure password hashing (**bcrypt**)
- ✅ Role-based access (Admin, User, Moderator, etc.)
- ✅ Permission-based middleware for fine-grained access
- ✅ Modular project structure for scalability
- ✅ Ready for extension & contribution by the community

---

## 📂 Project Structure

```
rbac-auth/
├── src/
│ ├── config/ # DB & environment configs
│ ├── controllers/ # Request handlers
│ ├── middlewares/ # Auth & RBAC middlewares
│ ├── models/ # MongoDB schemas (User, Role, Permission)
│ ├── routes/ # API routes
│ ├── services/ # Business logic (auth, role mgmt)
│ ├── utils/ # Helper functions
│ └── index.js # Entry point
├── tests/ # Unit & integration tests
├── .env.example # Sample environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-org>/rbac-auth.git
cd rbac-auth
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Setup Environment

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rbac
JWT_SECRET=your-secret-key
RESEND_API_KEY=your-resend-api-key

🔑 Note: The RESEND_API_KEY can be obtained by creating an account on Resend Mail
 and generating an API key.
```

### 4️⃣ Run the Project

```
npm run dev
```

---

### 🔄 System Flows

🔑 Authentication Flow

User signs up → password hashed → stored in DB

User logs in → JWT issued

JWT validated for protected routes

RBAC middleware checks user role/permission

### 🛂 Role & Permission Flow

Admin can create roles and assign permissions

Users get assigned roles

Middleware checks role/permission before accessing API

---

### 🛠 Contribution Guide

We ❤️ contributions! Follow these steps to get started:

Fork the repository

Create a branch (feature/auth-flow, fix/bug-x)

Commit changes (use clear, descriptive messages)

Push your branch

Open a Pull Request 🚀

### ✅ Contribution Hints

Keep PRs small & focused

Follow coding style (ESLint + Prettier recommended)

Add tests when introducing new features

Use issues to discuss before large changes

---

### 📌 Hints for Contributors

🔒 Always hash passwords before storing

🔑 Use JWT for stateless authentication

🛂 Centralize RBAC logic in middlewares

🧩 Keep business logic in services, not controllers

📚 Write meaningful commit messages

---

🤝 Community

This project is part of Opcode, IIIT Bhagalpur.
Maintainers will review PRs, suggest changes, and merge contributions.
Use Issues to report bugs or suggest features.

📜 License

This project is licensed under the MIT License.
You’re free to use, modify, and distribute this project with attribution.
