/* eslint-disable jsx-a11y/alt-text */
import { Container, Button } from 'react-bootstrap'
//import { ProjectLayout } from './ProjectLayout.jsx'
//import { PreviewProjects } from './PreviewProjects.jsx'
import { Header } from '../Components/Header/Header.jsx'
import { useUserHome } from '../contexts/UserHomeContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { CreateProject } from '../Components/Projects/CreateProject.jsx'
import { Dashboard } from './Dashboard.jsx'

export function Home() {
  const { currentProjectId, userProjects } = useUserHome()
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
        }}
      >
        <img src={logo} style={{ width: '20%', marginBottom: '3rem' }} />
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
  }

  // After logging in
  if (userData && Object.keys(userProjects).length === 0) {
    return (
      <div>
        <Header />
        <Container className='mt-5 text-center'>
          <h1>Welcome, {userData.userId}!</h1>
          <p>
            It looks like you do not have any projects yet. Go ahead and create
            your first project!
          </p>
          <CreateProject />
        </Container>
      </div>
    )
  }

  return (
    <div className='min-vh-100 bg-light' style={{ width: '100vw' }}>
      <Container fluid className='py-4'>
        {
          !currentProjectId && <Dashboard />
          // ) : (
          //   <>
          //     <Header />
          //     <ProjectLayout />
          //   </>
          // )
        }
      </Container>
    </div>
  )
}
