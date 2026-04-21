/**
 * ProjectShell  
 * ──────────────────────────────────────────────────────────────
 * Shell for all project-level routes: /project/:id/*
 *
 * Responsibilities:
 *   - Reads :id from the URL and initialises ProjectContext
 *   - Mounts the shared <Header /> once
 *   - Provides a locked-height canvas (100vh) — only inner panes scroll
 *   - Sidebar: fixed narrow strip, always visible
 *   - Blog panel: UI toggle (not a route) — lives alongside main content
 *   - Main content: <Outlet /> — child routes render here
 *
 * Route tree (defined in App.jsx):
 *   /project/:id            → redirects to ./board
 *   /project/:id/board      → <Board />
 *   /project/:id/settings   → <ProjectSettings />  (future)
 *
 * Blog is intentionally NOT a route — its open/closed state is
 * owned here and shared via <OutletContext> so child routes can
 * read it if needed (e.g. Board adjusting its width).
 * ──────────────────────────────────────────────────────────────
 */
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
import { useProject } from '../contexts/ProjectContext'

export function ProjectShell() {
  const { id } = useParams()
  const { setCurrentProjectId } = useProject()

  const [showBlog, setShowBlog] = useState(false)
  const [mainRef, setMainRef]   = useState(null)
  const [scrollToUp, setShowScrollUp] = useState(false);

  // Sync URL param → ProjectContext whenever the project changes
  useEffect(() => {
    if (id) setCurrentProjectId(id)
  }, [id, setCurrentProjectId])

  

  //scrolling up
  const scrollMainToTop = () =>
    mainRef?.scrollTo({ top: 0, behavior: 'smooth' })

  // Attach scroll listener
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

      {/* ── Content row (full height minus header) ────────── */}
      <div
        className="flex overflow-hidden w-full bg-[var(--color-accent-blue)]"
        style={{
          height:    'calc(100vh - var(--header-h))',
          marginTop: 'var(--header-h)',
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

        {/* ── Blog panel (UI toggle, not a route) ───────────── */}
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

        {/* ── Main content — child routes render here ───────── */}
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
          {/*
           * outletContext passes blog state so child routes can
           * react to the panel being open (e.g. Board reflow).
           */}
          <Outlet context={{ showBlog, mainRef }} />
        </main>
      </div>
    </div>
  )
}

/**
 * Convenience hook for child routes that need to read shell state.
 * Usage inside Board.jsx (or any child):
 *   const { showBlog } = useProjectShell()
 */
export const useProjectShell = () => useOutletContext()