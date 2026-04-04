'use client';

import { useEffect, useMemo, useState } from 'react';
import { onValue, ref, set } from 'firebase/database';
import { database, tasksRef } from './firebase';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  progress: number;
};

const defaultTasks: Task[] = [
  { id: 'task-1', title: 'Review codebase', completed: false, progress: 40 },
  { id: 'task-2', title: 'Write documentation', completed: false, progress: 22 },
  { id: 'task-3', title: 'Prepare demo presentation', completed: false, progress: 54 },
  { id: 'task-4', title: 'Plan new project', completed: false, progress: 18 },
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const progressAverage = useMemo(() => Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length), [tasks]);

  useEffect(() => {
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const value = snapshot.val();
      if (!value) return;
      const fetched = Object.entries(value).map(([key, data]) => ({ id: key, ...(data as Omit<Task, 'id'>) }));
      setTasks((prev) => (fetched.length ? fetched : prev));
    });

    return unsubscribe;
  }, []);

  const toggleTask = async (task: Task) => {
    const updated = { ...task, completed: !task.completed, progress: task.completed ? task.progress : Math.min(100, task.progress + 15) };
    await set(ref(database, `tasks/${task.id}`), {
      title: updated.title,
      completed: updated.completed,
      progress: updated.progress,
    });
    setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)));
  };

  return (
    <section className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-panel backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Task List</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Create, track, and update tasks</h2>
        </div>
        <div className="rounded-2xl bg-slate-800/90 px-4 py-3 text-right text-sm text-slate-300">
          <p>{completedCount}/{tasks.length} done</p>
          <p className="text-amber-300">Avg. {progressAverage}%</p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-medium text-white">{task.title}</p>
                <p className="text-sm text-slate-400">{task.completed ? 'Completed' : 'In progress'}</p>
              </div>
              <button
                onClick={() => toggleTask(task)}
                className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${task.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
