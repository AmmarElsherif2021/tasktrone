import { Dropdown } from 'react-bootstrap'
import refreshProjectIcon from '../../assets/refresh-icon.svg'
import IconButton from '../../Ui/IconButton'
import refreshDashboard from '../../assets/refreshDash.svg'
import syncIcon from '../../assets/sync.svg'
import { useProject } from '../../contexts/ProjectContext.jsx'
import { useState } from 'react'

const RefreshProject = () => {
  const { refreshTasks } = useProject()
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

  const handleRefreshTasks = () => {
    refreshTasks()
    setIsOpen(false)
  }

  return (
    <Dropdown
      id='dropdown-basic-button'
      className='custom-modal h-100'
      show={isOpen}
      onToggle={handleToggle}
    >
      <Dropdown.Toggle
        as={IconButton}
        src={refreshProjectIcon}
        alt='Refresh Project'
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
            src={syncIcon}
            alt='Refresh Project Tasks'
            iconWidthREM={6}
            className='ml-1 my-1 h-100'
            onClick={handleRefreshTasks}
          />
          <IconButton
            src={refreshDashboard}
            alt='Refresh Project Dashboard'
            iconWidthREM={6}
            className='ml-1 my-1 h-100'
            onClick={() => setIsOpen(false)}
          />
          <IconButton
            src={syncIcon}
            alt='Full Sync'
            iconWidthREM={6}
            className='ml-1 my-1 h-100'
            onClick={() => setIsOpen(false)}
          />
        </Dropdown.Menu>
      )}
    </Dropdown>
  )
}

export default RefreshProject
