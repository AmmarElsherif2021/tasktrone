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
    width: '7rem',
    minWidth: '6rem',
    maxWidth: '8rem',
    paddingLeft: '2rem',
    fontSize: '0.7em',

    marginTop: '1rem',
    marginLeft: '0.5rem',
    borderColor: '#729B87',
    backgroundColor: '#E1F9ED',
    borderWidth: '3px',
  }

  return (
    <Dropdown className=' h-100' show={isOpen} onToggle={handleToggle}>
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
          className=' flex-column align-center pl-0'
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
