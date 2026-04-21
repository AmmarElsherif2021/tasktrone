import { useState } from 'react'
import folderPlus from '../../assets/folderPlus.svg'
import { CreateProject } from '../../Components/Projects/CreateProject'
import { Modal } from '../../Ui/Modal'

export default function CreateProjectPortion() {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)

  return (
    <>
      {/* Card */}
      <div className="border-thick border-neutral-black bg-neutral-white rounded-card p-5 text-center">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3">Create your new project!</h3>
          <button
            onClick={() => setShowCreateProjectModal(true)}
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
      <Modal isOpen={showCreateProjectModal} onClose={() => setShowCreateProjectModal(false)} title="Create Project">
        <CreateProject onClose={() => setShowCreateProjectModal(false)} />
      </Modal>
    </>
  )
}