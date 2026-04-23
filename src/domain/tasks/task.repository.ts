import { StorageAdapter, localStorageAdapter } from '../storage/localStorageAdapter';
import { createStoragePayload, isValidStoragePayload, safeTaskList, Task, TaskStoragePayload } from './task.model';

const STORAGE_KEY = 'kanban.tasks';

export class TaskRepository {
  constructor(
    private readonly storage: StorageAdapter = localStorageAdapter,
    private readonly storageKey = STORAGE_KEY,
  ) {}

  load(): Task[] {
    const raw = this.storage.read<unknown>(this.storageKey);
    if (raw === null) {
      return [];
    }

    if (!isValidStoragePayload(raw)) {
      this.storage.remove(this.storageKey);
      return [];
    }

    return safeTaskList(raw.tasks);
  }

  save(tasks: Task[]): void {
    const payload: TaskStoragePayload = createStoragePayload(tasks);
    this.storage.write(this.storageKey, payload);
  }
}
