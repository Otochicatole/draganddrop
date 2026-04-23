import { useCallback, useEffect, useMemo, useState } from 'react';
import { localStorageAdapter } from '../storage/localStorageAdapter';
import { Task, TaskStatus, createTask } from './task.model';
import { TaskRepository } from './task.repository';
import { TaskService, TaskInput } from './task.service';

const sampleTasks: Task[] = [
  createTask({
    title: 'Diseñar tablero',
    description: 'Configurar columnas y estructura principal del Kanban',
    status: 'todo',
  }),
  createTask({
    title: 'Revisar objetivos',
    description: 'Asegurarse que el flujo funcione para todos los estados',
    status: 'in-progress',
  }),
  createTask({
    title: 'Publicar prototipo',
    description: 'Probar la persistencia en LocalStorage y corregir detalles',
    status: 'done',
  }),
];

export type TaskActions = {
  createTask: (input: TaskInput) => void;
  updateTask: (taskId: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
};

export const useTasks = () => {
  const repository = useMemo(() => new TaskRepository(localStorageAdapter), []);
  const service = useMemo(() => new TaskService(repository), [repository]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loaded = service.loadTasks();
    if (loaded.length === 0) {
      setTasks(service.saveTasks(sampleTasks));
      return;
    }

    setTasks(loaded);
  }, [service]);

  const createTask = useCallback(
    (input: TaskInput) => {
      setTasks((current) => service.createTask(current, input));
    },
    [service],
  );

  const updateTask = useCallback(
    (taskId: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
      setTasks((current) => service.updateTask(current, taskId, changes));
    },
    [service],
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((current) => service.deleteTask(current, taskId));
    },
    [service],
  );

  const moveTask = useCallback(
    (taskId: string, status: TaskStatus) => {
      setTasks((current) => service.moveTask(current, taskId, status));
    },
    [service],
  );

  return {
    tasks,
    actions: {
      createTask,
      updateTask,
      deleteTask,
      moveTask,
    },
  } as const;
};
