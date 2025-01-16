/* eslint-disable react/prop-types */
import NewMemberExplorer from './NewMemberExplorer'
import { Container, Button } from 'react-bootstrap'
import OldMemberExplorer from './OldMemberExplorer'
import { Link } from 'react-router-dom'
import { useUserHome } from '../contexts/UserHomeContext'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
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

export function Home() {
  const { userProjects } = useUserHome()
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

  return (
    <div
      style={{
        backgroundColor: '#EEFBF4',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      {userData && Object.keys(userProjects).length === 0 ? (
        <NewMemberExplorer userId={userData.userId} />
      ) : userData && Object.keys(userProjects).length > 0 ? (
        <OldMemberExplorer userId={userData.userId} />
      ) : (
        <WelcomeScreen />
      )}
    </div>
  )
}
