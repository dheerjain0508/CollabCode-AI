CollabCode - Low-Level Design (LLD)

1. Frontend Structure

client/src/
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── Projects.tsx
│   ├── ProjectDetails.tsx
│   ├── CreateProject.tsx
│   └── AiAssistant.tsx
├── components/
├── utils/
│   ├── jsHoisting.ts          # JavaScript Hoisting principles & utilities
│   └── apiClient.ts           # Centralized API fetch wrapper for HTTP status codes
├── App.tsx
├── main.tsx
└── App.css

client/prisma/
└── schema.prisma              # Synchronized PostgreSQL relational schema with SQL JOIN annotations

2. Backend Structure

server/src/
├── users/
├── projects/
├── applications/
├── skills/
├── sql-joins/
│   ├── sql-joins.controller.ts # REST controller for SQL JOIN endpoints
│   ├── sql-joins.service.ts    # Service executing raw Postgres SQL JOIN queries via Prisma $queryRaw
│   └── sql-joins.module.ts
├── common/
│   └── utils/
│       ├── hoisting-demo.ts    # JS Hoisting demonstration module (Function & var hoisting, TDZ)
│       └── hoisting-demo.spec.ts
├── ai-assistant/
├── ai-analyses/
│   └── schemas/
├── notifications/
│   └── notifications.gateway.ts
├── auth/
├── app.module.ts
└── main.ts

server/prisma/
└── schema.prisma              # PostgreSQL schema with full relational models & JOIN docstrings

3. PostgreSQL Relational Schema & SQL JOIN Specifications

Schema Definitions (client/prisma/schema.prisma & server/prisma/schema.prisma):
- User (id, email, name, createdAt, updatedAt)
- Profile (id, userId FK -> User.id) -> 1:1 relation for LEFT JOIN
- Skill (id, name)
- UserSkill (userId FK, skillId FK) -> Many-to-Many JOIN table
- Project (id, title, description, category, teamSize, status, ownerId FK -> User.id) -> 1:N INNER JOIN
- ProjectSkill (projectId FK, skillId FK) -> Many-to-Many JOIN table
- Application (id, message, status, applicantId FK -> User.id, projectId FK -> Project.id) -> 1:N JOIN
- ProjectMember (projectId FK, userId FK) -> Many-to-Many JOIN table

Raw SQL JOIN Query Implementations ($queryRaw):

1. INNER JOIN (Projects & Owners):
   SELECT p.id, p.title, p.status, u.id, u.name, u.email
   FROM "Project" p INNER JOIN "User" u ON p."ownerId" = u.id;

2. LEFT JOIN (Users & Profiles):
   SELECT u.id, u.email, u.name, pr.bio, pr."experienceLevel"
   FROM "User" u LEFT JOIN "Profile" pr ON u.id = pr."userId";

3. RIGHT JOIN (Applications & Projects):
   SELECT p.id, p.title, a.id, a.status
   FROM "Application" a RIGHT JOIN "Project" p ON a."projectId" = p.id;

4. FULL OUTER JOIN (Users & Applications):
   SELECT u.id, u.email, a.id, a.status
   FROM "User" u FULL OUTER JOIN "Application" a ON u.id = a."applicantId";

5. CROSS JOIN (User & Skill Matrix):
   SELECT u.id, u.name, s.id, s.name
   FROM "User" u CROSS JOIN "Skill" s;

6. SELF JOIN (Developer Pair Matching):
   SELECT u1.id, u1.email, u2.id, u2.email
   FROM "User" u1 INNER JOIN "User" u2 ON u1.id <> u2.id;

4. HTTP Status Code Strategy & Controller Annotations

NestJS Backend Controller Standard:
- @HttpCode(HttpStatus.OK) [200]: Applied to all GET endpoints and PATCH profile/application updates.
- @HttpCode(HttpStatus.CREATED) [201]: Applied to POST endpoints (/projects, /applications, /users, /skills, /ai-analyses).
- @HttpCode(HttpStatus.NO_CONTENT) [204]: Applied to DELETE endpoints (/ai-analyses/:id).

Exception Filter & Status Mapping:
- BadRequestException -> 400 Bad Request
- UnauthorizedException -> 401 Unauthorized
- ForbiddenException -> 403 Forbidden
- NotFoundException -> 404 Not Found
- ConflictException -> 409 Conflict
- UnprocessableEntityException -> 422 Unprocessable Entity
- InternalServerErrorException -> 500 Internal Server Error
- ServiceUnavailableException -> 503 Service Unavailable

Frontend API Client (client/src/utils/apiClient.ts):
Inspects response.status, handling 200, 201, 204 success cases and displaying appropriate status errors for 400, 401, 403, 404, 409, 422, 500, 503.

5. JavaScript Hoisting Low-Level Specification

Module Locations:
- Backend: server/src/common/utils/hoisting-demo.ts
- Frontend: client/src/utils/jsHoisting.ts

Mechanism Verification:
1. Function Hoisting:
   Functions processUserWithHoisting and validateAndFormatState invoke helper functions (hoistedSanitizeUser, hoistedComputeUserPermissions, hoistedValidateInput) prior to their code declaration lines.
2. Variable Hoisting (var):
   var variables are hoisted to function/global scope and initialized as undefined.
3. Temporal Dead Zone (TDZ):
   let and const variables are hoisted into the TDZ and throw a ReferenceError if accessed prior to initial statement evaluation.

Unit Test Suite:
- server/src/common/utils/hoisting-demo.spec.ts verifies function hoisting execution and var/let hoisting behavior.

6. Validation

Global validation uses:

new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

This validates DTOs, transforms incoming data, and rejects unexpected properties.

7. MongoDB AI Analysis Schema

AiAnalysis (_id, userId, projectId, jobTitle, score, summary, strengths[], missingSkills[], metadata{})

8. WebSocket & Real-Time Protocol

Socket.IO gateway provides project rooms (project:<projectId>) and emits projectUpdated events.

9. Transactions

Project creation performs related database operations in a Prisma transaction (BEGIN ... COMMIT/ROLLBACK).

10. Docker

Backend builds using Node.js Alpine container.