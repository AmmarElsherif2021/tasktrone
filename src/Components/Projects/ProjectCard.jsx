import PropTypes from 'prop-types'
import { Card, Badge, ListGroup } from 'react-bootstrap'
import { User } from '../User/User.jsx'
import { useProject } from '../../contexts/ProjectContext.jsx'
import { useState } from 'react'

function createHexColor(id) {
  const cleanedId = id.replace(/\s/g, '')
  const firstChar = cleanedId.charAt(cleanedId.length - 1)
  const middleChar = cleanedId.charAt(cleanedId.length - 2)
  const lastChar = cleanedId.charAt(cleanedId.length - 3)
  return `#ffa${firstChar}${middleChar}${lastChar}`
}

export function ProjectCard({
  projectId,
  title,
  description,
  createdBy,
  members,
}) {
  const { setCurrentProject } = useProject()
  const [hover, setHover] = useState(false)

  const handleProjectClick = () => {
    setCurrentProject(projectId)
  }

  const cardBgColor = createHexColor(projectId)

  return (
    <Card
      onClick={handleProjectClick}
      className='shadow-sm h-100'
      style={{
        cursor: 'pointer',
        backgroundColor: hover ? cardBgColor + '30' : cardBgColor,
        borderWidth: '2.5px',
        borderColor: '#000',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card.Body className='p-3'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          <Card.Title
            className='h6 mb-0'
            style={{ fontSize: '1.2em', maxWidth: '99%' }}
          >
            {title}
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
            //maxWidth: '25%',
            width: '5rem',
          }}
        >
          {projectId.slice(-6)}
        </Badge>
        {description && (
          <Card.Subtitle className='small text-muted my-2'>
            Created by <User id={createdBy} />
          </Card.Subtitle>
        )}

        <ListGroup variant='flush'>
          {members.map((member) => (
            <ListGroup.Item
              key={member.user}
              className='d-flex justify-content-between align-items-center px-0 flex-wrap gap-2'
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '0.8em',
              }}
            >
              <div className='text-truncate'>
                <User id={member.user} />
              </div>
              <Badge
                bg='none'
                className='text-nowrap'
                style={{
                  borderWidth: '2px',
                  borderColor:
                    member.role === 'admin'
                      ? '#ad0000'
                      : member.role === 'reviewer'
                        ? '#186545'
                        : '#000',
                  borderRadius: '2rem',
                  borderStyle: 'solid',
                  padding: '0.5rem',
                  color:
                    member.role === 'admin'
                      ? '#ad0000'
                      : member.role === 'reviewer'
                        ? '#186545'
                        : '#000',
                }}
              >
                {member.role}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

ProjectCard.propTypes = {
  projectId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      role: PropTypes.oneOf(['admin', 'reviewer', 'worker']).isRequired,
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default ProjectCard
