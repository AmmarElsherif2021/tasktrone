import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Form, Button, Card, Alert, ListGroup, Collapse } from 'react-bootstrap'
import { createTask } from '../../API/tasks'
import { useAuth } from '../../contexts/AuthContext'

export function CreateTask() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [newReq, setNewReq] = useState('')
  const [requirements, setRequirements] = useState([])
  const [leadTime, setLeadTime] = useState('')
  const [attachments, setAttachments] = useState([])
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const createTaskMutation = useMutation({
    mutationFn: () => createTask(token, { title, requirements, leadTime }),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  })

  const handleAddReq = async () => {
    if (newReq.trim()) {
      setRequirements((prev) => [...prev, newReq.trim()])
      setNewReq('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createTaskMutation.mutate()
  }

  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      setAttachments([])
      setRequirements([])
      setLeadTime('')
      setTitle('')
      setOpen(false) // Close the form after successful creation
    }
  }, [createTaskMutation.isSuccess])

  if (!token) {
    return <Alert variant='warning'>Please log in to create new tasks.</Alert>
  }

  return (
    <div className='mb-4'>
      <Button
        variant='primary'
        onClick={() => setOpen(!open)}
        aria-controls='create-task-collapse'
        aria-expanded={open}
        className='mb-4'
      >
        {open ? 'Hide Create Task' : 'Create New Task'}
      </Button>

      <Collapse in={open}>
        <div id='create-task-collapse'>
          <Card className='mb-4'>
            <Card.Body>
              <Card className='mb-3 p-2'>
                <Card.Header>
                  <h5 className='mb-0'>Create New Task</h5>
                </Card.Header>
                <Card.Body className='p-2'>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-2'>
                      <Form.Label className='mb-1'>Title</Form.Label>
                      <Form.Control
                        size='sm'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Enter task title'
                      />
                    </Form.Group>

                    <Form.Group className='mb-2'>
                      <Form.Label className='mb-1'>Requirements</Form.Label>
                      <div className='d-flex gap-2 mb-1'>
                        <Form.Control
                          size='sm'
                          type='text'
                          value={newReq}
                          onChange={(e) => setNewReq(e.target.value)}
                          placeholder='Add a requirement'
                        />
                        <Button
                          size='sm'
                          variant='outline-primary'
                          onClick={handleAddReq}
                        >
                          Add
                        </Button>
                      </div>
                      {requirements.length > 0 && (
                        <ListGroup className='mb-2'>
                          {requirements.map((req, index) => (
                            <ListGroup.Item
                              key={index}
                              className='d-flex justify-content-between align-items-center p-1'
                            >
                              {req}
                              <Button
                                size='sm'
                                variant='outline-danger'
                                onClick={() =>
                                  setRequirements((prev) =>
                                    prev.filter((_, i) => i !== index),
                                  )
                                }
                              >
                                Remove
                              </Button>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Form.Group>

                    <Form.Group className='mb-2'>
                      <Form.Label className='mb-1'>Lead Time (days)</Form.Label>
                      <Form.Control
                        size='sm'
                        type='number'
                        value={leadTime}
                        onChange={(e) => setLeadTime(e.target.value)}
                        placeholder='Enter estimated lead time'
                      />
                    </Form.Group>

                    <Form.Group className='mb-2'>
                      <Form.Label className='mb-1'>Attachment</Form.Label>
                      <Form.Control
                        size='sm'
                        type='text'
                        value={attachments[0] || ''}
                        onChange={(e) => setAttachments([e.target.value])}
                        placeholder='Add attachment link'
                      />
                    </Form.Group>

                    <Button
                      size='sm'
                      type='submit'
                      variant='primary'
                      disabled={!title || createTaskMutation.isLoading}
                    >
                      {createTaskMutation.isLoading
                        ? 'Creating...'
                        : 'Create Task'}
                    </Button>

                    {createTaskMutation.isSuccess && (
                      <Alert variant='success' className='mt-2 p-2'>
                        Task created successfully!
                      </Alert>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </div>
      </Collapse>
    </div>
  )
}
