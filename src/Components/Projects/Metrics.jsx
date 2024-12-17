import { Card, Row, Col, Form, Button, InputGroup } from 'react-bootstrap'
import { useProject } from '../../contexts/ProjectContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '../../API/projects'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import refreshIcon from '../../assets/refresh-icon.svg'
export function Metrics() {
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

  // useEffect(() => {
  //   if (currentProject?.tasks?.length) {
  //     const totalCycleTime = currentProject.tasks.reduce(
  //       (acc, task) => acc + (task.cycleTime || 0),
  //       0,
  //     )
  //     const totalLeadTime = currentProject.tasks.reduce(
  //       (acc, task) => acc + (task.leadTime || 0),
  //       0,
  //     )
  //     setcurrentAvgCycleTime(totalCycleTime / currentProject.tasks.length)
  //     setcurrentAvgLeadTime(totalLeadTime / currentProject.tasks.length)
  //   }
  // }, [currentProjectId, currentProject])

  const handleWipChange = (e) => {
    setWipLimit(e.target.value)
  }

  const handleWipSubmit = () => {
    if (currentProjectId && token) {
      wipMutation.mutate({ token, projectId: currentProjectId, wip: wipLimit })
    }
  }

  const metricCardStyle = {
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    margin: '10px 0',
  }

  const metricValueStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#f11c1f',
  }

  return (
    <Card className='shadow-sm'>
      <Card.Body>
        <Row>
          <Col md={3} style={metricCardStyle}>
            <h6 className='text-muted mb-3'>Total Tasks</h6>
            <p style={metricValueStyle}>{currentProject?.tasks?.length || 0}</p>
          </Col>

          <Col md={2} style={metricCardStyle}>
            <h6 className='text-muted mb-3'>WIP Limit</h6>
            <InputGroup>
              <Form.Control
                type='number'
                value={wipLimit}
                onChange={handleWipChange}
                min={0}
              />
              <Button
                variant='none'
                onClick={handleWipSubmit}
                disabled={!currentProjectId}
              >
                <img alt='wip' src={refreshIcon} style={{ width: '2rem' }} />
              </Button>
            </InputGroup>
          </Col>

          <Col md={3} style={metricCardStyle}>
            <h6 className='text-muted mb-3'>Avg Cycle Time</h6>
            <p style={metricValueStyle}>
              {!isNaN(currentAvgCycleTime)
                ? currentAvgCycleTime.toFixed(2)
                : '0'}{' '}
              days
            </p>
          </Col>

          <Col md={3} style={metricCardStyle}>
            <h6 className='text-muted mb-3'>Avg Lead Time</h6>
            <p style={metricValueStyle}>
              {!isNaN(currentAvgLeadTime) ? currentAvgLeadTime.toFixed(2) : '0'}{' '}
              days
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
