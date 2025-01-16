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
    <Container fluid className='vh-100 d-flex flex-column mx-0 px-0'>
      <Header />
      <Row className='flex-grow-1 g-0'>
        {/* Sidebar */}
        <Col
          xs={2}
          lg={1}
          className='d-flex flex-column align-items-center  p-2'
          style={{
            height: 'calc(100vh - 4rem)',
            position: 'fixed',
            top: '4rem',
            left: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: '#EEFBF4',
            borderRightWidth: !showBlog && '2px',
            borderRightColor: !showBlog && '#729B87',
            borderRightStyle: !showBlog && 'solid',
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

        {/* Blog Panel */}
        <Col
          xs={10}
          lg={showBlog ? 4 : 1}
          className={` p-2 ${showBlog ? 'd-block' : 'd-none'}`}
          style={{
            height: 'calc(100vh - 5rem)',
            position: 'fixed',
            top: '4.5rem',
            left: '5rem',
            overflowY: 'auto',
            zIndex: 999,
            backgroundColor: '#EEFBF4',
            borderRightWidth: '2px',
            borderRightColor: '#729B87',
            borderRightStyle: 'solid',
          }}
        >
          <Blog />
        </Col>

        {/* Main Content */}
        <Col
          xs={10}
          lg={11}
          className=' w-99'
          style={{
            mineight: '100%',
            position: 'absolute',
            top: '4.5rem',
            left: '5rem',
            paddingTop: 0,
            marginTop: 0,
            marginLeft: '2rem',
            paddingBottom: '1rem',
            overflowY: 'auto',
          }}
        >
          <Board />
        </Col>
      </Row>
    </Container>
  )
}
