'use client';

import { useEffect, useMemo, useState } from 'react';
import { onValue, ref, set, push, remove } from 'firebase/database';
import { database, tasksRef } from './firebase';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  progress: number;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
};

const defaultTasks: Task[] = [
  { id: 'task-1', title: 'Review codebase', completed: false, progress: 40, createdAt: new Date().toISOString(), priority: 'high' },
  { id: 'task-2', title: 'Write documentation', completed: false, progress: 22, createdAt: new Date().toISOString(), priority: 'medium' },
  { id: 'task-3', title: 'Prepare demo presentation', completed: false, progress: 54, createdAt: new Date().toISOString(), priority: 'high' },
  { id: 'task-4', title: 'Plan new project', completed: false, progress: 18, createdAt: new Date().toISOString(), priority: 'low' },
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const progressAverage = useMemo(() => Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length), [tasks]);
  const totalTasks = tasks.length;
  const productivityScore = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed);
    const avgProgress = completedTasks.reduce((sum, task) => sum + task.progress, 0) / (completedTasks.length || 1);
    return Math.round((completedTasks.length / totalTasks) * 100 + avgProgress * 0.5);
  }, [tasks, totalTasks]);

  useEffect(() => {
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const value = snapshot.val();
      if (!value) return;
      const fetched = Object.entries(value).map(([key, data]) => ({ id: key, ...(data as Omit<Task, 'id'>) }));
      setTasks((prev) => (fetched.length ? fetched : prev));
    });

    return unsubscribe;
  }, []);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Omit<Task, 'id'> = {
      title: newTaskTitle.trim(),
      completed: false,
      progress: 0,
      createdAt: new Date().toISOString(),
      priority: newTaskPriority,
    };

    const newTaskRef = await push(tasksRef, newTask);
    const taskId = newTaskRef.key;
    if (taskId) {
      setTasks(prev => [...prev, { ...newTask, id: taskId }]);
    }

    setNewTaskTitle('');
    setNewTaskPriority('medium');
  };

  const toggleTask = async (task: Task) => {
    const updated = { ...task, completed: !task.completed, progress: task.completed ? task.progress : Math.min(100, task.progress + 15) };
    await set(ref(database, `tasks/${task.id}`), {
      title: updated.title,
      completed: updated.completed,
      progress: updated.progress,
      createdAt: updated.createdAt,
      priority: updated.priority,
    });
    setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)));
  };

  const updateProgress = async (taskId: string, newProgress: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updated = { ...task, progress: Math.max(0, Math.min(100, newProgress)) };
    await set(ref(database, `tasks/${taskId}`), {
      title: updated.title,
      completed: updated.completed,
      progress: updated.progress,
      createdAt: updated.createdAt,
      priority: updated.priority,
    });
    setTasks((current) => current.map((item) => (item.id === taskId ? updated : item)));
  };

  const deleteTask = async (taskId: string) => {
    await remove(ref(database, `tasks/${taskId}`));
    setTasks((current) => current.filter((item) => item.id !== taskId));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async () => {
    if (!editingTask || !editTitle.trim()) return;

    const task = tasks.find(t => t.id === editingTask);
    if (!task) return;

    const updated = { ...task, title: editTitle.trim() };
    await set(ref(database, `tasks/${editingTask}`), {
      title: updated.title,
      completed: updated.completed,
      progress: updated.progress,
      createdAt: updated.createdAt,
      priority: updated.priority,
    });
    setTasks((current) => current.map((item) => (item.id === editingTask ? updated : item)));
    setEditingTask(null);
    setEditTitle('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400/40';
      case 'medium': return 'text-amber-400 border-amber-400/40';
      case 'low': return 'text-green-400 border-green-400/40';
      default: return 'text-slate-400 border-slate-400/40';
    }
  };

  return (
    <section className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-4 sm:p-6 shadow-panel backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Task Management</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-white">Your productivity hub</h2>
          <div className="mt-2 flex gap-4 text-xs sm:text-sm text-slate-400">
            <span>Completed: {completedCount}/{totalTasks}</span>
            <span>Avg Progress: {progressAverage}%</span>
            <span>Productivity: {productivityScore}%</span>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-800/90 px-3 py-2 text-xs sm:text-sm text-slate-300">
          {completedCount} done
        </div>
      </div>

      {/* Add New Task */}
      <div className="mb-6 rounded-2xl border border-slate-700/60 bg-slate-950/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg bg-slate-800/60 border border-slate-700/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/40"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="rounded-lg bg-slate-800/60 border border-slate-700/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400/40"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button
            onClick={addTask}
            disabled={!newTaskTitle.trim()}
            className="rounded-lg bg-amber-400/20 border border-amber-400/40 px-4 py-2 text-sm font-medium text-amber-200 hover:bg-amber-400/30 transition disabled:opacity-50"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-2xl border bg-slate-950/50 p-4 transition ${
              task.completed ? 'border-green-400/30 bg-green-400/5' : 'border-slate-700/60 hover:border-amber-400/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
                className="mt-1 h-4 w-4 rounded border-slate-600 text-amber-400 focus:ring-amber-400"
              />
              <div className="flex-1 min-w-0">
                {editingTask === task.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 rounded bg-slate-800/60 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:border-amber-400/40"
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    />
                    <button
                      onClick={saveEdit}
                      className="rounded px-2 py-1 text-xs bg-green-400/20 text-green-300 hover:bg-green-400/30"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="rounded px-2 py-1 text-xs bg-slate-400/20 text-slate-300 hover:bg-slate-400/30"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-medium text-sm sm:text-base ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {task.title}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                )}

                {/* Progress Control */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-xs font-medium text-amber-300">{task.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) => updateProgress(task.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Created {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(task)}
                      className="rounded px-2 py-1 text-xs bg-slate-600/20 text-slate-300 hover:bg-slate-600/40 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded px-2 py-1 text-xs bg-red-600/20 text-red-300 hover:bg-red-600/40 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No tasks yet. Add your first task above!
        </div>
      )}
    </section>
  );
}
