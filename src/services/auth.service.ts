import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import { env } from '../config/env.js';

const SALT_ROUNDS = parseInt(env.BCRYPT_SALT_ROUNDS, 10);

export const authService = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser(email: string, hashedPassword: string) {
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  },

  generateAuthToken(userId: string, email: string): string {
    // ⚠️ If you want to include role in the token, uncomment the role line
    // return generateToken({ id: userId, email, role: 'user' });
    return generateToken({ id: userId, email });
  },
};