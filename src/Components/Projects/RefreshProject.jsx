import { Button, Dropdown } from 'react-bootstrap'
import refreshProjectIcon from '../../assets/refresh-icon.svg'
import IconButton from '../../Ui/IconButton'
import { useProject } from '../../contexts/ProjectContext'
const RefreshProject = () => {
  //for now only project tasks are refreshed consider updating other paramaters
  const { refreshTasks } = useProject()

  return (
    <Dropdown>
      <Dropdown.Toggle
        as={(props) => (
          <IconButton
            src={refreshProjectIcon}
            alt={'Refresh Project'}
            {...props}
          />
        )}
      />
      <Dropdown.Menu>
        <Dropdown.Item>
          <Button onClick={refreshTasks}>Refresh Project Tasks</Button>
        </Dropdown.Item>
        <Dropdown.Item>Refresh Project Dashboard</Dropdown.Item>
        <Dropdown.Item>Full Sync</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default RefreshProject
