import { Dropdown } from 'react-bootstrap'
import dashboardIcon from '../../assets/dashboard-icon.svg'
import IconButton from '../../Ui/IconButton'
const ProjectDashboard = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        as={(props) => (
          <IconButton
            src={dashboardIcon}
            alt={'Project Dashboard'}
            className={'dashboard'}
            {...props}
          />
        )}
      />
      <Dropdown.Menu>
        <Dropdown.Item>Overview</Dropdown.Item>
        <Dropdown.Item>Analytics</Dropdown.Item>
        <Dropdown.Item>Reports</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ProjectDashboard
