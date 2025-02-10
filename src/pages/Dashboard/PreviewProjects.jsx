import { Row, Col } from 'react-bootstrap'
import { ProjectCard } from '../../Components/Projects/ProjectCard'
//import { useProject } from '../contexts/ProjectContext'
//import { useNavigate } from 'react-router-dom'
import { useUserHome } from '../../contexts/UserHomeContext'

export const PreviewProjects = () => {
  const { userProjects } = useUserHome()
  //const { setCurrentProjectId, currentProjectId, currentProject } = useProject()
  //const navigate = useNavigate()

  // const handleProjectClick = (projectId) => {
  //   setCurrentProjectId(projectId)
  //   console.log(
  //     `current project ${(currentProjectId, JSON.stringify(currentProject))}`,
  //   )
  //   navigate('/project')
  // }

  return (
    <div className='p-3' style={{ maxHeight: '61.5vh', overflowY: 'auto' }}>
      <Row xs={1} sm={1} md={2} lg={3} xl={4} className='g-1'>
        {userProjects.map((project) => (
          <Col key={project._id}>
            <ProjectCard
              projectId={project._id}
              title={project.title}
              description={project.description}
              createdBy={project.createdBy}
              members={project.members}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}
