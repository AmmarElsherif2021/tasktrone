import { Row } from 'react-bootstrap'
import { ProjectCard } from '../Components/Projects/ProjectCard'
import { useProject } from '../contexts/ProjectContext'
import { useNavigate } from 'react-router-dom'
import { useUserHome } from '../contexts/UserHomeContext'
export const PreviewProjects = () => {
  const { userProjects } = useUserHome()
  const { setCurrentProjectId, currentProjectId, currentProject } = useProject()
  const navigate = useNavigate()
  const handleProjectClick = (projectId) => {
    setCurrentProjectId(projectId)
    console.log(
      `current project ${(currentProjectId, JSON.stringify(currentProject))}`,
    )
    navigate('/project')
  }
  return (
    <Row className='g-4'>
      <h1>Welcome back </h1>
      <h3>Projects</h3>
      {
        <Row xs={1} sm={2} md={3} lg={4} className='g-4'>
          {userProjects.map((project) => (
            <div
              onClick={() => handleProjectClick(project._id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleProjectClick(project._id)
                }
              }}
              style={{ cursor: 'pointer' }}
              role='button'
              tabIndex={0}
              key={project._id}
            >
              <ProjectCard
                projectId={project._id}
                title={project.title}
                description={project.description}
                createdBy={project.createdBy}
                members={project.members}
              />
            </div>
          ))}
        </Row>
      }
    </Row>
  )
}
