import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  CheckSquare,
  AlertTriangle,
  FolderKanban,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { fetchTasks } from "../features/tasks/taskSlice";
import { fetchProjects } from "../features/projects/projectSlice";
import { StatCard, Spinner, StatusBadge } from "../components/ui/index";
import { isPast } from "date-fns";

const COLORS = {
  todo: "#4a4a70",
  "in-progress": "#2ec4ef",
  done: "#b8f500",
};
// const PIE_COLORS = ['#4a4a70', '#2ec4ef', '#b8f500']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-ink-800 border border-white/10 rounded-xl px-3 py-2 text-sm">
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((p) => (
          <p
            key={p.name}
            style={{ color: p.fill || p.color }}
            className="font-semibold"
          >
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { list: tasks, loading: tLoading } = useSelector((s) => s.tasks);
  const { list: projects, loading: pLoading } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, []);

  const loading = tLoading || pLoading;

  // Stats
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter(
    (t) => t.dueDate && t.status !== "done" && isPast(new Date(t.dueDate)),
  ).length;

  // Status chart data
  const statusData = [
    { name: "To Do", value: todo, fill: COLORS.todo },
    { name: "In Progress", value: inProgress, fill: COLORS["in-progress"] },
    { name: "Done", value: done, fill: COLORS.done },
  ];

  // Tasks per user
  const userTaskMap = {};
  tasks.forEach((t) => {
    const name = t.assignedTo?.userName || "Unassigned";
    userTaskMap[name] = (userTaskMap[name] || 0) + 1;
  });
  const userChartData = Object.entries(userTaskMap).map(([name, count]) => ({
    name,
    count,
  }));

  // Recent tasks
  const recentTasks = [...tasks].slice(0, 5);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-white/40 text-sm mb-1">{greeting},</p>
        <h1 className="text-3xl font-bold text-white">
          {user?.userName.charAt(0).toUpperCase() + user?.userName.slice(1)}
          <span className="text-volt-400">👋</span>
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Spinner size={32} />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Tasks"
              value={total}
              icon={CheckSquare}
              accent
            />
            <StatCard
              label="In Progress"
              value={inProgress}
              icon={TrendingUp}
            />
            <StatCard label="Completed" value={done} icon={CheckSquare} />
            <StatCard label="Overdue" value={overdue} icon={AlertTriangle} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Pie chart */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-white mb-1">
                Tasks by Status
              </h3>
              <p className="text-xs text-white/30 mb-4">
                Distribution overview
              </p>
              {total === 0 ? (
                <div className="flex items-center justify-center h-40 text-white/20 text-sm">
                  No data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-white/50 text-xs">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bar chart */}
            <div className="card p-6 lg:col-span-2">
              <h3 className="text-sm font-semibold text-white mb-1">
                Tasks per Member
              </h3>
              <p className="text-xs text-white/30 mb-4">
                Workload distribution
              </p>
              {userChartData.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-white/20 text-sm">
                  No data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={userChartData} barSize={24}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Bar
                      dataKey="count"
                      name="Tasks"
                      fill="#b8f500"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent tasks */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-white">
                  Recent Tasks
                </h3>
                <Link
                  to="/tasks"
                  className="text-xs text-volt-400 hover:text-volt-300 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {recentTasks.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-8">
                  No tasks yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-ink-800/60 border border-white/5"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">
                          {task.project?.name || "—"}
                        </p>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Projects overview */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-white">
                  Your Projects
                </h3>
                <Link
                  to="/projects"
                  className="text-xs text-volt-400 hover:text-volt-300 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {projects.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-8">
                  No projects yet
                </p>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-ink-800/60 border border-white/5 hover:border-volt-500/20 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-ink-700 border border-white/10 flex items-center justify-center">
                        <FolderKanban
                          size={14}
                          className="text-white/40 group-hover:text-volt-400 transition-colors"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-white/30">
                          {project.members?.length || 0} members
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-white/20 group-hover:text-volt-400 transition-colors"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Overdue tasks warning */}
          {overdue > 0 && (
            <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400">
                You have <strong>{overdue}</strong> overdue{" "}
                {overdue === 1 ? "task" : "tasks"}.{" "}
                <Link
                  to="/tasks"
                  className="underline hover:text-red-300 transition-colors"
                >
                  Review now →
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
