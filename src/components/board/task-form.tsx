import { useMemo, useState } from 'react';
import { Task, TaskStatus } from '../../domain/tasks/task.model';
import { boardColumns } from '../../domain/board/board.model';

type TaskFormValues = {
  title: string;
  description: string;
  status: TaskStatus;
};

type TaskFormProps = {
  initialTask?: Task;
  onSubmit: (payload: TaskFormValues) => void;
  onClose: () => void;
};

const emptyValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
};

export function TaskForm({ initialTask, onSubmit, onClose }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(() => ({
    title: initialTask?.title ?? emptyValues.title,
    description: initialTask?.description ?? emptyValues.description,
    status: initialTask?.status ?? emptyValues.status,
  }));

  const isValid = useMemo(
    () => values.title.trim().length > 0 && values.description.trim().length > 0,
    [values.title, values.description],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl sm:mx-4">
        <div className="space-y-6 border-b border-slate-200 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Editor</p>
              <h2 className="text-2xl font-bold text-slate-900">{initialTask ? 'Editar' : 'Nueva tarea'}</h2>
            </div>
            <button
              className="rounded-lg text-2xl text-slate-400 transition hover:text-slate-600"
              onClick={onClose}
              type="button"
            >
              ✕
            </button>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-900">Título</span>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-200"
              value={values.title}
              onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="¿Qué necesitas hacer?"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-900">Descripción</span>
            <textarea
              className="w-full min-h-[100px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-200"
              value={values.description}
              onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Agrega detalles..."
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-900">Estado</span>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-200"
              value={values.status}
              onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.value as TaskStatus }))}
            >
              {boardColumns.map((column) => (
                <option key={column.status} value={column.status}>{column.title}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex gap-3 p-6 sm:justify-end">
          <button
            type="button"
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 sm:flex-none sm:min-w-[120px]"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300 sm:flex-none sm:min-w-[120px]"
            onClick={() => onSubmit(values)}
            disabled={!isValid}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
