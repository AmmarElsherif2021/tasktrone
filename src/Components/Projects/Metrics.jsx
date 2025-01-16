/* eslint-disable react/prop-types */

import {
  Container,
  Card,
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
//import tasksIcon from '../../assets/tasks.svg'
import inProgressIcon from '../../assets/inProgress.svg'
import cycleTimeIcon from '../../assets/cycleTime.svg'
import leadTimeIcon from '../../assets/leadTime.svg'
import doneIcon from '../../assets/done.svg'
import flowIcon from '../../assets/flow.svg'
import updateIcon from '../../assets/update.svg'
import wipIcon from '../../assets/wip.svg'
const COMMON_STYLES = {
  nav: {
    borderBottomStyle: 'dashed',
    borderBottomColor: '#EC4F50',
    borderWidth: '2px',
    //paddingBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#adf222',
    padding: 0,
  },
  card: {
    borderWidth: '2px',
    borderColor: '#000', //#729B87',
    backgroundColor: '#101010', //'#E1F9ED',
    width: '5rem',
    height: '11rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    margin: '5px',
  },
  iconContainer: {
    width: '3rem',
    height: '3rem',
    borderColor: '#000',
    borderWidth: '2px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '2rem',
    height: '2rem',
  },
  title: {
    fontSize: '0.5em',
    width: '3rem',
    minHeight: '1rem',
  },
  wipInput: {
    borderWidth: '1.5px',
    borderColor: '#000',
    width: '2.5rem',
    height: '2rem',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 0,
    marginRight: '1px',
  },
  wipBtn: {
    backgroundColor: 'transparent',
    borderRadius: '0.5rem',
    //borderColor: '#000',
    borderWidth: '2px',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const WipControl = ({ value, onChange, onSubmit }) => (
  <div
    className='d-flex flex-row align-items-center pt-2'
    style={{ height: '2.5rem', width: '4.5rem' }}
  >
    <Form.Control
      type='number'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={0}
      style={COMMON_STYLES.wipInput}
      className='mb-2'
    />
    <button
      onClick={onSubmit}
      className='btn pb-3'
      style={COMMON_STYLES.wipBtn}
    >
      <img
        src={updateIcon}
        alt='Update WIP'
        style={{ width: '1rem', height: '1rem' }}
      />
    </button>
  </div>
)

const METRICS_CONFIG = [
  {
    id: 'wipLimit',
    title: 'WIP Limit',
    getValue: (project) => project?.wip || 0,
    icon: wipIcon,
    tooltip: 'Set Work in Progress Limit',
    color: '#DE2C2D',
    backgroundColor: '#F83C3D',
    customContent: WipControl,
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    getValue: (project) =>
      project?.tasks?.filter((t) => t.status === 'inProgress')?.length || 0,
    icon: inProgressIcon,
    tooltip: 'Current tasks in progress',
    color: '#49DB78',
    backgroundColor: '#49DB78',
  },
  {
    id: 'cycleTime',
    title: 'Cycle Time',
    getValue: (_, metrics) =>
      !isNaN(metrics.currentAvgCycleTime)
        ? `${metrics.currentAvgCycleTime.toFixed(1)}d`
        : '0d',
    icon: cycleTimeIcon,
    tooltip: "Average time from 'In Progress' to 'Done'",
    color: '#04EBBD',
    backgroundColor: '#04EBBD',
  },
  {
    id: 'leadTime',
    title: 'Lead Time',
    getValue: (_, metrics) =>
      !isNaN(metrics.currentAvgLeadTime)
        ? `${metrics.currentAvgLeadTime.toFixed(1)}d`
        : '0d',
    icon: leadTimeIcon,
    tooltip: 'Average time from task creation to completion',
    color: '#FE9900',
    backgroundColor: '#FE9900',
  },
  {
    id: 'throughput',
    title: 'Throughput',
    getValue: (project) => {
      const completedTasks =
        project?.tasks?.filter((t) => t.status === 'completed')?.length || 0
      return (completedTasks / 30).toFixed(1)
    },
    icon: doneIcon,
    tooltip: 'Average number of tasks completed per day',
    color: '#49DB78',
    backgroundColor: '#49DB78',
  },
  {
    id: 'flowEfficiency',
    title: 'Flow Efficiency',
    getValue: (_, metrics) => {
      const efficiency =
        ((metrics.currentAvgCycleTime || 0) /
          (metrics.currentAvgLeadTime || 1)) *
        100
      return `${efficiency.toFixed(0)}%`
    },
    icon: flowIcon,
    tooltip: 'Ratio of active work time to total lead time',
    color: '#DE2C2D',
    backgroundColor: '#F83C3D',
  },
]

const MetricsCard = ({
  title,
  value,
  src,
  color,
  backgroundColor,
  tooltip,
  CustomContent,
  customProps,
}) => (
  <OverlayTrigger placement='top' overlay={<Tooltip>{tooltip}</Tooltip>}>
    <Card className='text-center p-1 mb-4 mx-4' style={COMMON_STYLES.card}>
      <Card.Body>
        <div
          className='d-flex justify-content-center align-items-center mb-1'
          style={{ ...COMMON_STYLES.iconContainer, backgroundColor }}
        >
          <img src={src} alt={title} style={COMMON_STYLES.icon} />
        </div>
        <Card.Title className='mb-1'>
          <h5 style={{ color, ...COMMON_STYLES.title }}>{title}</h5>
        </Card.Title>
        {CustomContent ? (
          <CustomContent {...customProps} />
        ) : (
          <Card.Text
            style={{
              color: color !== '#000' ? color : '#aaa',
              backgroundColor: '#000',
              borderRadius: '0.6rem',
            }}
            className='h3 mb-1'
          >
            {value}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  </OverlayTrigger>
)

export const Metrics = () => {
  const queryClient = useQueryClient()
  const [wipLimit, setWipLimit] = useState(0)
  const {
    currentAvgCycleTime,
    currentAvgLeadTime,
    currentProjectId,
    currentProject,
  } = useProject()
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

  const handleWipSubmit = () => {
    if (currentProjectId && token) {
      wipMutation.mutate({ token, projectId: currentProjectId, wip: wipLimit })
    }
  }

  const metrics = { currentAvgCycleTime, currentAvgLeadTime }

  return (
    <Container className='w-100' style={COMMON_STYLES.nav}>
      <Row className='mb-4'>
        <Col>
          <h4 className='font-weight-bold'>Project Metrics</h4>

          <Row>
            {' '}
            <Col>
              <strong>
                <strong>Total tasks: </strong>
                {currentProject?.tasks?.length || 0}
              </strong>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className='w-100'>
        {METRICS_CONFIG.map((metric) => (
          <Col key={metric.id} md={3} lg={2} sm={4} xs={6}>
            <MetricsCard
              title={metric.title}
              value={metric.getValue(currentProject, metrics)}
              tooltip={metric.tooltip}
              src={metric.icon}
              color={metric.color}
              backgroundColor={metric.backgroundColor}
              CustomContent={metric.customContent}
              customProps={
                metric.id === 'wipLimit'
                  ? {
                      value: wipLimit,
                      onChange: setWipLimit,
                      onSubmit: handleWipSubmit,
                    }
                  : undefined
              }
            />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Metrics
