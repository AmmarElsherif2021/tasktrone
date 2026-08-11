import { useState, useEffect, memo } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { BoardSkeleton } from '../Ui/LoadingSkeletons/BoardSkeleton'
import { TaskCard } from '../Components/Tasks/TaskCard'
import ProjectControllers from './ProjectControllers'
import { useProject } from '../contexts/ProjectContext'
import Target from '../Components/Target/Target'
import { ANIMATION_STYLES } from '../Ui/LoadingSkeletons/animations'
import { useProjectShell } from '../layouts/ProjectShell'

// Kanban columns directly map to task_status enum
const STATUS_TITLES = {
  todo:        'To Do',
  in_progress: 'In Progress',
  review:      'Review',
  done:        'Done',
}

const KanbanColumn = memo(({ status, tasks }) => (
  <div className="kanban-column min-h-[70vh] max-w-[50vw] transition-all duration-300 p-px bg-neutral-white">
    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-center px-3 py-2 border-b border-card-border/30">
      {STATUS_TITLES[status]}
    </h3>
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
))

const BOARD_STATUSES = ['todo', 'in_progress', 'review', 'done']

const getTasksByStatus = (tasks) =>
  tasks?.reduce(
    (acc, task) => {
      if (!acc[task.status]) acc[task.status] = []
      acc[task.status].push(task)
      return acc
    },
    BOARD_STATUSES.reduce((acc, s) => ({ ...acc, [s]: [] }), {})
  )

export function Board() {
  const {
    currentProjectId,
    currentProject,
    currentTasks,
    refreshTasks,
    isTasksLoading,
    isTasksError,
    tasksError,
    currentPhase,           // product‑line filter
  } = useProject()

  const { mainRef } = useProjectShell()

  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    mainRef?.scrollTo({ top: 0 })
  }, [mainRef])

  useEffect(() => {
    if (!currentProjectId) return
    const id = setTimeout(() => {
      refreshTasks()
      setIsInitialLoad(false)
    }, 500)
    return () => clearTimeout(id)
  }, [currentProjectId, refreshTasks])

  useEffect(() => {
    if (!isFirstRender) return
    const id = setTimeout(() => setIsFirstRender(false), 1000)
    return () => clearTimeout(id)
  }, [isFirstRender])

  if (!currentProjectId) {
    return (
      <div className="opacity-80">
        <BoardSkeleton phase="loading" />
      </div>
    )
  }

  if (isInitialLoad && isTasksLoading) {
    return <BoardSkeleton phase="empty" />
  }

  if (isTasksError) {
    return (
      <Alert variant="danger" className="m-3 d-flex align-items-center justify-content-between">
        <span>Couldn&apos;t load tasks{tasksError?.message ? `: ${tasksError.message}` : '.'}</span>
        <Button variant="outline-danger" size="sm" onClick={() => refreshTasks()}>
          Retry
        </Button>
      </Alert>
    )
  }

  // Filter tasks by selected manufacturing phase (product line)
  const phaseFilteredTasks = currentPhase
    ? currentTasks.filter(t => t.phase === currentPhase)
    : currentTasks

  const tasksByStatus = getTasksByStatus(phaseFilteredTasks)

  return (
    currentProject && currentProjectId && (
      <div className="py-0" style={isFirstRender ? ANIMATION_STYLES.fadeIn : {}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 border-b border-dashed border-sage">
          <div className="lg:col-span-1">
            <ProjectControllers />
          </div>
          <div className="lg:col-span-1">
            <Target />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 pt-3">
          {BOARD_STATUSES.map((status) => (
            <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
          ))}
        </div>
      </div>
    )
  )
}

export default memo(Board)