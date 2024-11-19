import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Form, Button, Alert, Card, Collapse, Image } from 'react-bootstrap'
import { createPost } from '../../API/posts'
import { useAuth } from '../../contexts/AuthContext'
import createPostIcon from '../../assets/create-post-negative.svg'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const createPostMutation = useMutation({
    mutationFn: () => createPost(token, { title, contents }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      setTitle('')
      setContents('')
      setOpen(false)
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
    <>
      <Button
        variant='primary'
        onClick={() => setOpen(!open)}
        aria-controls='create-post-collapse'
        aria-expanded={open}
        className='btn-custom mb-4'
        style={{ width: '90%' }}
      >
        <Image src={createPostIcon} width={30} />
        {open ? 'Hide Create Post' : 'Create New Post'}
      </Button>

      <Collapse in={open}>
        <div id='create-post-collapse'>
          <Card className='mb-4'>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='create-title'>Title</Form.Label>
                  <Form.Control
                    type='text'
                    id='create-title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter post title'
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Contents</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
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

                {createPostMutation.isSuccess && (
                  <Alert variant='success' className='mt-3'>
                    Post created successfully!
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Collapse>
    </>
  )
}
