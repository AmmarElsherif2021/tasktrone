import { Dropdown } from 'react-bootstrap'
import notificationIcon from '../../assets/notification-icon.svg'
import IconButton from '../../Ui/IconButton'
import notificationSettingsIcon from '../../assets/notificationsSettings.svg'
import markAllIcon from '../../assets/markAll.svg'
import { useState } from 'react'

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }
  const dropStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '8rem',
    padding: '1rem',
    fontSize: '0.7em',
  }

  return (
    <Dropdown
      className='custom-modal h-100'
      show={isOpen}
      onToggle={handleToggle}
    >
      <Dropdown.Toggle
        as={IconButton}
        src={notificationIcon}
        alt={'Notifications'}
        onClick={(e) => {
          e.stopPropagation()
          handleToggle()
        }}
      />
      {isOpen && (
        <Dropdown.Menu
          className='custom-modal flex-column align-center pl-3'
          style={dropStyle}
        >
          <IconButton
            src={notificationIcon}
            alt='Unread Notifications'
            iconWidthREM={9}
            className='ml-1 my-1 h-100'
            onClick={() => setIsOpen(false)}
          />
          <IconButton
            src={markAllIcon}
            alt='Mark All Read'
            iconWidthREM={9}
            className='ml-1 my-1 h-100'
            onClick={() => setIsOpen(false)}
          />
          <IconButton
            src={notificationSettingsIcon}
            alt='Notification Settings'
            iconWidthREM={9}
            className='ml-1 my-1 h-100'
            onClick={() => setIsOpen(false)}
          />
        </Dropdown.Menu>
      )}
    </Dropdown>
  )
}

export default Notifications
