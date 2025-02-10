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
import { colors } from '../../Ui/colors'
import { StyledCard } from '../../Ui/StyledCard'
const COMMON_STYLES = {
  card: {
    borderWidth: '2.5px',
    borderColor: '#000',
    transition: 'background-color 0.2s',
    backgroundColor: colors.cardBackgroundColor,
  },
  cardHeader: {
    backgroundColor: 'transparent',
    borderBottom: '2.5px solid #557263',
    fontFamily: 'var(--font-family-mono)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: '0.9rem',
  },

  metricItem: {
    border: '2px solid #000', // #557263',
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
    //boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  icon: {
    width: '2rem',
    height: '2rem',
    marginBottom: '0.5rem',
  },
  title: {
    fontFamily: 'var(--font-family-mono)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: '0.7rem',

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
    fontFamily: 'var(--font-family-mono)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: '0.7rem',
  },
  wipButton: {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
  },
  announcement: {
    backgroundColor: '#fff',
    marginBottom: '1rem',
    overflowY: 'scroll',
    height: '8rem',
    fontFamily: 'var()',
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
    posts,
    isPostsLoading,
  } = useProject()
  const [token] = useAuth()
  const [hoverStates, setHoverStates] = useState({
    metrics: false,
  })

  const handleHover = (key, value) => {
    setHoverStates((prev) => ({ ...prev, [key]: value }))
  }

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

  // Find the latest public post by the project creator
  const latestPublicPost = posts
    ?.filter((post) => post?.author === currentProject?.createdBy)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.[0]

  return (
    <StyledCard
      hoverKey='metrics'
      hoverStates={hoverStates}
      handleHover={handleHover}
      style={{ height: '90vh' }}
    >
      <Card.Header style={COMMON_STYLES.cardHeader} className='w-100'>
        <Card.Title>Project Metrics</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row className='d-flex flex-wrap justify-content-center'>
          {METRICS_CONFIG.map((metric) => (
            <Col
              key={metric.id}
              md={4}
              sm={6}
              xs={6}
              className='mb-3 d-flex align-items-stretch'
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
                    <div style={COMMON_STYLES.value}>
                      {metric.getValue(currentProject, metrics)}
                    </div>
                  )}
                </div>
              </OverlayTrigger>
            </Col>
          ))}
        </Row>

        <Row>
          {!isPostsLoading && (
            <Card
              style={{ ...COMMON_STYLES.card, ...COMMON_STYLES.announcement }}
            >
              <strong style={{ fontFamily: ` var(--font-family-mono)` }}>
                Announcement:{' '}
              </strong>

              <strong>
                {latestPublicPost?.title || 'No public announcement yet!'}
              </strong>
              <small style={{ fontFamily: ` var(--font-family-mono)` }}>
                {latestPublicPost?.contents}
              </small>
              {latestPublicPost && (
                <small className='d-block text-muted'>
                  {new Date(latestPublicPost.createdAt).toLocaleDateString()}
                </small>
              )}
            </Card>
          )}
        </Row>
        <Row
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '0.8rem',
            marginTop: '1rem',
          }}
        >
          <small>Total tasks: {currentProject?.tasks?.length || 0}</small>
        </Row>
      </Card.Body>
    </StyledCard>
  )
}
