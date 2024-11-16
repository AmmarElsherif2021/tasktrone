import { useQuery } from '@tanstack/react-query'
import { Card, Container, Row, Col } from 'react-bootstrap'
import { CreateTask } from '../Components/Tasks/CreateTask'
import { listTasks } from '../API/tasks'
import { Column } from '../Components/Tasks/Column'

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
    <>
      <CreateTask />

      <Card className='h-100 shadow-sm'>
        <Card.Body>
          <Container fluid>
            <Row className='g-3'>
              <Col xs={12} md={4}>
                <Card className='h-100 bg-light'>
                  <Card.Body className='p-2'>
                    <Column columnTitle='story' tasks={tasksByPhase.story} />
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={4}>
                <Card className='h-100 bg-light'>
                  <Card.Body className='p-2'>
                    <Column
                      columnTitle='In progress'
                      tasks={tasksByPhase.inProgress}
                    />
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={4}>
                <Card className='h-100 bg-light'>
                  <Card.Body className='p-2'>
                    <Column columnTitle='Done' tasks={tasksByPhase.done} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </>
  )
}
