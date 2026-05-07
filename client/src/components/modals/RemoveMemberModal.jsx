import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, removeMember } from "../../features/projects/projectSlice";
import Modal from "./Modal";
import { Avatar, RoleBadge } from "../ui/index";

export default function RemoveMemberModal({
  projectId,
  members,
  currentUserId,
  onClose,
}) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.projects);
  const [selectedUserId, setSelectedUserId] = useState("");

  //* Exclude the current admin from remove list
  const removableMembers = members.filter((m) => {
    const id = typeof m.user === "object" ? m.user._id : m.user;
    return id !== currentUserId;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    const res = await dispatch(
      removeMember({ projectId, userId: selectedUserId }),
    );
    await dispatch(fetchProjects());
    if (res.type === "projects/removeMember/fulfilled") onClose();
  };

  return (
    <Modal title="Remove Member" onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {removableMembers.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-6">
            No other members to remove.
          </p>
        ) : (
          <div>
            <label className="label">Select Member to Remove</label>
            <div className="space-y-2 mt-2">
              {removableMembers.map((m) => {
                const u =
                  typeof m.user === "object"
                    ? m.user
                    : { _id: m.user, userName: "Unknown" };
                return (
                  <label
                    key={u._id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedUserId === u._id
                        ? "border-red-500/40 bg-red-500/10"
                        : "border-white/6 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="member"
                      value={u._id}
                      checked={selectedUserId === u._id}
                      onChange={() => setSelectedUserId(u._id)}
                      className="hidden"
                    />
                    <Avatar name={u.userName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">
                        {u.userName}
                      </p>
                    </div>
                    <RoleBadge role={m.role} />
                  </label>
                );
              })}
            </div>
          </div>
        )}

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
            className="btn-danger flex-1"
            disabled={
              loading || !selectedUserId || removableMembers.length === 0
            }
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin mx-auto block" />
            ) : (
              "Remove"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
