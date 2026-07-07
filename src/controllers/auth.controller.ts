import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { SuccessResponse } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/index.js';
import { authService } from '../services/auth.service.js';

export const authController = {
  signup: asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await authService.findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'User already exists');
  }

  const hashedPassword = await authService.hashPassword(password);
  const user = await authService.createUser(email, hashedPassword);
  const token = authService.generateAuthToken(user.id, user.email);

  res.status(HTTP_STATUS.CREATED).json(
    new SuccessResponse(HTTP_STATUS.CREATED, 'User registered successfully', {
      user: { id: user.id, email: user.email },
      token,
    })
  );
}),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    const isPasswordValid = await authService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    const token = authService.generateAuthToken(user.id, user.email);

    res.status(HTTP_STATUS.OK).json(
      new SuccessResponse(HTTP_STATUS.OK, 'Login successful', {
        user: { id: user.id, email: user.email },
        token,
      })
    );
  }),
};