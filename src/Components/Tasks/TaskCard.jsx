/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Card, Button, Badge, Image } from 'react-bootstrap'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '../../API/tasks.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { User } from '../User/User.jsx'

import forwardArrow from '../../assets/forward-negative.svg'
import backwardArrow from '../../assets/backward-negative.svg'
//import { format, isValid } from 'date-fns'

//import { useUserHome } from '../../contexts/UserHomeContext.jsx'

import { getHexBackground } from '../../Ui/utils.jsx'
import TaskModal from './TaskModal.jsx'
export function TaskCard({
  taskId,
  projectId,
  title,
  author,
  leadTime,
  cycleTime,
  phase,
}) {
  const [token] = useAuth()
  //const { currentUser } = useUserHome()

  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  // const [isDragging, setIsDragging] = useState(false)
  // const fileInputRef = useRef(null)
  // const [uploadProgress, setUploadProgress] = useState(0)
  // const [isUploading, setIsUploading] = useState(false)

  const phaseMutation = useMutation({
    mutationFn: ({ token, projectId, taskId, phase }) =>
      updateTask(token, projectId, taskId, { phase }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
    },
  })

  // function formatDate(createdAt) {
  //   const date = new Date(createdAt)
  //   return isValid(date) ? format(date, 'PP') : 'Invalid date'
  // }

  // const uploadMutation = useMutation({
  //   mutationFn: async (file) => {
  //     setIsUploading(true)
  //     setUploadProgress(0)
  //     try {
  //       const formData = new FormData()
  //       formData.append('file', file)
  //       const response = await uploadTaskAttachment(token, taskId, formData)
  //       return response
  //     } finally {
  //       setIsUploading(false)
  //       setUploadProgress(0)
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['tasks', taskId])
  //     if (onAttachmentUpload) {
  //       onAttachmentUpload()
  //     }
  //   },
  // })

  const handlePhaseChange = (newPhase) => {
    phaseMutation.mutate({ token, projectId, taskId, phase: newPhase })
  }

  // const handleFileUpload = (files) => {
  //   if (files?.length) {
  //     uploadMutation.mutate(files[0])
  //   }
  // }

  // const handleDrop = (e) => {
  //   e.preventDefault()
  //   setIsDragging(false)
  //   const files = e.dataTransfer.files
  //   handleFileUpload(files)
  // }

  // const handleDragOver = (e) => {
  //   e.preventDefault()
  //   setIsDragging(true)
  // }

  // const handleDragLeave = () => {
  //   setIsDragging(false)
  // }

  const getNextPhase = (currentPhase) => {
    const phaseFlow = {
      story: 'inProgress',
      inProgress: 'reviewing',
      reviewing: 'done',
    }
    return phaseFlow[currentPhase]
  }

  const getPreviousPhase = (currentPhase) => {
    const reversePhaseFlow = {
      done: 'reviewing',
      reviewing: 'inProgress',
      inProgress: 'story',
    }
    return reversePhaseFlow[currentPhase]
  }

  const getPhaseLabel = (phase) => {
    const labels = {
      story: 'Story',
      inProgress: 'In Progress',
      reviewing: 'Review',
      done: 'Done',
    }
    return labels[phase] || phase
  }

  // const getPhaseVariant = (phase) => {
  //   const variants = {
  //     story: 'primary',
  //     inProgress: 'warning',
  //     reviewing: 'info',
  //     done: 'success',
  //   }
  //   return variants[phase] || 'primary'
  // }

  return (
    <>
      <Card
        className='task-card'
        style={{
          backgroundColor: getHexBackground(taskId, phase),
          cursor: 'pointer',
        }}
        onClick={() => setShowModal(true)}
      >
        <Card.Body className='p-2'>
          <Card.Title className='h6 mb-2'>{title}</Card.Title>
          <Card.Text className='small text-muted mb-2'>
            ID: <small>{taskId}</small>
          </Card.Text>

          <div className='d-flex gap-2 mb-2'>
            <Badge bg='info'>Lead: {leadTime}d</Badge>
            <Badge bg='secondary'>Cycle: {cycleTime}d</Badge>
          </div>

          {author && (
            <div className='small text-muted mb-2'>
              By <User id={author} />
            </div>
          )}

          <div className='d-flex justify-content-between gap-2'>
            {phase !== 'story' && (
              <Button
                variant='outline-secondary'
                size='sm'
                className='phase-button'
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
                <span className='phase-button-text'>
                  Move to {getPhaseLabel(getPreviousPhase(phase))}
                </span>
              </Button>
            )}
            {phase !== 'done' && (
              <Button
                variant='outline-primary'
                size='sm'
                className='phase-button'
                onClick={(e) => {
                  e.stopPropagation()
                  const nextPhase = getNextPhase(phase)
                  if (nextPhase) {
                    handlePhaseChange(nextPhase)
                  }
                }}
              >
                <span className='phase-button-text'>
                  Move to {getPhaseLabel(getNextPhase(phase))}
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

      {taskId && (
        <TaskModal
          show={showModal}
          onHide={() => setShowModal(false)}
          taskId={taskId}
          projectId={projectId}
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
      filename: PropTypes.string.required,
      url: PropTypes.string.required,
      contentType: PropTypes.string.required,
    }),
  ),
  startDate: PropTypes.startDate,
  dueDate: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  onAttachmentUpload: PropTypes.func,
}
