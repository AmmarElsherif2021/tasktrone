import { Container, Row, Col } from 'react-bootstrap'
import { Blog } from './Blog.jsx'
import { Header } from '../Components/Header/Header.jsx'
import { Board } from './Board.jsx'

export function Home() {
  return (
    <div className='min-vh-100 bg-light'>
      <Header />
      <Container fluid className='py-4'>
        <Row className='g-4'>
          <Col xs={12} lg={3}>
            <Blog />
          </Col>

          <Col xs={12} lg={9}>
            <Board />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
