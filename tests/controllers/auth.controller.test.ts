import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { authController } from '../../src/controllers/auth.controller.js';
import { authService } from '../../src/services/auth.service.js';
import ApiError from '../../src/utils/ApiError.js';

vi.mock('../../src/services/auth.service.js', () => ({
  authService: {
    findUserByEmail: vi.fn(),
    hashPassword: vi.fn(),
    createUser: vi.fn(),
    verifyPassword: vi.fn(),
    generateAuthToken: vi.fn(),
  },
}));

describe('auth.controller', () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a user and return 201 with token', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      vi.mocked(authService.findUserByEmail).mockResolvedValue(null);
      vi.mocked(authService.hashPassword).mockResolvedValue('hashed');
      vi.mocked(authService.createUser).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed',
      } as any);
      vi.mocked(authService.generateAuthToken).mockReturnValue('jwt-token');

      await authController.signup(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 201,
          message: 'User registered successfully',
          data: expect.objectContaining({
            user: { id: 'user-1', email: 'test@example.com' },
            token: 'jwt-token',
          }),
        })
      );
    });

    it('should throw 409 if user already exists', async () => {
      req.body = { email: 'existing@example.com', password: 'password123' };
      vi.mocked(authService.findUserByEmail).mockResolvedValue({
        id: 'user-1',
        email: 'existing@example.com',
      } as any);

      await authController.signup(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(409);
      expect(next.mock.calls[0][0].message).toBe('User already exists');
    });
  });

  describe('login', () => {
    it('should return 200 with token for valid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const user = { id: 'user-1', email: 'test@example.com', password: 'hashed' };
      vi.mocked(authService.findUserByEmail).mockResolvedValue(user as any);
      vi.mocked(authService.verifyPassword).mockResolvedValue(true);
      vi.mocked(authService.generateAuthToken).mockReturnValue('jwt-token');

      await authController.login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 200,
          message: 'Login successful',
          data: expect.objectContaining({
            user: { id: 'user-1', email: 'test@example.com' },
            token: 'jwt-token',
          }),
        })
      );
    });

    it('should throw 401 if user not found', async () => {
      req.body = { email: 'notfound@example.com', password: 'password123' };
      vi.mocked(authService.findUserByEmail).mockResolvedValue(null);

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Invalid credentials');
    });

    it('should throw 401 if password is incorrect', async () => {
      req.body = { email: 'test@example.com', password: 'wrong' };
      const user = { id: 'user-1', email: 'test@example.com', password: 'hashed' };
      vi.mocked(authService.findUserByEmail).mockResolvedValue(user as any);
      vi.mocked(authService.verifyPassword).mockResolvedValue(false);

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Invalid credentials');
    });
  });
});