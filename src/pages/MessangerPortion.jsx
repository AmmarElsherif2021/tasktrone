import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Card,
  Button,
  Spinner,
  Modal,
  Form,
  Alert,
  ListGroup,
} from 'react-bootstrap'
import { getAllUsers } from '../API/users'
import flowIcon from '../assets/flow.svg'

export default function MessangerPortion() {
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])

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

  const handleOpenModal = () => setShowNotifyModal(true)
  const handleCloseModal = () => setShowNotifyModal(false)

  const handleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleNotifyUsers = () => {
    // Implement notification logic here
    console.log('Notifying users:', selectedUsers)
    handleCloseModal()
  }

  return (
    <>
      <Card
        className='shadow-sm'
        style={{
          borderWidth: '2.5px',
          borderColor: '#000',
          backgroundColor: '#fff',
        }}
      >
        <Card.Body className='text-center p-5'>
          <div className='d-flex flex-column align-items-center'>
            <h3>Notify other users</h3>

            {/* Clickable flowIcon icon */}
            <button
              onClick={handleOpenModal}
              style={{
                borderWidth: '2.5px',
                backgroundColor: '#1aaa8F',
                borderRadius: '50%',
                height: '5rem',
                width: '5rem',
                display: 'flex',
                flex: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
              }}
              className='mb-1'
            >
              <img
                src={flowIcon}
                alt='notify users'
                style={{
                  width: '4rem',
                  margin: 0,
                  padding: 0,
                  cursor: 'pointer',
                }}
              />
            </button>
          </div>
          <p>
            Inform other users that you are ready to collaborate in their
            projects
          </p>
        </Card.Body>
      </Card>

      {/* Notify Users Modal */}
      <Modal
        show={showNotifyModal}
        onHide={handleCloseModal}
        className='custom-modal'
      >
        <Modal.Header closeButton className='custom-modal'>
          <Modal.Title>Notify Users</Modal.Title>
        </Modal.Header>
        <Modal.Body className='custom-modal'>
          {isUsersError ? (
            <Alert variant='danger'>
              Error loading users:{' '}
              {usersError?.message || 'Please try again later'}
            </Alert>
          ) : (
            <>
              <Form.Group
                className='custom-modal mb-3 '
                style={{ borderWidth: '2.5px', borderColor: '#000' }}
              >
                <Form.Label>Select Users to Notify</Form.Label>
                {isLoadingUsers ? (
                  <div className='text-center'>
                    <Spinner animation='border' role='status'>
                      <span className='visually-hidden'>Loading users...</span>
                    </Spinner>
                  </div>
                ) : (
                  <ListGroup>
                    {Object.entries(usersByTeam).map(([team, teamUsers]) => (
                      <div key={team}>
                        <h6>{team}</h6>
                        {teamUsers
                          .sort((a, b) => a.username.localeCompare(b.username))
                          .map((user) => (
                            <ListGroup.Item
                              key={user.id}
                              className='d-flex justify-content-between align-items-center'
                              style={{
                                borderWidth: '0.5px',
                                borderColor: '#fff',
                              }}
                            >
                              <div>
                                <strong>{user.username}</strong> ({user.role})
                              </div>
                              <Form.Check
                                type='checkbox'
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleUserSelection(user.id)}
                              />
                            </ListGroup.Item>
                          ))}
                      </div>
                    ))}
                  </ListGroup>
                )}
              </Form.Group>
              <Button
                variant='primary'
                onClick={handleNotifyUsers}
                disabled={selectedUsers.length === 0}
              >
                Notify Selected Users
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
