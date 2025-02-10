// Target.jsx
import { useState } from 'react'
import { Card, Nav, Tab, Container, Badge, ListGroup } from 'react-bootstrap'
import Three from '../../Ui/CAD/Three'
import { StyledCard } from '../../Ui/StyledCard'
//import { colors } from '../../Ui/colors'

const COMMON_STYLES = {
  cardHeader: {
    backgroundColor: 'transparent',
    borderBottom: '2.5px solid #557263',
    fontFamily: 'var(--font-family-mono)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTabs: {
    borderBottom: '2px solid #557263',
    marginBottom: '1rem',
  },
  navLink: {
    position: 'relative',
    fontFamily: 'var(--font-family-mono)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: '0.9rem',
    color: '#000',
    padding: '0.5rem 1rem',
    margin: '0 0.25rem',
    borderRadius: '5px 5px 0 0',
    transition: 'all 0.2s',
    borderBottomColor: 'transparent',
    bottom: '-2px',
    zIndex: 1000,
    backgroundColor: '#D3EADE',
  },
  navLinkActive: {
    backgroundColor: '#557263',
    color: '#fff',
  },
  listItem: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #557263',
    padding: '0.75rem',
    fontFamily: 'var(--font-family-mono)',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  },
  listItemHover: {
    backgroundColor: 'rgba(85, 114, 99, 0.1)',
  },
  footer: {
    borderTop: '2.5px solid #557263',
    padding: '0.25rem',
    fontFamily: 'var(--font-family-mono)',
    color: '#000',
    fontSize: '0.8rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
}

export default function Target() {
  const [activeKey, setActiveKey] = useState('3dModel')
  const [hoveredItem, setHoveredItem] = useState(null)
  const [hoverStates, setHoverStates] = useState({})

  const handleHover = (key, isHovered) => {
    setHoverStates((prev) => ({ ...prev, [key]: isHovered }))
  }

  return (
    <StyledCard
      hoverKey='targetCard'
      hoverStates={hoverStates}
      handleHover={handleHover}
      style={{
        height: '90vh',
      }}
    >
      <Card.Header style={COMMON_STYLES.cardHeader}>
        <Card.Title className='mb-0'>Gear 1011AM3</Card.Title>
        <div>
          <Badge bg='black' className='me-2'>
            In Progress
          </Badge>
          <Badge bg='secondary'>75%</Badge>
        </div>
      </Card.Header>
      <Card.Body className='p-0'>
        <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          <Nav
            variant='tabs'
            style={COMMON_STYLES.navTabs}
            className='px-3 pt-2'
          >
            {['3D Model', 'Related Documents', 'Other Data'].map(
              (title, index) => {
                const eventKey = ['3dModel', 'documents', 'otherData'][index]
                return (
                  <Nav.Item key={eventKey}>
                    <Nav.Link
                      eventKey={eventKey}
                      style={{
                        ...COMMON_STYLES.navLink,
                        ...(activeKey === eventKey
                          ? COMMON_STYLES.navLinkActive
                          : {}),
                      }}
                    >
                      {title}
                    </Nav.Link>
                  </Nav.Item>
                )
              },
            )}
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey='3dModel'>
              <Container fluid>
                <Three />
              </Container>
            </Tab.Pane>
            <Tab.Pane eventKey='documents'>
              <ListGroup>
                {[
                  'Design Specifications.pdf',
                  'BOM.xlsx',
                  'Prototype Testing Report.docx',
                  'Production Plan.pdf',
                ].map((doc, index) => (
                  <ListGroup.Item
                    key={index}
                    style={{
                      ...COMMON_STYLES.listItem,
                      ...(hoveredItem === doc
                        ? COMMON_STYLES.listItemHover
                        : {}),
                    }}
                    onMouseEnter={() => setHoveredItem(doc)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {doc}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab.Pane>
            <Tab.Pane eventKey='otherData'>
              <ListGroup>
                {[
                  'Target Timeline: Q4 2023',
                  'Current Progress: 75%',
                  'Key Milestones: Prototype Testing, Production Planning',
                  'Team Members: Design Engineers, Manufacturing Engineers, Quality Control',
                ].map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    style={{
                      ...COMMON_STYLES.listItem,
                      ...(hoveredItem === item
                        ? COMMON_STYLES.listItemHover
                        : {}),
                    }}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
      <Card.Footer style={COMMON_STYLES.footer}>
        <small>Last Updated: Today</small>
        <small>Controller Module</small>
      </Card.Footer>
    </StyledCard>
  )
}
