/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { useState, useEffect, memo } from 'react'
import { BoardSkeleton } from '../Ui/LoadingSkeletons/BoardSkeleton'
import { TaskCard } from '../Components/Tasks/TaskCard'
import ProjectControllers from './ProjectControllers'
import { useProject } from '../contexts/ProjectContext'

import Target from '../Components/Target/Target'
import { ANIMATION_STYLES } from '../Ui/LoadingSkeletons/animations'
import { useProjectShell } from '../layouts/ProjectShell'

// ── Phase display labels ──────────────────────────────────────
const PHASE_TITLES = {
  story:      'Story',
  inProgress: 'In Progress',
  reviewing:  'Review',
  done:       'Done',
}

// ── Kanban column ─────────────────────────────────────────────
const KanbanColumn = memo(({ phase, tasks }) => (
  <div
    className="
      kanban-column
      min-h-[70vh]
      max-w-[50vw]
      transition-all duration-300
      p-px
      bg-neutral-white
    "
  >
    <h3
      className="
        text-sm font-bold font-mono uppercase tracking-wider
        text-center px-3 py-2
        border-b border-card-border/30
      "
    >
      {PHASE_TITLES[phase]}
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

// ── Board phases ──────────────────────────────────────────────
const BOARD_PHASES = ['story', 'inProgress', 'reviewing', 'done']

// ── Helpers ───────────────────────────────────────────────────
const calculateMetrics = (tasks, setAvgCycle, setAvgLead) => {
  if (!tasks?.length) return
  const totalCycle = tasks.reduce((acc, t) => acc + (t.cycleTime || 0), 0)
  const totalLead  = tasks.reduce((acc, t) => acc + (t.leadTime  || 0), 0)
  setAvgCycle(totalCycle / tasks.length)
  setAvgLead(totalLead  / tasks.length)
}

const getTasksByPhase = (tasks) =>
  tasks?.reduce(
    (acc, task) => {
      if (!acc[task.phase]) acc[task.phase] = []
      acc[task.phase].push(task)
      return acc
    },
    BOARD_PHASES.reduce((acc, phase) => ({ ...acc, [phase]: [] }), {})
  )

// ── Main component ────────────────────────────────────────────
export function Board() {
  const {
    currentProjectId,
    currentProject,
    setCurrentAvgCycleTime,
    setCurrentAvgLeadTime,
    currentTasks,
    refreshTasks,
    isTasksLoading,
  } = useProject()

  // mainRef comes from ProjectShell via Outlet context.
  // Use it to scroll the main pane (not the locked document).
  const { mainRef } = useProjectShell()

  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isFirstRender, setIsFirstRender] = useState(true)

  // Scroll the main pane to top when Board mounts
  useEffect(() => {
    mainRef?.scrollTo({ top: 0 })
  }, [mainRef])

  useEffect(() => {
    calculateMetrics(currentTasks, setCurrentAvgCycleTime, setCurrentAvgLeadTime)
  }, [currentTasks, setCurrentAvgCycleTime, setCurrentAvgLeadTime])

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

  const tasksByPhase = getTasksByPhase(currentTasks)

  return (
    currentProject && currentProjectId && (
      <div
        className="py-0"
        style={isFirstRender ? ANIMATION_STYLES.fadeIn : {}}
      >
        {/*
         * Toolbar / Metrics / Target row
         * border-[#a11] was a typo — replaced with border-sage
         */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 border-b border-dashed border-sage ">
          <div className="lg:col-span-1">
            <ProjectControllers />
          </div>
          <div className="lg:col-span-1">
            <Target />
          </div>
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 pt-3">
          {BOARD_PHASES.map((phase) => (
            <KanbanColumn key={phase} phase={phase} tasks={tasksByPhase[phase]} />
          ))}
        </div>
      </div>
    )
  )
}

export default memo(Board)