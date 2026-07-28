/**
 * AppShell
 * ──────────────────────────────────────────────────────────────
 * Shell for authenticated full-page views that have a top Header
 * but no sidebar:   /   /dashboard
 *
 * Responsibilities:
 *   - Mounts the shared <Header /> once
 *   - Offsets the scrollable content area by --header-h so it
 *     never hides behind the fixed Header
 *   - Provides a reliable min-height so background colors fill
 *     the viewport even on short pages
 *   - Handles horizontal overflow on small screens
 *
 * The Header component is assumed to be `position: fixed` with a
 * height equal to `--header-h` (defined in index.css :root).
 *
 * Pages rendered inside here should NOT include <Header /> or any
 * top-padding that compensates for it — the shell owns that.
 * ──────────────────────────────────────────────────────────────
 */
import { Outlet } from 'react-router-dom'
import { Header } from '../Components/Header/Header'

export function AppShell() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <div
        className="w-full overflow-x-auto"
        style={{ paddingTop: 'var(--header-h)' }}
      >
        <div className="min-h-[calc(100vh_-_var(--header-h))] w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}