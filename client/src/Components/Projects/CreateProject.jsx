import { useState, useMemo, useEffect, useRef } from 'react'
import { Input, Textarea, Label } from '../../Ui/FormUi'
import propTypes from 'prop-types'

const INPUT_CLS = `
  w-full px-3 py-2
  border border-card-border
  bg-neutral-white
  font-mono text-sm
  focus:outline-none focus:ring-1 focus:ring-primary
`

// ── Helpers ───────────────────────────────────────────────────────
const formatLabel = (str) =>
  str?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ?? ''

// ── Role permission maps ──────────────────────────────────────────
const MEMBER_ROLES = ['lead', 'contributor', 'reviewer', 'observer', 'coordinator']

const ALLOWED_PROJECT_ROLES_BY_USER_ROLE = {
  design_engineer:        ['lead', 'contributor', 'observer'],
  cad_technician:         ['contributor', 'observer'],
  cnc_programmer:         ['contributor', 'lead'],
  manufacturing_engineer: ['lead', 'contributor', 'observer'],
  machinist:              ['contributor'],
  machine_operator:       ['contributor'],
  production_supervisor:  ['lead', 'coordinator', 'observer'],
  production_planner:     ['coordinator', 'contributor', 'observer'],
  qc_inspector:           ['reviewer', 'observer'],
  metrology_engineer:     ['reviewer', 'observer'],
  inventory_manager:      ['coordinator', 'observer'],
  logistics_coordinator:  ['coordinator', 'observer'],
  maintenance_technician: ['contributor', 'observer'],
  hr_personnel:           ['observer'],
}

const ALLOWED_PROJECT_ROLES_BY_TEAM = {
  design_team:          ['lead', 'contributor', 'observer'],
  manufacturing_team:   ['lead', 'contributor', 'observer'],
  quality_control_team: ['reviewer', 'observer'],
  support_teams:        ['coordinator', 'observer'],
}

const getAllowedRolesForUser = (user) => {
  if (!user) return []
  if (user.role && ALLOWED_PROJECT_ROLES_BY_USER_ROLE[user.role])
    return ALLOWED_PROJECT_ROLES_BY_USER_ROLE[user.role]
  if (user.team && ALLOWED_PROJECT_ROLES_BY_TEAM[user.team])
    return ALLOWED_PROJECT_ROLES_BY_TEAM[user.team]
  return ['observer']
}

// ─────────────────────────────────────────────────────────────────

