import { useState, useEffect } from 'react'
import {
  Container,
  Card,
  Alert,
  Button,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from 'react-bootstrap'
import { PreviewProjects } from './PreviewProjects'
import { FolderPlus, User as UserIcon } from 'lucide-react'
import addNewIcon from '../assets/addNew.svg'
import { User } from '../Components/User/User'
import { CreateProject } from '../Components/Projects/CreateProject'
import { useAuth } from '../contexts/AuthContext'
import { useUserHome } from '../contexts/UserHomeContext'
import { jwtDecode } from 'jwt-decode'
import { Header } from '../Components/Header/Header'
import IconButton from '../Ui/IconButton'

export function Dashboard() {
  const { userProjects } = useUserHome()
  const [token] = useAuth()
  const [userData, setUserData] = useState(null)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [hoverInfo, setHoverInfo] = useState(false)
  const [hoverProjects, setHoverProjects] = useState(false)

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

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
      <Header />
      <Container fluid className='py-4'>
        <Row>
          <h1 className='mb-4'>Welcome back</h1>
          <Col lg={4} md={5} sm={12} className='mb-4'>
            <Card
              className='shadow-sm h-100'
              style={{
                borderWidth: '2.5px',
                borderColor: '#000',
                backgroundColor: hoverInfo ? '#fafafa' : '#fff',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={() => setHoverInfo(true)}
              onMouseLeave={() => setHoverInfo(false)}
            >
              <Card.Header
                className='d-flex align-items-center justify-content-between py-3'
                style={{
                  backgroundColor: 'transparent',
                  borderBottom: '2.5px solid #000',
                }}
              >
                <div className='d-flex align-items-center'>
                  <UserIcon
                    size={24}
                    className='me-2'
                    style={{ color: '#ad0000' }}
                  />
                  <h4 className='mb-0'>Personal Information</h4>
                </div>
              </Card.Header>
              <Card.Body>
                {userData ? (
                  <User id={userData.userId} explicit={true} />
                ) : (
                  <Alert
                    variant='warning'
                    style={{
                      borderWidth: '2px',
                      borderColor: '#ad0000',
                      backgroundColor: 'transparent',
                      color: '#ad0000',
                    }}
                  >
                    User data not available
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8} md={7} sm={12}>
            <Card
              className='shadow-sm'
              style={{
                borderWidth: '2.5px',
                borderColor: '#000',
                backgroundColor: hoverProjects ? '#fafafa' : '#fff',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={() => setHoverProjects(true)}
              onMouseLeave={() => setHoverProjects(false)}
            >
              <Card.Body>
                {userProjects && userProjects.length ? (
                  <>
                    <Card.Header
                      className='d-flex align-items-center justify-content-between py-3'
                      style={{
                        backgroundColor: 'transparent',
                        borderBottom: '2.5px solid #000',
                      }}
                    >
                      <div className='d-flex align-items-center'>
                        <FolderPlus
                          size={24}
                          className='me-2'
                          style={{ color: '#186545' }}
                        />
                        <h4 className='mb-0'>Your Projects</h4>
                      </div>
                      <OverlayTrigger
                        placement='top'
                        overlay={<Tooltip>Create New Project</Tooltip>}
                      >
                        <IconButton
                          src={addNewIcon}
                          alt={'create new project'}
                          onClick={() => setShowCreateProject(true)}
                          className=''
                          iconWidthREM={7}
                          color={'#000'}
                        />
                      </OverlayTrigger>
                    </Card.Header>
                    {showCreateProject && (
                      <Card.Body className='border-bottom'>
                        <CreateProject
                          onClose={() => setShowCreateProject(false)}
                        />
                      </Card.Body>
                    )}
                    <PreviewProjects />
                  </>
                ) : (
                  <Card
                    className='text-center border-0'
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <Card.Body>
                      <div className='d-flex flex-column align-items-center justify-content-center'>
                        <FolderPlus
                          size={48}
                          className='mb-3'
                          style={{ color: '#186545' }}
                        />
                        <p className='mb-3' style={{ color: '#666' }}>
                          No projects found. Create your first project to get
                          started!
                        </p>
                        <Button
                          variant='none'
                          onClick={() => setShowCreateProject(true)}
                          style={{
                            borderWidth: '2px',
                            borderColor: '#186545',
                            borderRadius: '2rem',
                            color: '#186545',
                          }}
                        >
                          Create Project
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
