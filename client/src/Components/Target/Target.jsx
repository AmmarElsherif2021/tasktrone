// Target.jsx
import { useState } from 'react'
import Three from '../../Ui/CAD/Three'
import { StyledCard } from '../../Ui/StyledCard'

const TABS = [
  { key: '3dModel',    label: '3D Model' },
  { key: 'documents',  label: 'Documents' },
  { key: 'otherData',  label: 'Other Data' },
]

const DOCUMENTS = [
  'Design Specifications.pdf',
  'BOM.xlsx',
  'Prototype Testing Report.docx',
  'Production Plan.pdf',
]

const OTHER_DATA = [
  'Target Timeline: Q4 2023',
  'Current Progress: 75%',
  'Key Milestones: Prototype Testing, Production Planning',
  'Team Members: Design Engineers, Manufacturing Engineers, Quality Control',
]

export default function Target() {
  const [activeKey,   setActiveKey]   = useState('3dModel')
  const [hoverStates, setHoverStates] = useState({})

  const handleHover = (key, val) =>
    setHoverStates((prev) => ({ ...prev, [key]: val }))

  return (
    <StyledCard
      hoverKey="targetCard"
      hoverStates={hoverStates}
      handleHover={handleHover}
      className="h-[90vh] flex flex-col"
    >
      {/* Header */}
      <div
        className="flex justify-between items-center p-3 font-mono font-bold text-base"
        style={{ borderBottom: 'var(--border-width-thick) solid var(--color-sage)' }}
      >
        <h3 className="text-base font-bold">Gear 1011AM3</h3>
        <div className="flex gap-2">
          <span
            className="px-2 py-0.5 text-xs font-mono"
            style={{
              backgroundColor: 'var(--color-neutral-black)',
              color:           'var(--color-neutral-white)',
              borderRadius:    'var(--radius-pill)',
            }}
          >
            In Progress
          </span>
          <span
            className="px-2 py-0.5 text-xs font-mono"
            style={{
              backgroundColor: 'var(--color-sage)',
              color:           'var(--color-neutral-white)',
              borderRadius:    'var(--radius-pill)',
            }}
          >
            75%
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="px-3 pt-2"
        style={{ borderBottom: 'var(--border-width-base) solid var(--color-sage)' }}
      >
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveKey(tab.key)}
              className={`
                font-mono font-bold text-xs px-3 py-1.5 rounded-t
                transition-colors duration-fast
                ${activeKey === tab.key
                  ? 'bg-sage text-neutral-white'
                  : 'bg-card-bg text-neutral-black hover:bg-sage/10'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div className="p-3 flex-1 overflow-y-auto">
        {activeKey === '3dModel' && (
          <div className="w-full h-96">
            <Three />
          </div>
        )}

        {activeKey === 'documents' && (
          <ul className="divide-y divide-sage/30">
            {DOCUMENTS.map((doc, i) => (
              <li
                key={i}
                className="py-3 px-2 font-mono text-sm transition-colors hover:bg-sage/10 cursor-pointer"
              >
                {doc}
              </li>
            ))}
          </ul>
        )}

        {activeKey === 'otherData' && (
          <ul className="divide-y divide-sage/30">
            {OTHER_DATA.map((item, i) => (
              <li key={i} className="py-3 px-2 font-mono text-sm transition-colors hover:bg-sage/10">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div
        className="p-2 font-mono text-xs text-neutral-black/60 flex justify-between"
        style={{ borderTop: 'var(--border-width-thick) solid var(--color-sage)' }}
      >
        <small>Last Updated: Today</small>
        <small>Controller Module</small>
      </div>
    </StyledCard>
  )
}