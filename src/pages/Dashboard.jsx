/* eslint-disable no-unused-vars */
import { User } from '../Components/User/User'
import { CreateProject } from '../Components/Projects/CreateProject'
//import { Fragment } from 'react'
import { ProjectCard } from '../Components/Projects/ProjectCard'
import { listProjects } from '../API/projects'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap'

export function Dashboard() {
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token)
      const userId = decoded.sub
      const userName = decoded.name
      return { userId, userName }
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }

  const [token] = useAuth()
  const userData = decodeToken(token)
  const projectsQuery = useQuery({
    queryKey: ['projects', {}],
    queryFn: () => {
      listProjects({})
    },
  })

  const projects = projectsQuery.data ?? []

  const sectionStyles = {
    marginBottom: '2rem',
    transition: 'all 0.3s ease',
  }

  const headerStyles = {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    padding: '15px',
    fontWeight: 'bold',
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
            {projects.length > 0 && (
              <span className='float-end badge bg-primary'>
                {projects.length}
              </span>
            )}
          </h4>
        </Card.Header>
        <Card.Body>
          {projectsQuery.isLoading ? (
            <div className='text-center py-5'>
              <Spinner animation='border' role='status' variant='primary'>
                <span className='visually-hidden'>Loading...</span>
              </Spinner>
            </div>
          ) : projects && projects.length ? (
            <Row className='g-4'>
              {projects.map((project) => (
                <Col key={project._id} xs={12} md={6} lg={4}>
                  <ProjectCard
                    projectId={project._id}
                    title={project.title}
                    subtitle={project.subtitle}
                    admin={project.admin}
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
