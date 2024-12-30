import { Dropdown } from 'react-bootstrap'
import notificationIcon from '../../assets/notification-icon.svg'
import IconButton from '../../Ui/IconButton'
import notificationSettingsIcon from '../../assets/notificationsSettings.svg'
import markAllIcon from '../../assets/markAll.svg'

const Notifications = () => {
  const dropStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '8rem',
    padding: '1rem',
    fontSize: '0.7em',
  }

  const handleClose = () => {
    console.log('Notifications dropdown closed')
  }

  return (
    <Dropdown
      className='custom-modal h-100'
      onToggle={(isOpen) => !isOpen && handleClose()}
    >
      <Dropdown.Toggle
        as={(props) => (
          <IconButton src={notificationIcon} alt={'Notifications'} {...props} />
        )}
      />
      <Dropdown.Menu
        className='custom-modal flex-column align-center pl-3'
        style={dropStyle}
      >
        <IconButton
          src={notificationIcon}
          alt='Unread Notifications'
          iconWidthREM={9}
          className='ml-1 my-1 h-100'
        />
        <IconButton
          src={markAllIcon}
          alt='Mark All Read'
          iconWidthREM={9}
          className='ml-1 my-1 h-100'
        />
        <IconButton
          src={notificationSettingsIcon}
          alt='Notification Settings'
          iconWidthREM={9}
          className='ml-1 my-1 h-100'
        />
      </Dropdown.Menu>
    </Dropdown>
  )
}
export default Notifications
