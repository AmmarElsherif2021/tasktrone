// CreateProjectPortion.jsx
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import folderPlus from '../../assets/folderPlus.svg'
import { CreateProject } from '../../Components/Projects/CreateProject'
import { Modal } from '../../Ui/Modal'
import { useAuth } from '../../contexts/AuthContext'
import { useProject } from '../../contexts/ProjectContext'
import { createProject } from '../../API/projects'   // you’ll need this API function

export default function CreateProjectPortion() {
  const { user } = useAuth()
  const { users, fetchUsers } = useProject()
  const queryClient = useQueryClient()

  const [showModal, setShowModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Lazy‑load users when the modal opens
  const handleOpenModal = () => {
    setShowModal(true)
    if (users.length === 0) {
      fetchUsers()
    }
  }

  // Mutation to create the project
  const createProjectMutation = useMutation({
    mutationFn: (formData) => createProject(formData),
    onMutate: () => setIsCreating(true),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])   // refresh project lists
      setShowModal(false)
    },
    onError: (error) => {
      alert(error?.message || 'Project creation failed')
    },
    onSettled: () => {
      setIsCreating(false)
    },
  })

  const handleSubmit = (formData) => {
    createProjectMutation.mutate(formData)
  }

  return (
    <>
      {/* Card */}
      <div className="border-thick border-neutral-black bg-neutral-white rounded-card p-5 text-center">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3">Create your new project!</h3>
          <button
            onClick={handleOpenModal}
            className="border-thick bg-[#FFD941] rounded-full h-20 w-20 flex items-center justify-center p-4 mb-1 hover:scale-105 transition-transform"
            aria-label="Create project"
          >
            <img src={folderPlus} alt="add project" className="w-16 cursor-pointer" />
          </button>
          <p className="mt-0 mb-4 text-[#666]">
            No manufacturing projects found. Create your first project to get started!
          </p>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Project"
      >
        <CreateProject
          users={users}
          isLoadingUsers={users.length === 0 && showModal}   // show spinner while lazy‑loading
          currentUserId={user?.id}
          onSubmit={handleSubmit}
          isCreating={isCreating}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </>
  )
}