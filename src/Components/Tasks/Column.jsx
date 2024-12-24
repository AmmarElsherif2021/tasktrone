import PropTypes from 'prop-types'
import { Card, Stack } from 'react-bootstrap'
import { TaskCard } from './TaskCard'
import { useEffect } from 'react'
//import { useProject } from '../../contexts/ProjectContext'

export const Column = ({ tasks }) => {
  useEffect(() => {
    console.log(`Column  rendered with tasks:`, tasks)
  }, [tasks])
  return (
    <Card className='h-100' style={{ backgroundColor: '#fff', border: 'none' }}>
      <Stack
        gap={2}
        className='overflow-auto'
        style={{
          maxHeight: '70vh',
          backgroundColor: '#fff',
          border: 'none',
        }}
      >
        {tasks?.map((task) => (
          <TaskCard
            key={task._id}
            projectId={task.project}
            taskId={task._id}
            title={task.title}
            author={task.author}
            leadTime={task.leadTime}
            startDate={task.startDate}
            dueDate={task.dueDate}
            cycleTime={task.cycleTime}
            phase={task.phase}
            members={task.members}
            requirements={task.requirements}
          />
        ))}
      </Stack>
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
