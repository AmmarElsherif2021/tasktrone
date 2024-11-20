import { Dropdown } from 'react-bootstrap'
import settingsIcon from '../../assets/settings-icon.svg'
import IconButton from '../../Ui/IconButton'
const Settings = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        as={(props) => (
          <IconButton src={settingsIcon} alt={'Settings'} {...props} />
        )}
      />
      <Dropdown.Menu>
        <Dropdown.Item>General Settings</Dropdown.Item>
        <Dropdown.Item>Project Preferences</Dropdown.Item>
        <Dropdown.Item>Integrations</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Settings
