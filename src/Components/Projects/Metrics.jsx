/* eslint-disable react/prop-types */
//import React from 'react';
import {
  Container,
  Card,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from 'react-bootstrap'
import { RefreshCw, AlertCircle, Clock, ListTodo, Activity } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '../../API/projects'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const MetricsCard = ({ title, value, icon: Icon, tooltip }) => (
  <OverlayTrigger placement='top' overlay={<Tooltip>{tooltip}</Tooltip>}>
    <Card className='bg-white text-center p-3 mb-4'>
      <Card.Body>
        <div
          className='d-flex justify-content-center align-items-center mb-2'
          style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '50%',
            backgroundColor: '#e6f7ff',
            borderWidth: '2px',
            borderColor: '#186545',
          }}
        >
          <Icon style={{ width: '24px', height: '24px', color: '#186545' }} />
        </div>
        <Card.Title className='mb-1'>
          <strong style={{ fontSize: '0.6em' }}>{title}</strong>
        </Card.Title>
        <Card.Text className='h2'>{value}</Card.Text>
      </Card.Body>
    </Card>
  </OverlayTrigger>
)

const Metrics = () => {
  const queryClient = useQueryClient()
  const [wipLimit, setWipLimit] = useState(0)
  const { currentAvgCycleTime, currentAvgLeadTime } = useProject()

  const { currentProjectId, currentProject } = useProject()
  const [token] = useAuth()

  const wipMutation = useMutation({
    mutationFn: ({ token, projectId, wip }) =>
      updateProject(projectId, token, { wip }),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', currentProjectId])
    },
  })

  useEffect(() => {
    if (currentProject?.wip) {
      setWipLimit(currentProject.wip)
    }
  }, [currentProjectId, currentProject])

  const onWipChange = (e) => {
    setWipLimit(e.target.value)
  }

  const onWipSubmit = () => {
    if (currentProjectId && token) {
      wipMutation.mutate({ token, projectId: currentProjectId, wip: wipLimit })
    }
  }
  //Define params
  const tasksInProgress =
    currentProject?.tasks?.filter((t) => t.status === 'inProgress')?.length || 0
  const completedTasks =
    currentProject?.tasks?.filter((t) => t.status === 'completed')?.length || 0
  const throughput = completedTasks / 30 // Tasks completed per day over last 30 days
  const flowEfficiency =
    ((currentAvgCycleTime || 0) / (currentAvgLeadTime || 1)) * 100

  return (
    <Container>
      <Row className='justify-content-between align-items-center mb-4'>
        <Col>
          <h2 className='font-weight-bold'>Project Metrics</h2>
        </Col>
        <Col className='d-flex justify-content-end align-items-center'>
          <Form.Control
            type='number'
            value={wipLimit}
            onChange={(e) => onWipChange(e.target.value)}
            className='w-25 mr-2'
            min={0}
          />
          <Button onClick={onWipSubmit} variant='outline-primary' size='sm'>
            <RefreshCw className='mr-2' />
            Update WIP
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Total Tasks'
            value={currentProject?.tasks?.length || 0}
            icon={ListTodo}
            tooltip='Total number of tasks in the project'
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='In Progress'
            value={tasksInProgress}
            icon={Activity}
            tooltip={`Tasks in progress (WIP Limit: ${wipLimit})`}
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Cycle Time'
            value={`${
              !isNaN(currentAvgCycleTime) ? currentAvgCycleTime.toFixed(1) : '0'
            }d`}
            icon={Clock}
            tooltip="Average time from 'In Progress' to 'Done'"
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Lead Time'
            value={`${
              !isNaN(currentAvgLeadTime) ? currentAvgLeadTime.toFixed(1) : '0'
            }d`}
            icon={Clock}
            tooltip='Average time from task creation to completion'
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Throughput'
            value={throughput.toFixed(1)}
            icon={Activity}
            tooltip='Average number of tasks completed per day'
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Flow Efficiency'
            value={`${flowEfficiency.toFixed(0)}%`}
            icon={AlertCircle}
            tooltip='Ratio of active work time to total lead time'
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Metrics
