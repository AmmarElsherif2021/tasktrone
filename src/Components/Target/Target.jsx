import { Card, Col, Row } from 'react-bootstrap'
import mediaRegister from '../../assets/negative-dashboard.svg'
export default function Target() {
  return (
    <>
      <Card className='mx-2 custom-modal'>
        <Card.Header className='custom-modal'>
          <Card.Title>Target</Card.Title>
        </Card.Header>
        <Card.Body className='custom-modal'>
          <Row>
            <Col>
              <img
                src={mediaRegister}
                alt='project target'
                style={{ maxWidth: '15rem', backgroundColor: '#000' }}
              />
            </Col>
            <Col>
              <h3>here target light-weighted media will be displayed </h3>
              <p>Little manager message should be displayed here</p>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className='custom-modal'>
          <small>last phase: --- </small> <small> controllers</small>
        </Card.Footer>
      </Card>
    </>
  )
}
