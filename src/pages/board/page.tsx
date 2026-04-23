import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TaskBoard } from '../../components/board/task-board';
import { useTasks } from '../../domain/tasks/useTasks';

export default function BoardPage() {
  const { tasks, actions } = useTasks();

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10 sm:px-6">
          <TaskBoard tasks={tasks} actions={actions} />
        </div>
      </main>
    </DndProvider>
  );
}
