/* eslint-disable react/prop-types */
import { Navbar, Container, Card } from 'react-bootstrap'
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

const PlaceholderItem = ({ width, height = '2rem', className = '' }) => (
  <div
    className={`rounded ${className}`}
    style={{
      width,
      height,
      backgroundColor: THEME.colors.primary,
      ...ANIMATION_STYLES.pulse,
    }}
  />
)

export default function ToolbarSkeleton() {
  return (
    <>
      <style>{createKeyframes(THEME)}</style>
      <Card
        className='shadow-sm mb-4'
        style={{
          borderWidth: '2.5px',
          borderColor: '#C2D4CA',
          backgroundColor: THEME.colors.secondary,
          padding: '1rem',
          ...ANIMATION_STYLES.fadeIn,
        }}
      >
        <Navbar
          expand='lg'
          className='px-3'
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <Container fluid>
            <div className='d-flex align-items-center justify-content-between w-100'>
              {/* Left section - Logo/Brand placeholder */}
              <div className='d-flex align-items-center'>
                <PlaceholderItem
                  width='3rem'
                  height='3rem'
                  className='rounded-circle me-3'
                />
                <PlaceholderItem width='8rem' />
              </div>

              {/* Center section - Navigation items */}
              <div
                className='d-none d-md-flex align-items-center gap-4'
                style={ANIMATION_STYLES.fadeIn}
              >
                <PlaceholderItem width='5rem' />
                <PlaceholderItem width='6rem' />
                <PlaceholderItem width='5.5rem' />
              </div>

              {/* Right section - Actions */}
              <div className='d-flex align-items-center gap-3'>
                <PlaceholderItem
                  width='2.25rem'
                  height='2.25rem'
                  className='rounded-circle'
                />
                <PlaceholderItem
                  width='2.25rem'
                  height='2.25rem'
                  className='rounded-circle'
                />
                <PlaceholderItem
                  width='2.25rem'
                  height='2.25rem'
                  className='rounded-circle d-none d-sm-block'
                />
              </div>
            </div>
          </Container>
        </Navbar>
      </Card>
    </>
  )
}
