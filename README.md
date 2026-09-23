# CollabCode AI - Full-Stack Developer Collaboration Platform

CollabCode is a full-stack developer collaboration platform designed to help developers discover projects, build teams, manage project applications, and leverage AI insights.

---

## Technical Concept Implementations

### 1. SQL JOINs (PostgreSQL & Prisma)

The platform utilizes PostgreSQL relational models and foreign key constraints defined in both `client/prisma/schema.prisma` and `server/prisma/schema.prisma`. 

Raw PostgreSQL SQL JOIN queries are implemented in `server/src/sql-joins/sql-joins.service.ts` using Prisma `$queryRaw`:

- **INNER JOIN**: Combines projects and owner user accounts (`Project INNER JOIN User ON p.ownerId = u.id`).
  - Endpoint: `GET /sql-joins/inner-join`
- **LEFT JOIN**: Fetches all users along with optional profile details (`User LEFT JOIN Profile ON u.id = pr.userId`).
  - Endpoint: `GET /sql-joins/left-join`
- **RIGHT JOIN**: Fetches applications right-joined with target projects (`Application RIGHT JOIN Project ON a.projectId = p.id`).
  - Endpoint: `GET /sql-joins/right-join`
- **FULL OUTER JOIN**: Merges users and applications, returning NULL for unmatched sides (`User FULL OUTER JOIN Application ON u.id = a.applicantId`).
  - Endpoint: `GET /sql-joins/full-outer-join`
- **CROSS JOIN**: Computes Cartesian product of users and skills for recommendation matrices (`User CROSS JOIN Skill`).
  - Endpoint: `GET /sql-joins/cross-join`
- **SELF JOIN**: Performs a self-join on the `User` table to match peer developers (`User u1 INNER JOIN User u2 ON u1.id <> u2.id`).
  - Endpoint: `GET /sql-joins/self-join`

---

### 2. HTTP Status Codes Used Correctly (Backend & System Design)

Every NestJS backend controller endpoint explicitly declares appropriate HTTP status code decorators from `@nestjs/common`:

| HTTP Status Code | Decorator / Exception | Usage Description |
|---|---|---|
| **200 OK** | `@HttpCode(HttpStatus.OK)` | Successful GET retrievals and PATCH updates |
| **201 Created** | `@HttpCode(HttpStatus.CREATED)` | Successful resource creation (POST /projects, /applications, /users, /skills, /ai-analyses) |
| **204 No Content** | `@HttpCode(HttpStatus.NO_CONTENT)` | Successful deletion operations (DELETE /ai-analyses/:id) |
| **400 Bad Request** | `BadRequestException` | Validation pipe failure or invalid body parameters |
| **401 Unauthorized** | `UnauthorizedException` | Missing or invalid session authentication |
| **403 Forbidden** | `ForbiddenException` | Access denied for unauthorized user actions |
| **404 Not Found** | `NotFoundException` | Resource (project, user, application) does not exist |
| **409 Conflict** | `ConflictException` | Unique constraint violation (duplicate email or application) |
| **422 Unprocessable Entity** | `UnprocessableEntityException` | Business logic domain validation failure |
| **500 Internal Error** | `InternalServerErrorException` | Unexpected operational server failure |
| **503 Unavailable** | `ServiceUnavailableException` | External AI API or PostgreSQL database connection failure |

Client API calls in `client/src/utils/apiClient.ts` explicitly inspect response HTTP status codes and provide clean user feedback.

---

### 3. JavaScript — Hoisting (Execution Engine Principles)

JavaScript hoisting is the engine behavior where variable and function declarations are moved to the top of their containing scope during compilation before code execution.

Implemented in `server/src/common/utils/hoisting-demo.ts` and `client/src/utils/jsHoisting.ts`:

- **Function Hoisting**: Function declarations are fully hoisted (declaration and body). Helper functions (`hoistedSanitizeUser`, `hoistedComputeUserPermissions`, `hoistedValidateInput`) are called prior to their line of declaration in code.
- **`var` Hoisting**: `var` declarations are hoisted and initialized to `undefined`.
- **`let` / `const` (Temporal Dead Zone - TDZ)**: `let` and `const` declarations are hoisted into block scope TDZ and throw `ReferenceError` if accessed prior to initial evaluation.

Unit tests in `server/src/common/utils/hoisting-demo.spec.ts` verify these mechanisms.

---

## Project Architecture & Layout

```
Collabcode AI/
├── client/                     # React + TypeScript Frontend
│   ├── prisma/
│   │   └── schema.prisma       # Synchronized PostgreSQL relational schema
│   └── src/
│       ├── utils/
│       │   ├── apiClient.ts    # Centralized HTTP status code handler
│       │   └── jsHoisting.ts   # Client JS hoisting utilities
├── server/                     # NestJS Backend
│   ├── prisma/
│   │   └── schema.prisma       # PostgreSQL relational database schema
│   └── src/
│       ├── sql-joins/          # SQL JOINs module ($queryRaw Postgres queries)
│       └── common/utils/       # JS Hoisting demonstration module & Jest specs
├── HLD.md                      # High-Level Design document
├── lld.md                      # Low-Level Design document
├── PRD.md                      # Product Requirements Document
└── README.md                   # Project documentation
```

---

## Quick Start

### 1. Server Setup
```bash
cd server
npm install
npx prisma generate
npm run build
npm test
npm start
```

### 2. Client Setup
```bash
cd client
npm install
npm run build
npm run dev
```
