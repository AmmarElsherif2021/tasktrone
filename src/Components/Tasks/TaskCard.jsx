import PropTypes from 'prop-types'
import { useState } from 'react'
import { Card, Button, Badge, Modal, ListGroup } from 'react-bootstrap'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeTaskPhase } from '../../API/tasks.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { User } from '../User/User.jsx'
import { format } from 'date-fns'

function createHexColor(id) {
  const cleanedId = id.replace(/\s/g, '')
  const firstChar = cleanedId.charAt(cleanedId.length - 1)
  const middleChar = cleanedId.charAt(cleanedId.length - 2)
  const lastChar = cleanedId.charAt(cleanedId.length - 3)
  return `#fd9${firstChar}${middleChar}${lastChar}`
}

export function TaskCard({
  taskId,
  title,
  author,
  leadTime,
  cycleTime,
  phase,
  requirements = [],
  members = [],
  attachments = [],
  createdAt,
  updatedAt,
}) {
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)

  const mutation = useMutation({
    mutationFn: ({ token, taskId, newPhase }) =>
      changeTaskPhase(token, taskId, newPhase),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
    },
  })

  const handlePhaseChange = (newPhase) => {
    mutation.mutate({ token, taskId, newPhase })
  }

  const getNextPhase = (currentPhase) => {
    const phaseFlow = {
      story: 'inProgress',
      inProgress: 'reviewing',
      reviewing: 'done',
    }
    return phaseFlow[currentPhase]
  }

  const getPhaseVariant = (phase) => {
    const variants = {
      story: 'primary',
      inProgress: 'warning',
      reviewing: 'info',
      done: 'success',
    }
    return variants[phase] || 'primary'
  }

  const getNextPhaseLabel = (currentPhase) => {
    const labels = {
      story: 'In Progress',
      inProgress: 'Review',
      reviewing: 'Done',
    }
    return labels[currentPhase]
  }

  return (
    <>
      <Card
        className='task-card'
        style={{ backgroundColor: createHexColor(taskId), cursor: 'pointer' }}
        onClick={() => setShowModal(true)}
      >
        <Card.Body className='p-2'>
          <Card.Title className='h6 mb-2'>{title}</Card.Title>
          <Card.Text className='small text-muted mb-2'>ID: {taskId}</Card.Text>

          <div className='d-flex gap-2 mb-2'>
            <Badge bg='info'>Lead: {leadTime}d</Badge>
            <Badge bg='secondary'>Cycle: {cycleTime}d</Badge>
          </div>

          {author && (
            <div className='small text-muted mb-2'>
              By <User id={author} />
            </div>
          )}

          {phase !== 'done' && (
            <Button
              variant='outline-primary'
              size='sm'
              className='w-100 btn-custom'
              onClick={(e) => {
                e.stopPropagation()
                const nextPhase = getNextPhase(phase)
                if (nextPhase) {
                  handlePhaseChange(nextPhase)
                }
              }}
            >
              Move to {getNextPhaseLabel(phase)}
            </Button>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size='lg'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div className='d-flex align-items-center gap-2'>
              {title}
              <Badge bg={getPhaseVariant(phase)} className='ms-2'>
                {phase}
              </Badge>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className='mb-4'>
            <h6 className='text-muted'>Task Information</h6>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <strong>ID:</strong> {taskId}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Author:</strong> <User id={author} />
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Lead Time:</strong> {leadTime} days
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Cycle Time:</strong> {cycleTime} days
              </ListGroup.Item>
              {createdAt && (
                <ListGroup.Item>
                  <strong>Created:</strong>{' '}
                  {format(new Date(createdAt), 'PPpp')}
                </ListGroup.Item>
              )}
              {updatedAt && (
                <ListGroup.Item>
                  <strong>Last Updated:</strong>{' '}
                  {format(new Date(updatedAt), 'PPpp')}
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>

          {requirements?.length > 0 && (
            <div className='mb-4'>
              <h6 className='text-muted'>Requirements</h6>
              <ListGroup variant='flush'>
                {requirements.map((req, index) => (
                  <ListGroup.Item key={index}>
                    <div className='d-flex align-items-center'>
                      <span className='me-2'>•</span>
                      {req}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {members?.length > 0 && (
            <div className='mb-4'>
              <h6 className='text-muted'>Team Members</h6>
              <ListGroup variant='flush'>
                {members.map((member, index) => (
                  <ListGroup.Item
                    key={index}
                    className='d-flex justify-content-between align-items-center'
                  >
                    <div className='d-flex align-items-center gap-2'>
                      <User id={member.user} />
                      <Badge bg='secondary' className='text-capitalize'>
                        {member.role}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {attachments?.length > 0 && (
            <div className='mb-4'>
              <h6 className='text-muted'>Attachments</h6>
              <ListGroup variant='flush'>
                {attachments.map((attachment, index) => (
                  <ListGroup.Item key={index}>
                    <a
                      href={attachment.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='d-flex align-items-center gap-2'
                    >
                      {attachment.filename}
                      <span className='text-muted'>
                        ({attachment.contentType})
                      </span>
                    </a>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          {phase !== 'done' && (
            <Button
              variant={getPhaseVariant(phase)}
              onClick={() => {
                const nextPhase = getNextPhase(phase)
                if (nextPhase) {
                  handlePhaseChange(nextPhase)
                }
                setShowModal(false)
              }}
            >
              Move to {getNextPhaseLabel(phase)}
            </Button>
          )}
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

TaskCard.propTypes = {
  taskId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  leadTime: PropTypes.number,
  cycleTime: PropTypes.number,
  phase: PropTypes.string,
  requirements: PropTypes.arrayOf(PropTypes.string),
  members: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string,
      role: PropTypes.oneOf(['admin', 'reviewer', 'worker']),
    }),
  ),
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.required,
      url: PropTypes.string.required,
      contentType: PropTypes.string.required,
    }),
  ),
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
}
