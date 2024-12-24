import { useState } from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import { Blog } from './Blog'
import { Board } from './Board'
import { Header } from '../Components/Header/Header'
import BlogIcon from '../assets/blogIcon.svg'
import BlogIconFlipped from '../assets/blogIconFlipped.svg'
import IconButton from '../Ui/IconButton'
import { CreateTask } from '../Components/Tasks/CreateTask'
import { ProjectDashboard } from '../Components/Projects/ProjectDashboard'

export const ProjectLayout = () => {
  const [showBlog, setShowBlog] = useState(false)

  const toggleBlog = () => {
    setShowBlog(!showBlog)
  }

  return (
    <Container fluid className='vh-100 d-flex flex-column'>
      <Header />
      <Row className='flex-grow-1 g-0'>
        {/* Sidebar with toggle button */}
        <Col
          xs={12}
          lg={1}
          className='d-none d-lg-flex flex-column align-items-center bg-light p-2'
          style={{
            height: 'calc(100vh - 5rem)',
            position: 'fixed',
            top: '5rem',
            left: 0,
            transition: 'width 0.3s',
            zIndex: 1000,
            justifyContent: 'space-around',
          }}
        >
          <IconButton
            src={showBlog ? BlogIconFlipped : BlogIcon}
            alt={showBlog ? 'Hide Blog' : 'Show Blog'}
            onClick={toggleBlog}
            iconWidthREM={7}
          />
          <CreateTask />
          <ProjectDashboard />
        </Col>

        {/* Blog Sidebar */}
        {showBlog && (
          <Col
            xs={12}
            lg={3}
            className='d-none d-lg-block bg-light p-2'
            style={{
              position: 'fixed',
              top: '56px',
              left: '4rem', // Adjust based on sidebar width
              height: 'calc(100vh - 56px)',
              overflowY: 'auto',
              transition: 'left 0.3s',
            }}
          >
            <Blog />
          </Col>
        )}

        {/* Main Content Area */}
        <Col
          xs={12}
          lg={showBlog ? 8 : 11}
          style={{
            marginLeft: showBlog ? '4rem' : '4rem',

            transition: 'margin-left 0.3s',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        >
          <Board />
        </Col>
      </Row>
    </Container>
  )
}
