import { useEffect } from 'react'

/**
 * Modal
 * ──────────────────────────────────────────────────────────────
 * Accessible modal overlay.
 *   ‣ Click backdrop to close
 *   ‣ Escape key to close
 *   ‣ Scroll-locked to max 90vh
 *
 * Styling uses CSS variables from index.css @theme so it stays
 * in sync with the design system without hardcoding hex values.
 */
export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])

  if (!isOpen) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 "
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="
          w-[600px] h-auto p-4 mx-4
          max-h-[90vh] overflow-y-auto
          bg-neutral-white
          rounded-sm
        "
        style={{
          border:       'var(--border-width-base) solid var(--color-modal-border)',
          borderRadius: 'var(--radius-sm)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center px-4 py-3"
          style={{ borderBottom: 'var(--border-width-base) solid var(--color-modal-divider)' }}
        >
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--color-modal-text)' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="
              text-2xl font-bold leading-none
              hover:text-primary transition-colors duration-fast
            "
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal