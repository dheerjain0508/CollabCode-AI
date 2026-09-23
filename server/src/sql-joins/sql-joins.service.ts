import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * SqlJoinsService
 * Demonstrates PostgreSQL SQL JOIN operations using Prisma raw SQL queries ($queryRaw).
 * Covers: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, and SELF JOIN.
 */
@Injectable()
export class SqlJoinsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. INNER JOIN (Postgres SQL)
   * Retrieves projects combined with owner account details where matching keys exist in both tables.
   * SQL: SELECT ... FROM "Project" p INNER JOIN "User" u ON p."ownerId" = u.id
   */
  async getInnerJoinProjectsAndOwners() {
    return this.prisma.$queryRaw<
      {
        projectId: string;
        projectTitle: string;
        projectStatus: string;
        ownerId: string;
        ownerName: string | null;
        ownerEmail: string;
      }[]
    >`
      SELECT 
        p.id AS "projectId",
        p.title AS "projectTitle",
        p.status AS "projectStatus",
        u.id AS "ownerId",
        u.name AS "ownerName",
        u.email AS "ownerEmail"
      FROM "Project" p
      INNER JOIN "User" u ON p."ownerId" = u.id
      ORDER BY p."createdAt" DESC
    `;
  }

  /**
   * 2. LEFT JOIN (Postgres SQL)
   * Retrieves all users along with their optional profile details (including users without profiles).
   * SQL: SELECT ... FROM "User" u LEFT JOIN "Profile" pr ON u.id = pr."userId"
   */
  async getLeftJoinUsersAndProfiles() {
    return this.prisma.$queryRaw<
      {
        userId: string;
        email: string;
        name: string | null;
        bio: string | null;
        experienceLevel: string | null;
        githubUrl: string | null;
      }[]
    >`
      SELECT 
        u.id AS "userId",
        u.email,
        u.name,
        pr.bio,
        pr."experienceLevel",
        pr."githubUrl"
      FROM "User" u
      LEFT JOIN "Profile" pr ON u.id = pr."userId"
      ORDER BY u."createdAt" DESC
    `;
  }

  /**
   * 3. RIGHT JOIN (Postgres SQL)
   * Retrieves applications matched with projects, keeping all projects even if no applications exist.
   * SQL: SELECT ... FROM "Application" a RIGHT JOIN "Project" p ON a."projectId" = p.id
   */
  async getRightJoinApplicationsAndProjects() {
    return this.prisma.$queryRaw<
      {
        projectId: string;
        projectTitle: string;
        applicationId: string | null;
        applicationStatus: string | null;
        applicantId: string | null;
      }[]
    >`
      SELECT 
        p.id AS "projectId",
        p.title AS "projectTitle",
        a.id AS "applicationId",
        a.status AS "applicationStatus",
        a."applicantId"
      FROM "Application" a
      RIGHT JOIN "Project" p ON a."projectId" = p.id
      ORDER BY p."createdAt" DESC
    `;
  }

  /**
   * 4. FULL OUTER JOIN (Postgres SQL)
   * Retrieves all users and applications, matching rows where possible and filling NULL for unmatched sides.
   * SQL: SELECT ... FROM "User" u FULL OUTER JOIN "Application" a ON u.id = a."applicantId"
   */
  async getFullOuterJoinUsersAndApplications() {
    return this.prisma.$queryRaw<
      {
        userId: string | null;
        userEmail: string | null;
        applicationId: string | null;
        applicationStatus: string | null;
        appliedProjectId: string | null;
      }[]
    >`
      SELECT 
        u.id AS "userId",
        u.email AS "userEmail",
        a.id AS "applicationId",
        a.status AS "applicationStatus",
        a."projectId" AS "appliedProjectId"
      FROM "User" u
      FULL OUTER JOIN "Application" a ON u.id = a."applicantId"
      LIMIT 100
    `;
  }

  /**
   * 5. CROSS JOIN (Postgres SQL)
   * Generates a Cartesian product of all users and skills to compute potential skill match matrices.
   * SQL: SELECT ... FROM "User" u CROSS JOIN "Skill" s
   */
  async getCrossJoinUserSkillMatrix() {
    return this.prisma.$queryRaw<
      {
        userId: string;
        userName: string | null;
        userEmail: string;
        skillId: string;
        skillName: string;
      }[]
    >`
      SELECT 
        u.id AS "userId",
        u.name AS "userName",
        u.email AS "userEmail",
        s.id AS "skillId",
        s.name AS "skillName"
      FROM "User" u
      CROSS JOIN "Skill" s
      LIMIT 50
    `;
  }

  /**
   * 6. SELF JOIN (Postgres SQL)
   * Performs a self-join on the User table to identify peer developer pairs with matching email domains or distinct users.
   * SQL: SELECT ... FROM "User" u1 INNER JOIN "User" u2 ON u1.id <> u2.id
   */
  async getSelfJoinPeerPairs() {
    return this.prisma.$queryRaw<
      {
        developer1Id: string;
        developer1Email: string;
        developer2Id: string;
        developer2Email: string;
      }[]
    >`
      SELECT 
        u1.id AS "developer1Id",
        u1.email AS "developer1Email",
        u2.id AS "developer2Id",
        u2.email AS "developer2Email"
      FROM "User" u1
      INNER JOIN "User" u2 ON u1.id <> u2.id
      LIMIT 20
    `;
  }
}
