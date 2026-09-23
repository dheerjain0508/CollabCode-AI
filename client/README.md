# CollabCode Client - React + TypeScript Frontend

Frontend client application for CollabCode, built using React, TypeScript, and Vite.

---

## Technical Features

### 1. PostgreSQL Schema Synchronization (`prisma/schema.prisma`)
The client includes the complete PostgreSQL relational schema definition matching backend data models (User, Profile, Project, Application, Skill, UserSkill, ProjectSkill, ProjectMember, Session, Account, Verification) with explicit PostgreSQL SQL JOIN docstrings.

### 2. Centralized HTTP Status Code Handler (`src/utils/apiClient.ts`)
Inspects and processes standard HTTP status codes:
- **200 OK / 201 Created / 204 No Content**: Success processing
- **400 Bad Request**: Input validation error handling
- **401 Unauthorized**: Session expiration warning
- **403 Forbidden**: Access permission error
- **404 Not Found**: Resource non-existence state
- **409 Conflict**: Unique constraint collision warning
- **422 Unprocessable Entity**: Business validation failure
- **500 Internal Error / 503 Service Unavailable**: Operational error state

### 3. Client JavaScript Hoisting Utility (`src/utils/jsHoisting.ts`)
Demonstrates function hoisting, `var` hoisting, and Temporal Dead Zone (TDZ) handling in browser JavaScript engines.

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```
