import { describe, it, expect, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { authService } from '../../src/services/auth.service.js';
import { prisma } from '../../src/config/db.js';
import { generateToken } from '../../src/utils/jwt.js';

vi.mock('bcrypt');
vi.mock('../../src/config/db.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));
vi.mock('../../src/utils/jwt.js', () => ({
  generateToken: vi.fn(),
}));

describe('auth.service', () => {
  const mockUser = { id: 'user-1', email: 'test@example.com', password: 'hashed' };

  describe('hashPassword', () => {
    it('should hash the password using bcrypt', async () => {
      const password = 'password123';
      const hash = 'hashed_password';
      vi.mocked(bcrypt.hash).mockResolvedValue(hash as never);

      const result = await authService.hashPassword(password);
      expect(result).toBe(hash);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      const result = await authService.verifyPassword('password', 'hash');
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      const result = await authService.verifyPassword('wrong', 'hash');
      expect(result).toBe(false);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user if found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      const user = await authService.findUserByEmail('test@example.com');
      expect(user).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should return null if not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      const user = await authService.findUserByEmail('notfound@example.com');
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser as any);
      const user = await authService.createUser('test@example.com', 'hashed');
      expect(user).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: 'test@example.com', password: 'hashed' },
      });
    });
  });

  describe('generateAuthToken', () => {
    it('should generate a JWT token with user id and email', () => {
      const token = 'jwt-token';
      vi.mocked(generateToken).mockReturnValue(token);
      const result = authService.generateAuthToken('user-1', 'test@example.com');
      expect(result).toBe(token);
      expect(generateToken).toHaveBeenCalledWith({ id: 'user-1', email: 'test@example.com' });
    });
  });
});