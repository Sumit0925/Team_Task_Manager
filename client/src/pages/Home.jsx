import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import {
  Zap, CheckSquare, Users, BarChart2,
  ArrowRight, FolderKanban, Clock
} from 'lucide-react'

const FEATURES = [
  {
    icon: FolderKanban,
    title: 'Project Management',
    desc: 'Organize work into projects with role-based access for admins and members.',
  },
  {
    icon: CheckSquare,
    title: 'Kanban Board',
    desc: 'Drag tasks across To Do, In Progress, and Done columns visually.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Invite teammates, assign tasks, and manage roles all in one place.',
  },
  {
    icon: BarChart2,
    title: 'Dashboard Analytics',
    desc: 'Get a bird\'s-eye view of workload distribution and task completion.',
  },
  {
    icon: Clock,
    title: 'Due Date Tracking',
    desc: 'Never miss a deadline — overdue tasks are highlighted automatically.',
  },
  {
    icon: Zap,
    title: 'Fast & Lightweight',
    desc: 'Built with Vite + React 19 and Tailwind v4 for instant performance.',
  },
]

export default function Home() {
  const { token } = useSelector((s) => s.auth)
  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen hero-gradient noise">
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-volt-500 rounded-lg flex items-center justify-center shadow-lg shadow-volt-500/30">
            <Zap size={16} className="text-ink-950" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 ">
          <Link to="/login" className="btn-ghost text-[0.7rem] sm:text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-[0.7rem] sm:text-sm flex items-center sm:gap-1.5">
            Get started <ArrowRight size={14} className='hidden sm:block' />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-20 pb-24 max-w-4xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-volt-500/10 border border-volt-500/20 text-volt-400 text-xs font-semibold mb-8">
          <Zap size={11} /> Team Task Management — Simplified
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
          Ship work{' '}
          <span className="text-volt-400">faster,</span>
          <br />together.
        </h1>

        <p className="text-lg text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
          TaskFlow helps teams manage projects, track tasks on kanban boards,
          and stay on top of deadlines — all in a clean, distraction-free workspace.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/signup" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <p className="section-title mb-3">Features</p>
          <h2 className="text-3xl font-bold text-white">Everything your team needs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-hover p-6 group">
              <div className="w-10 h-10 rounded-xl bg-volt-500/10 border border-volt-500/20 flex items-center justify-center mb-4 group-hover:bg-volt-500/20 transition-colors">
                <Icon size={18} className="text-volt-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="card p-10 border-volt-500/10">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to get organized?</h2>
          <p className="text-white/40 mb-8">Create your workspace in seconds. No credit card required.</p>
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            Create free account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-10 text-white/20 text-sm">
        © {new Date().getFullYear()} TaskFlow. Built by Sumit
      </footer>
    </div>
  )
}
