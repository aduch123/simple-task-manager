import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { SuccessResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';
import { taskService } from '../services/task.service.js';
import { AuthRequest } from '../types/index.js';

export const taskController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const tasks = await taskService.getAllByUser(userId);
    res.status(HTTP_STATUS.OK).json(
      new SuccessResponse(HTTP_STATUS.OK, 'Tasks fetched successfully', tasks)
    );
  }),

  getById: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;
    const task = await taskService.getById(id, userId);
    res.status(HTTP_STATUS.OK).json(
      new SuccessResponse(HTTP_STATUS.OK, 'Task fetched successfully', task)
    );
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const task = await taskService.create(req.body, userId);
    res.status(HTTP_STATUS.CREATED).json(
      new SuccessResponse(HTTP_STATUS.CREATED, 'Task created successfully', task)
    );
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;
    const task = await taskService.update(id, req.body, userId);
    res.status(HTTP_STATUS.OK).json(
      new SuccessResponse(HTTP_STATUS.OK, 'Task updated successfully', task)
    );
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;
    await taskService.delete(id, userId);
    res.status(HTTP_STATUS.OK).json(
      new SuccessResponse(HTTP_STATUS.OK, 'Task deleted successfully', null)
    );
  }),
};