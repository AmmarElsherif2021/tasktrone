import { Dropdown } from 'react-bootstrap'
import refreshProjectIcon from '../../assets/refresh-icon.svg'
import IconButton from '../../Ui/IconButton'
const RefreshProject = () => {
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
        <Dropdown.Item>Refresh Project Tasks</Dropdown.Item>
        <Dropdown.Item>Refresh Project Dashboard</Dropdown.Item>
        <Dropdown.Item>Full Sync</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default RefreshProject
