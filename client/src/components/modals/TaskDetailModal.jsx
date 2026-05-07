import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTask,
  editTask,
  deleteTask,
  fetchTasks,
} from "../../features/tasks/taskSlice";
import Modal from "./Modal";
import { StatusBadge, PriorityBadge } from "../ui/index";
import {
  Calendar,
  User,
  FolderKanban,
  Tag,
  Pencil,
  Trash2,
} from "lucide-react";
import { format, isPast } from "date-fns";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];
const PRIORITY_OPTIONS = ["low", "medium", "high"];

export default function TaskDetailModal({
  task,
  isAdmin,
  currentUserId,
  members,
  onClose,
}) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.tasks);

  const assignedId = task.assignedTo?._id || task.assignedTo;
  const canUpdateStatus = isAdmin || assignedId === currentUserId;
  const isOverdue =
    task.dueDate && task.status !== "done" && isPast(new Date(task.dueDate));

  //* View vs Edit mode
  const [mode, setMode] = useState("view");

  //* Status update (view mode)
  const [status, setStatus] = useState(task.status);
  const [saved, setSaved] = useState(false);

  //* Edit form
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    priority: task.priority,
    assignedTo: task.assignedTo?._id || task.assignedTo || "",
  });

  const handleStatusSave = async () => {
    if (status === task.status) {
      onClose();
      return;
    }
    const res = await dispatch(updateTask({ taskId: task._id, status }));
    await dispatch(fetchTasks());
    if (res.type === "tasks/update/fulfilled") {
      setSaved(true);
      setTimeout(onClose, 800);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await dispatch(editTask({ taskId: task._id, ...form }));
    await dispatch(fetchTasks());
    if (res.type === "tasks/edit/fulfilled") onClose();
  };

  const handleDelete = async () => {
    const res = await dispatch(deleteTask(task._id));
    if (res.type === "tasks/delete/fulfilled") onClose();
  };

  //* Delete confirm screen
  if (mode === "delete") {
    return (
      <Modal title="Delete Task" onClose={onClose} size="sm">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <Trash2 size={20} className="text-red-400" />
          </div>
          <div>
            <p className="text-white font-medium mb-1">Delete this task?</p>
            <p className="text-white/40 text-sm">
              "<span className="text-white/60">{task.title}</span>" will be
              permanently removed.
            </p>
          </div>
          {error && (
            <p className="text-red-400 text-sm px-3 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setMode("view")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger flex-1"
              disabled={loading}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin mx-auto block" />
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  //* Edit form screen
  if (mode === "edit") {
    return (
      <Modal title="Edit Task" onClose={onClose} size="md">
        <form onSubmit={handleEdit} className="space-y-4">
          {error && (
            <p className="text-red-400 text-sm px-3 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}

          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                className="input"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="label">Priority</label>
              <select
                className="input"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value }))
                }
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p} style={{ background: "#16163a" }}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {members?.length > 0 && (
            <div>
              <label className="label">Assigned To</label>
              <select
                className="input"
                value={form.assignedTo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assignedTo: e.target.value }))
                }
              >
                <option value="" style={{ background: "#16163a" }}>
                  Unassigned
                </option>
                {members.map((m) => {
                  const u =
                    typeof m.user === "object"
                      ? m.user
                      : { _id: m.user, userName: "Unknown" };
                  return (
                    <option
                      key={u._id}
                      value={u._id}
                      style={{ background: "#16163a" }}
                    >
                      {u.userName}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setMode("view")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin mx-auto block" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  // ── View mode (default) ──
  return (
    <Modal title="Task Details" onClose={onClose} size="md">
      <div className="space-y-5">
        {/* Title row + admin actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {isOverdue && (
                <span className="badge bg-red-500/15 text-red-400">
                  ⚠ Overdue
                </span>
              )}
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setMode("edit")}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                title="Edit task"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setMode("delete")}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/5 hover:bg-red-500/15 text-red-400/50 hover:text-red-400 transition-all"
                title="Delete task"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div className="p-4 bg-ink-800 rounded-xl border border-white/5">
            <p className="text-sm text-white/70 leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetaItem
            icon={FolderKanban}
            label="Project"
            value={task.project?.name || "—"}
          />
          <MetaItem
            icon={Calendar}
            label="Due Date"
            value={
              task.dueDate
                ? format(new Date(task.dueDate), "MMM d, yyyy")
                : "No due date"
            }
            danger={isOverdue}
          />
          <MetaItem
            icon={User}
            label="Assigned To"
            value={task.assignedTo?.userName || "Unassigned"}
          />
          <MetaItem icon={Tag} label="Priority" value={task.priority} />
        </div>

        {/* Status update (assigned user or admin) */}
        {canUpdateStatus && (
          <div className="pt-4 border-t border-white/6">
            <label className="label mb-3">Update Status</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    status === value
                      ? value === "todo"
                        ? "border-white/30 bg-white/10 text-white"
                        : value === "in-progress"
                          ? "border-sky-500/40 bg-sky-500/15 text-sky-400"
                          : "border-volt-500/40 bg-volt-500/15 text-volt-400"
                      : "border-white/6 text-white/40 hover:text-white hover:border-white/20"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1">
            Close
          </button>
          {canUpdateStatus && (
            <button
              onClick={handleStatusSave}
              className="btn-primary flex-1"
              disabled={loading}
            >
              {saved ? (
                "✓ Saved!"
              ) : loading ? (
                <span className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin mx-auto block" />
              ) : (
                "Save Changes"
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function MetaItem({ icon: Icon, label, value, danger }) {
  return (
    <div className="p-3 bg-ink-800/60 rounded-xl border border-white/4">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} className="text-white/30" />
        <span className="text-xs text-white/30 uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <p
        className={`text-sm font-medium capitalize ${danger ? "text-red-400" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}
