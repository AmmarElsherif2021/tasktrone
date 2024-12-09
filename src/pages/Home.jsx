/* eslint-disable jsx-a11y/alt-text */
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Blog } from './Blog.jsx'
import { Header } from '../Components/Header/Header.jsx'
import { Board } from './Board.jsx'
import { ProjectCard } from '../Components/Projects/ProjectCard.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
//import { useProject } from '../contexts/ProjectContext.jsx'
import { useUserHome } from '../contexts/UserHomeContext.jsx'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
//import { Dashboard } from './Dashboard.jsx'
import { CreateProject } from '../Components/Projects/CreateProject.jsx'
import { useProject } from '../contexts/ProjectContext.jsx'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const { userProjects } = useUserHome()
  const { currentProjectId, setCurrentProjectId } = useProject()
  const navigate = useNavigate()
  const handleProjectClick = (projectId) => {
    setCurrentProjectId(projectId)
    navigate('/board')
  }
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

  //After logging in
  if (userData && Object.keys(userProjects).length === 0) {
    return (
      <div>
        <Header />
        <h1>create project</h1>
        {
          //   {JSON.stringify(userData)}
          //   {JSON.stringify(userProjects)}
          //   {JSON.stringify(currentUser)}
        }
        <CreateProject />
      </div>
    )
  }
  return (
    <div className='min-vh-100 bg-light' style={{ width: '100vw' }}>
      <Header />
      <Container fluid className='py-4'>
        {/*
          <h2>current user {JSON.stringify(currentUser)}</h2>
        <h2>token {token}</h2>
        <h2>projects {JSON.stringify(userProjects)}</h2>
        <h2>current project {JSON.stringify(currentProject)}</h2>
         <h3>project: {JSON.stringify(currentProject)}</h3>
            <h3>{JSON.stringify(currentUser)}</h3>
          */}
        {!currentProjectId ? (
          <Row className='g-4'>
            <h1>Welcome back </h1>
            <h3>Projects</h3>
            {
              <Row xs={1} sm={2} md={3} lg={4} className='g-4'>
                {userProjects.map((project) => (
                  <Col key={project._id}>
                    <div
                      onClick={() => handleProjectClick(project._id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleProjectClick(project._id)
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                      role='button'
                      tabIndex={0}
                    >
                      <ProjectCard
                        projectId={project._id}
                        title={project.title}
                        description={project.description}
                        createdBy={project.createdBy}
                        members={project.members}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            }
          </Row>
        ) : (
          <Row className='g-4'>
            <Col xs={12} lg={3}>
              <Blog />
            </Col>

            <Col xs={12} lg={9}>
              <Board />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  )
}
