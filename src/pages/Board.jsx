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
        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            title={task.title}
            author={task.author}
            leadTime={task.leadTime}
            cycleTime={task.cycleTime}
          />
        ))}
      </div>
    </div>
  )
}

Column.propTypes = {
  columnTitle: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      author: PropTypes.string,
      leadTime: PropTypes.number,
      cycleTime: PropTypes.number,
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
      acc[task.phase].push(task)
      return acc
    },
    { story: [], 'In progress': [], Done: [] },
  )

  return (
    <div style={{ background: 'wheat', display: 'flex', flexDirection: 'row' }}>
      <CreateTask />
      <Column columnTitle='story' tasks={tasksByPhase.story} />
      <Column columnTitle='In progress' tasks={tasksByPhase['In progress']} />
      <Column columnTitle='Done' tasks={tasksByPhase.Done} />
    </div>
  )
}
