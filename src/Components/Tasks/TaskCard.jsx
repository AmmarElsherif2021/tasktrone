import { useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Badge, Image } from 'react-bootstrap'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask, updateTask } from '../../API/tasks.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { User } from '../User/User.jsx'
import { useUserHome } from '../../contexts/UserHomeContext.jsx'
import forwardArrow from '../../assets/forward-negative.svg'
import backwardArrow from '../../assets/backward-negative.svg'
import deleteIcon from '../../assets/delete.svg'
import { getHexBackground } from '../../Ui/utils.jsx'
import TaskModal from './TaskModal.jsx'
import { DeleteWarningModal } from './DeleteTaskModal.jsx'
import { useProject } from '../../contexts/ProjectContext.jsx'
import IconButton from '../../Ui/IconButton.jsx'
export function TaskCard({
  taskId,
  projectId,
  title,
  author,
  leadTime,
  cycleTime,
  taskType,
  phase,
}) {
  const [token] = useAuth()
  const { currentUser } = useUserHome()
  const { refreshTasks } = useProject()
  const queryClient = useQueryClient()
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [hover, setHover] = useState(false)
  const phaseMutation = useMutation({
    mutationFn: ({ token, projectId, taskId, phase }) =>
      updateTask(token, projectId, taskId, { phase }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ token, projectId, taskId }) =>
      deleteTask(token, projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
    },
  })

  const handlePhaseChange = (newPhase) => {
    phaseMutation.mutate({ token, projectId, taskId, phase: newPhase })
    refreshTasks()
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    deleteMutation.mutate({ token, projectId, taskId })
    setShowDeleteModal(false)
  }

  const getNextPhase = (currentPhase) =>
    ({
      story: 'inProgress',
      inProgress: 'reviewing',
      reviewing: 'done',
    })[currentPhase]

  const getPreviousPhase = (currentPhase) =>
    ({
      done: 'reviewing',
      reviewing: 'inProgress',
      inProgress: 'story',
    })[currentPhase]

  const getPhaseLabel = (phase) =>
    ({
      story: 'Story',
      inProgress: 'In Progress',
      reviewing: 'Review',
      done: 'Done',
    })[phase] || phase

  return (
    <>
      <Card
        className='task-card shadow-sm'
        style={{
          backgroundColor: hover
            ? getHexBackground(taskType, phase, 20)
            : getHexBackground(taskType, phase, 0),
          cursor: 'pointer',
          borderWidth: '2.5px',
          borderColor: '#000',
        }}
        onClick={() => setShowTaskModal(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Card.Body className='p-3'>
          <div className='d-flex justify-content-between align-items-start mb-2'>
            <Card.Title className='h6 mb-0' style={{ maxWidth: '75%' }}>
              {title}
            </Card.Title>
            <br />

            {currentUser.id === author && (
              <IconButton
                src={deleteIcon}
                alt={'delete'}
                onClick={handleDeleteClick}
                className={'danger'}
                iconWidthREM='1rem'
                color='#ad0000'
              />
            )}
          </div>
          <Card.Subtitle style={{ color: '#ad0000' }}>
            {cycleTime > leadTime
              ? 'Exceeded deadline!'
              : cycleTime / leadTime > 0.8 || leadTime < 3
                ? 'Expires soon!'
                : ''}
          </Card.Subtitle>
          <Card.Text className='small text-muted mb-2'>
            {/*<small style={{ size: '0.4em' }}>{taskId}</small> */}
          </Card.Text>
          <div className='d-flex gap-2 mb-2'>
            <Badge
              bg='none'
              style={{
                borderWidth: '2px',
                borderColor: '#186545',
                borderRadius: '2rem',
                borderStyle: 'solid',
                padding: '0.5rem',
                color: '#186545',

                // backgroundColor: '#e6f5e9',
              }}
            >
              {' '}
              Lead: {leadTime}d{' '}
            </Badge>
            <Badge
              bg='none'
              style={{
                borderWidth: '2px',
                borderColor: '#ad0000',
                borderRadius: '2rem',
                borderStyle: 'solid',
                padding: '0.5rem',
                color: '#ad0000',
                //backgroundColor: 'none',
              }}
            >
              {' '}
              Cycle: {cycleTime}d{' '}
            </Badge>
          </div>
          {author && (
            <div className='small text-muted mb-2'>
              <span>
                {' '}
                By <User id={author} />
              </span>
            </div>
          )}
          <div className='d-flex justify-content-between gap-2'>
            {phase !== 'story' && (
              <Button
                variant='none'
                size='sm'
                className='phase-button'
                style={{
                  borderWidth: '2px',
                  borderColor: '#ad0000',
                  borderRadius: '2rem',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  const prevPhase = getPreviousPhase(phase)
                  if (prevPhase) {
                    handlePhaseChange(prevPhase)
                  }
                }}
              >
                <Image
                  src={backwardArrow}
                  width={15}
                  alt={`Move to ${getPhaseLabel(getPreviousPhase(phase))}`}
                  className='phase-button-icon'
                />
                <span
                  className='phase-button-text'
                  style={{ color: '#ad0000' }}
                >
                  <strong>
                    Move to {getPhaseLabel(getPreviousPhase(phase))}
                  </strong>
                </span>
              </Button>
            )}
            {phase !== 'done' && (
              <Button
                variant='none'
                size='sm'
                className='phase-button'
                onClick={(e) => {
                  e.stopPropagation()
                  const nextPhase = getNextPhase(phase)
                  if (nextPhase) {
                    handlePhaseChange(nextPhase)
                  }
                }}
                style={{
                  borderWidth: '2px',
                  borderColor: '#000',
                  borderRadius: '2rem',
                }}
              >
                <span className='phase-button-text' style={{ color: '#000' }}>
                  <strong> Move to {getPhaseLabel(getNextPhase(phase))}</strong>
                </span>
                <Image
                  src={forwardArrow}
                  width={15}
                  alt={`Move to ${getPhaseLabel(getNextPhase(phase))}`}
                  className='phase-button-icon'
                />
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <DeleteWarningModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={title}
      />

      {taskId && (
        <TaskModal
          show={showTaskModal}
          onHide={() => setShowTaskModal(false)}
          taskId={taskId}
          projectId={projectId}
          cardColor={getHexBackground(taskId, phase)}
        />
      )}
    </>
  )
}

TaskCard.propTypes = {
  taskId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
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
      filename: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      contentType: PropTypes.string.isRequired,
    }),
  ),
  taskType: PropTypes.string,
  startDate: PropTypes.string,
  dueDate: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  onAttachmentUpload: PropTypes.func,
}

export default TaskCard
