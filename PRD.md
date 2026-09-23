CollabCode - Product Requirements Document (PRD)

1. Product Vision

CollabCode is a developer collaboration platform that helps developers
discover projects, find teammates, and turn ideas into working products.

The product combines project discovery, developer profiles,
applications, real-time updates, AI assistance, relational database SQL JOIN queries, precise HTTP status code semantics, and clean JavaScript engine execution principles.

2. Problem Statement

Developers often have useful skills or project ideas but struggle to
find suitable collaborators. Existing workflows are spread across
messaging platforms, repositories, job boards, and community groups.

CollabCode provides one workflow for creating projects, discovering
projects, presenting skills, applying to projects, managing
applications, and getting AI-assisted guidance.

3. Core User Stories

Accounts & Profiles
- Create an account, log in securely, maintain session state.
- Create and update profile details (linked via 1:1 SQL LEFT JOIN to User table).

Projects & Database Queries
- Browse, search, and create projects.
- Query projects and owners using PostgreSQL SQL INNER JOINs, LEFT JOINs, RIGHT JOINs, FULL OUTER JOINs, CROSS JOINs, and SELF JOINs.

Applications
- Apply to projects with a message (1:N SQL JOIN).
- Review, accept, or reject applications.

HTTP Status Codes & Error Feedback
- Receive HTTP 200 OK for reads/updates, HTTP 201 Created for resource creation, HTTP 204 No Content for deletions.
- Receive explicit error codes: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 500 Internal Error, 503 Service Unavailable.

JavaScript Fundamentals & Hoisting
- Utilize hoisted helper functions and scoped variables cleanly.

4. Functional Requirements

PostgreSQL Database & SQL JOINs
- The database schema (synchronized in client/prisma/schema.prisma and server/prisma/schema.prisma) must define foreign keys and relationships for:
  - INNER JOIN: Projects with owners.
  - LEFT JOIN: Users with optional profiles.
  - RIGHT JOIN: Applications right-joined with projects.
  - FULL OUTER JOIN: Users and applications.
  - CROSS JOIN: User-Skill Cartesian matrix.
  - SELF JOIN: Peer developer matching.

HTTP Status Code Accuracy
- NestJS backend controllers must explicitly decorate all endpoints with @HttpCode(HttpStatus.OK), @HttpCode(HttpStatus.CREATED), or @HttpCode(HttpStatus.NO_CONTENT).
- Client API service (client/src/utils/apiClient.ts) must inspect response HTTP status codes and provide user feedback.

JavaScript Hoisting
- Backend and frontend utilities must demonstrate and document function hoisting, var hoisting, and Temporal Dead Zone (TDZ) rules.

5. Non-Functional Requirements

Security & Validation
- Environment variables for database and secrets.
- Global DTO validation pipe enabled.

Performance & Relational Design
- Indexes on frequently searched relational fields (status, ownerId, userId).
- Optimized SQL JOIN queries via Prisma $queryRaw for multi-table aggregations.

6. Acceptance Criteria

SQL JOINs:
- client/prisma/schema.prisma and server/prisma/schema.prisma must declare all relational models with explicit SQL JOIN docstrings.
- Endpoint /sql-joins/* must return data for INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF JOINs.

HTTP Status Codes:
- POST endpoints return HTTP 201.
- GET/PATCH endpoints return HTTP 200.
- DELETE endpoints return HTTP 204.
- Invalid requests return HTTP 400, missing resources return HTTP 404.

JavaScript Hoisting:
- Unit tests in server/src/common/utils/hoisting-demo.spec.ts must pass without errors.