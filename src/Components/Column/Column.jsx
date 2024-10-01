import PropTypes from 'prop-types'
import { TaskCard } from '../TaskCard/TaskCard'
import { Fragment } from 'react'
export const Column = ({ columnTitle, tasks }) => {
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
              phase={task.phase}
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
      phase: PropTypes.string,
    }),
  ).isRequired,
}
