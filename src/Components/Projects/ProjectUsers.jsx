/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import usersIcon from '../../assets/users-icon.svg'
import IconButton from '../../Ui/IconButton'
const ProjectUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null)

  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
  ]

  return (
    <Dropdown onSelect={(eventKey) => setSelectedUser(eventKey)}>
      <Dropdown.Toggle
        as={(props) => (
          <IconButton src={usersIcon} alt={'Project Users'} {...props} />
        )}
      />
      <Dropdown.Menu>
        {users.map((user) => (
          <Dropdown.Item key={user.id} eventKey={user.id}>
            {user.name}
          </Dropdown.Item>
        ))}
        <Dropdown.Divider />
        <Dropdown.Item>Invite Team Member</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ProjectUsers
