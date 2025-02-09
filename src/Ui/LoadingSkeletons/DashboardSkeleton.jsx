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
      width: '10rem',
      height: '10rem',
      borderWidth: '3px',
      borderColor: '#000',
      borderRadius: '30%',
      backgroundColor: THEME.colors.muted,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...ANIMATION_STYLES.fadeIn,
    }}
  >
    <div
      style={{
        width: '3rem',
        height: '3rem',
        backgroundColor: THEME.colors.primary,
        borderRadius: '50%',
        ...ANIMATION_STYLES.pulse,
      }}
    />
    <TextRegister width={6} />
    <TextRegister width={4} />
  </Card>
)

const CardHeaderSkeleton = ({ title }) => (
  <Card.Header
    className='d-flex align-items-center justify-content-between py-3'
    style={{
      backgroundColor: 'transparent',
      borderBottom: '2.5px solid #000',
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
      <Container fluid className='py-4'>
        <h1 className='mb-4' style={ANIMATION_STYLES.fadeIn}>
          <TextRegister width={14} />
        </h1>

        {/* Metrics Row */}
        <Row className='mx-4 mb-3'>
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
              className='mb-3 shadow-sm'
              style={{
                borderWidth: '2.5px',
                borderColor: '#000',
                backgroundColor: THEME.colors.secondary,
                padding: '1rem',
                ...ANIMATION_STYLES.fadeIn,
              }}
            >
              <CardHeaderSkeleton title='Personal Information' />
              <Card.Body>
                <div className='d-flex flex-row align-items-center'>
                  <div
                    style={{
                      width: '4rem',
                      height: '4rem',
                      backgroundColor: THEME.colors.primary,
                      borderRadius: '50%',
                      marginRight: '1rem',
                      ...ANIMATION_STYLES.pulse,
                    }}
                  />
                  <TextRegister width={8} />
                </div>
              </Card.Body>
            </Card>

            {/* Quick Access Card */}
            <Card
              className='mb-3 shadow-sm'
              style={{
                borderWidth: '2.5px',
                borderColor: '#000',
                backgroundColor: THEME.colors.secondary,
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
              className='shadow-sm'
              style={{
                borderWidth: '2.5px',
                borderColor: '#000',
                backgroundColor: THEME.colors.secondary,
                ...ANIMATION_STYLES.fadeIn,
              }}
            >
              <Card.Body>
                <CardHeaderSkeleton title='Projects' />
                <div
                  className='p-3'
                  style={{ maxHeight: '61.5vh', overflowY: 'auto' }}
                >
                  <Row xs={1} sm={2} md={2} lg={3} xl={4} className='g-4'>
                    {[1, 2, 3].map((_, index) => (
                      <Col key={index}>
                        <div
                          style={{
                            width: '100%',
                            height: '20rem',
                            backgroundColor: THEME.colors.primary,
                            borderRadius: '0.5rem',
                            ...ANIMATION_STYLES.pulse,
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
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
