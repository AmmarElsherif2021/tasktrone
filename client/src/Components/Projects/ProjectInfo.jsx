// ProjectInfo.jsx – unchanged
import { useProject } from '../../contexts/ProjectContext'

export function ProjectInfo() {
  const { currentProject } = useProject()

  return (
    <div className="m-4 flex flex-row items-center gap-4">
      <h3 className="text-base font-mono font-bold">
        {currentProject?.title || 'Loading…'}
      </h3>
      {currentProject?.created_by && (
        <em className="text-xs font-mono text-neutral-black/60">
          Created by {currentProject.created_by.username}
        </em>
      )}
      {currentProject?.members?.length > 0 && (
        <small className="text-xs font-mono text-neutral-black/60">
          {currentProject.members.length} members
        </small>
      )}
    </div>
  )
}