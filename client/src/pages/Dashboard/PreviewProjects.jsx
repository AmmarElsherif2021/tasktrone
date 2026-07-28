import { ProjectCard } from '../../Components/Projects/ProjectCard'

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