import { Task, TaskStatus, createTask, updateTask } from './task.model';
import { TaskRepository } from './task.repository';

export type TaskInput = {
  title: string;
  description: string;
  status?: TaskStatus;
};

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  loadTasks(): Task[] {
    return this.repository.load();
  }

  saveTasks(tasks: Task[]): Task[] {
    this.repository.save(tasks);
    return tasks;
  }

  createTask(tasks: Task[], input: TaskInput): Task[] {
    const next = [...tasks, createTask(input)];
    return this.saveTasks(next);
  }

  updateTask(tasks: Task[], taskId: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): Task[] {
    const next = tasks.map((task) =>
      task.id === taskId ? updateTask(task, changes) : task,
    );
    return this.saveTasks(next);
  }

  deleteTask(tasks: Task[], taskId: string): Task[] {
    const next = tasks.filter((task) => task.id !== taskId);
    return this.saveTasks(next);
  }

  moveTask(tasks: Task[], taskId: string, status: TaskStatus): Task[] {
    const next = tasks.map((task) =>
      task.id === taskId ? updateTask(task, { status }) : task,
    );
    return this.saveTasks(next);
  }
}
