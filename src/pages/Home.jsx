/* eslint-disable react/prop-types */
import { Container, Button, Card, Row, Col } from 'react-bootstrap'
import { Header } from '../Components/Header/Header'
import { CreateProject } from '../Components/Projects/CreateProject'
import { Dashboard } from './Dashboard'
import { Link } from 'react-router-dom'
import { useUserHome } from '../contexts/UserHomeContext'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import folderPlus from '../assets/folderPlus.svg'
import logo from '../assets/logo.svg'

const WelcomeScreen = () => (
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
    }}
  >
    <img
      src={logo}
      alt='Tasktrone'
      style={{ width: '20%', marginBottom: '3rem' }}
    />
    <h2 style={{ marginBottom: '1rem' }}>Welcome to Tasktrone!</h2>
    <p className='mb-4'>
      Please sign in or sign up to start managing your projects.
    </p>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Link to='/login'>
        <Button
          variant='dark'
          className='m-2'
          style={{ backgroundColor: 'black', color: 'white' }}
        >
          Login
        </Button>
      </Link>
      <Link to='/signup'>
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

const EmptyProjectsView = ({ userId }) => (
  <div style={{ backgroundColor: '#EEFBF4', minHeight: '100vh' }}>
    <Header />
    <Container fluid className='py-4'>
      <Row className='mb-4'>
        <Col>
          <h1 className='fw-bold'>Welcome back</h1>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md={8} lg={6}>
          <Card
            className='shadow-sm'
            style={{
              borderWidth: '2.5px',
              borderColor: '#000',
              backgroundColor: '#fff',
            }}
          >
            <Card.Body className='text-center p-5'>
              <div className='d-flex flex-column align-items-center'>
                <img
                  src={folderPlus}
                  alt='add project'
                  style={{ width: '4rem', marginBottom: '2rem' }}
                />
                <h4 className='mb-3'>Welcome, {userId}!</h4>
                <p className='mb-4' style={{ color: '#666' }}>
                  No manufacturing projects found. Create your first project to
                  get started!
                </p>
                <CreateProject />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
)

export function Home() {
  const { currentProjectId, userProjects } = useUserHome()
  const [token] = useAuth()

  const decodeToken = (token) => {
    if (!token || typeof token !== 'string') return null
    try {
      const decoded = jwtDecode(token)
      return { userId: decoded.sub }
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }

  const userData = decodeToken(token)

  if (!userData) return <WelcomeScreen />
  if (userData && Object.keys(userProjects).length === 0)
    return <EmptyProjectsView userId={userData.userId} />

  return (
    <div
      style={{
        backgroundColor: '#EEFBF4',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      {!currentProjectId && <Dashboard />}
    </div>
  )
}
