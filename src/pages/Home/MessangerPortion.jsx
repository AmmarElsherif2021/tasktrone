import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import flowIcon from '../../assets/flow.svg'
import { getAllUsers } from '../../API/users'
import { Modal } from '../../Ui/Modal'
import { Spinner } from '../../Ui/Spinner'

export default function MessangerPortion() {
  const [showModal, setShowModal] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    retry: 2,
    staleTime: 30000,
  })

  const usersByTeam = users.reduce((acc, user) => {
    if (user?.team && user?.id) {
      if (!acc[user.team]) acc[user.team] = []
      acc[user.team].push(user)
    }
    return acc
  }, {})

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleNotifyUsers = () => {
    console.log('Notifying users:', selectedUsers)
    setShowModal(false)
  }

  return (
    <>
      <div className="border-thick border-neutral-black bg-neutral-white rounded-card p-5 text-center shadow-sm">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3">Notify other users</h3>
          <button
            onClick={() => setShowModal(true)}
            className="border-thick bg-[#1aaa8F] rounded-full h-20 w-20 flex items-center justify-center p-4 mb-3 hover:scale-105 transition-transform"
            aria-label="Notify users"
          >
            <img src={flowIcon} alt="notify users" className="w-16 cursor-pointer" />
          </button>
          <p className="text-[#666]">
            Inform other users that you are ready to collaborate in their projects
          </p>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Notify Users">
        {isError ? (
          <div className="border-2 border-[#ad0000] bg-transparent text-[#ad0000] p-3 rounded">
            Error loading users: {error?.message || 'Please try again later'}
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="block mb-2 font-medium">Select Users to Notify</label>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto border border-neutral-black rounded p-2">
                  {Object.entries(usersByTeam).map(([team, teamUsers]) => (
                    <div key={team} className="mb-3">
                      <h6 className="font-bold mb-1">{team}</h6>
                      <ul className="space-y-1">
                        {teamUsers
                          .sort((a, b) => a.username.localeCompare(b.username))
                          .map((user) => (
                            <li
                              key={user.id}
                              className="flex justify-between items-center p-2 border-b border-gray-200 last:border-0"
                            >
                              <span>
                                <strong>{user.username}</strong> ({user.role})
                              </span>
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleUserSelection(user.id)}
                                className="w-5 h-5 accent-primary"
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleNotifyUsers}
              disabled={selectedUsers.length === 0}
              className="bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Notify Selected Users
            </button>
          </>
        )}
      </Modal>
    </>
  )
}