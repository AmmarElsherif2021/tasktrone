import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Button, Alert, Modal } from 'react-bootstrap'
import { createPost } from '../../API/posts'
import { useAuth } from '../../contexts/AuthContext'
import { useProject } from '../../contexts/ProjectContext'
import createPostIcon from '../../assets/create-post.svg'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const { currentProjectId } = useProject()

  const createPostMutation = useMutation({
    mutationFn: () =>
      createPost(token, currentProjectId.toString(), { title, contents }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      setTitle('')
      setContents('')
      setShowModal(false)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate()
  }

  if (!token) {
    return <Alert variant='warning'>Please log in to create new posts.</Alert>
  }

  return (
    <div className='mx-1'>
      <Button
        variant='none'
        size='lg'
        className='phase-button'
        style={{
          borderWidth: '2px',
          borderColor: '#000',
          borderRadius: '2rem',
          backgroundColor: '#5EE5AD',
        }}
        onClick={() => setShowModal(true)}
      >
        <img
          src={createPostIcon}
          width={25}
          alt={`Create Post`}
          className='phase-button-icon'
        />
        <span className='phase-button-text' style={{ color: '#000' }}>
          <strong>Create Post</strong>
        </span>
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header
          style={{ borderWidth: '2px', borderColor: '#000' }}
          closeButton
        >
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ borderWidth: '2px', borderColor: '#000' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label htmlFor='create-title'>Title</Form.Label>
              <Form.Control
                type='text'
                id='create-title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter post title'
                style={{ borderWidth: '2px', borderColor: '#000' }}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Contents</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                style={{ borderWidth: '2px', borderColor: '#000' }}
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                placeholder='Write your post content here...'
              />
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              disabled={!title || createPostMutation.isPending}
              className='btn-custom'
            >
              {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
            </Button>
          </Form>

          {createPostMutation.isSuccess && (
            <Alert variant='success' className='mt-3'>
              Post created successfully!
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}
