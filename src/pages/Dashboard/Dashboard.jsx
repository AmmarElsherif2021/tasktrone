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
import { User } from '../../Components/User/User'
import { CreateProject } from '../../Components/Projects/CreateProject'
import { useAuth } from '../../contexts/AuthContext'
import { useUserHome } from '../../contexts/UserHomeContext'
import { jwtDecode } from 'jwt-decode'
import { Header } from '../../Components/Header/Header'
import IconButton from '../../Ui/IconButton'
import StaticRoundBtn from '../../Ui/StaticRoundBtn'
import folderPlus from '../../assets/folderPlus.svg'
import userInfo from '../../assets/userInfo.svg'
import clock from '../../assets/clock.svg'
import boxes from '../../assets/boxes.svg'
import charts from '../../assets/charts.svg'
import alert from '../../assets/alert.svg'
import clipboardCheck from '../../assets/clipboardCheck.svg'
import addNew from '../../assets/addNew.svg'
import { ProfileImage } from '../../Components/User/ProfileImage'
import DashboardSkeleton from '../../Ui/LoadingSkeletons/DashboardSkeleton'
import { colors } from '../../Ui/colors'
// ==================== STYLES ====================
const CARD_STYLES = {
  borderWidth: '2.5px',
  borderColor: '#404C46',
  transition: 'background-color 0.2s',
  backgroundColor: colors.cardBackgroundColor,
}

const METRIC_CARD_STYLES = {
  width: '15rem',
}

const HOVER_CARD_STYLES = {
  backgroundColor: colors.hoverCardBackgroundColor,
}

const CARD_HEADER_STYLES = {
  backgroundColor: 'transparent',
  borderBottom: '2.5px solid #000',
}

const ALERT_STYLES = {
  borderWidth: '2px',
  borderColor: '#ad0000',
  backgroundColor: 'transparent',
  color: '#ad0000',
}

const BUTTON_STYLES = {
  borderWidth: '2px',
  borderColor: '#186545',
  borderRadius: '2rem',
  color: '#186545',
}

const ICON_STYLES = {
  width: '3rem',
}

const SMALL_TEXT_STYLES = {
  fontSize: '0.7em',
}

const MEDIUM_TEXT_STYLES = {
  fontSize: '0.8em',
}

// ==================== CONSTANTS ====================
const METRICS_DATA = [
  {
    icon: clock,
    title: 'In Progress',
    key: 'tasksInProgress',
    color: '#7DDA58',
  },
  {
    icon: alert,
    title: 'Critical Tasks',
    key: 'criticalTasks',
    color: '#FF4A4A',
  },
  {
    icon: clipboardCheck,
    title: 'Quality Issues',
    key: 'qualityIssues',
    color: '#FFDE4C',
  },
  {
    icon: boxes,
    title: 'Inventory Alerts',
    key: 'inventoryAlerts',
    color: '#99FACA',
  },
]

const QUICK_ACCESS_BUTTONS = [
  { title: 'Design Tasks', color: '#E4080A' },
  { title: 'Manufacturing', color: '#0F5A38' },
  { title: 'Quality Control', color: '#FF6201' },
  { title: 'Inventory', color: '#000' },
]

// ==================== REUSABLE COMPONENTS ====================
const MetricCard = ({ metric, value }) => (
  <Card
    className='mb-3 shadow-sm'
    style={{
      ...CARD_STYLES,
      ...METRIC_CARD_STYLES,
      backgroundColor: metric.color,
    }}
  >
    <Card.Body className='d-flex justify-content-between align-items-center'>
      <div>
        <h5 className='mb-1'>{metric.title}</h5>
        <h3 className='mb-0'>{value}</h3>
      </div>
      <img
        className='d-flex align-items-center'
        style={ICON_STYLES}
        src={metric.icon}
        alt={metric.title}
      />
    </Card.Body>
  </Card>
)

const CardHeader = ({ icon, title, children }) => (
  <Card.Header
    className='d-flex align-items-center justify-content-between py-3'
    style={CARD_HEADER_STYLES}
  >
    <div className='d-flex align-items-center'>
      {icon && <img src={icon} alt={title} style={ICON_STYLES} />}
      <h4 className='mb-0'>{title}</h4>
    </div>
    {children}
  </Card.Header>
)

const StyledCard = ({
  children,
  hoverKey,
  hoverStates,
  handleHover,
  style,
}) => (
  <Card
    className='mb-1 shadow-sm'
    style={{
      ...CARD_STYLES,
      backgroundColor: hoverStates[hoverKey]
        ? HOVER_CARD_STYLES.backgroundColor
        : CARD_STYLES.backgroundColor,
      ...style,
    }}
    onMouseEnter={() => handleHover(hoverKey, true)}
    onMouseLeave={() => handleHover(hoverKey, false)}
  >
    {children}
  </Card>
)

