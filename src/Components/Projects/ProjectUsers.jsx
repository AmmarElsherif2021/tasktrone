import { useState } from 'react'
import {
  Collapse,
  Button,
  Card,
  ListGroup,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import usersIcon from '../../assets/users-icon.svg'
import IconButton from '../../Ui/IconButton'
import { useProject } from '../../contexts/ProjectContext'

const ProjectUsers = () => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)

  const { currentProjectMembers } = useProject()

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredMembers = currentProjectMembers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const possibleUsers = [
    { id: '1', username: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', username: 'Jane Smith', email: 'jane.smith@example.com' },
    // Add more possible users here
  ]

  const filteredPossibleUsers = possibleUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className='w-100'>
      <div className='d-flex align-items-center'>
        <IconButton
          src={usersIcon}
          alt='Project Users'
          onClick={() => setOpen(!open)}
          className={`me-2 ${open ? 'active' : ''}`}
        />
      </div>
      <Collapse in={open}>
        <div>
          <Card className='card-body mt-2'>
            <ListGroup variant='flush'>
              {filteredMembers?.map((user) => (
                <ListGroup.Item key={user.id} style={{ fontSize: '0.8em' }}>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <h5 className='mb-1'>{user.username}</h5>
                      <small className='mb-0'>
                        <strong>Email:</strong> {user.email}
                      </small>
                      <br />
                      <small className='mb-0'>
                        <strong>Team:</strong> {user.team}
                      </small>
                      <br />
                      <small className='mb-0'>
                        <strong>Role:</strong> {user.role}
                      </small>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <Button
                  variant='outline-primary'
                  className='mt-2 w-100'
                  onClick={() => setInviteOpen(!inviteOpen)}
                  aria-expanded={inviteOpen}
                >
                  Invite Team Member
                </Button>
                <Collapse in={inviteOpen}>
                  <div className='mt-2'>
                    <InputGroup className='mb-3'>
                      <FormControl
                        placeholder='Search for users...'
                        aria-label='Search for users'
                        onChange={handleSearchChange}
                      />
                    </InputGroup>
                    <ListGroup>
                      {filteredPossibleUsers.map((user) => (
                        <ListGroup.Item key={user.id}>
                          <div className='d-flex justify-content-between align-items-center'>
                            <span>{user.username}</span>
                            <Button variant='outline-secondary'>Invite</Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Collapse>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </div>
      </Collapse>
    </div>
  )
}

export default ProjectUsers
