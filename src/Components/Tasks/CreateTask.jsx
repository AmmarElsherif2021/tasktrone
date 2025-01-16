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
  //const handleShow = () => setShow(true)
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

      <Modal show={show} onHide={() => setShow(false)} size='lg'>
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

            <Row className='mb-3'>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Requirements</Form.Label>
                  <div className='d-flex gap-2 mb-2'>
                    <Form.Control
                      type='text'
                      value={newReq}
                      onChange={(e) => setNewReq(e.target.value)}
                      placeholder='Add a requirement'
                      style={{ borderWidth: '2px', borderColor: '#000' }}
                    />
                    <Button
                      variant='outline-primary'
                      onClick={() => {
                        addRequirement(newReq)
                        setNewReq('')
                      }}
                      className='btn-custom'
                      style={{ borderWidth: '2px', borderColor: '#000' }}
                    >
                      Add
                    </Button>
                  </div>
                  {requirements.length > 0 && (
                    <ListGroup
                      style={{ borderWidth: '2px', borderColor: '#000' }}
                    >
                      {requirements.map((req, index) => (
                        <ListGroup.Item
                          key={index}
                          className='d-flex justify-content-between align-items-center'
                          style={{ borderWidth: '2px', borderColor: '#000' }}
                        >
                          {req}
                          <Button
                            variant='outline-danger'
                            onClick={() => removeRequirement(index)}
                            className='btn-custom'
                            style={{ borderWidth: '2px', borderColor: '#000' }}
                          >
                            Remove
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Team Members</Form.Label>
                  <div className='d-flex gap-2 mb-2'>
                    <Form.Select
                      value={newMemberId}
                      onChange={(e) => setNewMemberId(e.target.value)}
                      style={{ borderWidth: '2px', borderColor: '#000' }}
                    >
                      <option value=''>Select a user</option>
                      {usersDataQuery.isLoading && (
                        <Spinner animation='border' />
                      )}
                      {currentProjectMembers?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      style={{
                        width: '120px',
                        borderWidth: '2px',
                        borderColor: '#000',
                      }}
                    >
                      <option value='worker'>Worker</option>
                      <option value='reviewer'>Reviewer</option>
                      <option value='admin'>Admin</option>
                    </Form.Select>
                    <Button
                      variant='outline-primary'
                      onClick={handleAddMember}
                      className='btn-custom'
                      disabled={!newMemberId}
                      style={{ borderWidth: '2px', borderColor: '#000' }}
                    >
                      Add
                    </Button>
                  </div>
                  {members.length > 0 && (
                    <ListGroup
                      style={{ borderWidth: '2px', borderColor: '#000' }}
                    >
                      {members.map((member, index) => {
                        const user = currentProjectMembers.find(
                          (u) => u.id === member.user,
                        )
                        return (
                          <ListGroup.Item
                            key={index}
                            className='d-flex justify-content-between align-items-center'
                            style={{ borderWidth: '2px', borderColor: '#000' }}
                          >
                            <div>
                              {user ? user.username : 'Unknown User'} (
                              {member.role})
                            </div>
                            <Button
                              variant='outline-danger'
                              onClick={() => handleRemoveMember(index)}
                              className='btn-custom'
                              style={{
                                borderWidth: '2px',
                                borderColor: '#000',
                              }}
                            >
                              Remove
                            </Button>
                          </ListGroup.Item>
                        )
                      })}
                    </ListGroup>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className='mb-3'>
              <Form.Label>Attachments</Form.Label>
              <div
                className='file-drop-zone'
                onClick={(e) => fileInputRef.current?.click(e.target)}
                style={{
                  border: '2px solid #000',
                  borderRadius: '4px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type='file'
                  ref={fileInputRef}
                  className='d-none'
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <UploadCloud size={24} className='mb-2' />
                <div>Click to select files or drag and drop</div>
              </div>

              {selectedFiles.length > 0 && (
                <ListGroup
                  className='mt-2'
                  style={{ borderWidth: '2px', borderColor: '#000' }}
                >
                  {selectedFiles.map((fileObj, index) => (
                    <ListGroup.Item
                      key={index}
                      className='d-flex justify-content-between align-items-center'
                      style={{ borderWidth: '2px', borderColor: '#000' }}
                    >
                      <div>
                        <Paperclip size={16} className='me-2' />
                        {fileObj.name}
                        <span className='text-muted ms-2'>
                          ({formatFileSize(fileObj.size)})
                        </span>
                      </div>
                      <Button
                        variant='outline-danger'
                        onClick={() => handleRemoveFile(index)}
                        className='btn-custom'
                        style={{ borderWidth: '2px', borderColor: '#000' }}
                      >
                        Remove
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form.Group>

            {createTaskMutation.isSuccess && (
              <Alert variant='success' className='mt-2'>
                Task created successfully!
              </Alert>
            )}
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
