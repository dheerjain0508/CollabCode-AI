CollabCode - High-Level Design (HLD)

1. System Overview

CollabCode is a full-stack developer collaboration platform that helps
users discover projects, create projects, find teammates, submit
applications, and receive AI-assisted project insights.

The system follows a client-server architecture:

Frontend: React + TypeScript

Backend: NestJS

Relational database: PostgreSQL on Neon, accessed through Prisma (with full schema definitions in both client/prisma/schema.prisma and server/prisma/schema.prisma)

Document database: MongoDB, accessed through Mongoose

Authentication: Better Auth

Real-time communication: Socket.IO through a NestJS WebSocket Gateway

AI integration: OpenAI API through a NestJS service

Containerization: Docker

2. Architecture

Browser
  |
  | HTTP / WebSocket
  v
React + TypeScript
  |
  v
NestJS Server
  |---- Authentication
  |---- Users
  |---- Projects
  |---- Applications
  |---- Skills
  |---- SQL JOINs Service
  |---- JS Hoisting Utilities
  |---- AI Assistant
  |---- AI Analyses
  `---- WebSocket Gateway
       |
       +---- PostgreSQL / Neon (Raw SQL JOINs + Prisma ORM)
       +---- MongoDB
       `---- OpenAI API

3. Main Components

React Client

Pages include Home, Login, Signup, Dashboard, Profile, Projects, Project
Details, Create Project, and AI Assistant.

React state manages forms, loading states, errors, fetched data, and
real-time updates. Standard HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 500) are inspected and handled.

NestJS Backend

The backend uses NestJS modules, controllers, services, DTOs,
authentication, database access, explicit HTTP status code annotations, and a WebSocket gateway.

PostgreSQL

PostgreSQL stores structured relational data including users, profiles, projects,
applications, skills, project members, and their relationships. Prisma is used as the
ORM, supporting both model-level relation navigation and raw SQL queries ($queryRaw) for complex SQL JOINs.

MongoDB

MongoDB stores AI analysis documents containing flexible metadata,
strengths, missing skills, scores, and summaries. Mongoose is used for
schema modeling and CRUD.

WebSocket Gateway

Socket.IO provides project-specific rooms and real-time projectUpdated
events.

AI Service

The AI service calls the OpenAI API from the backend so the API
credential is not exposed in the browser.

4. PostgreSQL Relational Model & SQL JOIN Architecture

The database architecture leverages PostgreSQL relational semantics and foreign key constraints, fully declared in client/prisma/schema.prisma and server/prisma/schema.prisma.

SQL JOIN Operations Implemented:

- INNER JOIN:
  Executes queries combining matching rows between tables (e.g. Project INNER JOIN User ON Project.ownerId = User.id; Project INNER JOIN ProjectSkill INNER JOIN Skill).
  Endpoint: GET /sql-joins/inner-join

- LEFT JOIN:
  Retrieves all rows from the left table and matching rows from the right table, returning NULL for unmatched right rows (e.g. User LEFT JOIN Profile ON User.id = Profile.userId).
  Endpoint: GET /sql-joins/left-join

- RIGHT JOIN:
  Retrieves all rows from the right table and matching rows from the left table (e.g. Application RIGHT JOIN Project ON Application.projectId = Project.id).
  Endpoint: GET /sql-joins/right-join

- FULL OUTER JOIN:
  Combines all records from both tables, returning NULL for non-matching elements on either side (e.g. User FULL OUTER JOIN Application ON User.id = Application.applicantId).
  Endpoint: GET /sql-joins/full-outer-join

- CROSS JOIN:
  Generates a Cartesian product of two tables for skill-matching matrices (e.g. User CROSS JOIN Skill).
  Endpoint: GET /sql-joins/cross-join

- SELF JOIN:
  Performs a self-referential JOIN on the User table to pair peer developers (e.g. User u1 INNER JOIN User u2 ON u1.id <> u2.id).
  Endpoint: GET /sql-joins/self-join

5. HTTP Status Code Architecture

The platform enforces HTTP status code standards across backend controllers and frontend client API handlers:

- 200 OK: Returned for successful data retrieval (GET) and updates (PATCH/PUT).
- 201 Created: Returned for successful creation of resources (POST /projects, POST /applications, POST /users, POST /ai-analyses).
- 204 No Content: Returned for successful deletion operations (DELETE /ai-analyses/:id).
- 400 Bad Request: Thrown via BadRequestException when request DTO validation fails.
- 401 Unauthorized: Thrown via UnauthorizedException when session authentication is invalid or missing.
- 403 Forbidden: Thrown via ForbiddenException when a user attempts unauthorized operations.
- 404 Not Found: Thrown via NotFoundException when a requested project, user, or resource does not exist.
- 409 Conflict: Thrown via ConflictException when unique constraint violations occur (e.g., duplicate email or duplicate application).
- 422 Unprocessable Entity: Thrown when request payload fails domain business rules.
- 500 Internal Server Error: Thrown via InternalServerErrorException for unhandled operational errors.
- 503 Service Unavailable: Thrown when external AI provider or database connections are unreachable.

6. JavaScript Execution Engine & Hoisting Principles

JavaScript hoisting is the compiler mechanism where variable and function declarations are hoisted to the top of their containing scope prior to code execution.

Hoisting Rules & Implementation in CollabCode:

- Function Declarations:
  Function declarations are hoisted in full (both declaration name and function body). They can be called prior to their line of definition in code.
  Example in codebase: processUserWithHoisting() calls hoistedSanitizeUser() and hoistedComputeUserPermissions() declared at the bottom of the file.

- Variable Hoisting (var):
  var declarations are hoisted and initialized to undefined. Referencing a var variable before declaration returns undefined without throwing an error.

- Let & Const (Temporal Dead Zone - TDZ):
  let and const declarations are hoisted into the block scope but remain uninitialized in the TDZ until the declaration statement is evaluated. Accessing them prior to declaration throws a ReferenceError.

- Class & Expression Hoisting:
  Arrow functions, function expressions, and classes follow variable hoisting scope rules.

7. Security

Secrets are stored in environment variables.

.env files are ignored by Git.

Better Auth manages sessions.

Protected operations use authentication.

DTO validation is enabled globally.

Unexpected request properties can be rejected.

AI credentials remain server-side.

8. Scalability

Future scalability options include Redis caching, horizontal backend
scaling, message queues, CDN delivery, AI streaming, RAG, and automated
testing.

9. Deployment

The NestJS backend can be packaged as a Docker image. Production
configuration should provide database, MongoDB, authentication, and AI
secrets through the hosting environment.