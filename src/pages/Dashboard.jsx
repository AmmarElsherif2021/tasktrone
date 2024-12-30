/* eslint-disable react/prop-types */
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
  Modal,
} from 'react-bootstrap'
import { PreviewProjects } from './PreviewProjects'

import folderPlusIcon from '../assets/folderPlus.svg'
import userInfoIcon from '../assets/userInfo.svg'
import clockIcon from '../assets/clock.svg'
import boxesIcon from '../assets/boxes.svg'
import chartIcon from '../assets/charts.svg'
import alertIcon from '../assets/alert.svg'
import clipboardCheckIcon from '../assets/clipboardCheck.svg'
import { User } from '../Components/User/User'
import { CreateProject } from '../Components/Projects/CreateProject'
import { useAuth } from '../contexts/AuthContext'
import { useUserHome } from '../contexts/UserHomeContext'
import { jwtDecode } from 'jwt-decode'
import { Header } from '../Components/Header/Header'
import IconButton from '../Ui/IconButton'
import StaticRoundBtn from '../Ui/StaticRoundBtn'
import addNewIcon from '../assets/addNew.svg'

export function Dashboard() {
  const { userProjects } = useUserHome()
  const [token] = useAuth()
  const [userData, setUserData] = useState(null)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [hoverInfo, setHoverInfo] = useState(false)
  const [hoverProjects, setHoverProjects] = useState(false)

  // Mock data for dashboard metrics
  const metrics = {
    tasksInProgress: 12,
    criticalTasks: 3,
    qualityIssues: 2,
    inventoryAlerts: 4,
  }

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

  const MetricCard = ({ icon, title, value, color }) => (
    <Card
      className='mb-3 shadow-sm'
      style={{
        width: '15rem',
        borderWidth: '2.5px',
        color: '#000',
        borderColor: '#000',
        backgroundColor: color,
      }}
    >
      <Card.Body className='d-flex justify-content-between align-items-center'>
        <div>
          <h5 className='mb-1' style={{ fontColor: '#000' }}>
            {title}
          </h5>
          <h3 className='mb-0'>{value}</h3>
        </div>
        <img
          className='d-flex align-items-center'
          style={{ width: '3rem' }}
          src={icon}
          alt={title}
        />
      </Card.Body>
    </Card>
  )

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
      <Header />
      <Container fluid className='py-4'>
        <Row>
          <h1 className='mb-4'>Welcome back</h1>

          {/* Metrics Row */}
          <Row className='mb-4'>
            <Col md={3} sm={6}>
              <MetricCard
                icon={clockIcon}
                title='In Progress'
                value={metrics.tasksInProgress}
                color='#7DDA58'
              />
            </Col>
            <Col md={3} sm={6}>
              <MetricCard
                icon={alertIcon}
                title='Critical Tasks'
                value={metrics.criticalTasks}
                color='#FF4A4A'
              />
            </Col>
            <Col md={3} sm={6}>
              <MetricCard
                icon={clipboardCheckIcon}
                title='Quality Issues'
                value={metrics.qualityIssues}
                color='#FFDE4C'
              />
            </Col>
            <Col md={3} sm={6}>
              <MetricCard
                icon={boxesIcon}
                title='Inventory Alerts'
                value={metrics.inventoryAlerts}
                color='#99FACA'
              />
            </Col>
          </Row>

          <Col lg={4} md={5} sm={12} className='mb-4'>
            <Card
              className='mb-1 h-40'
              style={{
                borderWidth: '2.5px',
                borderColor: '#000',
                backgroundColor: hoverInfo ? '#fafafa' : '#fff',
                transition: 'background-color 0.2s',
                padding: '1rem',
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
                  <img
                    src={userInfoIcon}
                    alt={'user info'}
                    style={{ width: '3rem' }}
                  />
                  <h4 className='mb-0'>Personal Information</h4>
                </div>
              </Card.Header>
              <Card.Body>
                {userData ? (
                  <>
                    <User id={userData.userId} explicit={true} />
                  </>
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
            <Card
              className='mb-1 h-30'
              style={{
                borderWidth: '2.5px',
                borderColor: '#000',
                backgroundColor: hoverInfo ? '#fafafa' : '#fff',
                transition: 'background-color 0.2s',
                padding: '1rem',
              }}
            >
              <Card.Header
                className='d-flex align-items-center justify-content-between py-3'
                style={{
                  backgroundColor: 'transparent',
                  borderBottom: '2.5px solid #000',
                }}
              >
                <h2>Quick Access</h2>
              </Card.Header>
              <Card.Body>
                <div className='mt-3'>
                  <small
                    className='d-flex flex-wrap gap-2'
                    style={{ fontSize: '0.7em' }}
                  >
                    <StaticRoundBtn
                      src={''}
                      alt={'Design Tasks'}
                      handleClick={() => {}}
                      color='#E4080A'
                      backgroundColor='#fff'
                    />
                    <StaticRoundBtn
                      src={''}
                      alt={'Manufacturing'}
                      handleClick={() => {}}
                      color='#0F5A38'
                      backgroundColor='#fff'
                    />
                    <StaticRoundBtn
                      src={''}
                      alt={'Quality Control'}
                      handleClick={() => {}}
                      color='#FF6201'
                      backgroundColor='#fff'
                    />
                    <StaticRoundBtn
                      src={''}
                      alt={'Inventory'}
                      handleClick={() => {}}
                      color='#000'
                      backgroundColor='#fff'
                    />
                  </small>
                </div>
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
                <Card.Header
                  className='d-flex align-items-center justify-content-between py-3'
                  style={{
                    backgroundColor: 'transparent',
                    borderBottom: '2.5px solid #000',
                  }}
                >
                  <div className='d-flex align-items-center'>
                    <img
                      src={folderPlusIcon}
                      alt={'add project'}
                      className='me-2'
                      style={{ width: '3rem', color: '#000' }}
                    />
                    <h4 className='mb-0'> Projects </h4>
                  </div>
                  <div className='d-flex gap-2'>
                    <OverlayTrigger
                      placement='top'
                      overlay={<Tooltip>View Analytics</Tooltip>}
                    >
                      <IconButton
                        onClick={() => {}}
                        className='d-flex align-items-center'
                        color='#000'
                        src={chartIcon}
                        alt='Visualize data'
                      />
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement='top'
                      overlay={<Tooltip>Create New Project</Tooltip>}
                    >
                      <IconButton
                        onClick={() => setShowCreateProject(true)}
                        className='d-flex align-items-center'
                        color='#186545'
                        src={addNewIcon}
                        alt='Create new project'
                      />
                    </OverlayTrigger>
                  </div>
                </Card.Header>

                {showCreateProject && (
                  <Modal
                    className='custom-modal'
                    show={showCreateProject}
                    onHide={() => setShowCreateProject(false)}
                    size={'xl'}
                  >
                    <Modal.Header className='custom-modal' closeButton>
                      <Modal.Title>Create project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                      style={{
                        width: '70vw',
                      }}
                      className='custom-modal'
                    >
                      <CreateProject
                        onClose={() => setShowCreateProject(false)}
                      />
                    </Modal.Body>
                  </Modal>
                )}

                {userProjects && userProjects.length ? (
                  <PreviewProjects />
                ) : (
                  <Card.Body className='text-center'>
                    <div className='d-flex flex-column align-items-center justify-content-center'>
                      <img
                        src={folderPlusIcon}
                        alt={'add project'}
                        className='me-2'
                        style={{ width: '3rem', color: '#186545' }}
                      />
                      <p className='mb-3' style={{ color: '#666' }}>
                        No manufacturing projects found. Create your first
                        project to get started!
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
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
