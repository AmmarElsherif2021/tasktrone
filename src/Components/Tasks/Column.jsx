import PropTypes from 'prop-types'
import { Card, Stack } from 'react-bootstrap'
import { TaskCard } from './TaskCard'

export const Column = ({ columnTitle, tasks }) => {
  return (
    <Card className='h-100'>
      <Card.Header className='text-center fw-bold text-capitalize'>
        {columnTitle}
        <span className='ms-2 badge bg-secondary'>{tasks.length}</span>
      </Card.Header>
      <Card.Body className='p-2'>
        <Stack gap={2} className='overflow-auto' style={{ maxHeight: '70vh' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              taskId={task._id}
              title={task.title}
              author={task.author}
              leadTime={task.leadTime}
              cycleTime={task.cycleTime}
              phase={task.phase}
            />
          ))}
        </Stack>
      </Card.Body>
    </Card>
  )
}

Column.propTypes = {
  columnTitle: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      leadTime: PropTypes.number.isRequired,
      cycleTime: PropTypes.number.isRequired,
      phase: PropTypes.string,
    }),
  ).isRequired,
}
