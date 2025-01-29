/* eslint-disable react/jsx-key */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { Card, Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect, memo } from 'react'
import { BoardSkeleton } from '../Ui/LoadingSkeletons/BoardSkeleton'
import { Column } from '../Components/Tasks/Column'
import Toolbar from '../Components/Projects/ProjectToolbar'
import { useProject } from '../contexts/ProjectContext'
import { Metrics } from '../Components/Projects/Metrics'
import Target from '../Components/Target/Target'
import { ANIMATION_STYLES } from '../Ui/LoadingSkeletons/animations'

// Memoized Kanban Column component
const KanbanColumn = memo(({ phase, tasks, styles }) => (
  <Col xs={12} md={3} style={styles.column}>
    <h5 className='px-3' style={styles.header}>
      {phase}
      <span className='float-end badge bg-black'>{tasks?.length || 0}</span>
    </h5>
    <Card.Body className='p-2'>
      <Column tasks={tasks || []} />
    </Card.Body>
  </Col>
))

// Styles object
const BOARD_STYLES = {
  column: {
    minHeight: '70vh',
    transition: 'all 0.3s ease',
    margin: 0,
    padding: '1px',
    borderStyle: 'dotted',
    borderColor: 'transparent',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    color: '#000',
    borderBottom: '2px solid #fff',
    padding: '0 2rem',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  container: {
    borderStyle: 'none',
  },
}

// Board phases configuration
const BOARD_PHASES = ['story', 'inProgress', 'reviewing', 'done']

// Helper function to calculate metrics
const calculateMetrics = (
  tasks,
  setCurrentAvgCycleTime,
  setCurrentAvgLeadTime,
) => {
  if (!tasks?.length) return

  const totalCycleTime = tasks.reduce(
    (acc, task) => acc + (task.cycleTime || 0),
    0,
  )
  const totalLeadTime = tasks.reduce(
    (acc, task) => acc + (task.leadTime || 0),
    0,
  )

  setCurrentAvgCycleTime(tasks.length > 0 ? totalCycleTime / tasks.length : 0)
  setCurrentAvgLeadTime(tasks.length > 0 ? totalLeadTime / tasks.length : 0)
}

// Helper function to organize tasks by phase
const getTasksByPhase = (tasks) => {
  return tasks?.reduce(
    (acc, task) => {
      if (!acc[task.phase]) {
        acc[task.phase] = []
      }
      acc[task.phase].push(task)
      return acc
    },
    BOARD_PHASES.reduce((acc, phase) => ({ ...acc, [phase]: [] }), {}),
  )
}

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

  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isFirstRender, setIsFirstRender] = useState(true)

  // Effects
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    calculateMetrics(
      currentTasks,
      setCurrentAvgCycleTime,
      setCurrentAvgLeadTime,
    )
  }, [currentTasks])

  useEffect(() => {
    if (currentProjectId && (!currentTasks.length || isInitialLoad)) {
      const timeoutId = setTimeout(() => {
        refreshTasks()
        setIsInitialLoad(false)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [currentProjectId, currentTasks, isInitialLoad])

  // Animation effect for first render
  useEffect(() => {
    if (isFirstRender) {
      const animationTimeout = setTimeout(() => {
        setIsFirstRender(false)
      }, 1000)

      return () => clearTimeout(animationTimeout)
    }
  }, [isFirstRender])

  // Loading states
  if (!currentProjectId || (isInitialLoad && isTasksLoading)) {
    return (
      <div style={{ opacity: '80%' }}>
        <BoardSkeleton phase='loading' />
      </div>
    )
  }

  if (isTasksLoading && !currentTasks?.length) {
    return <BoardSkeleton phase='empty' />
  }

  const tasksByPhase = getTasksByPhase(currentTasks)

  return (
    <Container
      fluid
      className='py-0'
      style={isFirstRender ? ANIMATION_STYLES.fadeIn : {}}
    >
      <Card className='sm' style={BOARD_STYLES.container}>
        <Card.Body>
          <Container fluid className='py-0 my-0'>
            <Row
              style={{
                borderBottomColor: '#a11',
                borderBottomStyle: 'dashed',
                paddingBottom: '10px',
              }}
            >
              <Toolbar project={currentProject} />
              <Col lg={4}>
                <Metrics />
              </Col>
              <Col lg={8}>
                <Target />
              </Col>
            </Row>
            <Row className='pt-3 g-2'>
              {BOARD_PHASES.map((phase) => (
                <KanbanColumn
                  key={phase}
                  phase={phase}
                  tasks={tasksByPhase[phase]}
                  styles={BOARD_STYLES.column}
                />
              ))}
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default memo(Board)
