import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, CheckSquare, AlertTriangle } from "lucide-react";
import { fetchTasks } from "../features/tasks/taskSlice";
import {
  PageHeader,
  Spinner,
  StatusBadge,
  PriorityBadge,
  EmptyState,
  Avatar,
} from "../components/ui/index";
import TaskDetailModal from "../components/modals/TaskDetailModal";
import { format, isPast } from "date-fns";

const STATUS_OPTS = ["all", "todo", "in-progress", "done"];
const PRIORITY_OPTS = ["all", "high", "medium", "low"];

export default function Tasks() {
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  const filtered = tasks.filter((t) => {
    const matchSearch =
      !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || t.status === status;
    const matchPriority = priority === "all" || t.priority === priority;
    return matchSearch && matchStatus && matchPriority;
  });

  const overdue = filtered.filter(
    (t) => t.dueDate && t.status !== "done" && isPast(new Date(t.dueDate)),
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="All Tasks"
        subtitle={`${filtered.length} task${filtered.length !== 1 ? "s" : ""} found`}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            className="input pl-9"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 p-1 bg-ink-900 border border-white/6 rounded-xl">
          {STATUS_OPTS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                status === s
                  ? "bg-ink-700 text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {s === "all"
                ? "All"
                : s === "in-progress"
                  ? "In Progress"
                  : s === "todo"
                    ? "To Do"
                    : "Done"}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1 p-1 bg-ink-900 border border-white/6 rounded-xl">
          {PRIORITY_OPTS.map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                priority === p
                  ? "bg-ink-700 text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overdue banner */}
      {overdue.length > 0 && (
        <div className="mb-5 p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-2">
          <AlertTriangle size={15} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-400">
            <strong>{overdue.length}</strong> overdue{" "}
            {overdue.length === 1 ? "task" : "tasks"} in current view
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Spinner size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description={
            search || status !== "all" || priority !== "all"
              ? "Try adjusting your filters"
              : "Tasks assigned to you will appear here"
          }
        />
      ) : (
        <div className="card overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_160px_100px_100px_120px_100px] gap-4 px-5 py-3 border-b border-white/6">
            {[
              "Task",
              "Project",
              "Status",
              "Priority",
              "Due Date",
              "Assigned To",
            ].map((h) => (
              <span
                key={h}
                className="text-xs font-semibold uppercase tracking-wider text-white/30"
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/4">
            {filtered.map((task) => {
              const isOverdue =
                task.dueDate &&
                task.status !== "done" &&
                isPast(new Date(task.dueDate));
              return (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  className="grid grid-cols-1 md:grid-cols-[1fr_160px_100px_100px_120px_100px] gap-3 md:gap-4 px-5 py-4 cursor-pointer hover:bg-ink-800/40 transition-colors group"
                >
                  {/* Title */}
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-volt-300 transition-colors line-clamp-1">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-white/30 mt-0.5 line-clamp-1 hidden md:block">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Project */}
                  <div className="flex items-center">
                    <span className="text-xs text-white/40 truncate">
                      {task.project?.name || "—"}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <StatusBadge status={task.status} />
                  </div>

                  {/* Priority */}
                  <div className="flex items-center">
                    <PriorityBadge priority={task.priority} />
                  </div>

                  {/* Due date */}
                  <div className="flex items-center">
                    {task.dueDate ? (
                      <span
                        className={`text-xs font-medium ${isOverdue ? "text-red-400" : "text-white/40"}`}
                      >
                        {isOverdue ? "⚠ " : ""}
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="text-xs text-white/20">—</span>
                    )}
                  </div>

                  {/* Assigned */}
                  <div className="flex items-center gap-2">
                    {task.assignedTo ? (
                      <>
                        <Avatar name={task.assignedTo?.userName} size="sm" />
                        <span className="text-xs text-white/40 truncate hidden xl:block">
                          {task.assignedTo?.userName}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-white/20">Unassigned</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isAdmin={false}
          currentUserId={user?.id}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
