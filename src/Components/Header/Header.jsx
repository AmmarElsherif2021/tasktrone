import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button, Row, Col } from 'react-bootstrap'
import { User } from '../User/User'

export function Header() {
  const [token, setToken] = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken(null)
    navigate('/') // Navigate to Intro after logout
  }

  const renderAuthenticatedLinks = () => {
    const { sub } = jwtDecode(token)
    return (
      <>
        <Nav.Item as='span' className='navbar-text me-2'>
          Logged in as <User id={sub} />
        </Nav.Item>
        <Nav.Link as={Link} to='/dashboard' className='nav-link'>
          Dashboard
        </Nav.Link>
        <Button
          variant='outline-light'
          onClick={handleLogout}
          className='btn-custom ms-2'
        >
          Sign out
        </Button>
      </>
    )
  }

  const renderUnauthenticatedLinks = () => (
    <>
      <Nav.Link as={Link} to='/login' className='nav-link'>
        Log In
      </Nav.Link>
      <Nav.Link as={Link} to='/signup' className='nav-link'>
        Sign Up
      </Nav.Link>
    </>
  )

  return (
    <Navbar bg='dark' variant='dark' expand='lg' sticky='top'>
      <Container fluid>
        <Navbar.Brand as={Link} to='/'>
          MyApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='w-100 justify-content-end'>
            <Row className='w-100'>
              <Col className='d-flex justify-content-end'>
                {token
                  ? renderAuthenticatedLinks()
                  : renderUnauthenticatedLinks()}
              </Col>
            </Row>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
