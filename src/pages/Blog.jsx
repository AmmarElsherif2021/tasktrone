import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { PostList } from '../Components/Posts/PostList.jsx'
import { CreatePost } from '../Components/Posts/CreatePost.jsx'

import { getPosts } from '../API/posts.js'
import { BlogControls } from '../Components/Posts/BlogController.jsx'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })

  const posts = postsQuery.data ?? []

  return (
    <Card
      className='h-100 shadow-sm'
      style={{ maxHeight: '95vh', overflowY: 'scroll' }}
    >
      <Card.Body>
        <Container fluid>
          <Row className='mb-4'>
            <Col>
              <CreatePost />
            </Col>
          </Row>

          <Row>
            <BlogControls
              author={author}
              onAuthorChange={setAuthor}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              sortFields={['createdAt', 'updatedAt']}
            />
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
