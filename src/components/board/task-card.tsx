import { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { FiEdit3, FiTrash2, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { Task, TaskStatus } from '../../domain/tasks/task.model';

const ITEM_TYPE = 'TASK';

const nextStatus = (status: TaskStatus): TaskStatus | null => {
  if (status === 'todo') {
    return 'in-progress';
  }

  if (status === 'in-progress') {
    return 'done';
  }

  if (status === 'done') {
    return 'in-progress';
  }

  return null;
};

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, status: TaskStatus) => void;
};

export function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id, task.status]);

  const destination = useMemo(() => nextStatus(task.status), [task.status]);
  const opacity = isDragging ? 0.4 : 1;

  return (
    <article
      ref={drag}
      className="group space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md"
      style={{ opacity }}
    >
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900">{task.title}</h3>
        <p className="text-sm leading-5 text-slate-600">{task.description}</p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-slate-700">
          {task.status === 'todo' && '📋'}
          {task.status === 'in-progress' && '⚡'}
          {task.status === 'done' && '✓'}
        </span>
        <span className="text-xs text-slate-500">
          {new Date(task.updatedAt).toLocaleDateString('es-ES')}
        </span>
      </div>

      <div className="grid gap-2 pt-2 sm:grid-cols-3">
        {destination !== null && (
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            onClick={() => onMove(task.id, destination)}
          >
            {task.status === 'done' ? <FiArrowLeft className="mb-1 inline-block" /> : <FiArrowRight className="mb-1 inline-block" />}
          </button>
        )}
        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
          onClick={() => onEdit(task)}
        >
          <FiEdit3 className="mb-1 inline-block" />
        </button>
        <button
          type="button"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          onClick={() => onDelete(task.id)}
        >
          <FiTrash2 className="mb-1 inline-block" />
        </button>
      </div>
    </article>
  );
}
