// CreateProject.jsx
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProject } from '../../API/projects'
import { getAllUsers } from '../../API/users'
import { useAuth } from '../../contexts/AuthContext'
import { useProject } from '../../contexts/ProjectContext'

const INPUT_CLS = `
  w-full px-3 py-2
  border border-card-border
  bg-neutral-white
  font-mono text-sm
  focus:outline-none focus:ring-1 focus:ring-primary
`

const Label = ({ children }) => (
  <label className="block text-xs font-mono font-bold mb-1 uppercase tracking-wider text-neutral-black/70">
    {children}
  </label>
)

export function CreateProject({ onClose }) {
  const { user } = useAuth()
  const { setCurrentProjectId } = useProject()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    members: [],
    start_date: null,
    target_completion_date: null,
    wip_limit: 5,
  })
  const [member, setMember] = useState({ userId: '', role: 'worker' })

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    staleTime: 30000,
  })

  const usersByTeam = users.reduce((acc, u) => {
    if (u?.team && u?.id) {
      if (!acc[u.team]) acc[u.team] = []
      acc[u.team].push(u)
    }
    return acc
  }, {})

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleMemberChange = (e) =>
    setMember((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAddMember = () => {
    if (!member.userId) return
    const selected = users.find((u) => u.id === member.userId)
    if (!selected) return
    if (formData.members.some((m) => m.user_id === member.userId)) {
      alert('This user is already added.')
      return
    }
    if (member.userId === user.id) {
      alert('You will be automatically added as project admin.')
      return
    }
    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          user_id: member.userId,
          role: member.role,
          username: selected.username,
          full_name: selected.full_name,
          team: selected.team,
        },
      ],
    }))
    setMember({ userId: '', role: 'worker' })
  }

  const handleRemoveMember = (index) =>
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }))

  const createProjectMutation = useMutation({
    mutationFn: () =>
      createProject({
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        target_completion_date: formData.target_completion_date,
        wip_limit: formData.wip_limit,
        created_by: user.id,
        project_manager: user.id,
        members: formData.members.map((m) => ({
          user_id: m.user_id,
          role: m.role,
        })),
      }),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries(['projects'])
      queryClient.invalidateQueries(['project', newProject.id])
      setCurrentProjectId(newProject.id)
      onClose?.()
    },
    onError: (error) => console.error('Create project error:', error),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Project title is required.')
      return
    }
    createProjectMutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <Label>Project Title *</Label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter project title"
          required
          className={INPUT_CLS}
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter project description"
          rows={3}
          className={INPUT_CLS}
        />
      </div>

      {/* Start date */}
      <div>
        <Label>Start Date (Optional)</Label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, start_date: e.target.value || null }))
          }
          className={INPUT_CLS}
        />
      </div>

      {/* Target completion */}
      <div>
        <Label>Target Completion Date (Optional)</Label>
        <input
          type="date"
          name="target_completion_date"
          value={formData.target_completion_date || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              target_completion_date: e.target.value || null,
            }))
          }
          className={INPUT_CLS}
        />
      </div>

      {/* WIP limit */}
      <div>
        <Label>WIP Limit</Label>
        <input
          type="number"
          name="wip_limit"
          value={formData.wip_limit}
          onChange={handleInputChange}
          min="1"
          max="50"
          className={INPUT_CLS}
        />
        <p className="text-xs font-mono text-neutral-black/50 mt-1">
          Max tasks in progress at once (1–50)
        </p>
      </div>

      {/* Members */}
      <div>
        <Label>Add Project Members</Label>
        <p className="text-xs font-mono text-neutral-black/50 mb-2">
          You will be automatically added as project admin.
        </p>

        {isLoadingUsers ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-3">
              <select
                name="userId"
                value={member.userId}
                onChange={handleMemberChange}
                className={`flex-1 ${INPUT_CLS}`}
              >
                <option value="">Select a team member</option>
                {Object.entries(usersByTeam).map(([team, teamUsers]) => (
                  <optgroup
                    key={team}
                    label={team.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  >
                    {teamUsers
                      .filter((u) => u.id !== user.id)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.username} — {u.full_name} ({u.role})
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>

              <select
                name="role"
                value={member.role}
                onChange={handleMemberChange}
                className={`w-32 ${INPUT_CLS}`}
              >
                <option value="admin">Admin</option>
                <option value="worker">Worker</option>
                <option value="reviewer">Reviewer</option>
              </select>

              <button
                type="button"
                onClick={handleAddMember}
                disabled={!member.userId}
                className="
                  px-4 py-2
                  bg-primary text-neutral-white
                  font-mono text-sm font-bold
                  hover:opacity-90 transition-opacity
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                Add
              </button>
            </div>

            {/* Creator row */}
            <div className="mb-3">
              <span className="text-xs font-mono text-neutral-black/60 block mb-1">
                Project Creator (Admin)
              </span>
              <div className="p-2 bg-card-bg border border-card-border font-mono text-sm">
                <strong>You</strong> — Admin
              </div>
            </div>

            {/* Added members list */}
            {formData.members.length > 0 && (
              <ul className="divide-y divide-card-border border border-card-border">
                {formData.members.map((m, index) => (
                  <li key={index} className="p-3 flex justify-between items-center">
                    <div className="font-mono text-sm">
                      <strong>{m.username}</strong> — {m.full_name}
                      <br />
                      <span className="text-xs text-neutral-black/60">
                        {m.role} · {m.team?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="text-role-admin hover:opacity-70 text-sm font-mono font-bold transition-opacity"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!formData.title.trim() || createProjectMutation.isPending}
        className="
          w-full py-2 px-4
          bg-primary text-neutral-white
          font-mono font-bold text-sm
          hover:opacity-90 transition-opacity
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        {createProjectMutation.isPending ? 'Creating…' : 'Create Project'}
      </button>

      {/* Error */}
      {createProjectMutation.isError && (
        <div
          className="mt-3 p-3 font-mono text-sm"
          style={{
            color: 'var(--color-role-admin)',
            backgroundColor: 'color-mix(in srgb, var(--color-role-admin) 10%, transparent)',
            border: '1px solid var(--color-role-admin)',
          }}
        >
          Error: {createProjectMutation.error.message}
        </div>
      )}
    </form>
  )
}