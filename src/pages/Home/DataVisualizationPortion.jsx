import { useState } from 'react'
import { Card, Modal } from 'react-bootstrap'
import dataVisualizationIcon from '../../assets/preferences.svg'
export default function DataVisualizationPortion() {
  const [showVisualizationModal, setShowVisualizationModal] = useState(false)

  const handleOpenModal = () => setShowVisualizationModal(true)
  const handleCloseModal = () => setShowVisualizationModal(false)

  return (
    <>
      {/* Data Visualization portion */}
      <Card
        style={{
          borderWidth: '2.5px',
          borderColor: '#000',
          backgroundColor: '#fff',
        }}
      >
        <Card.Body className='text-center p-5'>
          <div className='d-flex flex-column align-items-center'>
            <h3>Visualize Data</h3>
            {/* Clickable data visualization icon */}
            <button
              onClick={handleOpenModal}
              style={{
                borderWidth: '2.5px',
                backgroundColor: '#FFD941', // Change color to match your theme
                borderRadius: '50%',
                height: '5rem',
                width: '5rem',
                display: 'flex',
                flex: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
              }}
              className='mb-1'
            >
              <img
                src={dataVisualizationIcon}
                alt='data visualization'
                style={{
                  width: '4rem',
                  margin: 0,
                  cursor: 'pointer',
                }}
              />
            </button>
            <p className='mt-0 mb-4' style={{ color: '#666' }}>
              Visualize your project data to gain insights and make decisions.
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Data Visualization Modal */}
      <Modal show={showVisualizationModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Data Visualization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add data visualization content here */}
          <p>Data visualization content goes here.</p>
        </Modal.Body>
      </Modal>
    </>
  )
}
