/* eslint-disable no-unused-vars */
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

const MetricCardSkeleton = () => (
  <Card
    className='mb-3 shadow-sm'
    style={{
      width: '15rem',
      borderWidth: '2.5px',
      borderColor: THEME.colors.primary,
      backgroundColor: THEME.colors.muted,
      ...ANIMATION_STYLES.fadeIn,
    }}
  >
    <Card.Body className='d-flex justify-content-between align-items-center'>
      <div className='h3 py-10 my-10'>
        <TextRegister width={6} />
      </div>
      <div
        style={{
          width: '3rem',
          height: '3rem',
          backgroundColor: THEME.colors.secondary,
          borderRadius: '50%',
          ...ANIMATION_STYLES.pulse,
        }}
      />
    </Card.Body>
  </Card>
)

const CardHeaderSkeleton = ({ title }) => (
  <Card.Header
    className='d-flex align-items-center justify-content-between py-3'
    style={{
      backgroundColor: 'transparent',
      borderBottom: '2.5px solid #404C46',
      ...ANIMATION_STYLES.pulse,
    }}
  >
    <div className='d-flex align-items-center'>
      <div
        style={{
          width: '3rem',
          height: '3rem',
          backgroundColor: THEME.colors.primary,
          borderRadius: '50%',
          ...ANIMATION_STYLES.pulse,
        }}
      />
      <h4 className='mb-0'>
        <TextRegister width={6} />
      </h4>
    </div>
    <div className='d-flex gap-2'>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          backgroundColor: THEME.colors.primary,
          borderRadius: '50%',
          ...ANIMATION_STYLES.pulse,
        }}
      />
      <div
        style={{
          width: '2rem',
          height: '2rem',
          backgroundColor: THEME.colors.secondary,
          borderRadius: '50%',
          ...ANIMATION_STYLES.pulse,
        }}
      />
    </div>
  </Card.Header>
)

export function DashboardSkeleton() {
  return (
    <div
      style={{
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        opacity: '50%',
      }}
    >
      <style>{createKeyframes(THEME)}</style>
      <Container fluid className='my-1'>
        <h1 className='mb-4' style={ANIMATION_STYLES.fadeIn}>
          <TextRegister width={14} />
        </h1>

        {/* Metrics Row */}
        <Row className='mb-3'>
          {[1, 2, 3, 4].map((_, index) => (
            <Col md={3} sm={6} key={index}>
              <MetricCardSkeleton />
            </Col>
          ))}
        </Row>

        {/* Main Content Row */}
        <Row className='mb-3'>
          {/* Personal Information and Quick Access Column */}
          <Col lg={4} md={5} sm={12} className='mb-4'>
            {/* Personal Information Card */}
            <Card
              className='mb-1 h-40'
              style={{
                borderWidth: '2.5px',
                borderColor: THEME.colors.primary,
                backgroundColor: THEME.colors.secondary,
                transition: 'background-color 0.2s',
                padding: '1rem',
                ...ANIMATION_STYLES.fadeIn,
              }}
            >
              <CardHeaderSkeleton title='Personal Information' />
              <Card.Body>
                <div className='d-flex flex-column align-items-center'>
                  <div
                    style={{
                      width: '5rem',
                      height: '5rem',
                      backgroundColor: THEME.colors.primary,
                      borderRadius: '50%',
                      ...ANIMATION_STYLES.pulse,
                    }}
                  />
                  <TextRegister width={8} />
                </div>
              </Card.Body>
            </Card>

            {/* Quick Access Card */}
            <Card
              className='mb-1 h-30'
              style={{
                borderWidth: '2.5px',
                borderColor: THEME.colors.primary,
                backgroundColor: THEME.colors.secondary,
                transition: 'background-color 0.2s',
                padding: '1rem',
                ...ANIMATION_STYLES.fadeIn,
              }}
            >
              <CardHeaderSkeleton title='Quick Access' />
              <Card.Body>
                <div className='d-flex flex-wrap gap-2'>
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: '6rem',
                        height: '2rem',
                        backgroundColor: THEME.colors.primary,
                        borderRadius: '2rem',
                        ...ANIMATION_STYLES.pulse,
                      }}
                    />
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Projects Column */}
          <Col lg={8} md={7} sm={12}>
            <Card
              style={{
                borderWidth: '2.5px',
                borderColor: THEME.colors.primary,
                backgroundColor: THEME.colors.secondary,
                transition: 'background-color 0.2s',
                ...ANIMATION_STYLES.fadeIn,
              }}
            >
              <Card.Body>
                <CardHeaderSkeleton title='Projects' />
                <div className='d-flex flex-wrap gap-2 pt-5'>
                  {[1, 2, 3].map((_, index) => (
                    <Col
                      key={index}
                      style={{
                        width: '10%',
                        height: '20rem',
                        backgroundColor: THEME.colors.primary,
                        borderRadius: '0.5rem',
                        ...ANIMATION_STYLES.pulse,
                      }}
                    />
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default DashboardSkeleton
