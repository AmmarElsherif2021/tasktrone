import { Navbar, Nav, Container } from 'react-bootstrap'
import Notifications from './Notifications'
import Search from './Search'
import RefreshProject from './RefreshProject'
const COMMON_STYLES = {
  navbar: {
    borderBottomStyle: 'solid',
    borderBottomColor: '#000',
    borderWidth: '2.5px',
    paddingBottom: '1rem',
  },
}
const Toolbar = () => {
  return (
    <Navbar
      bg='white'
      expand='lg'
      className='mb-2 w-100 '
      style={COMMON_STYLES.navbar}
    >
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
