import { useState } from 'react'
import { Card, Modal } from 'react-bootstrap'
import folderPlus from '../../assets/folderPlus.svg'
import { CreateProject } from '../../Components/Projects/CreateProject'

export default function CreateProjectPortion() {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)

  const handleOpenModal = () => setShowCreateProjectModal(true)
  const handleCloseModal = () => setShowCreateProjectModal(false)

  return (
    <>
      {/* Create new project portion */}
      <Card
        style={{
          borderWidth: '2.5px',
          borderColor: '#000',
          backgroundColor: '#fff',
        }}
      >
        <Card.Body className='text-center p-5'>
          <div className='d-flex flex-column align-items-center'>
            <h3>Create your new project!</h3>
            {/* Clickable folderPlus icon */}
            <button
              onClick={handleOpenModal}
              style={{
                borderWidth: '2.5px',
                backgroundColor: '#FFD941',
                borderRadius: '50%',
                height: '5rem',
                width: '5rem',
                display: 'flex',
                flex: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
              }}
              className=' mb-1'
            >
              <img
                src={folderPlus}
                alt='add project'
                style={{
                  width: '4rem',
                  margin: 0,
                  cursor: 'pointer',
                }}
              />
            </button>
            <p className='mt-0 mb-4' style={{ color: '#666' }}>
              No manufacturing projects found. Create your first project to get
              started!
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* CreateProject Modal */}
      <Modal show={showCreateProjectModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateProject onClose={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </>
  )
}
