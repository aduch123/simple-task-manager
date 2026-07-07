<div align="center">

# 📋 Task Manager API

### A production-ready REST API for secure task management with authentication and authorization.

<p>

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

</p>

Secure • Fast • Scalable • Type Safe

</div>

---

# ✨ Features

## 🔐 Authentication & Authorization

- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Per-user resource authorization

---

## 📋 Task Management

- Create tasks
- Read tasks
- Update tasks
- Delete tasks
- User-specific task ownership

---

## ✅ Validation

- Request validation using **Zod**
- Typed request parsing
- Friendly validation errors

---

## 🗄 Database

- PostgreSQL
- Prisma ORM v7
- Driver adapter architecture
- Type-safe queries
- Database migrations

---

## 🧪 Testing

- Unit tests
- Controller tests
- Service tests
- Vitest

---

## 🚦 Error Handling

- Global error middleware
- Consistent API responses
- Custom error classes

---

## 🔒 Security

- Helmet
- CORS
- Rate Limiting
- Environment validation
- Password hashing
- JWT authentication

---

## 🎨 Developer Experience

- TypeScript
- ESLint
- Prettier
- Husky Git hooks
- Hot reload
- Structured logging with Pino

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js 20+ | JavaScript Runtime |
| Express | REST API Framework |
| TypeScript | Type Safety |
| Prisma ORM | Database ORM |
| PostgreSQL | Database |
| Zod | Validation |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Pino | Logging |
| Vitest | Testing |
| Docker Compose | PostgreSQL Container |
| ESLint + Prettier | Code Quality |

---

# 📁 Project Structure

```text
src
├── config
│   ├── db.ts
│   └── env.ts
│
├── constants
│   └── http.ts
│
├── controllers
│   ├── auth.controller.ts
│   └── task.controller.ts
│
├── middlewares
│   ├── auth.ts
│   ├── error.ts
│   ├── validate.ts
│   └── rateLimiter.ts
│
├── routes
│   ├── auth.routes.ts
│   └── task.routes.ts
│
├── schemas
│
├── services
│
├── types
│
└── utils
    ├── ApiError.ts
    ├── ApiResponse.ts
    ├── asyncHandler.ts
    ├── jwt.ts
    └── logger.ts

tests
├── controllers
└── services

prisma
├── schema.prisma
└── migrations
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js **v20+**
- npm **v10+**
- Docker

---

## Clone Repository

```bash
git clone <repository-url>
cd simple-task-manager
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment

Copy the example file.

```bash
cp .env.example .env
```

Example configuration:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://postgres:postgres@localhost:5433/mydb?schema=public"

JWT_SECRET="your-super-secret-key"

JWT_EXPIRES_IN="7d"

BCRYPT_SALT_ROUNDS=10
```

> The database runs on port **5433** to avoid conflicts with local PostgreSQL installations.

---

## Start PostgreSQL

```bash
docker compose up -d
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Run Database Migrations

```bash
npx prisma migrate dev --name init
```

---

## Start Development Server

```bash
npm run dev
```

Server:

```
http://localhost:3000/api/v1
```

---

# 🧪 Running Tests

Run every test:

```bash
npm test
```

Run a single suite:

```bash
npm test tests/services/auth.service.test.ts

npm test tests/controllers/task.controller.test.ts
```

---

# 📚 API

Base URL

```
/api/v1
```

---

# Authentication

| Method | Endpoint | Description |
|----------|----------|------------|
| POST | /auth/signup | Register user |
| POST | /auth/login | Login user |

### Signup

```http
POST /auth/signup
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### Login

```http
POST /auth/login
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### Success Response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com"
    },
    "token": "JWT_TOKEN"
  }
}
```

---

# Tasks

Every endpoint requires:

```
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Description |
|----------|----------|------------|
| GET | /tasks | Get all tasks |
| GET | /tasks/:id | Get task |
| POST | /tasks | Create task |
| PUT | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |

---

### Example Create Task

```json
{
  "title": "Buy milk",
  "description": "From the grocery store",
  "status": "PENDING"
}
```

Status values:

```
PENDING
IN_PROGRESS
DONE
```

---

### Example Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Tasks fetched successfully",
  "data": [
    {
      "id": "clx123",
      "title": "Buy milk",
      "description": "From the grocery store",
      "status": "PENDING",
      "userId": "clw123",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

---

# 📜 Available Scripts

| Command | Description |
|----------|-------------|
| npm run dev | Development server |
| npm run build | Build production |
| npm run start | Start production |
| npm run lint | Run ESLint |
| npm run format | Format with Prettier |
| npm run test | Run tests |
| npm run prisma:generate | Generate Prisma Client |
| npm run prisma:migrate | Run migrations |
| npm run prisma:studio | Open Prisma Studio |

---

# 🗄 Database Schema

## User

| Field | Type |
|---------|------|
| id | CUID |
| email | Unique |
| password | Hashed |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## Task

| Field | Type |
|---------|------|
| id | CUID |
| title | String |
| description | Nullable |
| status | Enum |
| userId | Foreign Key |
| createdAt | DateTime |
| updatedAt | DateTime |

Status Enum

```
PENDING
IN_PROGRESS
DONE
```

---

# 🔧 Troubleshooting

## Docker Permission

```bash
sudo usermod -aG docker $USER
```

Then:

```bash
newgrp docker
```

---

## Prisma Client Missing

```bash
npx prisma generate
```

---

## Database Connection

Verify Docker is running.

```bash
docker ps
```

---

## Clear Vitest Cache

```bash
npx vitest --clearCache

npm test
```

---

# 🤝 Contributing

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feat/amazing-feature
```

3. Commit

```bash
git commit -m "Add amazing feature"
```

4. Push

```bash
git push origin feat/amazing-feature
```

5. Open a Pull Request

---

# 📄 License

Distributed under the MIT License.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

Happy Coding 🚀

</div>