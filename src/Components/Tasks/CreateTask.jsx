/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Form,
  Button,
  Alert,
  ListGroup,
  Modal,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap'
import { UploadCloud, Paperclip } from 'lucide-react'
import { calculateLeadTime, calcDueDate } from '../../Ui/utils'
import { createTask, uploadTaskAttachment } from '../../API/tasks'
import { useAuth } from '../../contexts/AuthContext'
import createTaskIcon from '../../assets/create-task.svg'
import { useProject } from '../../contexts/ProjectContext'
import IconButton from '../../Ui/IconButton'

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function CreateTask() {
  const {
    currentProjectMembers,
    usersDataQuery,
    currentProjectId,
    refreshTasks,
  } = useProject()
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [taskType, setTaskType] = useState('design')
  const [leadTime, setLeadTime] = useState('')
  const [newReq, setNewReq] = useState('')
  const [requirements, setRequirements] = useState([])
  const [members, setMembers] = useState([])
  const [newMemberId, setNewMemberId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('worker')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [attachments, setAttachments] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)

  const addRequirement = (req) => {
    if (req.trim() && !requirements.includes(req.trim())) {
      setRequirements((prev) => [...prev, req.trim()])
    }
  }

  const removeRequirement = (indexToRemove) => {
    setRequirements((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    )
  }

  const handleFileSelect = (files) => {
    const filesArray = Array.from(files)
    const newFiles = filesArray
      .filter(
        (file) =>
          !selectedFiles.some(
            (existingFile) => existingFile.name === file.name,
          ),
      )
      .map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      }))
    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    )
  }

  const handleAddMember = () => {
    if (newMemberId && newMemberRole) {
      const userExists = currentProjectMembers.find(
        (user) => user.id === newMemberId,
      )
      if (userExists) {
        const newMemberData = {
          user: newMemberId,
          role: newMemberRole,
          username: userExists.username,
        }
        const memberExists = members.some(
          (member) => member.user === newMemberId,
        )
        if (!memberExists) {
          setMembers((prev) => [...prev, newMemberData])
          setNewMemberId('')
          setNewMemberRole('worker')
        }
      }
    }
  }

  const handleRemoveMember = (indexToRemove) => {
    setMembers((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const uploadAttachments = async () => {
    setIsUploading(true)
    const uploadPromises = selectedFiles.map(async (fileObj) => {
      const formData = new FormData()
      formData.append('file', fileObj.file)
      try {
        const response = await uploadTaskAttachment(token, 'temp', formData)
        return {
          filename: response.filename,
          url: response.url,
          contentType: response.contentType,
        }
      } catch (error) {
        console.error(`Failed to upload ${fileObj.name}:`, error)
        return null
      }
    })

    try {
      const results = await Promise.all(uploadPromises)
      setAttachments(results.filter((result) => result !== null))
      setIsUploading(false)
    } catch (error) {
      console.error('Upload failed:', error)
      setIsUploading(false)
    }
  }

  useEffect(() => {
    const calculatedLeadTime = calculateLeadTime(dueDate)
    setLeadTime(calculatedLeadTime)
  }, [dueDate])

  useEffect(() => {
    const calculatedDueDate = calcDueDate(leadTime)
    setDueDate(calculatedDueDate)
  }, [leadTime])

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      await uploadAttachments()
      return createTask(token, currentProjectId, {
        title,
        description,
        taskType,
        requirements,
        leadTime,
        dueDate,
        members,
        attachments,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
      resetForm()
    },
  })

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTaskType('design')
    setLeadTime('')
    setNewReq('')
    setRequirements([])
    setMembers([])
    setDueDate('')
    setSelectedFiles([])
    setAttachments([])
    setNewMemberId('')
    setNewMemberRole('worker')
    setShow(false)
  }

  const handleClose = () => setShow(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    createTaskMutation.mutate()
    refreshTasks()
  }

  if (!token) {
    return <Alert variant='warning'>Please log in to create new tasks.</Alert>
  }

  return (
    <div className='mx-1'>
      <IconButton
        src={createTaskIcon}
        alt='Create Task'
        onClick={() => setShow(true)}
        className=''
        iconWidthREM={7}
        color='#000'
      />

      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header
          style={{ borderWidth: '2px', borderColor: '#000' }}
          closeButton
        >
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ borderWidth: '2px', borderColor: '#000' }}>
          <Form onSubmit={handleSubmit}>
            <Row className='mb-3'>
              <Col md={8}>
                <Form.Group className='mb-3'>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter task title'
                    style={{ borderWidth: '2px', borderColor: '#000' }}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Describe your new task'
                    style={{ borderWidth: '2px', borderColor: '#000' }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Task Type</Form.Label>
                  <Form.Select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    style={{ borderWidth: '2px', borderColor: '#000' }}
                  >
                    <option value='design'>Design</option>
                    <option value='production'>Production</option>
                    <option value='quality'>Quality</option>
                    <option value='maintenance'>Maintenance</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type='date'
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ borderWidth: '2px', borderColor: '#000' }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Lead Time (days)</Form.Label>
                  <Form.Control
                    type='number'
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    placeholder='Enter estimated lead time'
                    style={{ borderWidth: '2px', borderColor: '#000' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Requirements and Team Members sections remain unchanged */}
            {/* Attachments section remains unchanged */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='primary'
            disabled={
              !title.trim() || createTaskMutation.isLoading || isUploading
            }
            className='btn-custom'
            onClick={handleSubmit}
          >
            {createTaskMutation.isLoading || isUploading
              ? 'Creating...'
              : 'Create Task'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
