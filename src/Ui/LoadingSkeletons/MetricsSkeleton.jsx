/* eslint-disable react/prop-types */
import { Container, Card, Row, Col } from 'react-bootstrap'
import { createKeyframes, ANIMATION_STYLES } from './animations'

const THEME = {
  colors: {
    primary: '#404C46',
    secondary: '#222',
    accent: '#EC4F50',
    dark: '#304C46',
    muted: '#404C46',
  },
  metrics: [
    { id: 'wipLimit', color: '#AE2C2D', backgroundColor: '#A83C3D' },
    { id: 'inProgress', color: '#11AF44', backgroundColor: '#29DB78' },
    { id: 'cycleTime', color: '#0AC6A2', backgroundColor: '#01EBBD' },
    { id: 'leadTime', color: '#FA9900', backgroundColor: '#FA9900' },
    { id: 'throughput', color: '#186545', backgroundColor: '#49DB78' },
    { id: 'flowEfficiency', color: '#DE2C2D', backgroundColor: '#F83C3D' },
  ],
}

const TextRegister = ({ width = 8, backgroundColor = THEME.colors.muted }) => (
  <div
    style={{
      width: `${width}rem`,
      height: `${width / 10}rem`,
      backgroundColor,
      margin: '0.5rem',
      borderRadius: '4px',
      ...ANIMATION_STYLES.pulse,
    }}
  />
)

const MetricsCard = ({ color, backgroundColor, index }) => (
  <Card
    className='text-center p-1 mb-4 mx-4'
    style={{
      borderWidth: '4px',
      borderColor: THEME.colors.dark,
      backgroundColor: THEME.colors.dark,
      maxWidth: '7rem',
      minWidth: '6.5rem',
      height: '11rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      padding: '0.5rem',
      ...ANIMATION_STYLES.colorShift,
      animationDelay: `${index * 0.1}s`,
    }}
  >
    <Card.Body>
      <div
        className='d-flex justify-content-center align-items-center mb-1'
        style={{
          width: '4rem',
          height: '4rem',
          borderColor: '#000',
          borderWidth: '4px',
          borderRadius: '50%',
          backgroundColor,
          ...ANIMATION_STYLES.pulse,
        }}
      />
      <Card.Title className='my-1'>
        <TextRegister width={3} backgroundColor={color} />
      </Card.Title>
      <div
        style={{
          color,
          backgroundColor: '#000',
          borderRadius: '0.6rem',
          padding: '0.5rem',
        }}
        className='h3 mb-1'
      >
        <TextRegister width={2} backgroundColor={color} />
      </div>
    </Card.Body>
  </Card>
)

export const MetricsSkeleton = () => (
  <Container
    className='w-100'
    style={{
      borderBottomStyle: 'dashed',
      borderBottomColor: THEME.colors.accent,
      borderWidth: '2px',
      ...ANIMATION_STYLES.fadeIn,
    }}
  >
    <style>{createKeyframes(THEME)}</style>
    <Row className='mb-4'>
      <Col>
        <TextRegister />
        <Row>
          <Col>
            <TextRegister width={6} />
          </Col>
        </Row>
      </Col>
    </Row>
    <Row className='w-100'>
      {THEME.metrics.map((metric, index) => (
        <Col key={metric.id} md={3} lg={2} sm={4} xs={6}>
          <MetricsCard
            color={metric.color}
            backgroundColor={metric.backgroundColor}
            index={index}
          />
        </Col>
      ))}
    </Row>
  </Container>
)
