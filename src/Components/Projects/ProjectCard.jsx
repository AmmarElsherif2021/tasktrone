import PropTypes from 'prop-types'
import { Card, Badge, ListGroup } from 'react-bootstrap'
import { User } from '../User/User.jsx'
import { useProject } from '../../contexts/ProjectContext.jsx'
//import { Navigate } from 'react-router-dom'

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

  const handleProjectClick = () => {
    setCurrentProject(projectId)
  }

  const cardBgColor = createHexColor(projectId)

  return (
    <Card
      onClick={handleProjectClick}
      style={{
        margin: '1vw',
        width: '18rem',
        cursor: 'pointer',
        backgroundColor: cardBgColor,
        transition: 'transform 0.2s',
      }}
      className='shadow-sm hover:scale-105'
    >
      <Card.Body>
        <Card.Title className='d-flex justify-content-between align-items-center'>
          {title}
          <Badge bg='secondary' className='ms-2'>
            {projectId.slice(-6)}
          </Badge>
        </Card.Title>

        {description && (
          <Card.Subtitle className='mb-2 text-muted'>
            Created by <User id={createdBy} />
          </Card.Subtitle>
        )}

        <Card.Text className='mt-2'>
          <strong>Team Members:</strong>
        </Card.Text>

        <ListGroup variant='flush'>
          {members.map((member) => (
            <ListGroup.Item
              key={member.user}
              className='d-flex justify-content-between align-items-center px-0'
            >
              <div>
                <User id={member.user} />
              </div>
              <Badge
                bg={
                  member.role === 'admin'
                    ? 'danger'
                    : member.role === 'reviewer'
                      ? 'warning'
                      : 'primary'
                }
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
