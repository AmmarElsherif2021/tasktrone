import PropTypes from 'prop-types'
import { Card, Badge, Modal, ListGroup } from 'react-bootstrap'
import { User } from '../User/User.jsx'
import { useProject } from '../../contexts/ProjectContext.jsx'
import { useState, useEffect } from 'react'
import StaticRoundBtn from '../../Ui/StaticRoundBtn.jsx'
import { useNavigate } from 'react-router-dom'

function createHexColor(id) {
  const cleanedId = id.replace(/\s/g, '')
  const firstChar = cleanedId.charAt(cleanedId.length - 1)
  const middleChar = cleanedId.charAt(cleanedId.length - 2)
  const lastChar = cleanedId.charAt(cleanedId.length - 3)
  return `#ffa${firstChar}${middleChar}${lastChar}`
}

export function ProjectCard({
  projectId,
  title,
  description,
  createdBy,
  members,
}) {
  const navigate = useNavigate()
  const { setCurrentProjectId, currentProjectId } = useProject()
  const [hover, setHover] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleProjectClick = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const openProjectClick = () => {
    setCurrentProjectId(projectId)
  }

  useEffect(() => {
    if (currentProjectId === projectId) {
      navigate('/project')
    }
  }, [currentProjectId, projectId, navigate])

  const cardBgColor = createHexColor(projectId)

  return (
    <>
      <Card
        onClick={handleProjectClick}
        className='h-100'
        style={{
          cursor: 'pointer',
          backgroundColor: hover ? `${cardBgColor}30` : cardBgColor,
          borderWidth: '2.5px',
          borderColor: '#000',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Card.Body className='p-2 d-flex flex-column justify-content-between align-items-center custom-modal'>
          <div className='d-flex justify-content-between align-items-center mb-1'>
            <Card.Title
              className='h6 p-0 mb-0 w-100 custom-modal'
              style={{
                fontSize: '1.2em',
                maxWidth: '99%',
                textAlign: 'center',
              }}
            >
              {title}
            </Card.Title>
          </div>

          <Badge
            bg='none'
            className='text-nowrap'
            style={{
              borderWidth: '2px',
              borderColor: '#000',
              borderRadius: '1rem',
              borderStyle: 'solid',
              padding: '0.5rem',
              margin: '1px',
              backgroundColor: '#000',
              color: '#fff',
              width: '5rem',
            }}
          >
            {projectId.slice(-6)}
          </Badge>
          {createdBy && (
            <Card.Subtitle className='small text-muted my-2'>
              Created by <User id={createdBy} />
            </Card.Subtitle>
          )}
          <Card.Text
            className='small text-muted my-2 mx-2'
            style={{ maxWidth: '90%' }}
          >
            {description.slice(0, 50)} <strong>...continue</strong>
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: `${cardBgColor}99`,
            borderWidth: '2px',
            borderColor: '#000',
          }}
        >
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: `${cardBgColor}99` }}>
          <div
            style={{
              borderStyle: 'solid',
              borderWidth: '2.5px',
              borderColor: '#000',
              borderRadius: '10px',
              borderSpacing: '5px',
              height: '30vh',
              overflowY: 'auto',
              margin: '5px',
              padding: '5px',
              backgroundColor: '#fff',
            }}
          >
            <p>{description}</p>
          </div>
          <ListGroup
            variant='flush'
            style={{
              height: '20vh',
              overflowY: 'auto',
              padding: '5px',
              margin: '10px',
            }}
          >
            {members.map((member) => (
              <ListGroup.Item
                key={member.user}
                className='d-flex justify-content-between align-items-center px-0 flex-wrap gap-2'
                style={{
                  border: 'none',
                  fontSize: '0.8em',
                  backgroundColor: 'transparent',
                }}
              >
                <div className='text-truncate'>
                  <User id={member.user} />
                </div>
                <Badge
                  bg='none'
                  className='text-nowrap'
                  style={{
                    borderWidth: '2px',
                    borderColor:
                      member.role === 'admin'
                        ? '#ad0000'
                        : member.role === 'reviewer'
                          ? '#186545'
                          : '#000',
                    borderRadius: '2rem',
                    borderStyle: 'solid',
                    padding: '0.5rem',
                    color:
                      member.role === 'admin'
                        ? '#ad0000'
                        : member.role === 'reviewer'
                          ? '#186545'
                          : '#000',
                  }}
                >
                  {member.role}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <StaticRoundBtn
            alt='open'
            handleClick={openProjectClick}
            color='#126a41'
            backgroundColor='transparent'
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

ProjectCard.propTypes = {
  projectId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      role: PropTypes.oneOf(['admin', 'reviewer', 'worker']).isRequired,
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default ProjectCard
