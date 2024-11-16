import PropTypes from 'prop-types'
import { Card, Button, Badge } from 'react-bootstrap'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeTaskPhase } from '../../API/tasks.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { User } from '../User/User.jsx'

//hex color generator
function createHexColor(id) {
  const cleanedId = id.replace(/\s/g, '')
  // Get the middle and last characters
  const firstChar = 'f'
  const middleChar = cleanedId.charAt(Math.floor(cleanedId.length / 2))
  const lastChar = cleanedId.charAt(cleanedId.length - 1)
  // Construct the hex color
  const hexColor = `#${firstChar}${middleChar}${lastChar}`
  return hexColor
}

export function TaskCard({
  taskId,
  title,
  author,
  leadTime,
  cycleTime,
  phase,
}) {
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ token, taskId, newPhase }) =>
      changeTaskPhase(token, taskId, newPhase),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
    },
  })

  const handlePhaseChange = (newPhase) => {
    mutation.mutate({ token, taskId, newPhase })
  }

  return (
    <Card
      className='task-card'
      style={{ backgroundColor: createHexColor(taskId) }}
    >
      <Card.Body className='p-2'>
        <Card.Title className='h6 mb-2'>{title}</Card.Title>
        <Card.Text className='small text-muted mb-2'>ID: {taskId}</Card.Text>

        <div className='d-flex gap-2 mb-2'>
          <Badge bg='info'>Lead: {leadTime}d</Badge>
          <Badge bg='secondary'>Cycle: {cycleTime}d</Badge>
        </div>

        {author && (
          <div className='small text-muted mb-2'>
            By <User id={author} />
          </div>
        )}

        {phase !== 'done' && (
          <Button
            variant='outline-primary'
            size='sm'
            className='w-100'
            onClick={() => {
              if (phase === 'story') {
                handlePhaseChange('inProgress')
              } else if (phase === 'inProgress') {
                handlePhaseChange('done')
              }
            }}
          >
            Move to {phase === 'story' ? 'In Progress' : 'Done'}
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

TaskCard.propTypes = {
  taskId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  leadTime: PropTypes.number,
  cycleTime: PropTypes.number,
  phase: PropTypes.string,
}
