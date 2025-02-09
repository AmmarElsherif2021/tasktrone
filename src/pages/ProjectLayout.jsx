import { useState } from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import { Blog } from './Blog'
import { Board } from './Board'
import { Header } from '../Components/Header/Header'
import BlogIcon from '../assets/blogIcon.svg'
import BlogIconFlipped from '../assets/blogIconFlipped.svg'
import toUp from '../assets/up.svg'
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
          className='d-flex flex-column align-items-center'
          style={{
            height: '100%',
            position: 'fixed',
            paddingTop: 0, //'4rem',
            paddingRight: '1rem',
            top: 0,
            left: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            backgroundColor: '#EEFBF4',
            borderRightWidth: !showBlog && '2px',
            borderRightColor: !showBlog && '#000', // '#729B87',
            borderRightStyle: !showBlog && 'solid',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '0',
              margin: '1rem',
            }}
          >
            <IconButton
              src={toUp}
              alt={'scroll up'}
              onClick={() => window.scrollTo(0, 0)}
              iconWidthREM={6}
            />
          </div>

          <IconButton
            src={showBlog ? BlogIconFlipped : BlogIcon}
            alt={showBlog ? 'Hide Blog' : 'Show Blog'}
            onClick={toggleBlog}
            iconWidthREM={6}
          />
          <CreateTask />
          <ProjectDashboard />
        </Col>

        {/* Blog Panel */}
        <Col
          xs={10}
          lg={showBlog ? 4 : 1}
          className={` ${showBlog ? 'd-block' : 'd-none'}`}
          style={{
            height: '100vh',
            position: 'fixed',
            top: 0,
            paddingTop: 0,
            left: '5rem',
            overflowY: 'auto',
            zIndex: 999,
            backgroundColor: '#EEFBF4',
            borderRightWidth: '2px',
            borderRightColor: '#000', // '#729B87',
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
            top: 0,
            left: '5rem',
            paddingTop: '5rem',
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
