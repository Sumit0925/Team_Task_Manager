import { useState } from 'react'
import { useSelector } from 'react-redux'
import { User, Copy, CheckCheck, Mail, Hash, Shield } from 'lucide-react'
import { PageHeader } from '../components/ui/index'

export default function Profile() {
  const { user } = useSelector((s) => s.auth)
  const [copied, setCopied] = useState(false)

  const userId = user?.id || user?._id || ''

  const copyId = () => {
    if (!userId) return
    navigator.clipboard.writeText(userId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const initials = user?.userName?.slice(0, 2).toUpperCase() || '??'

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader
        title="Profile"
        subtitle="Your account details and shareable ID"
      />

      {/* Avatar + name card */}
      <div className="card p-6 mb-4 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-volt-500/20 border border-volt-500/30 flex items-center justify-center text-volt-400 text-2xl font-bold shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.userName}</h2>
          <p className="text-white/40 text-sm mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Info fields */}
      <div className="card divide-y divide-white/6 mb-4">
        <InfoRow icon={User} label="Username" value={user?.userName} />
        <InfoRow icon={Mail} label="Email" value={user?.email} />
        <InfoRow icon={Shield} label="Account type" value="Member" />
      </div>

      {/* User ID — the key section */}
      <div className="card p-5 border-volt-500/20 bg-volt-500/3">
        <div className="flex items-center gap-2 mb-3">
          <Hash size={14} className="text-volt-400" />
          <p className="text-xs font-semibold uppercase tracking-wider text-volt-400">Your User ID</p>
        </div>

        <p className="text-white/50 text-sm mb-4 leading-relaxed">
          Share this ID with a project admin so they can add you as a member to their project.
        </p>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-ink-800 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white/70 truncate select-all">
            {userId || 'ID not available — try logging out and back in'}
          </div>
          <button
            onClick={copyId}
            disabled={!userId}
            className={`shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              copied
                ? 'bg-volt-500/20 border border-volt-500/40 text-volt-400'
                : 'btn-primary'
            }`}
          >
            {copied ? (
              <><CheckCheck size={15} /> Copied!</>
            ) : (
              <><Copy size={15} /> Copy ID</>
            )}
          </button>
        </div>

        {/* Instruction callout */}
        <div className="mt-4 p-3 bg-ink-800/60 rounded-xl border border-white/6 text-xs text-white/40 leading-relaxed">
          💡 <strong className="text-white/60">How to join a project:</strong> Copy your ID above and send it to the project admin. They'll paste it into the "Add Member" dialog.
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-white/30" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/30 uppercase tracking-wider font-medium mb-0.5">{label}</p>
        <p className="text-sm text-white font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  )
}
