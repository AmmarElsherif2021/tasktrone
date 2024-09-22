import { Fragment } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreateTask } from '../Components/CreateTask/CreateTask'
import { TaskCard } from '../Components/TaskCard/TaskCard'
import { listTasks } from '../API/tasks'
import PropTypes from 'prop-types'

const Column = ({ columnTitle, tasks }) => {
  return (
    <div
      style={{
        alignItems: 'center',
        width: '25vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2>{columnTitle}</h2>
      <div
        style={{
          background: 'wheat',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {tasks.map((task) => (
          <Fragment key={task._id}>
            <TaskCard
              key={task._id}
              taskId={task._id}
              title={task.title}
              author={task.author}
              leadTime={task.leadTime}
              cycleTime={task.cycleTime}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}

Column.propTypes = {
  columnTitle: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired, // Corrected to PropTypes.string
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      leadTime: PropTypes.number.isRequired,
      cycleTime: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

export function Board() {
  const tasksQuery = useQuery({
    queryKey: ['tasks', {}],
    queryFn: () => listTasks({}),
  })

  const tasks = tasksQuery.data ?? []

  const tasksByPhase = tasks.reduce(
    (acc, task) => {
      if (!acc[task.phase]) {
        acc[task.phase] = []
      }
      acc[task.phase].push(task)
      return acc
    },
    { story: [], 'In progress': [], Done: [] },
  )

  return (
    <div style={{ background: 'wheat', display: 'flex', flexDirection: 'row' }}>
      <CreateTask />
      <Column columnTitle='story' tasks={tasksByPhase.story} />
      <Column columnTitle='In progress' tasks={tasksByPhase.inProgress} />
      <Column columnTitle='Done' tasks={tasksByPhase.Done} />
    </div>
  )
}
