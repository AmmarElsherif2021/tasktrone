import { useState }         from 'react'
import IconButton           from '../../Ui/IconButton'
import Notifications        from './Settings'
import { ProjectUsers }     from './ProjectUsers'
import { ExportProject }    from './ExportProject'
import { useProject }       from '../../contexts/ProjectContext'
import projectDashboardIcon from '../../assets/dashboard-icon.svg'

export const ProjectDashboard = () => {
  const [show, setShow] = useState(false)
  const { currentProjectId } = useProject()

  return (
    <>
      <IconButton
        src={projectDashboardIcon}
        alt={`Project\n Dashboard`}
        onClick={() => setShow(true)}
        iconWidthREM={5}
      />

      {show && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <button
            type="button"
            aria-label="Close project management"
            className="absolute inset-0 cursor-default"
            onClick={() => setShow(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-neutral-white max-w-3xl w-full mx-4"
            style={{ border: 'var(--border-width-base) solid var(--color-card-border)' }}
          >
            {/* Header */}
            <div
              className="flex justify-between items-center px-4 py-3"
              style={{ borderBottom: 'var(--border-width-base) solid var(--color-card-border)' }}
            >
              <h2 className="text-base font-mono font-bold">Project Management</h2>
              <button
                onClick={() => setShow(false)}
                className="text-xl font-bold hover:text-primary transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <Notifications projectId={currentProjectId} />
                <ProjectUsers />
                <ExportProject projectId={currentProjectId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}