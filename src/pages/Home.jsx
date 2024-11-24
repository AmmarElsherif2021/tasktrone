/* eslint-disable jsx-a11y/alt-text */
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Blog } from './Blog.jsx'
import { Header } from '../Components/Header/Header.jsx'
import { Board } from './Board.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useProject } from '../contexts/ProjectContext.jsx'
import { useUserHome } from '../contexts/UserHomeContext.jsx'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { Dashboard } from './Dashboard.jsx'

export function Home() {
  const { currentUser, userProjects } = useUserHome()
  const [token] = useAuth()
  const decodeToken = (token) => {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token:', 'Token must be a valid string')
      return null
    }
    try {
      const decoded = jwtDecode(token)
      const userId = decoded.sub // Extracting 'sub' for user ID
      return { userId }
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }
  const { currentProject } = useProject()
  const userData = decodeToken(token)
  if (!userData) {
    return (
      <Container
        className='text-center'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          //backgroundColor: '#a12223',
        }}
      >
        <img src={logo} style={{ width: '20%', marginBottom: '3rem' }} />
        <h2 style={{ marginBottom: '3rem' }}>Sign in and enjoy Tasktrone</h2>
        <small>if you are not registered, sign up </small>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Link to={'/login'}>
            <Button
              variant='dark'
              className='m-2'
              style={{ backgroundColor: 'black', color: 'white' }}
            >
              Login
            </Button>
          </Link>
          <Link to={'/signup'}>
            <Button
              variant='light'
              className='m-2'
              style={{ backgroundColor: '#1aaa8F', color: 'black' }}
            >
              Signup
            </Button>
          </Link>
        </div>
      </Container>
    )
  }
  if (Object.keys(currentProject).length === 0) {
    return (
      <div>
        <Header />
        <h1>create project</h1>
        <Dashboard />
      </div>
    )
  }
  return (
    <div className='min-vh-100 bg-light'>
      <Header />
      <Container fluid className='py-4'>
        <h2>current user {JSON.stringify(currentUser)}</h2>
        <h2>token {token}</h2>
        <h2>projects {JSON.stringify(userProjects)}</h2>
        <h2>current project {JSON.stringify(currentProject)}</h2>
        <Row className='g-4'>
          <Col xs={12} lg={3}>
            <Blog />
          </Col>

          <Col xs={12} lg={9}>
            <Board />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
