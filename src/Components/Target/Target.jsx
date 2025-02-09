import { Row, Col, Tabs, Tab, ListGroup, Card } from 'react-bootstrap'
import Three from '../../Ui/CAD/Three'
import { StyledCard } from '../../Ui/StyledCard'
import { useState } from 'react'
import { colors } from '../../Ui/colors'

const COMMON_STYLES = {
  card: {
    borderWidth: '2.5px',
    borderColor: '#557263',
    transition: 'background-color 0.2s',
    backgroundColor: colors.cardBackgroundColor,
  },
  cardHeader: {
    backgroundColor: 'transparent',
    borderBottom: '2.5px solid #557263',
    fontFamily: 'var(--font-family-mono)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: '0.9rem',
  },
  listGroup: {
    border: '2px solid #000',
    borderRadius: '8px',
    margin: '0.25rem',
  },
  listItem: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #557263',
    padding: '0.75rem',
    fontFamily: 'var(--font-family-mono)',
    fontSize: '0.8rem',
  },
  tabs: {
    border: 'none',
    marginBottom: '1rem',
  },
  tab: {
    fontFamily: 'var(--font-family-mono)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: '0.8rem',
    border: '2px solid #557263',
    borderRadius: '8px',
    marginRight: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: '#000',
    transition: 'all 0.2s',
  },
  activeTab: {
    backgroundColor: '#557263',
    color: '#fff',
    border: '2px solid #557263',
  },
  footer: {
    borderTop: '2.5px solid #557263',
    padding: '0.5rem',
    fontFamily: 'var(--font-family-mono)',
    fontSize: '0.8rem',
  },
}

export default function Target() {
  const [hoverStates, setHoverStates] = useState({})
  const [activeKey, setActiveKey] = useState('3dModel')

  const handleHover = (key, isHovered) => {
    setHoverStates((prev) => ({ ...prev, [key]: isHovered }))
  }

  return (
    <StyledCard
      hoverKey='targetCard'
      hoverStates={hoverStates}
      handleHover={handleHover}
      style={{
        height: '85vh',
        ...COMMON_STYLES.card,
      }}
    >
      <Card.Header style={COMMON_STYLES.cardHeader}>
        <Card.Title>Gear 1011AM3</Card.Title>
      </Card.Header>
      <Card.Body>
        <Tabs
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k)}
          className='mb-3'
          style={COMMON_STYLES.tabs}
        >
          <Tab
            eventKey='3dModel'
            title='3D Model'
            tabClassName={activeKey === '3dModel' ? 'active' : ''}
          >
            <Row>
              <Col>
                <div>
                  <Three />
                </div>
              </Col>
            </Row>
          </Tab>

          <Tab
            eventKey='documents'
            title='Related Documents'
            tabClassName={activeKey === 'documents' ? 'active' : ''}
          >
            <Row>
              <Col>
                <ListGroup style={COMMON_STYLES.listGroup}>
                  <ListGroup.Item style={COMMON_STYLES.listItem}>
                    Design Specifications.pdf
                  </ListGroup.Item>
                  <ListGroup.Item style={COMMON_STYLES.listItem}>
                    BOM.xlsx
                  </ListGroup.Item>
                  <ListGroup.Item style={COMMON_STYLES.listItem}>
                    Prototype Testing Report.docx
                  </ListGroup.Item>
                  <ListGroup.Item style={COMMON_STYLES.listItem}>
                    Production Plan.pdf
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Tab>

          <Tab
            eventKey='otherData'
            title='Other Data'
            tabClassName={activeKey === 'otherData' ? 'active' : ''}
          >
            <Row>
              <Col>
                <ListGroup style={COMMON_STYLES.listGroup}>
                  <ListGroup.Item style={COMMON_STYLES.listItem}>
                    Target Timeline: Q4 2023
                  </ListGroup.Item>
                  <ListGroup.Item style={COMMON_STYLES.listItem}>
                    Current Progress: 75%
                  </ListGroup.Item>
                  <ListGroup.Item style={COMMON_STYLES.listItem}>
                    Key Milestones: Prototype Testing, Production Planning
                  </ListGroup.Item>
                  <ListGroup.Item style={COMMON_STYLES.listItem}>
                    Team Members: Design Engineers, Manufacturing Engineers,
                    Quality Control
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Card.Body>
      <Card.Footer style={COMMON_STYLES.footer}>
        <small>Last phase: --- </small> <small> Controllers</small>
      </Card.Footer>
    </StyledCard>
  )
}
