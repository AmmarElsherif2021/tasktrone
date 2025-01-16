/* eslint-disable react/prop-types */
//import PropTypes from 'prop-types'
import { Card, Badge } from 'react-bootstrap'
import { ANIMATION_STYLES } from './animations'

const THEME = {
  colors: {
    primary: '#404C46',
    secondary: '#222',
    accent: '#EC4F50',
    dark: '#304C46',
    muted: '#404C46',
  },
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

export function ProjectCardSkeleton() {
  return (
    <>
      <Card
        className='shadow-sm h-100'
        style={{
          cursor: 'pointer',
          backgroundColor: THEME.colors.muted,
          borderWidth: '2.5px',
          borderColor: '#000',
          transition: 'background-color 0.3s ease',
          ...ANIMATION_STYLES.fadeIn,
        }}
      >
        <Card.Body className='p-2 d-flex flex-column justify-content-between align-items-center'>
          <div className='d-flex justify-content-between align-items-center mb-1'>
            <Card.Title
              className='h6 p-0 mb-0 w-100'
              style={{
                fontSize: '1.2em',
                maxWidth: '99%',
                textAlign: 'center',
              }}
            >
              <TextRegister width={10} />
            </Card.Title>
          </div>

          <Badge
            bg='none'
            className='text-nowrap'
            style={{
              borderWidth: '2px',
              borderColor: '#000',
              borderRadius: '1rem',
              borderStyle: 'solid',
              padding: '0.5rem',
              margin: '1px',
              backgroundColor: '#000',
              color: '#fff',
              width: '5rem',
              ...ANIMATION_STYLES.pulse,
            }}
          >
            <TextRegister width={4} backgroundColor='#fff' />
          </Badge>

          <Card.Subtitle className='small text-muted my-2'>
            <TextRegister width={6} />
          </Card.Subtitle>

          <Card.Text className='small text-muted my-2'>
            <TextRegister width={8} />
            <TextRegister width={6} />
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}
