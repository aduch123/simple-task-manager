import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../src/config/db';

describe('Prisma Database Config', () => {
  // Optional: test connection
  it('should connect to the database', async () => {
    // Run a simple query to check connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    expect(result).toBeDefined();
  });

  it('should have User model available', () => {
    expect(prisma.user).toBeDefined();
    expect(typeof prisma.user.findMany).toBe('function');
  });

  it('should have Task model available', () => {
    expect(prisma.task).toBeDefined();
    expect(typeof prisma.task.findMany).toBe('function');
  });

  it('should have the correct Prisma client singleton', async () => {
    // Import again to ensure same instance is reused
    const { prisma: prisma2 } = await import('../../src/config/db');
    expect(prisma).toBe(prisma2);
  });
});