import { useState, useEffect } from 'react'
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Alert,
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import { Plus, FolderPlus, User as UserIcon } from 'lucide-react'
import { User } from '../Components/User/User'
import { CreateProject } from '../Components/Projects/CreateProject'
import { ProjectCard } from '../Components/Projects/ProjectCard'
import { useAuth } from '../contexts/AuthContext'
import { useUserHome } from '../contexts/UserHomeContext'
import { useProject } from '../contexts/ProjectContext'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { Header } from '../Components/Header/Header'

export function Dashboard() {
  const navigate = useNavigate()
  const { userProjects } = useUserHome()
  const { setCurrentProjectId } = useProject()
  const [token] = useAuth()
  const [userData, setUserData] = useState(null)
  const [showCreateProject, setShowCreateProject] = useState(false)

  useEffect(() => {
    const decodeToken = (token) => {
      try {
        const decoded = jwtDecode(token)
        return { userId: decoded.sub, username: decoded.username }
      } catch (error) {
        console.error('Invalid token:', error)
        return null
      }
    }

    setUserData(decodeToken(token))
  }, [token])

  const handleProjectClick = (projectId) => {
    setCurrentProjectId(projectId)
    navigate('/')
  }

  return (
    <div style={{ position: 'absolute', top: 0, left: 0 }}>
      <Header />
      <Container fluid className='py-4' style={{ width: '100vw' }}>
        {/* Personal Information Section */}
        <Card className='mb-4 border-0 shadow-sm' bg='light'>
          <Card.Header className='d-flex align-items-center justify-content-between bg-white text-black py-3'>
            <div className='d-flex align-items-center'>
              <UserIcon size={24} className='me-2' />
              <h4 className='mb-0'>Personal Information</h4>
            </div>
          </Card.Header>
          <Card.Body>
            {userData ? (
              <User id={userData.userId} />
            ) : (
              <Alert variant='warning'>User data not available</Alert>
            )}
          </Card.Body>
        </Card>

        {/* Projects Section */}
        <Card className='border-0 shadow-sm' bg='light'>
          <Card.Header className='d-flex align-items-center justify-content-between bg-white text-black py-3'>
            <div className='d-flex align-items-center'>
              <FolderPlus size={24} className='me-2' />
              <h4 className='mb-0'>
                Your Projects
                {userProjects.length > 0 && (
                  <Badge bg='light' text='primary' className='ms-2'>
                    {userProjects.length}
                  </Badge>
                )}
              </h4>
            </div>
            <OverlayTrigger
              placement='top'
              overlay={<Tooltip>Create New Project</Tooltip>}
            >
              <Button
                variant='light'
                size='sm'
                onClick={() => setShowCreateProject(!showCreateProject)}
              >
                <Plus size={20} />
              </Button>
            </OverlayTrigger>
          </Card.Header>

          {showCreateProject && (
            <Card.Body className='border-bottom'>
              <CreateProject onClose={() => setShowCreateProject(false)} />
            </Card.Body>
          )}

          <Card.Body>
            {userProjects && userProjects.length ? (
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
            ) : (
              <Card className='text-center border-0 bg-light'>
                <Card.Body>
                  <div className='d-flex flex-column align-items-center justify-content-center'>
                    <FolderPlus size={48} className='text-muted mb-3' />
                    <p className='text-muted mb-3'>
                      No projects found. Create your first project to get
                      started!
                    </p>
                    <Button
                      variant='primary'
                      onClick={() => setShowCreateProject(true)}
                    >
                      Create Project
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
