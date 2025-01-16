import { Dropdown } from 'react-bootstrap'
import exportIcon from '../../assets/export-icon.svg'
import IconButton from '../../Ui/IconButton'
const ExportProject = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        as={(props) => (
          <IconButton src={exportIcon} alt={'Export'} {...props} />
        )}
      />
      <Dropdown.Menu>
        <Dropdown.Item>Export Tasks</Dropdown.Item>
        <Dropdown.Item>Export Project</Dropdown.Item>
        <Dropdown.Item>Export Metrics</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ExportProject
