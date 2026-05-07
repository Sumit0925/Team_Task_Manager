import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMember, fetchProjects } from "../../features/projects/projectSlice";
import Modal from "./Modal";
import { UserPlus, Info } from "lucide-react";

export default function AddMemberModal({ projectId, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.projects);
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(addMember({ projectId, userId: userId.trim() }));
    await dispatch(fetchProjects());
    if (res.type === "projects/addMember/fulfilled") onClose();
  };

  return (
    <Modal title="Add Member" onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 mx-auto mb-1">
          <UserPlus size={20} className="text-sky-400" />
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="label">User ID</label>
          <input
            type="text"
            className="input font-mono text-sm"
            placeholder="Paste the member's User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Clear instructions */}
        <div className="flex gap-2.5 p-3 bg-ink-800 rounded-xl border border-white/6">
          <Info size={14} className="text-volt-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/50 leading-relaxed">
            Ask the person to go to their{" "}
            <span className="text-volt-400 font-medium">Profile page</span>{" "}
            (bottom of the sidebar) and copy their User ID, then paste it here.
          </p>
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
            disabled={loading || !userId.trim()}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin mx-auto block" />
            ) : (
              "Add Member"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
