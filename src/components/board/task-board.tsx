import { useMemo, useState } from 'react';
import { Task } from '../../domain/tasks/task.model';
import { boardColumns } from '../../domain/board/board.model';
import { TaskForm } from './task-form';
import { TaskColumn } from './task-column';
import { TaskActions } from '../../domain/tasks/useTasks';

type TaskBoardProps = {
  tasks: Task[];
  actions: TaskActions;
};

export function TaskBoard({ tasks, actions }: TaskBoardProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const editingTask = useMemo(
    () => tasks.find((task) => task.id === editingTaskId) ?? null,
    [editingTaskId, tasks],
  );

  const openCreate = () => {
    setEditingTaskId(null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setEditingTaskId(null);
    setIsEditorOpen(false);
  };

  const onSubmit = (payload: { title: string; description: string; status: Task['status'] }) => {
    if (editingTask) {
      actions.updateTask(editingTask.id, payload);
    } else {
      actions.createTask(payload);
    }
    closeEditor();
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'done').length;

  return (
    <div className="w-full space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">Mi</p>
            <h1 className="text-5xl font-bold text-slate-900">Tareas</h1>
          </div>
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 active:shadow-sm"
            onClick={openCreate}
          >
            + Nueva
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/60 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-600">Total</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{totalTasks}</p>
          </div>
          <div className="rounded-2xl bg-white/60 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-600">Completadas</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{completedTasks}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {boardColumns.map((column) => (
          <TaskColumn
            key={column.status}
            column={column}
            tasks={tasks.filter((task) => task.status === column.status)}
            onDropTask={actions.moveTask}
            onEditTask={(task) => {
              setEditingTaskId(task.id);
              setIsEditorOpen(true);
            }}
            onDeleteTask={actions.deleteTask}
            onMoveTask={actions.moveTask}
          />
        ))}
      </div>

      {isEditorOpen && (
        <TaskForm
          initialTask={editingTask ?? undefined}
          onSubmit={onSubmit}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}
