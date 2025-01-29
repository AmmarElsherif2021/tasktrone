/* eslint-disable react/prop-types */
import { Row, Col, Container } from 'react-bootstrap'
import { Header } from '../../Components/Header/Header'
import DashboardPortion from './DashboardPortion'
import DataVisualizationPortion from './DataVisualizationPortion'
import { UserWelcome } from './UserWelcome'

const OldMemberExplorer = ({ userId }) => {
  return (
    <div style={{ backgroundColor: '#EEFBF4', minHeight: '100vh' }}>
      <Header />
      <Container fluid className='py-4'>
        <UserWelcome userId={userId} welcomeMessage='Welcome back,'>
          Explore your projects and visualize your data to stay on top of your
          tasks.
        </UserWelcome>
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
