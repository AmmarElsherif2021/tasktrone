import { useState, useRef, useEffect } from 'react'
import notificationIcon from '../../assets/notification-icon.svg'
import IconButton from '../../Ui/IconButton'
import notificationSettingsIcon from '../../assets/notificationsSettings.svg'
import markAllIcon from '../../assets/markAll.svg'

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => setIsOpen(!isOpen)

  return (
    <div className="relative inline-block h-full" ref={dropdownRef}>
      <IconButton
        src={notificationIcon}
        alt="Notifications"
        onClick={handleToggle}
      />
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border-2 border-green-200 bg-green-50 z-10 p-2 flex flex-col items-center">
          <IconButton
            src={notificationIcon}
            alt="Unread Notifications"
            iconWidthREM={2.25}
            className="my-1"
            onClick={() => setIsOpen(false)}
          />
          <IconButton
            src={markAllIcon}
            alt="Mark All Read"
            iconWidthREM={2.25}
            className="my-1"
            onClick={() => setIsOpen(false)}
          />
          <IconButton
            src={notificationSettingsIcon}
            alt="Notification Settings"
            iconWidthREM={2.25}
            className="my-1"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

export default Notifications