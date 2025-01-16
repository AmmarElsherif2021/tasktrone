/* eslint-disable react/prop-types */
import PropTypes from 'prop-types'
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

export function TaskCardSkeleton() {
  return (
    <Card
      className='task-card shadow-sm'
      style={{
        backgroundColor: THEME.colors.muted,
        cursor: 'pointer',
        borderWidth: '2.5px',
        borderColor: '#000',
        ...ANIMATION_STYLES.fadeIn,
      }}
    >
      <Card.Body className='p-3'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <TextRegister width={10} />
          <div style={{ backgroundColor: '#ad0000' }} />
        </div>
        <TextRegister width={6} />
        <div className='d-flex gap-2 mb-2'>
          <Badge
            bg='none'
            style={{
              borderWidth: '2px',
              borderColor: '#186545',
              borderRadius: '2rem',
              borderStyle: 'solid',
              padding: '0.5rem',
              color: '#186545',
              ...ANIMATION_STYLES.pulse,
            }}
          />
          <Badge
            bg='none'
            style={{
              borderWidth: '2px',
              borderColor: '#ad0000',
              borderRadius: '2rem',
              borderStyle: 'solid',
              padding: '0.5rem',
              color: '#ad0000',
              ...ANIMATION_STYLES.pulse,
            }}
          />
        </div>
        <TextRegister width={8} />
        <div className='d-flex justify-content-between gap-2'>
          <div
            className='phase-button'
            style={{
              borderWidth: '2px',
              borderColor: '#000',
              borderRadius: '2rem',
              ...ANIMATION_STYLES.pulse,
            }}
          />
          <div
            className='phase-button'
            style={{
              borderWidth: '2px',
              borderColor: '#000',
              borderRadius: '2rem',
              ...ANIMATION_STYLES.pulse,
            }}
          />
        </div>
      </Card.Body>
    </Card>
  )
}

TaskCardSkeleton.propTypes = {
  taskId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  leadTime: PropTypes.number,
  cycleTime: PropTypes.number,
  phase: PropTypes.string,
  requirements: PropTypes.arrayOf(PropTypes.string),
  members: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string,
      role: PropTypes.oneOf(['admin', 'reviewer', 'worker']),
    }),
  ),
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      contentType: PropTypes.string.isRequired,
    }),
  ),
  startDate: PropTypes.string,
  dueDate: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  onAttachmentUpload: PropTypes.func,
}

export default TaskCardSkeleton
