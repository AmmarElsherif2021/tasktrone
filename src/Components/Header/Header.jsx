import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import {
  Navbar,
  Nav,
  Container,
  //Button,
  Row,
  Col,
  Image,
} from 'react-bootstrap'
//import { User } from '../User/User'
import logo from '../../assets/logo-negative.svg'
import { useProject } from '../../contexts/ProjectContext'
//import { jwtDecode } from 'jwt-decode'
import IconButton from '../../Ui/IconButton'
import logoutIcon from '../../assets/logout.svg'
import dashboardIcon from '../../assets/negative-dashboard.svg'
import { useUserHome } from '../../contexts/UserHomeContext'
export function Header() {
  const [token, setToken] = useAuth()
  const { currentUser, setCurrentUser } = useUserHome()
  const navigate = useNavigate()
  const { setCurrentProjectId } = useProject()

  const handleLogout = () => {
    setToken(null)
    setCurrentUser({})
    navigate('/') // Navigate to Intro after logout
  }

  const renderAuthenticatedLinks = () => {
    //const { sub } = jwtDecode(token)
    return (
      <Nav
        className='ml-auto'
        style={{
          flex: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Nav.Item as='span' className='navbar-text me-2 py-3'>
          <span style={{ fontSize: '0.8em' }}>
            Logged in as {currentUser.username}
          </span>
        </Nav.Item>
        <Nav.Link as={Link} to='/dashboard' className='nav-link'>
          <IconButton
            src={dashboardIcon}
            alt='Dashboard'
            onClick={() => {
              setCurrentProjectId('')
              navigate('/dashboard')
            }}
            className='py-4'
            iconWidthREM={7}
            color='#ffffff'
          />
        </Nav.Link>
        <Nav.Link>
          {' '}
          <IconButton
            src={logoutIcon}
            alt='Sign out'
            onClick={handleLogout}
            className='py-4'
            iconWidthREM={3}
            color='#ffffff'
          />
        </Nav.Link>
      </Nav>
    )
  }

  const renderGuestLinks = () => (
    <Nav className='ml-auto'>
      <Nav.Link as={Link} to='/login' className='nav-link'>
        Log In
      </Nav.Link>
      <Nav.Link as={Link} to='/signup' className='nav-link'>
        Sign Up
      </Nav.Link>
    </Nav>
  )

  return (
    <Navbar
      expand='lg'
      sticky='top'
      className='mb-3'
      style={{
        paddingRight: '3rem',
        paddingLeft: 0,
        postion: 'fixed',
        left: 0,
        width: '100vw',
        backgroundColor: '#000',
      }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to='/' onClick={() => setCurrentProjectId('')}>
          <Image src={logo} width={30} alt='Tasktrone Logo' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='w-100 justify-content-end'>
            <Row className='w-100'>
              <Col className='d-flex justify-content-end'>
                {token ? renderAuthenticatedLinks() : renderGuestLinks()}
              </Col>
            </Row>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
