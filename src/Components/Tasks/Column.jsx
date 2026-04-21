import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { TaskCard } from './TaskCard'

export const Column = ({ tasks }) => {
  useEffect(() => {
    console.log(`Column rendered with tasks:`, tasks)
  }, [tasks])

  return (
    <div className="h-full bg-white border-none pr-[15px]">
      <div
        className="flex flex-col gap-2 overflow-auto px-1 max-h-[70vh] bg-white border-r border-r-red-700 border-dashed"
      >
        {tasks?.map((task) => (
          <TaskCard
            key={task._id}
            projectId={task.project}
            taskId={task._id}
            title={task.title}
            author={task.author}
            taskType={task.taskType}
            leadTime={task.leadTime}
            startDate={task.startDate}
            dueDate={task.dueDate}
            cycleTime={task.cycleTime}
            phase={task.phase}
            members={task.members}
            requirements={task.requirements}
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
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      leadTime: PropTypes.number.isRequired,
      cycleTime: PropTypes.number.isRequired,
      phase: PropTypes.string,
    })
  ).isRequired,
}