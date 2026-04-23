export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStoragePayload {
  version: number;
  tasks: Task[];
}

const STORAGE_VERSION = 1;

const isString = (value: unknown): value is string => typeof value === 'string';

export const isTaskStatus = (value: unknown): value is TaskStatus =>
  value === 'todo' || value === 'in-progress' || value === 'done';

export const createTask = (input: {
  title: string;
  description: string;
  status?: TaskStatus;
}): Task => {
  const now = new Date().toISOString();
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status ?? 'todo',
    createdAt: now,
    updatedAt: now,
  };
};

const normalizeTask = (value: unknown): Task | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const entry = value as Record<string, unknown>;

  if (
    !isString(entry.id)
    || !isString(entry.title)
    || !isString(entry.description)
    || !isString(entry.createdAt)
    || !isString(entry.updatedAt)
    || !isTaskStatus(entry.status)
  ) {
    return null;
  }

  return {
    id: entry.id,
    title: entry.title.trim(),
    description: entry.description.trim(),
    status: entry.status,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
};

export const safeTaskList = (value: unknown): Task[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const tasks = value
    .map(normalizeTask)
    .filter((task): task is Task => task !== null)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return tasks;
};

export const createStoragePayload = (tasks: Task[]): TaskStoragePayload => ({
  version: STORAGE_VERSION,
  tasks,
});

export const isValidStoragePayload = (value: unknown): value is TaskStoragePayload => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return payload.version === STORAGE_VERSION && Array.isArray(payload.tasks);
};

export const updateTask = (
  task: Task,
  changes: Partial<Pick<Task, 'title' | 'description' | 'status'>>
): Task => ({
  ...task,
  title: changes.title !== undefined ? changes.title.trim() : task.title,
  description: changes.description !== undefined ? changes.description.trim() : task.description,
  status: changes.status ?? task.status,
  updatedAt: new Date().toISOString(),
});
