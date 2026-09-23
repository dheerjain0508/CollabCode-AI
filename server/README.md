# CollabCode Server - NestJS Backend

CollabCode NestJS Backend Service supporting PostgreSQL relational databases via Prisma ORM and raw SQL JOIN queries, MongoDB via Mongoose, authentication via Better Auth, WebSocket real-time updates via Socket.IO, and AI integrations.

---

## Technical Implementations

### 1. PostgreSQL SQL JOINs (`src/sql-joins/`)
Implements raw Postgres SQL queries via Prisma `$queryRaw`:
- `GET /sql-joins/inner-join` - `INNER JOIN` between `Project` and `User`
- `GET /sql-joins/left-join` - `LEFT JOIN` between `User` and `Profile`
- `GET /sql-joins/right-join` - `RIGHT JOIN` between `Application` and `Project`
- `GET /sql-joins/full-outer-join` - `FULL OUTER JOIN` between `User` and `Application`
- `GET /sql-joins/cross-join` - `CROSS JOIN` between `User` and `Skill`
- `GET /sql-joins/self-join` - `SELF JOIN` on `User`

### 2. HTTP Status Codes Used Correctly
Every controller method is annotated with explicit `@HttpCode(...)` decorators:
- `@HttpCode(HttpStatus.OK)` [200] for GET/PATCH
- `@HttpCode(HttpStatus.CREATED)` [201] for POST
- `@HttpCode(HttpStatus.NO_CONTENT)` [204] for DELETE
- Exception classes thrown: `BadRequestException` (400), `UnauthorizedException` (401), `ForbiddenException` (403), `NotFoundException` (404), `ConflictException` (409), `UnprocessableEntityException` (422), `InternalServerErrorException` (500), `ServiceUnavailableException` (503).

### 3. JavaScript Hoisting (`src/common/utils/hoisting-demo.ts`)
Demonstrates and tests JS function hoisting, `var` hoisting, and `let`/`const` Temporal Dead Zone (TDZ). Tested via Jest specs (`npm test`).

---

## Commands

```bash
# Install dependencies
npm install

# Build NestJS project
npm run build

# Run unit tests
npm test

# Start development server
npm run start:dev
```
