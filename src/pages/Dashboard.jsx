import { User } from '../Components/User/User'
import { CreateProject } from '../Components/Projects/CreateProject'
import { ProjectCard } from '../Components/Projects/ProjectCard'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { Container, Card, Row, Col } from 'react-bootstrap'
import { useUserHome } from '../contexts/UserHomeContext'
import { useProject } from '../contexts/ProjectContext'
import { useNavigate } from 'react-router-dom'
//import { useEffect } from 'react'

export function Dashboard() {
  const navigate = useNavigate()
  const { userProjects } = useUserHome()
  const { setCurrentProjectId } = useProject()

  const [token] = useAuth()

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token)
      const userId = decoded.sub
      const username = decoded.username
      return { userId, username }
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }

  const userData = decodeToken(token)

  // const sectionStyles = {
  //   marginBottom: '2rem',
  //   transition: 'all 0.3s ease',
  // }

  const headerStyles = {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    padding: '15px',
    fontWeight: 'bold',
  }

  // Handle project click
  const handleProjectClick = (projectId) => {
    console.log(`clicked project ${projectId}`)
    setCurrentProjectId(projectId)
    navigate(`/`)
  }

  return (
    <Container fluid className='py-4'>
      {/* Personal Information Section */}
      <Card className='shadow-sm mb-4'>
        <Card.Header style={headerStyles}>
          <h4 className='mb-0'>Personal Information</h4>
        </Card.Header>
        <Card.Body>
          <User id={userData?.userId} />
        </Card.Body>
      </Card>

      {/* Create Project Section */}
      <Card className='shadow-sm mb-4'>
        <Card.Header style={headerStyles}>
          <h4 className='mb-0'>Create New Project</h4>
        </Card.Header>
        <Card.Body>
          <CreateProject />
        </Card.Body>
      </Card>

      {/* Projects List Section */}
      <Card className='shadow-sm'>
        <Card.Header style={headerStyles}>
          <h4 className='mb-0'>
            Your Projects
            {userProjects.length > 0 && (
              <span className='float-end badge bg-primary'>
                {userProjects.length}
              </span>
            )}
          </h4>
        </Card.Header>
        <Card.Body>
          {userProjects && userProjects.length ? (
            <Row className='g-4'>
              {userProjects.map((project) => (
                <Col
                  key={project._id}
                  xs={12}
                  md={6}
                  lg={4}
                  onClick={() => handleProjectClick(project._id)}
                >
                  <ProjectCard
                    projectId={project._id}
                    title={project.title}
                    description={project.description}
                    createdBy={project.createdBy}
                    members={project.members}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Card className='bg-light text-center p-5'>
              <Card.Body>
                <p className='text-muted mb-0'>
                  No projects found. Create your first project to get started!
                </p>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}
