import { useEffect } from 'react'
import { Container, Card, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ToolbarSkeleton from './ToolbarSkeleton'
import { MetricsSkeleton } from './MetricsSkeleton'
import welcome from '../../assets/welcome.gif'
import { createKeyframes, ANIMATION_STYLES } from './animations'

const COLORS = {
  primary: '#729B87',
  secondary: '#E1F9ED',
  accent: '#EC4F50',
  dark: '#404C46',
  muted: '#1aaa8F',
}

const THEME = {
  colors: COLORS,
  metrics: [
    { id: 'wipLimit', color: '#AE2C2D', backgroundColor: '#A83C3D' },
    { id: 'inProgress', color: '#11AF44', backgroundColor: '#29DB78' },
    { id: 'cycleTime', color: '#0AC6A2', backgroundColor: '#01EBBD' },
    { id: 'leadTime', color: '#FA9900', backgroundColor: '#FA9900' },
    { id: 'throughput', color: '#186545', backgroundColor: '#49DB78' },
    { id: 'flowEfficiency', color: '#DE2C2D', backgroundColor: '#F83C3D' },
  ],
}

export const BoardSkeleton = ({ phase = 'loading' }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Container fluid className='py-4'>
      <style>{createKeyframes(THEME)}</style>
      {phase === 'loading' ? (
        <div style={ANIMATION_STYLES.fadeIn}>
          <ToolbarSkeleton />
          <MetricsSkeleton />
          <Card
            className='shadow-sm mb-4'
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
                ...ANIMATION_STYLES.pulse,
              }}
            >
              <div className='d-flex align-items-center'>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: THEME.colors.muted,
                    borderRadius: '50%',
                    marginRight: '1rem',
                    ...ANIMATION_STYLES.pulse,
                  }}
                />
                <h4 className='mb-0' style={{ color: THEME.colors.dark }}>
                  Project Board
                </h4>
              </div>
              <div className='d-flex gap-2'>
                <div
                  style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: THEME.colors.muted,
                    borderRadius: '50%',
                    ...ANIMATION_STYLES.pulse,
                  }}
                />
                <div
                  style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: THEME.colors.primary,
                    borderRadius: '50%',
                    ...ANIMATION_STYLES.pulse,
                  }}
                />
              </div>
            </Card.Header>
            <Card.Body>
              <div className='text-center py-5'>
                <Spinner
                  animation='border'
                  style={{
                    color: THEME.colors.muted,
                    width: '3rem',
                    height: '3rem',
                    borderWidth: '0.25rem',
                  }}
                >
                  <span className='visually-hidden'>Loading...</span>
                </Spinner>
                <p
                  className='mt-3'
                  style={{
                    color: THEME.colors.dark,
                    fontSize: '1.1rem',
                    ...ANIMATION_STYLES.fadeIn,
                  }}
                >
                  Loading project board...
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <Card
          className='shadow-sm'
          style={{
            borderWidth: '2.5px',
            borderColor: '#C2D4CA',
            backgroundColor: THEME.colors.secondary,
            padding: '1rem',
            ...ANIMATION_STYLES.scaleIn,
          }}
        >
          <Card.Header
            className='d-flex align-items-center justify-content-between py-3'
            style={{
              backgroundColor: 'transparent',
              borderBottom: '2.5px solid #C2D4CA',
              ...ANIMATION_STYLES.pulse,
            }}
          >
            <div className='d-flex align-items-center'>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: THEME.colors.muted,
                  borderRadius: '50%',
                  marginRight: '1rem',
                  ...ANIMATION_STYLES.pulse,
                }}
              />
            </div>
            <div className='d-flex gap-2'>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: THEME.colors.muted,
                  borderRadius: '50%',
                  ...ANIMATION_STYLES.pulse,
                }}
              />
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: THEME.colors.primary,
                  borderRadius: '50%',
                  ...ANIMATION_STYLES.pulse,
                }}
              />
            </div>
          </Card.Header>
          <Card.Body
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '2rem 1rem',
            }}
          >
            <img
              alt='newProject'
              src={welcome}
              className='mb-4'
              style={{
                maxWidth: '300px',
                ...ANIMATION_STYLES.fadeIn,
              }}
            />
            <h1
              style={{
                textAlign: 'center',
                color: THEME.colors.dark,
                fontSize: '1.75rem',
                maxWidth: '800px',
                ...ANIMATION_STYLES.slideIn,
              }}
            >
              Your project board is waiting for you. Invite your team and start
              planning your tasks!
            </h1>
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}

BoardSkeleton.propTypes = {
  phase: PropTypes.oneOf(['loading', 'empty']).isRequired,
}

export default BoardSkeleton
