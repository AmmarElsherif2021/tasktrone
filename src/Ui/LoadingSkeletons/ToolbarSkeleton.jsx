/* eslint-disable react/prop-types */
import { Navbar, Container } from 'react-bootstrap'
import { createKeyframes, ANIMATION_STYLES } from './animations'

const THEME = {
  colors: {
    primary: '#729B87',
    secondary: '#EAF9ED',
    accent: '#EC4F50',
    dark: '#404C46',
    muted: '#1aaa8F',
  },
}

const PlaceholderItem = ({ width, height = '2rem', className = '' }) => (
  <div
    className={`rounded ${className}`}
    style={{
      width,
      height,
      backgroundColor: THEME.colors.secondary,
      ...ANIMATION_STYLES.pulse,
    }}
  />
)

export default function ToolbarSkeleton() {
  return (
    <>
      <style>{createKeyframes(THEME)}</style>
      <Navbar
        expand='lg'
        className='mb-2 '
        style={{
          backgroundColor: THEME.colors.muted,
          borderRadius: '0.5rem',
          height: '4rem',
          ...ANIMATION_STYLES.fadeIn,
        }}
      >
        <Container fluid className='px-3'>
          <div className='d-flex align-items-center justify-content-between w-100 py-2'>
            {/* Left section - Logo/Brand placeholder */}
            <div className='d-flex align-items-center'>
              <PlaceholderItem
                width='2.5rem'
                height='2.5rem'
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
            <div
              className='d-flex align-items-center gap-3'
              style={{
                ...ANIMATION_STYLES.fadeIn,
                animationDelay: '0.2s',
              }}
            >
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
    </>
  )
}
