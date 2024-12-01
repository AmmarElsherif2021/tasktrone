import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { createProject } from '../../API/projects'
import { getAllUsers } from '../../API/users'
import { useAuth } from '../../contexts/AuthContext'
import { Form, Button, Card, ListGroup, Alert, Spinner } from 'react-bootstrap'

export function CreateProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    members: [],
    startDate: null,
    endDate: null,
  })
  const [member, setMember] = useState({ userId: '', role: 'worker' })
  const [token] = useAuth()
  const queryClient = useQueryClient()

  // Fetch all users with error handling
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    retry: 2,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })

  // Group users by team with safety checks
  const usersByTeam = users.reduce((acc, user) => {
    if (user && user.team && user.id) {
      if (!acc[user.team]) {
        acc[user.team] = []
      }
      acc[user.team].push(user)
    }
    return acc
  }, {})

  const createProjectMutation = useMutation({
    mutationFn: () => {
      const { title, description, members, startDate, endDate } = formData
      return createProject(token, {
        title,
        description,
        startDate,
        endDate,
        members: members.map((m) => ({
          user: m.userId || m.user,
          role: m.role || 'worker',
        })),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      console.log(`Created project: ${JSON.stringify(formData)}`)
      // Reset form
      setFormData({
        title: '',
        description: '',
        members: [],
        startDate: null,
        endDate: null,
      })
      setMember({ userId: '', role: 'worker' })
    },
    onError: (error) => {
      console.error('Project creation failed:', error)
    },
  })

  // Added handleInputChange method
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMemberChange = (e) => {
    const { name, value } = e.target
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }))

    console.log(
      `member changed: ${JSON.stringify({
        ...member,
        [name]: value,
      })}`,
    )
  }
  const handleAddMember = () => {
    if (!member.userId) return
    console.log(`users in CreateProject: ${JSON.stringify(usersByTeam)}`)
    const selectedUser = users.find((u) => u.id === member.userId)
    if (!selectedUser) return

    // Check for duplicate member
    if (formData.members.some((m) => m.userId === member.userId)) {
      alert('This user is already added to the project.')
      return
    }

    const newMember = {
      user: member.userId,
      id: formData.members.length,
      team: selectedUser.team,
      role: member.role,
      fieldRole: selectedUser.role,
      username: selectedUser.username,
    }

    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }))
    setMember({ userId: '', role: 'worker' })
  }

  const handleRemoveMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createProjectMutation.mutate()
  }

  if (!token) {
    return (
      <Alert variant='warning'>Please log in to create new projects.</Alert>
    )
  }

  if (isUsersError) {
    return (
      <Alert variant='danger'>
        Error loading users: {usersError?.message || 'Please try again later'}
      </Alert>
    )
  }

  return (
    <Card className='p-4 shadow-sm'>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>Project Title</Form.Label>
          <Form.Control
            type='text'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            placeholder='Enter project title'
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Project Description</Form.Label>
          <Form.Control
            as='textarea'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Enter project description'
            rows={3}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Start Date (Optional)</Form.Label>
          <Form.Control
            type='date'
            name='startDate'
            value={formData.startDate || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                startDate: e.target.value ? new Date(e.target.value) : null,
              }))
            }
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>End Date (Optional)</Form.Label>
          <Form.Control
            type='date'
            name='endDate'
            value={formData.endDate || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                endDate: e.target.value ? new Date(e.target.value) : null,
              }))
            }
          />
        </Form.Group>

        <Card className='mb-3'>
          <Card.Header>Add Project Members</Card.Header>
          <Card.Body>
            {isLoadingUsers ? (
              <div className='text-center'>
                <Spinner animation='border' role='status'>
                  <span className='visually-hidden'>Loading users...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <div className='d-flex gap-2 mb-3'>
                  <Form.Group className='flex-grow-1'>
                    <Form.Select
                      name='userId'
                      value={member.userId}
                      onChange={handleMemberChange}
                      disabled={isLoadingUsers}
                    >
                      <option value=''>Select a team member</option>
                      {Object.entries(usersByTeam).map(([team, teamUsers]) => (
                        <optgroup label={team} key={team}>
                          {teamUsers
                            .sort((a, b) =>
                              a.username.localeCompare(b.username),
                            )
                            .map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.username} ({user.role})
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group style={{ width: '150px' }}>
                    <Form.Select
                      name='role'
                      value={member.role}
                      onChange={handleMemberChange}
                    >
                      <option value='admin'>Admin</option>
                      <option value='worker'>Worker</option>
                      <option value='reviewer'>Reviewer</option>
                    </Form.Select>
                  </Form.Group>

                  <Button
                    onClick={handleAddMember}
                    disabled={!member.userId}
                    variant='outline-primary'
                  >
                    Add
                  </Button>
                </div>

                <ListGroup>
                  {formData.members.map((member, index) => (
                    <ListGroup.Item
                      key={index}
                      className='d-flex justify-content-between align-items-center'
                    >
                      <div>
                        <strong>{member.username}</strong> - {member.role}
                        <br />
                        <small className='text-muted'>
                          Team: {member.team} | Role: {member.fieldRole}
                        </small>
                      </div>
                      <Button
                        variant='outline-danger'
                        size='sm'
                        onClick={() => handleRemoveMember(index)}
                      >
                        Remove
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </Card.Body>
        </Card>

        <div className='d-grid gap-2'>
          <Button
            type='submit'
            variant='primary'
            disabled={
              !formData.title ||
              createProjectMutation.isPending ||
              formData.members.length === 0
            }
          >
            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </div>

        {createProjectMutation.isSuccess && (
          <Alert variant='success' className='mt-3'>
            Project created successfully!
          </Alert>
        )}

        {createProjectMutation.isError && (
          <Alert variant='danger' className='mt-3'>
            Failed to create project. Please try again.
          </Alert>
        )}
      </Form>
    </Card>
  )
}
