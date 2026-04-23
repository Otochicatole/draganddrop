import { TaskStatus } from '../tasks/task.model';

export interface BoardColumn {
  status: TaskStatus;
  title: string;
  subtitle: string;
  accent: string;
}

export const boardColumns: BoardColumn[] = [
  {
    status: 'todo',
    title: 'Por hacer',
    subtitle: 'Tareas que esperan inicio',
    accent: 'from-slate-500 to-slate-700',
  },
  {
    status: 'in-progress',
    title: 'En progreso',
    subtitle: 'Trabajo activo',
    accent: 'from-amber-500 to-amber-700',
  },
  {
    status: 'done',
    title: 'Completado',
    subtitle: 'Tareas terminadas',
    accent: 'from-emerald-500 to-emerald-700',
  },
];
