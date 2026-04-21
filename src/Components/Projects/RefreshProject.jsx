// RefreshProject.jsx
import { useState, useRef, useEffect } from 'react'
import refreshProjectIcon from '../../assets/refresh-icon.svg'
import refreshDashboard   from '../../assets/refreshDash.svg'
import refreshProject     from '../../assets/refreshProject.svg'
import syncIcon           from '../../assets/sync.svg'
import IconButton         from '../../Ui/IconButton'
import { useProject }     from '../../contexts/ProjectContext.jsx'

const RefreshProject = () => {
  const { refreshTasks } = useProject()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const handleRefreshTasks = () => {
    refreshTasks()
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <IconButton
        src={refreshProjectIcon}
        alt="Refresh Project"
        onClick={() => setIsOpen((v) => !v)}
      />
      {isOpen && (
        <div
          className="
            absolute right-0 mt-2 z-50 p-2
            flex flex-col items-center gap-1
            bg-card-bg
            border-[length:var(--border-width-base)] border-card-border border-solid
            shadow-sm
            w-28
          "
        >
          <IconButton
            src={refreshProject}
            alt="Refresh Tasks"
            iconWidthREM={2}
            onClick={handleRefreshTasks}
          />
          <IconButton
            src={refreshDashboard}
            alt="Refresh Dashboard"
            iconWidthREM={2}
            onClick={() => setIsOpen(false)}
          />
          <IconButton
            src={syncIcon}
            alt="Full Sync"
            iconWidthREM={2}
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

export default RefreshProject