import { Navbar, Nav, Container } from 'react-bootstrap'
//import { CreateTask } from '../Tasks/CreateTask'
//import ProjectDashboard from './ProjectDashboard'
import Notifications from './Notifications'
import Search from './Search'
import RefreshProject from './RefreshProject'

const Toolbar = () => {
  return (
    <Navbar bg='light' expand='lg' className='mb-2 shadow-sm w-100 py-1'>
      <Container className='d-flex justify-content-between align-items-center w-100'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='d-flex align-items-center d-flex justify-content-between align-items-center w-100'>
            <Notifications />
            <RefreshProject />
            <Search />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Toolbar
