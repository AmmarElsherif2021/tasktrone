import { useState } from 'react'
import { Modal, Button, Container, Row, Col, Collapse } from 'react-bootstrap'
import settingsIcon from '../../assets/settings-icon.svg'
import ProjectUsers from './ProjectUsers'
import exportIcon from '../../assets/export-icon.svg'
import IconButton from '../../Ui/IconButton'
import projectDashboardIcon from '../../assets/dashboard-icon.svg'

// Settings Component
const Settings = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className='w-100'>
      <div className='d-flex align-items-center'>
        <IconButton
          src={settingsIcon}
          alt={'Settings'}
          onClick={() => setOpen(!open)}
          className={`me-2 ${open ? 'active' : ''}`}
        />
      </div>
      <Collapse in={open}>
        <div>
          <div className='card card-body mt-2'>
            <div className='d-flex flex-column gap-2'>
              <Button variant='outline-secondary'>General Settings</Button>
              <Button variant='outline-secondary'>Project Preferences</Button>
              <Button variant='outline-secondary'>Integrations</Button>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  )
}

// Export Project Component
const ExportProject = () => {
  const [open, setOpen] = useState(false)

  const exportOptions = ['Export Tasks', 'Export Project', 'Export Metrics']

  return (
    <div className='w-100'>
      <div className='d-flex align-items-center'>
        <IconButton
          src={exportIcon}
          alt={'Export'}
          onClick={() => setOpen(!open)}
          className={`me-2 ${open ? 'active' : ''}`}
        />
      </div>
      <Collapse in={open}>
        <div>
          <div className='card card-body mt-2'>
            <div className='d-flex flex-column gap-2'>
              {exportOptions.map((option, index) => (
                <Button key={index} variant='outline-secondary'>
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  )
}

// Project Dashboard Component
export const ProjectDashboard = () => {
  const [show, setShow] = useState(false)

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  return (
    <>
      <IconButton
        src={projectDashboardIcon}
        alt='Project dashboard'
        className='mb-0 p-0 border-0'
        onClick={handleShow}
        iconWidthREM={7}
      />

      <Modal show={show} onHide={handleClose} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Project Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row className='g-3 flex-row'>
              <Col xs={4}>
                <Settings />
              </Col>
              <Col xs={4}>
                <ProjectUsers />
              </Col>
              <Col xs={4}>
                <ExportProject />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

//export default ProjectDashboard
export { Settings, ExportProject }
