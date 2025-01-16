/* eslint-disable react/prop-types */
import { Row, Col, Container } from 'react-bootstrap'
import { Header } from '../Components/Header/Header'
import { User } from '../Components/User/User'
import DashboardPortion from './DashboardPortion'
import DataVisualizationPortion from './DataVisualizationPortion'
import { ProfileImage } from '../Components/User/ProfileImage'
import { useUserHome } from '../contexts/UserHomeContext'

const OldMemberExplorer = ({ userId }) => {
  const { currentUser } = useUserHome()

  return (
    <div style={{ backgroundColor: '#EEFBF4', minHeight: '100vh' }}>
      <Header />
      <Container fluid className='py-4'>
        <Row className='mb-4'>
          <Col>
            <div className='d-flex align-items-center mb-3'>
              <ProfileImage
                user={currentUser}
                style={{ marginRight: '10px', width: '60px', height: '60px' }}
                size={5}
              />
              <div>
                <h1 className='mb-0 d-flex flex-row'>
                  <strong className='mx-2'>Welcome back, </strong>
                  <User id={userId} />!
                </h1>
              </div>
            </div>
            <p className='px-3' style={{ color: '#666', marginTop: '10px' }}>
              Explore your projects and visualize your data to stay on top of
              your tasks.
            </p>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col md={4} lg={3}>
            <DashboardPortion />
          </Col>
          <Col md={4} lg={3}>
            <DataVisualizationPortion />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default OldMemberExplorer
