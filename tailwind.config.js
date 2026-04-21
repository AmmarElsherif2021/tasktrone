// tailwind.config.js
// ─────────────────────────────────────────────────────────────────────
// Tailwind v4: ALL theme tokens (colors, spacing, radii, fonts, etc.)
// live in index.css under @theme.  This file is only needed to tell
// Tailwind which source files to scan for class names.
//
// Do NOT add theme.extend here — it will be silently ignored in v4
// and will create a second (drifting) source of truth.
// ─────────────────────────────────────────────────────────────────────
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
}