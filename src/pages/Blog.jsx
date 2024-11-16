import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { PostList } from '../Components/Posts/PostList.jsx'
import { CreatePost } from '../Components/Posts/CreatePost.jsx'
import { PostFilter } from '../Components/Posts/PostFilter.jsx'
import { PostSorting } from '../Components/Posts/PostSorting.jsx'
import { getPosts } from '../API/posts.js'

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
    <Card className='h-100 shadow-sm'>
      <Card.Body>
        <Container fluid>
          <Row className='mb-4'>
            <Col>
              <CreatePost />
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col md={6}>
              <Card.Subtitle className='mb-2 text-muted'>
                Filter by:
              </Card.Subtitle>
              <PostFilter
                field='author'
                value={author}
                onChange={(value) => setAuthor(value)}
              />
            </Col>
            <Col md={6}>
              <PostSorting
                fields={['createdAt', 'updatedAt']}
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                orderValue={sortOrder}
                onOrderChange={(orderValue) => setSortOrder(orderValue)}
              />
            </Col>
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
