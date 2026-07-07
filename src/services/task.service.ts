import { prisma } from '../config/db.js';
import { TaskStatus } from '@prisma/client'; // 👈 Import enum
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/index.js';

export const taskService = {
  async getAllByUser(userId: string) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string, userId: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Task not found');
    }
    if (task.userId !== userId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Access denied');
    }
    return task;
  },

  async create(data: { title: string; description?: string; status?: string }, userId: string) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus | undefined, // 👈 Cast to enum
        userId,
      },
    });
  },

  async update(id: string, data: Partial<{ title: string; description: string; status: string }>, userId: string) {
    await this.getById(id, userId);
    return prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus | undefined, // 👈 Cast to enum
      },
    });
  },

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    return prisma.task.delete({ where: { id } });
  },
};