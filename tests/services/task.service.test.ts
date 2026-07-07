import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '../../src/services/task.service.js';
import { prisma } from '../../src/config/db.js';
import ApiError from '../../src/utils/ApiError.js';

vi.mock('../../src/config/db.js', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('task.service', () => {
  const userId = 'user-1';
  const taskId = 'task-1';
  const mockTask = { id: taskId, title: 'Test', userId, status: 'PENDING' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllByUser', () => {
    it('should return tasks for the user', async () => {
      vi.mocked(prisma.task.findMany).mockResolvedValue([mockTask] as any);
      const tasks = await taskService.getAllByUser(userId);
      expect(tasks).toEqual([mockTask]);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getById', () => {
    it('should return task if it belongs to user', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(mockTask as any);
      const task = await taskService.getById(taskId, userId);
      expect(task).toEqual(mockTask);
    });

    it('should throw 404 if task not found', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null);
      await expect(taskService.getById(taskId, userId)).rejects.toThrow(ApiError);
      await expect(taskService.getById(taskId, userId)).rejects.toHaveProperty('statusCode', 404);
    });

    it('should throw 403 if task belongs to another user', async () => {
      const otherUserTask = { ...mockTask, userId: 'other-user' };
      vi.mocked(prisma.task.findUnique).mockResolvedValue(otherUserTask as any);
      await expect(taskService.getById(taskId, userId)).rejects.toThrow(ApiError);
      await expect(taskService.getById(taskId, userId)).rejects.toHaveProperty('statusCode', 403);
    });
  });

  describe('create', () => {
    it('should create a task for the user', async () => {
      const data = { title: 'New Task', description: 'Desc', status: 'IN_PROGRESS' };
      vi.mocked(prisma.task.create).mockResolvedValue({ ...mockTask, ...data } as any);
      const task = await taskService.create(data, userId);
      expect(task).toMatchObject(data);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          userId,
        },
      });
    });
  });

  describe('update', () => {
    it('should update task if it belongs to user', async () => {
      const updateData = { title: 'Updated' };
      vi.mocked(prisma.task.findUnique).mockResolvedValue(mockTask as any);
      vi.mocked(prisma.task.update).mockResolvedValue({ ...mockTask, ...updateData } as any);
      const task = await taskService.update(taskId, updateData, userId);
      expect(task).toMatchObject(updateData);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateData,
      });
    });
  });

  describe('delete', () => {
    it('should delete task if it belongs to user', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(mockTask as any);
      vi.mocked(prisma.task.delete).mockResolvedValue(mockTask as any);
      await taskService.delete(taskId, userId);
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: taskId } });
    });
  });
});