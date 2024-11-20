import { Dropdown } from 'react-bootstrap'
import notificationIcon from '../../assets/notification-icon.svg'
import IconButton from '../../Ui/IconButton'
const Notifications = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        as={(props) => (
          <IconButton src={notificationIcon} alt={'Notifications'} {...props} />
        )}
      />
      <Dropdown.Menu>
        <Dropdown.Item>Unread Notifications</Dropdown.Item>
        <Dropdown.Item>Mark All Read</Dropdown.Item>
        <Dropdown.Item>Notification Settings</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Notifications
