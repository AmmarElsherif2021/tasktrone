import { useState, useEffect } from 'react'
import { Outlet, useParams, useOutletContext } from 'react-router-dom'
import { Header } from '../Components/Header/Header'
import BlogIcon from '../assets/blogIcon.svg'
import BlogIconFlipped from '../assets/blogIconFlipped.svg'
import toUp from '../assets/up.svg'
import IconButton from '../Ui/IconButton'
import { CreateTask } from '../Components/Tasks/CreateTask'
import { ProjectDashboard } from '../Components/Projects/ProjectDashboard'
import { Blog } from '../pages/Blog'
import { useProject, MANUFACTURING_PHASE_LABELS } from '../contexts/ProjectContext'
import { useAuth } from '../contexts/AuthContext'

export function ProjectShell() {
  const { id } = useParams()
  const { setCurrentProjectId, currentPhase, setCurrentPhase } = useProject()
  const { user } = useAuth()

  const [showBlog, setShowBlog] = useState(false)
  const [mainRef, setMainRef] = useState(null)
  const [scrollToUp, setShowScrollUp] = useState(false)

  // Demo: assume platform owner mode is always active during development
  const isPlatformOwner = true   // replace with user.role check when RBAC is wired

  // Sync URL param → ProjectContext
  useEffect(() => {
    if (id) setCurrentProjectId(id)
  }, [id, setCurrentProjectId])

  // Scroll‑to‑top
  const scrollMainToTop = () =>
    mainRef?.scrollTo({ top: 0, behavior: 'smooth' })

  useEffect(() => {
    if (!mainRef) return
    const handleScroll = () => {
      setShowScrollUp(mainRef.scrollTop > 0)
    }
    mainRef.addEventListener('scroll', handleScroll)
    return () => mainRef.removeEventListener('scroll', handleScroll)
  }, [mainRef])

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      {/* ── Fixed header ──────────────────────────────────── */}
      <Header />

      {/* ── Platform Owner Mode Banner + Product Line Selector ─────────────────── */}
      {isPlatformOwner && (
        <div
          className="flex items-center justify-between px-4 py-1.5"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-neutral-white)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.75rem',
            marginTop: 'var(--header-h)',
          }}
        >
          <span>🛡️ PLATFORM OWNER MODE</span>
          <div className="flex items-center gap-2">
            <label htmlFor="phase-select" className="text-xs font-normal">
              Product Line / Phase:
            </label>
            <select
              id="phase-select"
              value={currentPhase}
              onChange={(e) => setCurrentPhase(e.target.value)}
              className="px-2 py-0.5 text-xs font-mono text-neutral-black bg-neutral-white border border-card-border rounded"
            >
             {Object.entries(MANUFACTURING_PHASE_LABELS).map(([phase, label]) => (
                <option key={phase} value={phase}>
                  {label}
                </option>)
             )}
                         
            </select>
          </div>
        </div>
      )}

      {/* ── Content row (full height minus header & banner) ────────── */}
      <div
        className="flex overflow-hidden w-full bg-[var(--color-accent-blue)]"
        style={{
          height: `calc(100vh - var(--header-h) ${isPlatformOwner ? '- 2.5rem' : ''})`,
          marginTop: isPlatformOwner ? '2.5rem' : 'var(--header-h)',
        }}
      >
        {/* ── Sidebar ───────────────────────────────────────── */}
        <aside
          className="
            relative
            flex flex-col items-center justify-evenly
            w-14 sm:w-20 lg:w-24 flex-shrink-0
            border-r-2 border-black border-solid
            bg-[#EEFBF4] overflow-hidden
          "
        >
          <IconButton
            src={showBlog ? BlogIconFlipped : BlogIcon}
            alt={showBlog ? 'Hide blog' : 'Show blog'}
            onClick={() => setShowBlog((v) => !v)}
            iconWidthREM={6}
          />
          <CreateTask />
          <ProjectDashboard />
        </aside>

        {/* ── Blog panel ────────────────────────────────────── */}
        {showBlog && (
          <aside
            className="
              w-72 sm:w-80 lg:w-96 flex-shrink-0
              h-full overflow-y-auto
              border-r-2 border-black bg-[#EEFBF4]
            "
          >
            <Blog />
          </aside>
        )}

        {/* ── Main content ──────────────────────────────────── */}
        <main
          ref={setMainRef}
          className="
            flex-1 h-full overflow-y-auto
            px-3 sm:px-4 lg:px-6 py-4
          "
        >
          <div className="fixed top-16 right-[-40px]">
            {scrollToUp && (
              <IconButton
                src={toUp}
                alt="scroll up"
                onClick={scrollMainToTop}
                iconWidthREM={8}
              />
            )}
          </div>
          <Outlet context={{ showBlog, mainRef }} />
        </main>
      </div>
    </div>
  )
}

export const useProjectShell = () => useOutletContext()