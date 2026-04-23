import { useDrop, DropTargetMonitor } from 'react-dnd';
import { Task } from '../../domain/tasks/task.model';
import { BoardColumn } from '../../domain/board/board.model';
import { TaskCard } from './task-card';

const ITEM_TYPE = 'TASK';

type DragItem = {
  id: string;
  status: Task['status'];
};

type TaskColumnProps = {
  column: BoardColumn;
  tasks: Task[];
  onDropTask: (taskId: string, status: Task['status']) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, status: Task['status']) => void;
};

export function TaskColumn({
  column,
  tasks,
  onDropTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: TaskColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: ITEM_TYPE,
    drop: (item) => {
      if (item.status !== column.status) {
        onDropTask(item.id, column.status);
      }
    },
    canDrop: (item) => item.status !== column.status,
    collect: (monitor: DropTargetMonitor<DragItem, void>) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [column.status, onDropTask]);

  return (
    <section
      ref={drop}
      className={`min-h-[400px] space-y-4 rounded-3xl border-2 border-dashed p-6 transition duration-300 ${
        isOver && canDrop
          ? 'border-slate-400 bg-slate-100/50'
          : 'border-slate-200 bg-white/50'
      }`}
    >
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">{column.title}</h2>
        <p className="text-sm text-slate-600">{column.subtitle}</p>
      </div>

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-8 text-center text-sm text-slate-500">
            Arrastra tareas aquí
          </div>
        )}
      </div>
    </section>
  );
}
