import { useQuery } from '@tanstack/react-query'
import { CreateTask } from '../Components/CreateTask/CreateTask'
import { listTasks } from '../API/tasks'
import { Column } from '../Components/Column/Column'

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
    { story: [], inProgress: [], done: [] },
  )

  return (
    <div style={{ background: 'wheat', display: 'flex', flexDirection: 'row' }}>
      <CreateTask />
      <Column columnTitle='story' tasks={tasksByPhase.story} />
      <Column columnTitle='In progress' tasks={tasksByPhase.inProgress} />
      <Column columnTitle='Done' tasks={tasksByPhase.done} />
    </div>
  )
}
