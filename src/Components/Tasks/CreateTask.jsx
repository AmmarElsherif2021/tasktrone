/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useRef } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
  Form,
  Button,
  // Card,
  Alert,
  ListGroup,
  Modal,
  Image,
  Row,
  Col,
} from 'react-bootstrap'
import { UploadCloud, Paperclip } from 'lucide-react'

import { createTask, uploadTaskAttachment } from '../../API/tasks'
import { getAllUsers } from '../../API/users'
import { useAuth } from '../../contexts/AuthContext'
import createTaskIcon from '../../assets/create-task-negative.svg'

// Utility Functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function CreateTask() {
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [leadTime, setLeadTime] = useState('')
  const [newReq, setNewReq] = useState('')
  const [newMemberId, setNewMemberId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('worker')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [attachments, setAttachments] = useState([])
  const [, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const [token] = useAuth()
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)

  // State management helpers
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

  const [requirements, setRequirements] = useState([])
  const [members, setMembers] = useState([])

  // Query to fetch all users
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    select: (data) => data?.users || [],
    onError: (error) => {
      console.error('Failed to fetch users:', error)
      return []
    },
  })

  const users = usersData || []

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
      const userExists = users.find((user) => user.id === newMemberId)
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
        const response = await uploadTaskAttachment(
          token,
          'temp',
          formData,
          (progress) => setUploadProgress(progress),
        )
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

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      // First upload attachments
      await uploadAttachments()

      // Then create task with uploaded attachments
      return createTask(token, {
        title,
        requirements,
        leadTime,
        members,
        attachments,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
      resetForm()
    },
    onError: (error) => {
      console.error('Failed to create task:', error)
    },
  })

  const resetForm = () => {
    setTitle('')
    setLeadTime('')
    setNewReq('')
    setRequirements([])
    setMembers([])
    setSelectedFiles([])
    setAttachments([])
    setNewMemberId('')
    setNewMemberRole('worker')
    setShow(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      console.error('Task title is required')
      return
    }

    createTaskMutation.mutate()
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  if (!token) {
    return <Alert variant='warning'>Please log in to create new tasks.</Alert>
  }

  return (
    <>
      <div className='mb-4'>
        <Button
          variant='primary'
          onClick={handleShow}
          className='btn-custom mb-4'
        >
          <Image
            src={createTaskIcon}
            width={27}
            style={{ marginRight: '5px' }}
          />
          Create New Task
        </Button>

        <Modal show={show} onHide={handleClose} size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Create New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {/* Title and Lead Time Row */}
              <Row className='mb-3'>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      size='sm'
                      type='text'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='Enter task title'
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Lead Time (days)</Form.Label>
                    <Form.Control
                      size='sm'
                      type='number'
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      placeholder='Enter estimated lead time'
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Requirements Section */}
              <Row className='mb-3'>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Requirements</Form.Label>
                    <div className='d-flex gap-2 mb-2'>
                      <Form.Control
                        size='sm'
                        type='text'
                        value={newReq}
                        onChange={(e) => setNewReq(e.target.value)}
                        placeholder='Add a requirement'
                      />
                      <Button
                        size='sm'
                        variant='outline-primary'
                        onClick={() => {
                          addRequirement(newReq)
                          setNewReq('')
                        }}
                        className='btn-custom'
                      >
                        Add
                      </Button>
                    </div>
                    {requirements.length > 0 && (
                      <ListGroup>
                        {requirements.map((req, index) => (
                          <ListGroup.Item
                            key={index}
                            className='d-flex justify-content-between align-items-center p-1'
                          >
                            {req}
                            <Button
                              size='sm'
                              variant='outline-danger'
                              onClick={() => removeRequirement(index)}
                              className='btn-custom'
                            >
                              Remove
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Form.Group>
                </Col>

                {/* Members Section */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Team Members</Form.Label>
                    <div className='d-flex gap-2 mb-2'>
                      <Form.Select
                        size='sm'
                        value={newMemberId}
                        onChange={(e) => setNewMemberId(e.target.value)}
                        disabled={isLoadingUsers}
                      >
                        <option value=''>Select a user</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Select
                        size='sm'
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        style={{ width: '120px' }}
                      >
                        <option value='worker'>Worker</option>
                        <option value='reviewer'>Reviewer</option>
                        <option value='admin'>Admin</option>
                      </Form.Select>
                      <Button
                        size='sm'
                        variant='outline-primary'
                        onClick={handleAddMember}
                        className='btn-custom'
                        disabled={!newMemberId}
                      >
                        Add
                      </Button>
                    </div>
                    {members.length > 0 && (
                      <ListGroup>
                        {members.map((member, index) => {
                          const user = users.find((u) => u.id === member.user)
                          return (
                            <ListGroup.Item
                              key={index}
                              className='d-flex justify-content-between align-items-center p-1'
                            >
                              <div>
                                {user ? user.username : 'Unknown User'} (
                                {member.role})
                              </div>
                              <Button
                                size='sm'
                                variant='outline-danger'
                                onClick={() => handleRemoveMember(index)}
                                className='btn-custom'
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

              {/* File Upload Section */}
              <Form.Group className='mb-3'>
                <Form.Label>Attachments</Form.Label>
                <div
                  className='file-drop-zone'
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #ccc',
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
                  <ListGroup className='mt-2'>
                    {selectedFiles.map((fileObj, index) => (
                      <ListGroup.Item
                        key={index}
                        className='d-flex justify-content-between align-items-center p-1'
                      >
                        <div>
                          <Paperclip size={16} className='me-2' />
                          {fileObj.name}
                          <span className='text-muted ms-2'>
                            ({formatFileSize(fileObj.size)})
                          </span>
                        </div>
                        <Button
                          size='sm'
                          variant='outline-danger'
                          onClick={() => handleRemoveFile(index)}
                          className='btn-custom'
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
    </>
  )
}
