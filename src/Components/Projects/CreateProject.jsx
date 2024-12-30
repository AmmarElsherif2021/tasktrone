/* eslint-disable react/prop-types */
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { createProject } from '../../API/projects'
import { getAllUsers } from '../../API/users'
import { useAuth } from '../../contexts/AuthContext'
import { Form, Button, ListGroup, Alert, Spinner } from 'react-bootstrap'

export function CreateProject({ onClose }) {
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

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    retry: 2,
    staleTime: 30000,
  })

  const usersByTeam = users.reduce((acc, user) => {
    if (user?.team && user?.id) {
      if (!acc[user.team]) acc[user.team] = []
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
      onClose?.()
    },
  })

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMemberChange = (e) => {
    const { name, value } = e.target
    setMember((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMember = () => {
    if (!member.userId) return
    const selectedUser = users.find((u) => u.id === member.userId)
    if (!selectedUser) return

    if (formData.members.some((m) => m.userId === member.userId)) {
      alert('This user is already added to the project.')
      return
    }

    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          user: member.userId,
          id: prev.members.length,
          team: selectedUser.team,
          role: member.role,
          fieldRole: selectedUser.role,
          username: selectedUser.username,
        },
      ],
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

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className='mb-3'>
        <Form.Label>Project Title</Form.Label>
        <Form.Control
          type='text'
          name='title'
          value={formData.title}
          onChange={handleInputChange}
          placeholder='Enter project title'
          className='custom-modal'
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
          className='custom-modal'
          rows={3}
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Start Date (Optional)</Form.Label>
        <Form.Control
          type='date'
          name='startDate'
          value={
            formData.startDate
              ? formData.startDate.toISOString().substr(0, 10)
              : ''
          }
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              startDate: e.target.value ? new Date(e.target.value) : null,
            }))
          }
          className='custom-modal'
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>End Date (Optional)</Form.Label>
        <Form.Control
          type='date'
          name='endDate'
          value={
            formData.endDate ? formData.endDate.toISOString().substr(0, 10) : ''
          }
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              endDate: e.target.value ? new Date(e.target.value) : null,
            }))
          }
          className='custom-modal'
        />
      </Form.Group>

      <div className='mb-3'>
        <h6>Add Project Members</h6>
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
                  className='custom-modal'
                  disabled={isLoadingUsers}
                >
                  <option value=''>Select a team member</option>
                  {Object.entries(usersByTeam).map(([team, teamUsers]) => (
                    <optgroup label={team} key={team}>
                      {teamUsers
                        .sort((a, b) => a.username.localeCompare(b.username))
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
                  className='custom-modal'
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
                className='custom-modal'
              >
                Add
              </Button>
            </div>

            <ListGroup>
              {formData.members.map((member, index) => (
                <ListGroup.Item
                  key={index}
                  className='d-flex justify-content-between align-items-center custom-modal'
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
                    className='custom-modal'
                  >
                    Remove
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
      </div>

      <Button
        type='submit'
        variant='primary'
        disabled={
          !formData.title ||
          createProjectMutation.isPending ||
          formData.members.length === 0
        }
        className='custom-modal'
      >
        {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
      </Button>

      {createProjectMutation.isSuccess && (
        <Alert variant='success' className='mt-3'>
          Project created successfully!
        </Alert>
      )}
    </Form>
  )
}
