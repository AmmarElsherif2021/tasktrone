/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types'
import { useState, useRef } from 'react'
import { Card, Button, Badge, Modal, Image } from 'react-bootstrap'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeTaskPhase, uploadTaskAttachment } from '../../API/tasks.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { User } from '../User/User.jsx'

import forwardArrow from '../../assets/forward-negative.svg'
import backwardArrow from '../../assets/backward-negative.svg'
import { format, isValid } from 'date-fns'
import {
  UploadCloud,
  //X,
  Paperclip,
  Calendar,
  Clock,
  User as UserIcon,
} from 'lucide-react'

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
  onAttachmentUpload,
}) {
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const mutation = useMutation({
    mutationFn: ({ token, taskId, newPhase }) =>
      changeTaskPhase(token, taskId, newPhase),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
    },
  })
  function formatDate(createdAt) {
    const date = new Date(createdAt)
    return isValid(date) ? format(date, 'PP') : 'Invalid date'
  }
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      setIsUploading(true)
      setUploadProgress(0)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await uploadTaskAttachment(
          token,
          taskId,
          formData,
          (progress) => {
            setUploadProgress(progress)
          },
        )
        return response
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
      if (onAttachmentUpload) {
        onAttachmentUpload()
      }
    },
  })

  const handlePhaseChange = (newPhase) => {
    mutation.mutate({ token, taskId, newPhase })
  }

  const handleFileUpload = (files) => {
    if (files?.length) {
      uploadMutation.mutate(files[0])
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

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

  const getPhaseVariant = (phase) => {
    const variants = {
      story: 'primary',
      inProgress: 'warning',
      reviewing: 'info',
      done: 'success',
    }
    return variants[phase] || 'primary'
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

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size='lg'
        centered
        className='task-modal'
      >
        <Modal.Header closeButton className='border-0 pb-0'>
          <Modal.Title className='w-100'>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='task-title'>
                <h4 className='mb-1'>{title}</h4>
                <div className='text-muted small'>ID: {taskId}</div>
              </div>
              <Badge bg={getPhaseVariant(phase)} className='ms-2 phase-badge'>
                {getPhaseLabel(phase)}
              </Badge>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className='pt-2'>
          <div className='task-info-grid'>
            <div className='info-item'>
              <UserIcon size={16} className='text-muted' />
              <span className='info-label'>Author:</span>
              <User id={author} />
            </div>
            <div className='info-item'>
              <Clock size={16} className='text-muted' />
              <span className='info-label'>Lead Time:</span>
              {leadTime} days
            </div>
            <div className='info-item'>
              <Clock size={16} className='text-muted' />
              <span className='info-label'>Cycle Time:</span>
              {cycleTime} days
            </div>
            <div className='info-item'>
              <Calendar size={16} className='text-muted' />
              <span className='info-label'>Created:</span>
              {formatDate(new Date(createdAt), 'PP')}
            </div>
            <div className='info-item'>
              <Calendar size={16} className='text-muted' />
              <span className='info-label'>Updated:</span>
              {formatDate(new Date(updatedAt), 'PP')}
            </div>
          </div>

          {requirements?.length > 0 && (
            <div className='task-section'>
              <h6 className='section-title'>Requirements</h6>
              <div className='requirements-list'>
                {requirements.map((req, index) => (
                  <div key={index} className='requirement-item'>
                    <span className='bullet'>•</span>
                    {req}
                  </div>
                ))}
              </div>
            </div>
          )}

          {members?.length > 0 && (
            <div className='task-section'>
              <h6 className='section-title'>Team Members</h6>
              <div className='members-grid'>
                {members.map((member, index) => (
                  <div key={index} className='member-item'>
                    <User id={member.user} />
                    <Badge
                      bg='secondary'
                      className='text-capitalize role-badge'
                    >
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='task-section'>
            <h6 className='section-title'>
              <Paperclip size={16} className='me-2' />
              Attachments
            </h6>
            <div
              className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type='file'
                ref={fileInputRef}
                className='d-none'
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <UploadCloud size={24} className='mb-2' />
              <div className='text-center'>
                {isUploading ? (
                  <div className='upload-progress'>
                    <div className='progress'>
                      <div
                        className='progress-bar'
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className='mt-2'>Uploading... {uploadProgress}%</div>
                  </div>
                ) : (
                  <>
                    <div>Drag & drop files here</div>
                    <div className='text-muted small'>or click to browse</div>
                  </>
                )}
              </div>
            </div>

            {attachments?.length > 0 && (
              <div className='attachments-list mt-3'>
                {attachments.map((attachment, index) => (
                  <div key={index} className='attachment-item'>
                    <a
                      href={attachment.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='attachment-link'
                    >
                      <Paperclip size={16} className='me-2' />
                      <span className='filename'>{attachment.filename}</span>
                      <span className='content-type'>
                        ({attachment.contentType})
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className='border-0'>
          <div className='d-flex gap-2'>
            {phase !== 'story' && (
              <Button
                variant='outline-secondary'
                className='phase-button'
                onClick={() => {
                  const prevPhase = getPreviousPhase(phase)
                  if (prevPhase) {
                    handlePhaseChange(prevPhase)
                  }
                  setShowModal(false)
                }}
              >
                <Image
                  src={backwardArrow}
                  width={20}
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
                className='phase-button'
                onClick={() => {
                  const nextPhase = getNextPhase(phase)
                  if (nextPhase) {
                    handlePhaseChange(nextPhase)
                  }
                  setShowModal(false)
                }}
              >
                <span className='phase-button-text'>
                  Move to {getPhaseLabel(getNextPhase(phase))}
                </span>
                <Image
                  src={forwardArrow}
                  width={20}
                  alt={`Move to ${getPhaseLabel(getNextPhase(phase))}`}
                  className='phase-button-icon'
                />
              </Button>
            )}
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
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
  onAttachmentUpload: PropTypes.func,
}
