import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Form, Button, Card, Alert, ListGroup, Collapse } from 'react-bootstrap'
import { createTask } from '../../API/tasks'
import { useAuth } from '../../contexts/AuthContext'
import { getAllUsers } from '../../API/users'

export function CreateTask() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [newReq, setNewReq] = useState('')
  const [requirements, setRequirements] = useState([])
  const [leadTime, setLeadTime] = useState('')
  const [attachments, setAttachments] = useState([])
  const [newMemberId, setNewMemberId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('worker')
  const [members, setMembers] = useState([])
  const [token] = useAuth()
  const queryClient = useQueryClient()

  // Query to fetch all users
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    // if error
    select: (data) => data?.users || [],
    onError: (error) => {
      console.error('Failed to fetch users:', error)
      return []
    },
  })
  // Get the users array from the response
  const users = usersData || []

  const createTaskMutation = useMutation({
    mutationFn: () =>
      createTask(token, {
        title,
        requirements,
        leadTime,
        members,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
    },
  })
  useEffect(() => console.log(`members ${JSON.stringify(members)}`), [members])
  const handleAddReq = () => {
    if (newReq.trim()) {
      setRequirements((prev) => [...prev, newReq.trim()])
      setNewReq('')
    }
  }

  const handleAddMember = () => {
    if (newMemberId && newMemberRole) {
      const userExists = users.find((user) => user.id === newMemberId)
      if (userExists) {
        const newMember = {
          user: newMemberId,
          role: newMemberRole,
          // Add username for display purposes only
          username: userExists.username,
        }
        // Check if user is not already added
        const memberExists = members.some(
          (member) => member.user === newMemberId,
        )
        if (!memberExists) {
          setMembers((prev) => [...prev, newMember])
          setNewMemberId('')
          setNewMemberRole('worker')
        } else {
          console.warn('Member already exists in the task')
        }
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createTaskMutation.mutate()
  }

  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      setAttachments([])
      setRequirements([])
      setMembers([])
      setLeadTime('')
      setTitle('')
      setOpen(false)
    }
  }, [createTaskMutation.isSuccess])

  if (!token) {
    return <Alert variant='warning'>Please log in to create new tasks.</Alert>
  }

  return (
    <div className='mb-4' style={{ padding: 0 }}>
      <Button
        variant='primary'
        onClick={() => setOpen(!open)}
        aria-controls='create-task-collapse'
        aria-expanded={open}
        className='btn-custom mb-4'
      >
        {open ? 'Hide Create Task' : 'Create New Task'}
      </Button>

      <Collapse in={open}>
        <div id='create-task-collapse'>
          <Card className='mb-3'>
            <Card.Body>
              <Card className='mb-3 p-2'>
                <Card.Header>
                  <h5 className='mb-0'>Create New Task</h5>
                </Card.Header>
                <Card.Body className='p-2'>
                  <Form onSubmit={handleSubmit}>
                    {/* Title Field */}
                    <Form.Group className='mb-2'>
                      <Form.Label className='mb-1'>Title</Form.Label>
                      <Form.Control
                        size='sm'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Enter task title'
                      />
                    </Form.Group>

                    {/* Requirements Section */}
                    <Form.Group className='mb-2'>
                      <Form.Label className='mb-1'>Requirements</Form.Label>
                      <div className='d-flex gap-2 mb-1'>
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
                          onClick={handleAddReq}
                          className='btn-custom'
                        >
                          Add
                        </Button>
                      </div>
                      {requirements.length > 0 && (
                        <ListGroup className='mb-2'>
                          {requirements.map((req, index) => (
                            <ListGroup.Item
                              key={index}
                              className='d-flex justify-content-between align-items-center p-1'
                            >
                              {req}
                              <Button
                                size='sm'
                                variant='outline-danger'
                                onClick={() =>
                                  setRequirements((prev) =>
                                    prev.filter((_, i) => i !== index),
                                  )
                                }
                                className='btn-custom'
                              >
                                Remove
                              </Button>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Form.Group>

                    {/* Members Section */}
                    <Form.Group className='mb-2'>
                      <Form.Label className='mb-1'>Team Members</Form.Label>
                      <div className='d-flex gap-2 mb-1'>
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
                              onClick={() =>
                                setMembers((prev) =>
                                  prev.filter((_, i) => i !== index),
                                )
                              }
                              className='btn-custom'
                            >
                              Remove
                            </Button>
                          </ListGroup.Item>
                        )
                      })}
                    </Form.Group>

                    {/* Lead Time Field */}
                    <Form.Group className='mb-2'>
                      <Form.Label className='mb-1'>Lead Time (days)</Form.Label>
                      <Form.Control
                        size='sm'
                        type='number'
                        value={leadTime}
                        onChange={(e) => setLeadTime(e.target.value)}
                        placeholder='Enter estimated lead time'
                      />
                    </Form.Group>

                    {/* Attachment Field */}
                    <Form.Group className='mb-2'>
                      <Form.Label className='mb-1'>Attachment</Form.Label>
                      <Form.Control
                        size='sm'
                        type='text'
                        value={attachments[0] || ''}
                        onChange={(e) => setAttachments([e.target.value])}
                        placeholder='Add attachment link'
                      />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button
                      size='sm'
                      type='submit'
                      variant='primary'
                      disabled={!title || createTaskMutation.isLoading}
                      className='btn-custom'
                    >
                      {createTaskMutation.isLoading
                        ? 'Creating...'
                        : 'Create Task'}
                    </Button>

                    {createTaskMutation.isSuccess && (
                      <Alert variant='success' className='mt-2 p-2'>
                        Task created successfully!
                      </Alert>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </div>
      </Collapse>
    </div>
  )
}
