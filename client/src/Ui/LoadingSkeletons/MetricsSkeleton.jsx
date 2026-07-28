/* eslint-disable react/prop-types */
import { Container, Card, Row, Col } from 'react-bootstrap'
import { createKeyframes, ANIMATION_STYLES } from './animations'

const THEME = {
  colors: {
    primary: '#729B87',
    secondary: '#E1F9ED',
    accent: '#EC4F50',
    dark: '#404C46',
    muted: '#A6C9B7',
  },
  metrics: [
    { id: 'wipLimit', color: '#DE2C2D', backgroundColor: '#F83C3D' },
    { id: 'inProgress', color: '#12AF44', backgroundColor: '#49DB78' },
    { id: 'cycleTime', color: '#0FC6A2', backgroundColor: '#04EBBD' },
    { id: 'leadTime', color: '#FE9900', backgroundColor: '#FE9900' },
    { id: 'throughput', color: '#186545', backgroundColor: '#49DB78' },
    { id: 'flowEfficiency', color: '#DE2C2D', backgroundColor: '#F83C3D' },
  ],
}

const TextRegister = ({ width = 8, backgroundColor = THEME.colors.muted }) => (
  <div
    style={{
      width: `${width}rem`,
      height: `${width / 4}rem`,
      backgroundColor,
      margin: '0.5rem',
      borderRadius: '4px',
      ...ANIMATION_STYLES.pulse,
    }}
  />
)

const MetricsCard = ({ color, backgroundColor, index }) => (
  <Card
    className='text-center shadow-sm mb-4'
    style={{
      borderWidth: '2.5px',
      borderColor: '#C2D4CA',
      backgroundColor: THEME.colors.secondary,
      maxWidth: '10rem',
      minWidth: '8rem',
      height: '12rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...ANIMATION_STYLES.fadeIn,
      animationDelay: `${index * 0.1}s`,
    }}
  >
    <Card.Body>
      <div
        className='d-flex justify-content-center align-items-center mb-2'
        style={{
          width: '4.5rem',
          height: '4.5rem',
          borderColor: '#C2D4CA',
          borderWidth: '2.5px',
          borderRadius: '50%',
          backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          ...ANIMATION_STYLES.pulse,
        }}
      />
      <Card.Title className='mb-2'>
        <TextRegister width={4} backgroundColor={color} />
      </Card.Title>
      <div
        style={{
          backgroundColor: THEME.colors.muted,
          borderRadius: '0.5rem',
          padding: '0.5rem',
        }}
      >
        <TextRegister width={3} backgroundColor={THEME.colors.secondary} />
      </div>
    </Card.Body>
  </Card>
)

export const MetricsSkeleton = () => (
  <Container
    fluid
    className='mb-4'
    style={{
      borderBottom: '2.5px solid #C2D4CA',
      padding: '1rem',
      backgroundColor: THEME.colors.secondary,
      ...ANIMATION_STYLES.fadeIn,
    }}
  >
    <style>{createKeyframes(THEME)}</style>
    <Card
      className='shadow-sm mb-3'
      style={{
        borderWidth: '2.5px',
        borderColor: '#C2D4CA',
        backgroundColor: THEME.colors.secondary,
        padding: '1rem',
      }}
    >
      <Card.Header
        className='d-flex align-items-center justify-content-between py-3'
        style={{
          backgroundColor: 'transparent',
          borderBottom: '2.5px solid #C2D4CA',
        }}
      >
        <div className='d-flex align-items-center'>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: THEME.colors.primary,
              borderRadius: '50%',
              marginRight: '1rem',
              ...ANIMATION_STYLES.pulse,
            }}
          />
        </div>
      </Card.Header>
      <Card.Body>
        <Row className='g-4'>
          {THEME.metrics.map((metric, index) => (
            <Col key={metric.id} md={4} lg={2} sm={6}>
              <MetricsCard
                color={metric.color}
                backgroundColor={metric.backgroundColor}
                index={index}
              />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  </Container>
)
