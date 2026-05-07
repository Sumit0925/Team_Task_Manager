import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FolderKanban, Plus, Users, ArrowRight, Calendar } from 'lucide-react'
import { fetchProjects } from '../features/projects/projectSlice'
import { PageHeader, EmptyState, Spinner, RoleBadge } from '../components/ui/index'
import CreateProjectModal from '../components/modals/CreateProjectModal'
import { format } from 'date-fns'

export default function Projects() {
  const dispatch = useDispatch()
  const { list: projects, loading } = useSelector((s) => s.projects)
  const { user } = useSelector((s) => s.auth)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => { dispatch(fetchProjects()) }, [])

  const getUserRole = (project) => {
    const member = project.members?.find((m) => m.user?._id === user?.id || m.user === user?.id)
    return member?.role || 'member'
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''} you're part of`}
        action={
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Project
          </button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Spinner size={32} />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project and start collaborating"
          action={
            <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Create Project
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => {
            const role = getUserRole(project)
            return (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="card-hover p-6 group block"
              >
                {/* Top */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-volt-500/10 border border-volt-500/20 flex items-center justify-center">
                    <FolderKanban size={18} className="text-volt-400" />
                  </div>
                  <RoleBadge role={role} />
                </div>

                {/* Name */}
                <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-volt-300 transition-colors">
                  {project.name}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/6">
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Users size={13} />
                    <span>{project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}</span>
                  </div>
                  {project.createdAt && (
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <Calendar size={13} />
                      <span>{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  <div className="ml-auto">
                    <ArrowRight size={14} className="text-white/20 group-hover:text-volt-400 transition-colors" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
