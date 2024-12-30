import { Dropdown } from 'react-bootstrap'
import refreshProjectIcon from '../../assets/refresh-icon.svg'
import IconButton from '../../Ui/IconButton'
import refreshDashboard from '../../assets/refreshDash.svg'
import syncIcon from '../../assets/sync.svg'
import { useProject } from '../../contexts/ProjectContext.jsx'

export const RefreshProject = () => {
  const { refreshTasks } = useProject()

  const dropStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '8rem',
    padding: '1rem',
    fontSize: '0.7em',
  }

  const handleClose = () => {
    // Add close handling logic here
    console.log('RefreshProject dropdown closed')
  }

  return (
    <Dropdown
      className='custom-modal h-100'
      onToggle={(isOpen) => !isOpen && handleClose()}
    >
      <Dropdown.Toggle
        as={(props) => (
          <IconButton
            src={refreshProjectIcon}
            alt='Refresh Project'
            {...props}
          />
        )}
      />
      <Dropdown.Menu
        className='custom-modal flex-column align-center pl-3'
        style={dropStyle}
      >
        <IconButton
          src={syncIcon}
          alt='Refresh Project Tasks'
          iconWidthREM={6}
          className='ml-1 my-1 h-100'
          onClick={refreshTasks}
        />
        <IconButton
          src={refreshDashboard}
          alt='Refresh Project Dashboard'
          iconWidthREM={6}
          className='ml-1 my-1 h-100'
        />
        <IconButton
          src={syncIcon}
          alt='Full Sync'
          iconWidthREM={6}
          className='ml-1 my-1 h-100'
        />
      </Dropdown.Menu>
    </Dropdown>
  )
}
export default RefreshProject
