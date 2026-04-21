/**
 * AuthLayout
 * ──────────────────────────────────────────────────────────────
 * Shell for all unauthenticated / onboarding routes:
 *   /login  /signup  /complete-profile
 *
 * Responsibilities:
 *   - Full-viewport centering (both axes)
 *   - Consistent page background
 *   - Responsive horizontal padding so the card never touches edges
 *
 * Pages rendered inside here should return ONLY their card/form
 * content — no min-h-screen, no flex centering wrappers.
 * ──────────────────────────────────────────────────────────────
 */
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-gray-50
        px-4 py-12
        sm:px-6 lg:px-8
      "
    >
      {/* Constrains child card width and centers it */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
