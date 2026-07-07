import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskController } from '../../src/controllers/task.controller.js';
import { taskService } from '../../src/services/task.service.js';
import { AuthRequest } from '../../src/types/index.js';

vi.mock('../../src/services/task.service.js', () => ({
  taskService: {
    getAllByUser: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('task.controller', () => {
  let req: any;
  let res: any;
  let next: any;
  const userId = 'user-1';

  beforeEach(() => {
    req = { user: { id: userId }, params: {}, body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return tasks for the user', async () => {
      const tasks = [{ id: '1', title: 'Task 1' }];
      vi.mocked(taskService.getAllByUser).mockResolvedValue(tasks as any);
      await taskController.getAll(req as AuthRequest, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 200,
          data: tasks,
        })
      );
    });
  });

  describe('getById', () => {
    it('should return task if found', async () => {
      const task = { id: '1', title: 'Task' };
      req.params = { id: '1' };
      vi.mocked(taskService.getById).mockResolvedValue(task as any);
      await taskController.getById(req as AuthRequest, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 200,
          data: task,
        })
      );
    });
  });

  describe('create', () => {
    it('should create a task', async () => {
      const newTask = { id: '1', title: 'New Task', userId, status: 'PENDING' };
      req.body = { title: 'New Task' };
      vi.mocked(taskService.create).mockResolvedValue(newTask as any);
      await taskController.create(req as AuthRequest, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 201,
          data: newTask,
        })
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updated = { id: '1', title: 'Updated', userId, status: 'PENDING' };
      req.params = { id: '1' };
      req.body = { title: 'Updated' };
      vi.mocked(taskService.update).mockResolvedValue(updated as any);
      await taskController.update(req as AuthRequest, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 200,
          data: updated,
        })
      );
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const mockTask = { id: '1', title: 'Task to delete', userId, status: 'PENDING' };
      req.params = { id: '1' };
      vi.mocked(taskService.delete).mockResolvedValue(mockTask as any); // 👈 Return the deleted task
      await taskController.delete(req as AuthRequest, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 200,
          message: 'Task deleted successfully',
        })
      );
    });
  });
});