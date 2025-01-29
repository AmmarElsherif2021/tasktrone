/* eslint-disable react/prop-types */
import { Row, Col, Container } from 'react-bootstrap'
import { Header } from '../../Components/Header/Header'
import MessangerPortion from './MessangerPortion'
import CreateProjectPortion from './CreateProjectPortion'
import { UserWelcome } from './UserWelcome'

const NewMemberExplorer = ({ userId }) => {
  return (
    <div style={{ backgroundColor: '#EEFBF4', minHeight: '100vh' }}>
      <Header />
      <Container fluid className='py-4'>
        <UserWelcome userId={userId} welcomeMessage='Welcome,'>
          Create your first project, or notify other users that you are ready
          for work.
        </UserWelcome>
        <Row className='justify-content-center'>
          <Col md={4} lg={3}>
            <CreateProjectPortion />
          </Col>
          <Col md={4} lg={3}>
            <MessangerPortion />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default NewMemberExplorer
