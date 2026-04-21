/**
 * App.jsx — Central routing + layout assignment
 * ──────────────────────────────────────────────────────────────
 *
 * Layout tree:
 *
 *   <AuthLayout>                 min-h-screen centered card
 *     /login
 *     /signup
 *     /complete-profile
 *
 *   <AppShell>                   Header (fixed) + offset content area
 *     /                          Home  (welcome → explorer)
 *     /dashboard                 Dashboard
 *
 *   <ProjectShell>               Header + sidebar + blog panel + <Outlet>
 *     /project/:id               → redirects to ./board
 *     /project/:id/board         Board
 *     /project/:id/settings      ProjectSettings  (example future route)
 *
 * Rules:
 *   - Layouts own positioning, sizing, and the shared <Header />.
 *   - Pages own their own content only — no position:absolute,
 *     no min-h-screen wrappers, no <Header /> imports.
 *   - --header-h (index.css :root) is the single source of truth
 *     for all header-offset calculations.
 *   - ProjectShell reads :id and calls setCurrentProjectId so
 *     ProjectContext is always in sync with the URL.
 * ──────────────────────────────────────────────────────────────
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import { AuthLayout }   from './layouts/AuthLayout'
import { AppShell }     from './layouts/AppShell'
import { ProjectShell } from './layouts/ProjectShell'

// Pages — auth
import { Login }           from './pages/Login'
import { Signup }          from './pages/Signup'
import { CompleteProfile } from './pages/CompleteProfile'

// Pages — app
import { Home }      from './pages/Home/Home'
import { Dashboard } from './pages/Dashboard/Dashboard'

// Pages — project
import { Board } from './pages/Board'
// import { ProjectSettings } from './pages/ProjectSettings'  // future

// Contexts
import { AuthContextProvider as AuthProvider } from './contexts/AuthContext'
import { UserHomeProvider }  from './contexts/UserHomeContext'
import { ProjectProvider }   from './contexts/ProjectContext'

// ── QueryClient (single instance, lives outside component tree) ──
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserHomeProvider>
          <ProjectProvider>
            <BrowserRouter>
              <Routes>

                {/* ── Unauthenticated ──────────────────────── */}
                <Route element={<AuthLayout />}>
                  <Route path="/login"            element={<Login />} />
                  <Route path="/signup"           element={<Signup />} />
                  <Route path="/complete-profile" element={<CompleteProfile />} />
                </Route>

                {/* ── Authenticated — no sidebar ───────────── */}
                <Route element={<AppShell />}>
                  <Route path="/"          element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* ── Authenticated — project shell ─────────── */}
                {/*
                 * ProjectShell owns the Header, sidebar, and blog
                 * panel. Child routes render inside its <Outlet>.
                 *
                 * The index route redirects /project/:id → /project/:id/board
                 * so there is always a concrete child route active.
                 */}
                <Route path="/project/:id" element={<ProjectShell />}>
                  <Route index element={<Navigate to="board" replace />} />
                  <Route path="board" element={<Board />} />
                  {/* <Route path="settings" element={<ProjectSettings />} /> */}
                </Route>

                {/* ── Fallback ─────────────────────────────── */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </BrowserRouter>
          </ProjectProvider>
        </UserHomeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}