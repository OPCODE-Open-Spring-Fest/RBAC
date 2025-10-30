# RBAC (Role Based Access Control)

Repository for OpenSpringFest (OSF)

# 🔐 RBAC Authentication System

A secure and extendable **Role-Based Access Control (RBAC)** authentication system built with **Node.js, Express, and MongoDB**.  
This project is developed and maintained under **Opcode, IIIT Bhagalpur** 🚀.

---

## 🌟 Features

- ✅ User authentication with **JWT**
- ✅ **Refresh Token mechanism** for persistent login
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

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
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

### 5️⃣ Seed the Database

Before using the application, seed the database with default roles and permissions:

```bash
node src/seed/seedRoles.js
```

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | `{username, email, fullname, password}` |
| POST | `/api/auth/login` | Login user | `{email, password}` |
| POST | `/api/auth/refresh` | Refresh access token | `{refreshToken}` |
| POST | `/api/auth/logout` | Logout user | `{refreshToken}` |

### Role Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/roles` | Get all roles | Yes |
| POST | `/api/roles` | Create new role | Yes |
| GET | `/api/roles/:id` | Get role by ID | Yes |
| PUT | `/api/roles/:id` | Update role | Yes |
| DELETE | `/api/roles/:id` | Delete role | Yes |
| PUT | `/api/roles/:id/permissions` | Assign permissions to role | Yes |

### Permission Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/permissions` | Get all permissions | Yes |
| POST | `/api/permissions` | Create new permission | Yes |
| GET | `/api/permissions/:id` | Get permission by ID | Yes |
| PUT | `/api/permissions/:id` | Update permission | Yes |
| DELETE | `/api/permissions/:id` | Delete permission | Yes |

### RBAC Test Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/rbac-test/admin-only` | Admin only access | Yes (Admin role) |
| GET | `/api/rbac-test/user-only` | User only access | Yes (User role) |

---

## 🔄 Authentication Flow

### Login Flow
1. User sends credentials to `/api/auth/login`
2. Server validates credentials
3. Server generates both access token (short-lived) and refresh token (long-lived)
4. Both tokens are returned to client

### Token Refresh Flow
1. When access token expires, client sends refresh token to `/api/auth/refresh`
2. Server validates refresh token
3. Server generates new access token
4. New access token is returned to client

### Logout Flow
1. Client sends refresh token to `/api/auth/logout`
2. Server invalidates the refresh token in database
3. Client should discard both tokens

---

## 🐳 Docker Deployment

This application can be easily deployed using Docker! See [README.Docker.md](./README.Docker.md) for detailed instructions.

### Quick Start with Docker Compose

```bash
# Copy environment variables
cp .env.example .env

# Start the application (production mode)
docker compose up -d

# Start in development mode with hot reload
docker compose --profile dev up -d app-dev

# View logs
docker compose logs -f

# Stop services
docker compose down
```

> **Note:** Use `docker compose` (v2) or `docker-compose` (v1) depending on your installation.

The Docker setup includes:

- ✅ Optimized multi-stage Dockerfile
- ✅ MongoDB database container
- ✅ Non-root user for security
- ✅ Health checks for services
- ✅ Development and production configurations
- ✅ Volume persistence for database

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
