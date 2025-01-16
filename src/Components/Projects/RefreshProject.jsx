import { Dropdown } from 'react-bootstrap'
import refreshProjectIcon from '../../assets/refresh-icon.svg'
import IconButton from '../../Ui/IconButton'
import refreshDashboard from '../../assets/refreshDash.svg'
import refreshProject from '../../assets/refreshProject.svg'
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
    minWidth: '6rem',
    maxWidth: '14rem',

    fontSize: '0.9em',
    marginTop: '1rem',

    borderColor: '#729B87',
    backgroundColor: '#E1F9ED',
    borderWidth: '3px',
  }

  const handleRefreshTasks = () => {
    refreshTasks()
    setIsOpen(false)
  }

  return (
    <Dropdown
      id='dropdown-basic-button'
      className=' h-100'
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
          className=' flex-column align-center pl-3'
          style={dropStyle}
        >
          <IconButton
            src={refreshProject}
            alt='Refresh Tasks'
            iconWidthREM={8}
            className='ml-1 my-1 h-100'
            onClick={handleRefreshTasks}
          />
          <IconButton
            src={refreshDashboard}
            alt='Refresh Dashboard'
            iconWidthREM={8}
            className='ml-1 my-1 h-100'
            onClick={() => setIsOpen(false)}
          />
          <IconButton
            src={syncIcon}
            alt='Full Sync'
            iconWidthREM={8}
            className='ml-1 my-1 h-100'
            onClick={() => setIsOpen(false)}
          />
        </Dropdown.Menu>
      )}
    </Dropdown>
  )
}

export default RefreshProject
