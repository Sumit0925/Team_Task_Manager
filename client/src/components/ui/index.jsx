import { Loader2 } from 'lucide-react'

//* Status Badge 
const STATUS_MAP = {
  'todo': { cls: 'badge-todo', label: 'To Do' },
  'in-progress': { cls: 'badge-progress', label: 'In Progress' },
  'done': { cls: 'badge-done', label: 'Done' },
}

export function StatusBadge({ status }) {
  const { cls, label } = STATUS_MAP[status] || STATUS_MAP['todo']
  return <span className={cls}>{label}</span>
}

//* Priority Badge 
const PRIORITY_MAP = {
  'low': { cls: 'badge-low', label: 'Low' },
  'medium': { cls: 'badge-medium', label: 'Medium' },
  'high': { cls: 'badge-high', label: 'High' },
}

export function PriorityBadge({ priority }) {
  const { cls, label } = PRIORITY_MAP[priority] || PRIORITY_MAP['medium']
  return <span className={cls}>{label}</span>
}

// * Role Badge 
export function RoleBadge({ role }) {
  return (
    <span className={role === 'admin' ? 'badge-admin' : 'badge-member'}>
      {role === 'admin' ? '★ Admin' : 'Member'}
    </span>
  )
}

//* Spinner 
export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-volt-400 ${className}`} />
}

//* Empty State 
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <Icon size={24} className="text-white/30" />
      </div>
      <p className="text-white/60 font-medium mb-1">{title}</p>
      <p className="text-white/30 text-sm mb-5">{description}</p>
      {action}
    </div>
  )
}

//* Page Header
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
        {subtitle && <p className="text-white/40 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

//* Avatar
export function Avatar({ name, size = 'sm' }) {
  const initials = name?.slice(0, 2).toUpperCase() || '??'
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' }
  return (
    <div className={`${sizes[size]} rounded-lg bg-ink-700 border border-white/10 flex items-center justify-center text-white/70 font-semibold`}>
      {initials}
    </div>
  )
}

//* Stat Card
export function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div className={`card p-5 ${accent ? 'border-volt-500/20 bg-volt-500/5' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</p>
        {Icon && <Icon size={16} className={accent ? 'text-volt-400' : 'text-white/20'} />}
      </div>
      <p className={`text-3xl font-bold ${accent ? 'text-volt-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}
