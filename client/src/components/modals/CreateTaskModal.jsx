import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, fetchTasks } from "../../features/tasks/taskSlice";
import Modal from "./Modal";

export default function CreateTaskModal({ projectId, members, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.tasks);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      projectId,
      assignedTo: form.assignedTo || undefined,
      dueDate: form.dueDate || undefined,
    };
    const res = await dispatch(createTask(payload));
    await dispatch(fetchTasks());
    if (res.type === "tasks/create/fulfilled") onClose();
  };

  return (
    <Modal title="Create Task" onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="label">Title *</label>
          <input
            name="title"
            type="text"
            className="input"
            placeholder="e.g. Design landing page"
            value={form.title}
            onChange={handleChange}
            required
            minLength={3}
            autoFocus
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            className="input resize-none"
            placeholder="Optional task description…"
            rows={3}
            value={form.description}
            onChange={handleChange}
            maxLength={1000}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Priority</label>
            <select
              name="priority"
              className="input"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="label">Due Date</label>
            <input
              name="dueDate"
              type="date"
              className="input"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="label">Assign To</label>
          <select
            name="assignedTo"
            className="input"
            value={form.assignedTo}
            onChange={handleChange}
          >
            <option value="">— Unassigned —</option>
            {members.map((m) => {
              const u =
                typeof m.user === "object"
                  ? m.user
                  : { _id: m.user, userName: "Unknown" };
              return (
                <option key={u._id} value={u._id}>
                  {u.userName}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
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
              "Create Task"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
