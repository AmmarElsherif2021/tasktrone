import { Card, Container, Row, Col, Spinner } from 'react-bootstrap'
import { useState, useEffect } from 'react'

import { Column } from '../Components/Tasks/Column'
import Toolbar from '../Components/Projects/ProjectToolbar'
import { useProject } from '../contexts/ProjectContext'
import { Metrics } from '../Components/Projects/Metrics'

// Skeleton Loading Component
const BoardSkeleton = () => (
  <Container fluid className='py-4'>
    <Toolbar />
    <Metrics />
    <Card className='shadow-sm'>
      <Card.Body>
        <div className='text-center py-5'>
          <Spinner animation='border' role='status' variant='primary'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
          <p className='mt-3'>Loading project board...</p>
        </div>
      </Card.Body>
    </Card>
  </Container>
)

export function Board() {
  const {
    currentProjectId,
    setCurrentAvgCycleTime,
    setCurrentAvgLeadTime,
    currentTasks,
    refreshTasks,
    isTasksLoading,
    //setIsTasksLoading,
  } = useProject()

  // State to track initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Update metrics when tasks change
  useEffect(() => {
    if (currentTasks?.length) {
      const totalCycleTime = currentTasks.reduce(
        (acc, task) => acc + (task.cycleTime || 0),
        0,
      )
      const totalLeadTime = currentTasks.reduce(
        (acc, task) => acc + (task.leadTime || 0),
        0,
      )

      setCurrentAvgCycleTime(
        currentTasks.length > 0 ? totalCycleTime / currentTasks.length : 0,
      )
      setCurrentAvgLeadTime(
        currentTasks.length > 0 ? totalLeadTime / currentTasks.length : 0,
      )
    }
  }, [currentTasks])

  // Initial tasks refresh
  useEffect(() => {
    if (currentProjectId && (!currentTasks.length || isInitialLoad)) {
      const timeoutId = setTimeout(() => {
        refreshTasks()
        setIsInitialLoad(false)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [currentProjectId, currentTasks, isInitialLoad])

  // Organize tasks by phase
  const currentTasksByPhase = currentTasks?.reduce(
    (acc, task) => {
      if (!acc[task.phase]) {
        acc[task.phase] = []
      }
      acc[task.phase].push(task)
      return acc
    },
    { story: [], inProgress: [], reviewing: [], done: [] },
  )

  const columnStyles = {
    minHeight: '70vh',
    transition: 'all 0.3s ease',
    marginRight: 0,
    marginLeft: 0,
    paddingRight: '1px',
    paddingLeft: '1px',
    backgroundColor: '#fff',
    border: 'none',
  }

  const colHeaderStyles = {
    backgroundColor: '#fff',
    color: '#000',
    borderBottom: '2px solid #fff',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  }
  //Kanban column
  // eslint-disable-next-line react/prop-types
  const KanbanColumn = ({ phase }) => (
    <Col xs={12} md={3} style={columnStyles}>
      <Card className='h-100 ' style={columnStyles}>
        <Card.Header style={colHeaderStyles}>
          {phase}
          <span className='float-end badge bg-black'>
            {currentTasksByPhase[phase]?.length || 0}
          </span>
        </Card.Header>
        <Card.Body className='p-2'>
          <Column tasks={currentTasksByPhase[phase] || []} />
        </Card.Body>
      </Card>
    </Col>
  )
  // If no project ID or initial loading, show skeleton
  if (!currentProjectId && !currentTasks?.length) {
    return <BoardSkeleton />
  }

  return (
    <Container fluid className='py-0'>
      <Card className='sm' style={{ borderStyle: 'none' }}>
        <Card.Body>
          {isTasksLoading && !currentTasks?.length ? (
            <BoardSkeleton />
          ) : (
            <Container fluid className='py-0 my-0'>
              <Row>
                <Toolbar />
                <Metrics />
              </Row>
              <Row className='g-2'>
                {/* Story Column */}
                <KanbanColumn phase='story' />
                {/* In Progress Column */}
                <KanbanColumn phase='inProgress' />

                {/* Reviewing Column */}
                <KanbanColumn phase='reviewing' />

                {/* Done Column */}
                <KanbanColumn phase='done' />
              </Row>
            </Container>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}
