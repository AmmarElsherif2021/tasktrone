import { useQuery } from '@tanstack/react-query'
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap'

import { listTasks } from '../API/tasks'
import { Column } from '../Components/Tasks/Column'
import Toolbar from '../Components/Projects/ProjectToolbar'
import { useProject } from '../contexts/ProjectContext'
//import { ProjectInfo } from '../Components/Projects/ProjectInfo'

export function Board() {
  const { currentProjectId } = useProject()
  const projectId = currentProjectId ? currentProjectId : ''
  const tasksQuery = useQuery({
    queryKey: ['tasks', projectId, {}],
    queryFn: () => listTasks(projectId, {}),
    select: (data) =>
      data.map((task) => ({
        ...task,
        requirements: task.requirements || [],
        members: task.members || [],
        attachments: task.attachments || [],
      })),
    enabled: !!currentProjectId,
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
    { story: [], inProgress: [], reviewing: [], done: [] },
  )

  const columnStyles = {
    minHeight: '70vh',
    transition: 'all 0.3s ease',
  }

  const taskHeaderStyles = {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    padding: '10px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  }

  return (
    <Container fluid className='py-4'>
      {/* board nav Section */}
      <Toolbar />

      {/* Board Section */}
      <Card className='shadow-sm'>
        <Card.Body>
          {tasksQuery.isLoading ? (
            <div className='text-center py-5'>
              <Spinner animation='border' role='status' variant='primary'>
                <span className='visually-hidden'>Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Container fluid>
              <Row className='g-4'>
                {/* Story Column */}
                <Col xs={12} md={3}>
                  <Card className='h-100 bg-light' style={columnStyles}>
                    <Card.Header style={taskHeaderStyles}>
                      Story
                      <span className='float-end badge bg-primary'>
                        {tasksByPhase.story.length}
                      </span>
                    </Card.Header>
                    <Card.Body className='p-2'>
                      <Column columnTitle='story' tasks={tasksByPhase.story} />
                    </Card.Body>
                  </Card>
                </Col>

                {/* In Progress Column */}
                <Col xs={12} md={3}>
                  <Card className='h-100 bg-light' style={columnStyles}>
                    <Card.Header style={taskHeaderStyles}>
                      In Progress
                      <span className='float-end badge bg-warning'>
                        {tasksByPhase.inProgress.length}
                      </span>
                    </Card.Header>
                    <Card.Body className='p-2'>
                      <Column
                        columnTitle='In progress'
                        tasks={tasksByPhase.inProgress}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                {/* Reviewing Column */}
                <Col xs={12} md={3}>
                  <Card className='h-100 bg-light' style={columnStyles}>
                    <Card.Header style={taskHeaderStyles}>
                      Reviewing
                      <span className='float-end badge bg-info'>
                        {tasksByPhase.reviewing.length}
                      </span>
                    </Card.Header>
                    <Card.Body className='p-2'>
                      <Column
                        columnTitle='Reviewing'
                        tasks={tasksByPhase.reviewing}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                {/* Done Column */}
                <Col xs={12} md={3}>
                  <Card className='h-100 bg-light' style={columnStyles}>
                    <Card.Header style={taskHeaderStyles}>
                      Done
                      <span className='float-end badge bg-success'>
                        {tasksByPhase.done.length}
                      </span>
                    </Card.Header>
                    <Card.Body className='p-2'>
                      <Column columnTitle='Done' tasks={tasksByPhase.done} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}
