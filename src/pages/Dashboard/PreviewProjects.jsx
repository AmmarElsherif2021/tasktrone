import { ProjectCard } from '../../Components/Projects/ProjectCard'
import { useProject } from '../../contexts/ProjectContext'
import { useNavigate } from 'react-router-dom'
import { useUserHome } from '../../contexts/UserHomeContext'

export const PreviewProjects = () => {
  const { userProjects } = useUserHome()
  const {currentProjectId, setCurrentProjectId } = useProject()
  const navigate = useNavigate()

  const handleProjectClick = (projectId) => {
  setCurrentProjectId(projectId)
  navigate(`/project/${projectId}/board`)
}

  return (
    <div className="p-3 max-h-[61.5vh] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {userProjects.map((project) => (
          <ProjectCard
            key={project.id}
            projectId={project.id}
            title={project.title}
            description={project.description}
            createdBy={project.created_by}
            projectManager={project.project_manager}
            status={project.status}
            currentPhase={project.current_phase}
            priority={project.priority}
            startDate={project.start_date}
            targetCompletionDate={project.target_completion_date}
            wipLimit={project.wip_limit}
            members={project.members || []}
            onClick={handleProjectClick}
          />
        ))}
      </div>
    </div>
  )
}