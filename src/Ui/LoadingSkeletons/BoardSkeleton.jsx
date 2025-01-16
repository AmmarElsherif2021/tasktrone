import { useEffect } from 'react'
import { Container, Card, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ToolbarSkeleton from './ToolbarSkeleton'
import { MetricsSkeleton } from './MetricsSkeleton'
import welcome from '../../assets/welcome.gif'
import { createKeyframes, ANIMATION_STYLES } from './animations'

const THEME = {
  colors: {
    primary: '#729B87',
    secondary: '#E1F9ED',
    accent: '#EC4F50',
    dark: '#404C46',
    muted: '#C4E2D3',
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
          <Card style={{ borderStyle: 'none' }}>
            <Card.Body>
              <div className='text-center py-5'>
                <Spinner animation='border' role='status' variant='#000'>
                  <span className='visually-hidden'>Loading...</span>
                </Spinner>
                <p className='mt-3' style={ANIMATION_STYLES.fadeIn}>
                  Loading project board...
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <Card
          className='p-4'
          style={{
            borderStyle: 'none',
            ...ANIMATION_STYLES.scaleIn,
          }}
        >
          <Card.Body
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              alt='newProject'
              src={welcome}
              className='mb-3'
              style={ANIMATION_STYLES.fadeIn}
            />
            <h1
              style={{
                textAlign: 'center',
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
