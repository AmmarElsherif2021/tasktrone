import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { PostList } from '../Components/Posts/PostList.jsx'
import { CreatePost } from '../Components/Posts/CreatePost.jsx'

import { getPosts } from '../API/posts.js'
import { BlogControls } from '../Components/Posts/BlogController.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useProject } from '../contexts/ProjectContext.jsx'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const [token] = useAuth()
  const { currentProjectId } = useProject()
  const controllerStyle = {
    width: '7rem',
    marginRight: '2rem',
    marginLeft: '2rem',
    padding: 0,
    height: '3.5rem',
  }
  const postsQuery = useQuery({
    queryKey: [
      'posts',
      { projectId: currentProjectId, author, sortBy, sortOrder },
    ],
    queryFn: () =>
      getPosts(token, currentProjectId, { author, sortBy, sortOrder }),
    enabled: !!token && !!currentProjectId,
    staleTime: 1000 * 60,
  })

  const posts = postsQuery.data ?? []

  return (
    <Card
      className='h-100 '
      style={{
        maxHeight: '97vh',
        overflowY: 'scroll',
        paddingLeft: '1rem',
        borderStyle: 'none',
        backgroundColor: '#EEFBF4',
      }}
    >
      <Card.Body>
        <Container fluid>
          <Row className='mt-0 pt-0 '>
            <div style={controllerStyle}>
              <CreatePost />
            </div>
            <div style={controllerStyle}>
              <BlogControls
                author={author}
                onAuthorChange={setAuthor}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                sortFields={['createdAt', 'updatedAt']}
              />
            </div>
          </Row>

          <Row>
            <Col>
              <PostList posts={posts} />
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}
