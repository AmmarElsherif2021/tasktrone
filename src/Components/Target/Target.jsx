import { Card, Row, Col, Tabs, Tab, ListGroup } from 'react-bootstrap'
import Three from '../../Ui/CAD/Three'

export default function Target() {
  return (
    <>
      <Card className='mx-2 custom-modal' style={{ height: '80vh' }}>
        <Card.Header className='custom-modal'>
          <Card.Title>Target: ------ Current phase target: ------ </Card.Title>
        </Card.Header>
        <Card.Body className='custom-modal'>
          <Tabs defaultActiveKey='3dModel' id='target-tabs' className='mb-3'>
            {/* Tab for 3D Model */}
            <Tab eventKey='3dModel' title='3D Model'>
              <Row>
                <Col>
                  <Three />
                </Col>
              </Row>
            </Tab>

            {/* Tab for Related Documents */}
            <Tab eventKey='documents' title='Related Documents'>
              <Row>
                <Col>
                  <h5>Related Documents</h5>
                  <ListGroup>
                    <ListGroup.Item>Design Specifications.pdf</ListGroup.Item>
                    <ListGroup.Item>BOM.xlsx</ListGroup.Item>
                    <ListGroup.Item>
                      Prototype Testing Report.docx
                    </ListGroup.Item>
                    <ListGroup.Item>Production Plan.pdf</ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Tab>

            {/* Tab for Other Related Data */}
            <Tab eventKey='otherData' title='Other Data'>
              <Row>
                <Col>
                  <h5>Other Related Data</h5>
                  <ListGroup>
                    <ListGroup.Item>Target Timeline: Q4 2023</ListGroup.Item>
                    <ListGroup.Item>Current Progress: 75%</ListGroup.Item>
                    <ListGroup.Item>
                      Key Milestones: Prototype Testing, Production Planning
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Team Members: Design Engineers, Manufacturing Engineers,
                      Quality Control
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
        <Card.Footer className='custom-modal'>
          <small>Last phase: --- </small> <small> Controllers</small>
        </Card.Footer>
      </Card>
    </>
  )
}