export function CreateProject({
  users = [],
  isLoadingUsers,
  currentUserId,
  onSubmit,
  isCreating,
  onClose,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer: '',           
    current_phase: 'concept_design',  
    priority: 'medium',    
    members: [],          
    start_date: null,
    target_completion_date: null,
    wip_limit: 5,
  })

  const [member, setMember] = useState({
    userId: '',
    role: 'contributor',
    allowedRoles: MEMBER_ROLES,
  })

  // Group users by team, sorted by role within each group
  const usersByTeam = useMemo(() => {
    return users.reduce((acc, u) => {
      if (u?.team && u?.id) {
        if (!acc[u.team]) acc[u.team] = []
        acc[u.team].push(u)
      }
      return acc
    }, {})
  }, [users])

  // Sort each team's members by role for consistent ordering
  const sortedUsersByTeam = useMemo(() => {
    return Object.fromEntries(
      Object.entries(usersByTeam).map(([team, members]) => [
        team,
        [...members].sort((a, b) => (a.role ?? '').localeCompare(b.role ?? '')),
      ])
    )
  }, [usersByTeam])

  const usersRef = useRef(users)
  useEffect(() => { usersRef.current = users })

  // Recompute allowed roles when selected user changes
  useEffect(() => {
    if (!member.userId) {
      setMember((prev) => ({ ...prev, allowedRoles: MEMBER_ROLES, role: 'contributor' }))
      return
    }
    const selectedUser = usersRef.current.find((u) => u.id === member.userId)
    const allowed = getAllowedRolesForUser(selectedUser)
    const newRole = allowed.includes(member.role) ? member.role : allowed[0]
    setMember((prev) => ({ ...prev, allowedRoles: allowed, role: newRole }))
  }, [member.userId])

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleMemberChange = (e) => {
    const { name, value } = e.target
    setMember((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMember = () => {
    if (!member.userId) return
    const selected = usersRef.current.find((u) => u.id === member.userId)
    if (!selected) return

    if (member.userId === currentUserId) {
      alert('You will be automatically added as project lead.')
      return
    }
    if (formData.members.some((m) => m.user_id === member.userId)) {
      alert('This user is already added.')
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
    setMember({ userId: '', role: 'contributor', allowedRoles: MEMBER_ROLES })
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
  onSubmit({ ...formData, created_by: currentUserId })
  onClose?.()
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div>
        <Label>Start Date (Optional)</Label>
        <Input
          type="date"
          value={formData.start_date || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, start_date: e.target.value || null }))
          }
        />
      </div>

      <div>
        <Label>Target Completion Date (Optional)</Label>
        <Input
          type="date"
          value={formData.target_completion_date || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              target_completion_date: e.target.value || null,
            }))
          }
        />
      </div>

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
       {/* ------------------- Customers ---------------------------- */}

        <div>
          <Label>Customer (Optional)</Label>
          <Input
            type="text"
            name="customer"
            value={formData.customer}
            onChange={handleInputChange}
            placeholder="Customer or client name"
          />
        </div>

        <div>
          <Label>Starting Phase</Label>
          <select
            name="current_phase"
            value={formData.current_phase}
            onChange={handleInputChange}
            className={INPUT_CLS}
          >
            {[
              'concept_design',
              'prototyping',
              'pre_production_planning',
              'production',
              'quality_control',
              'assembly_testing',
              'packaging_shipping',
              'maintenance_support',
            ].map((phase) => (
              <option key={phase} value={phase}>
                {formatLabel(phase)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Priority</Label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className={INPUT_CLS}
          >
            {['low', 'medium', 'high', 'critical'].map((p) => (
              <option key={p} value={p}>
                {formatLabel(p)}
              </option>
            ))}
          </select>
        </div>
      {/* ── Members ─────────────────────────────────────────────── */}
      <div>
        <Label>Add Project Members</Label>
        <p className="text-xs font-mono text-neutral-black/50 mb-2">
          You will be automatically added as project lead.
        </p>

        {isLoadingUsers ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Picker row */}
            <div className="flex gap-2 mb-3">
              <select
                name="userId"
                value={member.userId}
                onChange={handleMemberChange}
                className={`flex-1 ${INPUT_CLS}`}
              >
                <option value="">Select a team member</option>
                {Object.entries(sortedUsersByTeam).map(([team, teamUsers]) => (
                  <optgroup key={team} label={formatLabel(team)}>
                    {teamUsers
                      .filter((u) => u.id !== currentUserId)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name} · {formatLabel(u.role)}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>

              <select
                name="role"
                value={member.role}
                onChange={handleMemberChange}
                className={`w-36 ${INPUT_CLS}`}
                disabled={!member.userId}
              >
                {member.allowedRoles.map((role) => (
                  <option key={role} value={role}>
                    {formatLabel(role)}
                  </option>
                ))}
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
                Project Creator
              </span>
              <div className="p-2 bg-card-bg border border-card-border font-mono text-sm">
                You — <span className="text-neutral-black/60">Lead</span>
              </div>
            </div>

            {/* Added members list */}
            {formData.members.length > 0 && (
              <ul className="divide-y divide-card-border border border-card-border">
                {formData.members.map((m, index) => (
                  <li key={index} className="p-3 flex justify-between items-center">
                    <div className="font-mono text-sm">
                      <strong>{m.full_name}</strong>
                      <span className="text-neutral-black/60"> · {formatLabel(m.role)}</span>
                      <br />
                      <span className="text-xs text-neutral-black/50">
                        {formatLabel(m.team)}
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
CreateProject.propTypes = {
  users: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string.isRequired,
      username: propTypes.string.isRequired,
      full_name: propTypes.string.isRequired,
      role: propTypes.string,
      team: propTypes.string,
    })
  ),
  isLoadingUsers: propTypes.bool,
  currentUserId: propTypes.string.isRequired,
  onSubmit: propTypes.func.isRequired,
  isCreating: propTypes.bool,
  onClose: propTypes.func,
} 