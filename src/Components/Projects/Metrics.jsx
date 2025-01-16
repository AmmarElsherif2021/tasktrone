/* eslint-disable react/prop-types */

import { Card, Form, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap'
import { useProject } from '../../contexts/ProjectContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '../../API/projects'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import inProgressIcon from '../../assets/inProgress.svg'
import cycleTimeIcon from '../../assets/cycleTime.svg'
import leadTimeIcon from '../../assets/leadTime.svg'
import doneIcon from '../../assets/done.svg'
import flowIcon from '../../assets/flow.svg'
import updateIcon from '../../assets/update.svg'
import wipIcon from '../../assets/wip.svg'

const COMMON_STYLES = {
  nav: {
    borderColor: '#000',
    borderWidth: '2px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '80vh',
  },
  metricItem: {
    border: '2px solid #000',
    borderRadius: '8px',
    padding: '0.5rem',
    textAlign: 'center',
    //backgroundColor: '#fff',
    fontColor: '#000',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    margin: '0.25rem',
    height: '100%',
    minWidth: '6rem',
  },
  metricItemHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    width: '2rem',
    height: '2rem',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '0.25rem',
  },
  value: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#000',
  },
  wipControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    marginTop: '0.5rem',
  },
  wipInput: {
    width: '3rem',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '0.25rem',
  },
  wipButton: {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
  },
}

const WipControl = ({ value, onChange, onSubmit }) => (
  <div style={COMMON_STYLES.wipControl}>
    <Form.Control
      type='number'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={0}
      style={COMMON_STYLES.wipInput}
    />
    <button onClick={onSubmit} style={COMMON_STYLES.wipButton}>
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
    color: '#ee6352', // Pale Red
    customContent: WipControl,
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
    color: '#f7b801',
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    getValue: (project) =>
      project?.tasks?.filter((t) => t.status === 'inProgress')?.length || 0,
    icon: inProgressIcon,
    tooltip: 'Current tasks in progress',
    color: '#12EAA3',
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
    color: '#3fa7d6',
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
    color: '#12EAA3',
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
    color: '#f35b04',
  },
]

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
    <Card style={COMMON_STYLES.nav}>
      <Card.Header className='custom-modal w-100'>
        <Card.Title>Project Metrics</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row className='d-flex flex-wrap justify-content-center'>
          {METRICS_CONFIG.map((metric) => (
            <Col
              key={metric.id}
              md={4} // 3 columns on medium screens
              sm={6} // 2 columns on small screens
              xs={6} // 2 columns on extra small screens
              className='mb-3 d-flex align-items-stretch' // Ensure all items stretch to the same height
            >
              <OverlayTrigger
                placement='top'
                overlay={<Tooltip>{metric.tooltip}</Tooltip>}
              >
                <div
                  style={{
                    ...COMMON_STYLES.metricItem,
                    backgroundColor: metric.color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      COMMON_STYLES.metricItemHover.transform
                    e.currentTarget.style.boxShadow =
                      COMMON_STYLES.metricItemHover.boxShadow
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <img
                    src={metric.icon}
                    alt={metric.title}
                    style={COMMON_STYLES.icon}
                  />
                  <div style={COMMON_STYLES.title}>{metric.title}</div>
                  {metric.customContent ? (
                    <metric.customContent
                      value={wipLimit}
                      onChange={setWipLimit}
                      onSubmit={handleWipSubmit}
                    />
                  ) : (
                    <div
                      style={{
                        ...COMMON_STYLES.value,
                      }}
                    >
                      {metric.getValue(currentProject, metrics)}
                    </div>
                  )}
                </div>
              </OverlayTrigger>
            </Col>
          ))}
        </Row>
      </Card.Body>
      <Card.Footer className='custom-modal w-100'>
        <p>
          <strong>Total tasks: </strong>
          {currentProject?.tasks?.length || 0}
        </p>
      </Card.Footer>
    </Card>
  )
}

export default Metrics
