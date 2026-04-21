// ProjectUsers.jsx
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useProject } from '../../contexts/ProjectContext'
import { getAllUsers } from '../../API/users'

const INPUT_CLS = `
  w-full px-3 py-2
  font-mono text-sm
  bg-neutral-white
  border border-card-border
  focus:outline-none focus:ring-1 focus:ring-primary
`

export const ProjectUsers = () => {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { currentProjectId, currentProjectMembers } = useProject()

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    enabled: inviteOpen,
  })

  const handleInvite = (userId) => {
    console.log(`Inviting ${userId} to ${currentProjectId}`)
    setInviteOpen(false)
  }

  return (
    <div className="w-full">
      <ul className="divide-y divide-card-border border border-card-border">
        {currentProjectMembers?.map((member) => (
          <li key={member.user.id} className="p-3 flex justify-between items-center">
            <div>
              <span className="font-mono font-bold text-sm">{member.user.username}</span>
              <br />
              <small className="font-mono text-xs text-neutral-black/60">
                Role: {member.role}
              </small>
            </div>
          </li>
        ))}

        <li className="p-3">
          <button
            className="
              px-3 py-1
              font-mono text-xs font-bold
              border border-primary text-primary
              hover:bg-card-bg transition-colors duration-fast
            "
            onClick={() => setInviteOpen((v) => !v)}
          >
            Invite Team Member
          </button>

          {inviteOpen && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="Search users…"
                className={INPUT_CLS}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul className="divide-y divide-card-border border border-card-border max-h-48 overflow-y-auto">
                {allUsers
                  .filter(
                    (u) =>
                      !currentProjectMembers.some((m) => m.user.id === u.id) &&
                      u.username.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((u) => (
                    <li key={u.id} className="p-3 flex justify-between items-center">
                      <span className="font-mono text-sm">{u.username}</span>
                      <button
                        className="
                          px-3 py-1
                          font-mono text-xs
                          border border-card-border
                          hover:bg-card-hover transition-colors duration-fast
                        "
                        onClick={() => handleInvite(u.id)}
                      >
                        Invite
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </li>
      </ul>
    </div>
  )
}