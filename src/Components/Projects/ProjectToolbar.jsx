import { Navbar, Nav, Container } from 'react-bootstrap'
import { CreateTask } from '../Tasks/CreateTask'
import ProjectDashboard from './ProjectDashboard'
import Notifications from './Notifications'
import Settings from './Settings'
import ProjectUsers from './ProjectUsers'
import Search from './Search'
import ExportProject from './ExportProject'
import RefreshProject from './RefreshProject'

const Toolbar = () => {
  return (
    <Navbar bg='light' expand='lg' className='mb-2 shadow-sm w-100'>
      <Container className='d-flex justify-content-between align-items-center w-100'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='d-flex align-items-center d-flex justify-content-between align-items-center w-100'>
            <CreateTask />
            <ProjectDashboard />
            <Notifications />
            <Settings />
            <ProjectUsers />
            <ExportProject />
            <RefreshProject />
          </Nav>
          <Search />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Toolbar