// ==================== MAIN COMPONENT ====================
export function Dashboard() {
  const { userProjects, currentUser, isUserLoading, areProjectsLoading } =
    useUserHome()
  const [token] = useAuth()
  const [userData, setUserData] = useState(null)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [hoverStates, setHoverStates] = useState({
    info: false,
    projects: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  const metrics = {
    tasksInProgress: 12,
    criticalTasks: 3,
    qualityIssues: 2,
    inventoryAlerts: 4,
  }

  useEffect(() => {
    try {
      const decoded = jwtDecode(token)
      setUserData({ userId: decoded.sub, username: decoded.username })
    } catch (error) {
      console.error('Invalid token:', error)
      setUserData(null)
    }
  }, [token])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleHover = (key, value) => {
    setHoverStates((prev) => ({ ...prev, [key]: value }))
  }

  if (!currentUser || isLoading || isUserLoading || areProjectsLoading) {
    return (
      <>
        <Header />
        <div style={{ opacity: '80%' }}>
          <DashboardSkeleton />
        </div>
      </>
    )
  }

  const renderProjectsHeader = () => (
    <div className='d-flex gap-2'>
      <OverlayTrigger
        placement='top'
        overlay={<Tooltip>View Analytics</Tooltip>}
      >
        <IconButton
          onClick={() => {}}
          color='#000'
          src={charts}
          alt='Visualize data'
        />
      </OverlayTrigger>
      <OverlayTrigger
        placement='top'
        overlay={<Tooltip>Create New Project</Tooltip>}
      >
        <IconButton
          onClick={() => setShowCreateProject(true)}
          color='#186545'
          src={addNew}
          alt='Create new project'
        />
      </OverlayTrigger>
    </div>
  )

  const renderEmptyProjects = () => (
    <Card.Body className='text-center'>
      <div className='d-flex flex-column align-items-center justify-content-center'>
        <img
          src={folderPlus}
          alt='add project'
          style={{ ...ICON_STYLES, color: '#186545' }}
        />
        <p className='mb-3' style={{ color: '#666' }}>
          No manufacturing projects found. Create your first project to get
          started!
        </p>
        <Button
          variant='none'
          onClick={() => setShowCreateProject(true)}
          style={BUTTON_STYLES}
        >
          Create Project
        </Button>
      </div>
    </Card.Body>
  )

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
      <Header />
      <Container fluid className='py-4'>
        <h1 className='mb-4'>Welcome back</h1>

        <Row className='mb-3'>
          {METRICS_DATA.map((metric) => (
            <Col md={3} sm={6} key={metric.title}>
              <MetricCard metric={metric} value={metrics[metric.key]} />
            </Col>
          ))}
        </Row>

        <Row className='mb-3'>
          <Col lg={4} md={5} sm={12} className='mb-4'>
            <StyledCard
              hoverKey='info'
              hoverStates={hoverStates}
              handleHover={handleHover}
              style={{ padding: '1rem' }}
            >
              <CardHeader icon={userInfo} title='Personal Information' />
              <Card.Body style={MEDIUM_TEXT_STYLES}>
                {userData ? (
                  <div className='d-flex flex-row'>
                    <ProfileImage
                      user={currentUser}
                      style={{ marginRight: '1rem' }}
                      size={4}
                    />
                    <User id={userData.userId} explicit={true} />
                  </div>
                ) : (
                  <Alert variant='warning' style={ALERT_STYLES}>
                    User data not available
                  </Alert>
                )}
              </Card.Body>
            </StyledCard>

            <StyledCard
              hoverKey='info'
              hoverStates={hoverStates}
              handleHover={handleHover}
              style={{ padding: '1rem' }}
            >
              <CardHeader title='Quick Access' />
              <Card.Body>
                <div className='mt-3'>
                  <small
                    className='d-flex flex-wrap gap-2'
                    style={SMALL_TEXT_STYLES}
                  >
                    {QUICK_ACCESS_BUTTONS.map(({ title, color }) => (
                      <StaticRoundBtn
                        key={title}
                        src={''}
                        alt={title}
                        handleClick={() => {}}
                        color={color}
                        backgroundColor='#fff'
                      />
                    ))}
                  </small>
                </div>
              </Card.Body>
            </StyledCard>
          </Col>

          <Col lg={8} md={7} sm={12}>
            <StyledCard
              hoverKey='projects'
              hoverStates={hoverStates}
              handleHover={handleHover}
            >
              <Card.Body>
                <CardHeader icon={folderPlus} title='Projects'>
                  {renderProjectsHeader()}
                </CardHeader>

                {userProjects?.length ? (
                  <PreviewProjects />
                ) : (
                  renderEmptyProjects()
                )}
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <Modal
          show={showCreateProject}
          onHide={() => setShowCreateProject(false)}
          size='lg'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Project</Modal.Title>
          </Modal.Header>
          <Modal.Body className='custom-modal'>
            <CreateProject onClose={() => setShowCreateProject(false)} />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  )
}
