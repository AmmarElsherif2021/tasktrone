// ExportProject.jsx
import { useState, useRef, useEffect } from 'react'
import exportIcon from '../../assets/export-icon.svg'
import IconButton from '../../Ui/IconButton'

// ── Shared dropdown panel style (mirrors Settings.jsx pattern) ─
const DROPDOWN_CLS = `
  absolute right-0 mt-2 z-50
  bg-neutral-white
  border-[length:var(--border-width-base)] border-card-border border-solid
  shadow-sm
  min-w-[10rem]
`

const ITEM_CLS = `
  block w-full text-left
  px-4 py-2
  font-mono text-xs
  hover:bg-card-hover
  transition-colors duration-fast
`

export const ExportProject = () => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <IconButton
        src={exportIcon}
        alt="Export"
        onClick={() => setIsOpen((v) => !v)}
      />
      {isOpen && (
        <div className={DROPDOWN_CLS}>
          <button className={ITEM_CLS} onClick={() => setIsOpen(false)}>
            Export Tasks
          </button>
          <button className={ITEM_CLS} onClick={() => setIsOpen(false)}>
            Export Project
          </button>
          <button className={ITEM_CLS} onClick={() => setIsOpen(false)}>
            Export Metrics
          </button>
        </div>
      )}
    </div>
  )
}

export default ExportProject