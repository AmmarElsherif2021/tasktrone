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
//import { useAuth } from '../contexts/AuthContext'

export function ProjectShell() {
  const { id } = useParams()
  const { setCurrentProjectId, currentPhase, setCurrentPhase } = useProject()
  //const { user } = useAuth()

  const [showBlog, setShowBlog] = useState(false)
  const [mainRef, setMainRef] = useState(null)
  const [scrollToUp, setShowScrollUp] = useState(false)

  // Demo: assume platform owner mode is always active during development
  const isPlatformOwner = true   // replace with user.role check when RBAC is wired

  // Sync URL param → ProjectContext
  useEffect(() => {
    if (id) setCurrentProjectId(id)
  }, [id, setCurrentProjectId])

  // Scroll‑to‑top detection
  useEffect(() => {
    if (!mainRef) return
    const handleScroll = () => {
      // Show button after scrolling down 200px for better UX
      setShowScrollUp(mainRef.scrollTop > 200)
    }
    mainRef.addEventListener('scroll', handleScroll)
    return () => mainRef.removeEventListener('scroll', handleScroll)
  }, [mainRef])

  const scrollMainToTop = () =>
    mainRef?.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* ── Fixed header ──────────────────────────────────── */}
      <Header />

      {/* 
        Main wrapper that sits below the fixed header.
        Uses margin-top to push content down by the header height.
        This wrapper takes the remaining viewport height.
      */}
      <div 
        className="flex flex-col w-full"
        style={{ marginTop: 'var(--header-h)', height: 'calc(100vh - var(--header-h))' }}
      >
        {/* ── Platform Owner Mode Banner (no extra margin, sits directly below header) ── */}
        {isPlatformOwner && (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-2 w-full flex-shrink-0"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-neutral-white)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            <span className="whitespace-nowrap">🛡️ PLATFORM OWNER MODE</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="phase-select" className="text-xs font-normal whitespace-nowrap">
                Product Line / Phase:
              </label>
              <select
                id="phase-select"
                value={currentPhase}
                onChange={(e) => setCurrentPhase(e.target.value)}
                className="px-2 py-0.5 text-xs font-mono text-neutral-black bg-neutral-white border border-card-border rounded w-full sm:w-auto"
              >
                {Object.entries(MANUFACTURING_PHASE_LABELS).map(([phase, label]) => (
                  <option key={phase} value={phase}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 
          Content row: sidebar + blog panel (optional) + main content.
          Takes all remaining space with flex-1 and uses overflow-hidden to contain its children.
        */}
        <div className="flex flex-1 overflow-hidden w-full bg-[var(--color-accent-blue)]">
          
          {/* ── Sidebar (responsive widths) ───────────────────────────────────────── */}
          <aside
            className="
              relative
              flex flex-col items-center justify-start gap-6
              w-14 sm:w-20 lg:w-24 flex-shrink-0
              border-r-2 border-black border-solid
              bg-[#EEFBF4] overflow-y-auto
              py-6
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

          {/* ── Blog panel (collapsible, responsive width) ─────────────────────────── */}
          {showBlog && (
            <aside
              className="
                w-64 sm:w-72 lg:w-80 xl:w-96 flex-shrink-0
                h-full overflow-y-auto
                border-r-2 border-black bg-[#EEFBF4]
              "
            >
              <Blog />
            </aside>
          )}

          {/* ── Main content area (scrollable) ────────────────────────────────────── */}
          <main
            ref={setMainRef}
            className="
              flex-1 h-full overflow-y-auto
              px-3 sm:px-4 lg:px-6 py-4
              relative
            "
          >
            <Outlet context={{ showBlog, mainRef }} />
          </main>
        </div>
      </div>

      {/* ── Scroll to top button (fixed to viewport, appears only when needed) ── */}
      {scrollToUp && (
        <div className="fixed bottom-6 right-6 z-50">
          <IconButton
            src={toUp}
            alt="scroll up"
            onClick={scrollMainToTop}
            iconWidthREM={8}
          />
        </div>
      )}
    </div>
  )
}

export const useProjectShell = () => useOutletContext()