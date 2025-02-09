// Blog.jsx
import { Card, Container, Row, Col } from 'react-bootstrap'
import { PostList } from '../Components/Posts/PostList.jsx'
import { CreatePost } from '../Components/Posts/CreatePost.jsx'
import { BlogControls } from '../Components/Posts/BlogController.jsx'
import { useProject } from '../contexts/ProjectContext.jsx'

export function Blog() {
  const {
    posts,
    postAuthorFilter,
    postSortBy,
    postSortOrder,
    updatePostFilters,
  } = useProject()

  const controllerStyle = {
    width: '7rem',
    marginRight: '2rem',
    marginLeft: '2rem',
    padding: 0,
    height: '3.5rem',
  }

  return (
    <Card
      className='h-100'
      style={{
        maxHeight: '97vh',
        overflowY: 'scroll',
        paddingLeft: '1rem',
        paddingTop: '5rem',
        borderStyle: 'none',
        backgroundColor: '#EEFBF4',
      }}
    >
      <Card.Body>
        <Container fluid>
          <Row className='mt-0 pt-0'>
            <div style={controllerStyle}>
              <CreatePost />
            </div>
            <div style={controllerStyle}>
              <BlogControls
                author={postAuthorFilter}
                onAuthorChange={(author) => updatePostFilters({ author })}
                sortBy={postSortBy}
                onSortChange={(sortBy) => updatePostFilters({ sortBy })}
                sortOrder={postSortOrder}
                onSortOrderChange={(sortOrder) =>
                  updatePostFilters({ sortOrder })
                }
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
