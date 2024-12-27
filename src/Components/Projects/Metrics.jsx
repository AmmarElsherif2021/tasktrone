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

import { useProject } from '../../contexts/ProjectContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '../../API/projects'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import tasksIcon from '../../assets/tasks.svg'
import inProgressIcon from '../../assets/inProgress.svg'
import cycleTimeIcon from '../../assets/cycleTime.svg'
import leadTimeIcon from '../../assets/leadTime.svg'
import doneIcon from '../../assets/done.svg'
import flowIcon from '../../assets/flow.svg'
import refreshIcon from '../../assets/refresh-icon.svg'
const MetricsCard = ({
  title,
  value,
  src,
  color,
  backgroundColor,
  tooltip,
}) => (
  <OverlayTrigger placement='top' overlay={<Tooltip>{tooltip}</Tooltip>}>
    <Card
      className='bg-white text-center p-2 mb-4'
      style={{ borderWidth: '2px', borderColor: color, width: '8rem' }}
    >
      <Card.Body>
        <div
          className='d-flex justify-content-center align-items-center mb-1'
          style={{
            width: '5rem',
            height: '5rem',
            borderColor: color,
            borderWidth: '2px',
            borderRadius: '50%',
            backgroundColor: backgroundColor,
          }}
        >
          <img
            src={src}
            alt={value}
            style={{ width: '24px', height: '24px' }}
          />
        </div>
        <Card.Title className='mb-1'>
          <strong style={{ color: color, fontSize: '0.5em' }}>{title}</strong>
        </Card.Title>
        <Card.Text className='h2'>{value}</Card.Text>
      </Card.Body>
    </Card>
  </OverlayTrigger>
)

export const Metrics = () => {
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
          <Button onClick={onWipSubmit} className='btn-primary' size='sm'>
            <image src={refreshIcon} />
            Update WIP
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Total Tasks'
            value={currentProject?.tasks?.length || 0}
            src={tasksIcon}
            tooltip='Total number of tasks in the project'
            color={'#000'}
            backgroundColor={'#dddddd'}
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='In Progress'
            value={tasksInProgress}
            tooltip={`Tasks in progress (WIP Limit: ${wipLimit})`}
            src={inProgressIcon}
            color={'#186545'}
            backgroundColor={'#e6f7ff'}
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Cycle Time'
            value={`${
              !isNaN(currentAvgCycleTime) ? currentAvgCycleTime.toFixed(1) : '0'
            }d`}
            tooltip="Average time from 'In Progress' to 'Done'"
            src={cycleTimeIcon}
            color={'#60B8BB'}
            backgroundColor={'#BCF5F7'}
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Lead Time'
            value={`${
              !isNaN(currentAvgLeadTime) ? currentAvgLeadTime.toFixed(1) : '0'
            }d`}
            tooltip='Average time from task creation to completion'
            src={leadTimeIcon}
            color={'#FE9900'}
            backgroundColor={'#FFEEAA'}
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Throughput'
            value={throughput.toFixed(1)}
            tooltip='Average number of tasks completed per day'
            src={doneIcon}
            color={'#186545'}
            backgroundColor={'#e6f7ff'}
          />
        </Col>
        <Col md={4} lg={2}>
          <MetricsCard
            title='Flow Efficiency'
            value={`${flowEfficiency.toFixed(0)}%`}
            tooltip='Ratio of active work time to total lead time'
            src={flowIcon}
            color={'#CA5051'}
            backgroundColor={'#FFC5C6'}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Metrics
