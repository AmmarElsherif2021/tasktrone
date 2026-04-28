import { useState, useMemo } from 'react'
import { Input, Textarea, Label } from '../../Ui/FormUi'

const INPUT_CLS = `
  w-full px-3 py-2
  border border-card-border
  bg-neutral-white
  font-mono text-sm
  focus:outline-none focus:ring-1 focus:ring-primary
`

export function CreateProject({
  users = [],
  isLoadingUsers,
  currentUserId,
  onSubmit,          // async (formData) => void
  isCreating,
  onClose,           // optional
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    members: [],
    start_date: null,
    target_completion_date: null,
    wip_limit: 5,
  })
  const [member, setMember] = useState({ userId: '', role: 'worker' })

  // Group users by team (preserving original logic)
  const usersByTeam = useMemo(() => {
    return users.reduce((acc, u) => {
      if (u?.team && u?.id) {
        if (!acc[u.team]) acc[u.team] = []
        acc[u.team].push(u)
      }
      return acc
    }, {})
  }, [users])

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
    if (member.userId === currentUserId) {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Project title is required.')
      return
    }
    onSubmit(formData)
    onClose?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <Label>Project Title *</Label>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter project title"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter project description"
          rows={3}
        />
      </div>

      {/* Start date */}
      <div>
        <Label>Start Date (Optional)</Label>
        <Input
          type="date"
          value={formData.start_date || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value || null }))}
        />
      </div>

      {/* Target completion */}
      <div>
        <Label>Target Completion Date (Optional)</Label>
        <Input
          type="date"
          value={formData.target_completion_date || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, target_completion_date: e.target.value || null }))}
        />
      </div>

      {/* WIP limit */}
      <div>
        <Label>WIP Limit</Label>
        <Input
          type="number"
          name="wip_limit"
          value={formData.wip_limit}
          onChange={handleInputChange}
          min="1"
          max="50"
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
                      .filter((u) => u.id !== currentUserId)
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
        disabled={!formData.title.trim() || isCreating}
        className="
          w-full py-2 px-4
          bg-primary text-neutral-white
          font-mono font-bold text-sm
          hover:opacity-90 transition-opacity
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        {isCreating ? 'Creating…' : 'Create Project'}
      </button>
    </form>
  )
}