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
├── App.tsx
├── main.tsx
└── App.css

2. Backend Structure

server/src/
├── users/
├── projects/
├── applications/
├── skills/
├── ai-assistant/
├── ai-analyses/
│   └── schemas/
├── notifications/
│   └── notifications.gateway.ts
├── auth/
├── app.module.ts
└── main.ts

The backend follows the NestJS module-controller-service pattern.

3. Validation

Global validation uses:

new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

This validates DTOs, transforms incoming data, and rejects unexpected
properties.

4. Relational Data Model

Project

Project
---------
id           PK
title
description
category
teamSize
status
ownerId      FK -> User.id
createdAt
updatedAt

A project belongs to one owner and can have multiple required skills,
members, and applications.

Application

Application
-----------
id
message
status
projectId    FK -> Project.id
applicantId  FK -> User.id
createdAt
updatedAt

Application states include PENDING, ACCEPTED, and REJECTED.

5. MongoDB AI Analysis

AiAnalysis
-----------
_id
userId
projectId
jobTitle
score
summary
strengths[]
missingSkills[]
metadata{}
createdAt
updatedAt

Indexes are defined for userId and projectId.

6. AI Analysis CRUD

POST    /ai-analyses
GET     /ai-analyses
GET     /ai-analyses/:id
PATCH   /ai-analyses/:id
DELETE  /ai-analyses/:id

Missing documents produce a NotFoundException.

7. Authentication

Client
  |
  | Sign up / Sign in
  v
Better Auth
  |
  | Session cookie
  v
Authenticated request
  |
  v
NestJS

Frontend requests use credentials: 'include' when session cookies are
required.

8. Project APIs

GET    /projects
GET    /projects/:id
POST   /users/:userId/projects
GET    /projects/:id/members

Project creation performs related database operations in a Prisma
transaction.

9. Application APIs

POST  /users/:userId/projects/:projectId/apply
PATCH /applications/:applicationId

The PATCH operation changes the application status.

10. WebSocket Design

The Socket.IO gateway supports a join message with a project ID.
Clients join:

project:<projectId>

Project creation emits:

projectUpdated

The frontend listens for this event and cleans up the socket connection
when the page unmounts.

11. Error Handling

Frontend operations maintain loading, error, and message state.

Backend operations use NestJS HTTP exceptions such as NotFoundException,
BadRequestException, and UnauthorizedException.

12. Database Performance

MongoDB indexes cover common user/project lookup fields. The Project
relational model includes a status index for status filtering. SQL joins
and filters retrieve related project information efficiently.

13. Transactions

Project creation groups related database changes into one Prisma
transaction:

BEGIN
  Create/update project
  Process required skills
  Create project-skill relations
COMMIT

A failure rolls back the transaction rather than leaving a partial
update.

14. Docker

The backend Docker build installs dependencies, builds the NestJS
application, and produces a runnable container image based on Node.js
Alpine.