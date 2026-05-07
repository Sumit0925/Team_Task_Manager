import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  UserPlus,
  UserMinus,
  ChevronLeft,
  Users,
  CheckSquare,
} from "lucide-react";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchTasks } from "../features/tasks/taskSlice";
import {
  Spinner,
  PriorityBadge,
  RoleBadge,
  Avatar,
} from "../components/ui/index";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import AddMemberModal from "../components/modals/AddMemberModal";
import RemoveMemberModal from "../components/modals/RemoveMemberModal";
import TaskDetailModal from "../components/modals/TaskDetailModal";
import { format, isPast } from "date-fns";

const COLUMNS = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: projects, loading: pLoading } = useSelector((s) => s.projects);
  const { list: allTasks, loading: tLoading } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);

  const [tab, setTab] = useState("board");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showRemoveMember, setShowRemoveMember] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks(projectId));
  }, [projectId]);

  const project = projects.find((p) => p._id === projectId);
  const tasks = allTasks.filter((t) => {
    const proj = typeof t.project === "object" ? t.project._id : t.project;
    return proj === projectId;
  });

  if (pLoading && !project) {
    return (
      <div className="flex items-center justify-center h-60">
        <Spinner size={32} />
      </div>
    );
  }

  if (!project && !pLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40">Project not found.</p>
        <button
          onClick={() => navigate("/projects")}
          className="btn-secondary mt-4"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const currentMember = project?.members?.find(
    (m) => m.user?._id === user?.id || m.user === user?.id
  );
  const isAdmin = currentMember?.role === "admin";

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-4 transition-colors"
        >
          <ChevronLeft size={16} /> Projects
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">{project?.name}</h1>
            <p className="text-white/40 text-sm mt-1">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""} ·{" "}
              {project?.members?.length || 0} members
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <UserPlus size={14} /> Add Member
                </button>
                <button
                  onClick={() => setShowRemoveMember(true)}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <UserMinus size={14} /> Remove Member
                </button>
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Plus size={14} /> New Task
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-ink-900 rounded-xl border border-white/6 w-fit mb-6">
        {[
          { key: "board", label: "Board", icon: CheckSquare },
          { key: "members", label: "Members", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-ink-700 text-white"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tLoading ? (
        <div className="flex items-center justify-center h-60">
          <Spinner size={32} />
        </div>
      ) : tab === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(({ key, label }) => {
            const colTasks = tasksByStatus(key);
            return (
              <div
                key={key}
                className="rounded-2xl border border-white/6 bg-ink-900/50 p-4 min-h-[400px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        key === "todo"
                          ? "bg-white/30"
                          : key === "in-progress"
                          ? "bg-sky-400"
                          : "bg-volt-500"
                      }`}
                    />
                    <span className="text-sm font-semibold text-white">
                      {label}
                    </span>
                  </div>
                  <span className="text-xs text-white/30 font-mono">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTasks.length === 0 && (
                    <div className="text-center py-10 text-white/20 text-sm border border-dashed border-white/6 rounded-xl">
                      No tasks
                    </div>
                  )}
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-xl">
          <div className="card divide-y divide-white/6">
            {project?.members?.map((m) => {
              const memberUser =
                typeof m.user === "object"
                  ? m.user
                  : { _id: m.user, userName: "Unknown" };
              return (
                <div
                  key={memberUser._id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <Avatar name={memberUser.userName} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {memberUser.userName}
                    </p>
                    <p className="text-xs text-white/40">
                      {memberUser.email || "—"}
                    </p>
                  </div>
                  <RoleBadge role={m.role} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showCreateTask && (
        <CreateTaskModal
          projectId={projectId}
          members={project?.members || []}
          onClose={() => setShowCreateTask(false)}
        />
      )}
      {showAddMember && (
        <AddMemberModal
          projectId={projectId}
          onClose={() => setShowAddMember(false)}
        />
      )}
      {showRemoveMember && (
        <RemoveMemberModal
          projectId={projectId}
          members={project?.members || []}
          currentUserId={user?.id}
          onClose={() => setShowRemoveMember(false)}
        />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isAdmin={isAdmin}
          currentUserId={user?.id}
          members={project?.members || []}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

function TaskCard({ task, onClick }) {
  const isOverdue =
    task.dueDate && task.status !== "done" && isPast(new Date(task.dueDate));

  return (
    <div
      onClick={onClick}
      className="card p-4 cursor-pointer hover:border-volt-500/20 hover:bg-ink-800 transition-all group active:scale-95"
    >
      <p className="text-sm font-medium text-white mb-2 group-hover:text-volt-300 transition-colors line-clamp-2">
        {task.title}
      </p>
      {task.description && (
        <p className="text-xs text-white/40 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span
            className={`text-xs ${isOverdue ? "text-red-400" : "text-white/30"}`}
          >
            {isOverdue ? "⚠ " : ""}
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
      </div>
      {task.assignedTo && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
          <Avatar name={task.assignedTo?.userName || "?"} size="sm" />
          <span className="text-xs text-white/40">
            {task.assignedTo?.userName}
          </span>
        </div>
      )}
    </div>
  );
}