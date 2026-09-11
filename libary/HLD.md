CollabCode - High-Level Design (HLD)

1. System Overview

CollabCode is a full-stack developer collaboration platform that helps
users discover projects, create projects, find teammates, submit
applications, and receive AI-assisted project insights.

The system follows a client-server architecture:

Frontend: React + TypeScript

Backend: NestJS

Relational database: PostgreSQL on Neon, accessed through Prisma

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
  |---- AI Assistant
  |---- AI Analyses
  `---- WebSocket Gateway
       |
       +---- PostgreSQL / Neon
       +---- MongoDB
       `---- OpenAI API

3. Main Components

React Client

Pages include Home, Login, Signup, Dashboard, Profile, Projects, Project
Details, Create Project, and AI Assistant.

React state manages forms, loading states, errors, fetched data, and
real-time updates.

NestJS Backend

The backend uses NestJS modules, controllers, services, DTOs,
authentication, database access, and a WebSocket gateway.

PostgreSQL

PostgreSQL stores structured relational data including users, projects,
applications, skills, and their relationships. Prisma is used as the
ORM.

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

4. Important Data Flows

Project Creation

User submits the project form.

React sends a POST request.

NestJS validates the request.

Project and required skills are persisted through Prisma.

Related database work is performed in a transaction.

The WebSocket gateway emits a project update.

Connected clients update without a manual refresh.

Project Application

Developer opens a project.

Frontend loads the session and project.

Developer submits an application message.

Backend creates the application.

Project state is updated on the client.

Owner can accept or reject the application.

AI Request

User enters a prompt.

React sends the request to NestJS.

AI Assistant service calls OpenAI.

The response is returned to the client.

The UI displays the response or a readable error.

5. Security

Secrets are stored in environment variables.

.env files are ignored by Git.

Better Auth manages sessions.

Protected operations use authentication.

DTO validation is enabled globally.

Unexpected request properties can be rejected.

AI credentials remain server-side.

6. Scalability

Future scalability options include Redis caching, horizontal backend
scaling, message queues, CDN delivery, AI streaming, RAG, and automated
testing.

7. Deployment

The NestJS backend can be packaged as a Docker image. Production
configuration should provide database, MongoDB, authentication, and AI
secrets through the hosting environment.