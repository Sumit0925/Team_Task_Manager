import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProject } from '../../features/projects/projectSlice'
import Modal from './Modal'
import { FolderKanban } from 'lucide-react'

export default function CreateProjectModal({ onClose }) {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((s) => s.projects)
  const [name, setName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(createProject({ name }))
    if (res.type === 'projects/create/fulfilled') onClose()
  }

  return (
    <Modal title="New Project" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-volt-500/10 border border-volt-500/20 mx-auto mb-2">
          <FolderKanban size={24} className="text-volt-400" />
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="label">Project Name</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Marketing Rebrand"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
            autoFocus
          />
          <p className="mt-1.5 text-xs text-white/30">Min. 3 characters</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? (
              <span className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin mx-auto block" />
            ) : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
