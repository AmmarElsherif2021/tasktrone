/* eslint-disable react/prop-types */
//import PropTypes from 'prop-types'
import { Card, Modal, ListGroup } from 'react-bootstrap'
import { StyledBadge } from '../../Ui/StyledBadge.jsx'
import { User } from '../User/User.jsx'
import { useProject } from '../../contexts/ProjectContext.jsx'
import { useState, useEffect } from 'react'
import StaticRoundBtn from '../../Ui/StaticRoundBtn.jsx'
import { useNavigate } from 'react-router-dom'

// Style constants

const BORDER_STYLE = {
  width: '2.5px',
  color: '#000',
}
const CARD_STYLE = {
  cursor: 'pointer',
  borderWidth: BORDER_STYLE.width,
  borderColor: BORDER_STYLE.color,
  transition: 'background-color 0.3s ease',
  fontFamily: 'var(--font-family-mono)',
  fontWeight: 'var(--font-weight-bold)',
  color: '#000',
}
const SCROLL_CONTAINER_STYLE = {
  height: '30vh',
  overflowY: 'auto',
  padding: '5px',
  margin: '5px',
}

// Utility functions
function createHexColor(id) {
  const cleanedId = id.replace(/\s/g, '')
  const chars = cleanedId.slice(-2).split('')
  return `#f8${chars.join('')}5f`
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
  const cardBgColor = createHexColor(projectId)
  const modalBg = `${cardBgColor}99`

  const handleProjectClick = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)
  const openProjectClick = () => setCurrentProjectId(projectId)

  useEffect(() => {
    if (currentProjectId === projectId) navigate('/project')
  }, [currentProjectId, projectId, navigate])

  return (
    <>
      <Card
        onClick={handleProjectClick}
        className='h-100 project-card'
        style={{
          ...CARD_STYLE,
          backgroundColor: hover ? `${cardBgColor}30` : cardBgColor,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Card.Body className='p-2 d-flex flex-column justify-content-between align-items-center'>
          <div className='d-flex justify-content-between align-items-center mb-1'>
            <Card.Title
              className='h6 px-1 mb-2 w-100 text-center'
              style={{ fontSize: '1.1em' }}
            >
              {title}
            </Card.Title>
          </div>
          <StyledBadge>{projectId.slice(-6)}</StyledBadge>
          {createdBy && (
            <Card.Subtitle className='small text-muted my-3'>
              Created by <User id={createdBy} />
            </Card.Subtitle>
          )}

          <Card.Text className='small text-muted my-2 mx-2 truncate-text'>
            {description.slice(0, 50)} <strong>...continue</strong>
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: modalBg,
            borderWidth: BORDER_STYLE.width,
            borderColor: BORDER_STYLE.color,
          }}
        >
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: modalBg }}>
          <div
            style={{
              ...SCROLL_CONTAINER_STYLE,
              backgroundColor: '#fff',
              border: `${BORDER_STYLE.width} solid ${BORDER_STYLE.color}`,
              borderRadius: '7px',
            }}
          >
            <p>{description}</p>
          </div>

          <ListGroup variant='flush' style={SCROLL_CONTAINER_STYLE}>
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
                <StyledBadge role={member.role}>{member.role}</StyledBadge>
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

// PropTypes remain the same
