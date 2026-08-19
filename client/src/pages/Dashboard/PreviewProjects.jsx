import { ProjectCard } from '../../Components/Projects/ProjectCard'
import propTypes from 'prop-types'
export const PreviewProjects = ({ projects, onProjectClick }) => {
  return (
    <div className="p-3 max-h-[61.5vh] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {projects.map((project) => (
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
            onClick={onProjectClick}
          />
        ))}
      </div>
    </div>
  )
}
PreviewProjects.propTypes = {
  projects: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string.isRequired,
      title: propTypes.string.isRequired,
      description: propTypes.string,
      created_by: propTypes.string.isRequired,
      project_manager: propTypes.string,
      status: propTypes.string,
      current_phase: propTypes.string,
      priority: propTypes.string,
      start_date: propTypes.string,
      target_completion_date: propTypes.string,
      wip_limit: propTypes.number,
      members: propTypes.arrayOf(propTypes.string),
    })
  ).isRequired,
  onProjectClick: propTypes.func.isRequired,
}
