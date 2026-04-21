/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useProject } from '../contexts/ProjectContext'
import { StyledCard } from '../Ui/StyledCard'

// Icons
import inProgressIcon from '../assets/inProgress.svg'
import cycleTimeIcon  from '../assets/cycleTime.svg'
import leadTimeIcon   from '../assets/leadTime.svg'
import doneIcon       from '../assets/done.svg'
import flowIcon       from '../assets/flow.svg'
import updateIcon     from '../assets/update.svg'
import wipIcon        from '../assets/wip.svg'
import { metrics as metricColors } from '../Ui/colors'

// Toolbar sub-components (kept local for co-location)
import Notifications from '../Components/Projects/Settings'
import RefreshProject from '../Components/Projects/RefreshProject'
import Search from '../Components/Projects/Search'

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar section – extracted from ProjectToolbar.jsx
// ─────────────────────────────────────────────────────────────────────────────
const StatChip = ({ label, value }) => (
  <span className="px-3 py-1 font-mono font-bold text-xs bg-card-bg border border-card-border">
    {label}: <strong>{value}</strong>
  </span>
)

const ToolbarSection = ({ project }) => {
  const {
    title,
    start_date: startDate,
    target_completion_date: endDate,
    wip_limit: wip,
    members = [],
    integrations = {},
  } = project

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : 'Not set'

  const activeMembersCount = members.length
  const activeIntegrationsCount = Object.values(integrations).filter(Boolean).length

  return (
    <nav
      className="
        mb-2 px-4 py-3 bg-card-bg
        border-[length:var(--border-width-base)] border-card-border border-solid
        font-mono
      "
    >
      {/* Main row: project info, stats, actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: project identity */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Integration status badge */}
          <div
            className="
              w-6 h-6 flex items-center justify-center rounded-full
              text-sm font-bold flex-shrink-0
            "
            style={{
              backgroundColor:
                activeIntegrationsCount > 0
                  ? 'var(--color-primary)'
                  : 'var(--color-role-admin)',
              color: 'var(--color-neutral-white)',
            }}
          >
            {activeIntegrationsCount > 0 ? '✓' : '!'}
          </div>

          {/* Title + dates */}
          <div className="min-w-0">
            <h5 className="font-bold text-sm truncate">{title}</h5>
            <span className="text-xs text-neutral-black/60">
              {formatDate(startDate)} — {formatDate(endDate)}
            </span>
          </div>
        </div>

        {/* Center: stat chips (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-2">
          <StatChip label="WIP" value={wip} />
          <StatChip label="Team" value={activeMembersCount} />
          <StatChip label="Systems" value={activeIntegrationsCount} />
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Notifications />
          <RefreshProject />
          <Search />
        </div>
      </div>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Metrics section – extracted from Metrics.jsx
// ─────────────────────────────────────────────────────────────────────────────
const WipControl = ({ value, onChange, onSubmit }) => (
  <div className="flex items-center justify-center gap-1 mt-2">
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={0}
      className="w-12 text-center border border-card-border rounded px-1 py-0.5 text-sm font-mono font-bold bg-neutral-white focus:outline-none focus:ring-1 focus:ring-sage"
    />
    <button
      onClick={onSubmit}
      className="bg-neutral-black text-neutral-white border-none rounded px-2 py-1 hover:opacity-80 transition-opacity duration-fast"
    >
      <img src={updateIcon} alt="Update WIP" className="w-4 h-4" />
    </button>
  </div>
)

const METRICS_CONFIG = [
  {
    id: 'wipLimit',
    title: 'WIP Limit',
    getValue: (project) => project?.wip_limit || 0,
    icon: wipIcon,
    tooltip: 'Set Work in Progress Limit',
    color: metricColors.wip,
    customContent: WipControl,
  },
  {
    id: 'leadTime',
    title: 'Lead Time',
    getValue: (_, m) =>
      !isNaN(m.currentAvgLeadTime) ? `${m.currentAvgLeadTime.toFixed(1)}d` : '0d',
    icon: leadTimeIcon,
    tooltip: 'Avg time from task creation to completion',
    color: metricColors.leadTime,
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    getValue: (project) =>
      project?.tasks?.filter((t) => t.status === 'in_progress')?.length || 0,
    icon: inProgressIcon,
    tooltip: 'Current tasks in progress',
    color: metricColors.inProgress,
  },
  {
    id: 'cycleTime',
    title: 'Cycle Time',
    getValue: (_, m) =>
      !isNaN(m.currentAvgCycleTime) ? `${m.currentAvgCycleTime.toFixed(1)}d` : '0d',
    icon: cycleTimeIcon,
    tooltip: "Avg time from 'In Progress' to 'Done'",
    color: metricColors.cycleTime,
  },
  {
    id: 'throughput',
    title: 'Throughput',
    getValue: (project) => {
      const done = project?.tasks?.filter((t) => t.status === 'done')?.length || 0
      return (done / 30).toFixed(1)
    },
    icon: doneIcon,
    tooltip: 'Avg tasks completed per day (30d window)',
    color: metricColors.throughput,
  },
  {
    id: 'flowEfficiency',
    title: 'Flow Eff.',
    getValue: (_, m) => {
      const eff = ((m.currentAvgCycleTime || 0) / (m.currentAvgLeadTime || 1)) * 100
      return `${eff.toFixed(0)}%`
    },
    icon: flowIcon,
    tooltip: 'Ratio of active work time to total lead time',
    color: metricColors.flowEfficiency,
  },
]

const MetricsSection = () => {
  const {
    currentAvgCycleTime,
    currentAvgLeadTime,
    currentProjectId,
    currentProject,
    updateWipMutation,
    posts,
    isPostsLoading,
  } = useProject()

  const [wipLimit, setWipLimit] = useState(currentProject?.wip_limit || 0)
  const [hoverStates, setHoverStates] = useState({})

  useEffect(() => {
    if (currentProject?.wip_limit) setWipLimit(currentProject.wip_limit)
  }, [currentProject])

  const handleWipSubmit = () => {
    if (currentProjectId) {
      updateWipMutation.mutate({ projectId: currentProjectId, wip: wipLimit })
    }
  }

  const handleHover = (key, val) =>
    setHoverStates((prev) => ({ ...prev, [key]: val }))

  const metrics = { currentAvgCycleTime, currentAvgLeadTime }

  const latestPost = posts
    ?.filter((p) => p?.author === currentProject?.createdBy)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.[0]

  return (
    <StyledCard
      hoverKey="metrics"
      hoverStates={hoverStates}
      handleHover={handleHover}
      className="h-[90vh] flex flex-col"
    >
      <div
        className="px-4 py-3 font-mono font-bold text-sm"
        style={{ borderBottom: 'var(--border-width-thick) solid var(--color-card-border)' }}
      >
        <h2 className="text-base font-bold">Project Metrics</h2>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {METRICS_CONFIG.map((metric) => (
            <div
              key={metric.id}
              className=" relative group"
              onMouseEnter={() => handleHover(metric.id, true)}
              onMouseLeave={() => handleHover(metric.id, false)}
            >
              <div
                className="metric-box flex flex-col items-center justify-center p-3 border-2 border-card-border transition-transform duration-200 hover:scale-105 hover:shadow-sm"
                style={{ backgroundColor: metric.color }}
              >
                <img src={metric.icon} alt={metric.title} className="w-7 h-7 mb-1" />
                <span className="font-mono font-bold text-xs mb-1 text-neutral-black">
                  {metric.title}
                </span>
                {metric.customContent ? (
                  <metric.customContent
                    value={wipLimit}
                    onChange={setWipLimit}
                    onSubmit={handleWipSubmit}
                  />
                ) : (
                  <span className="text-lg font-bold text-neutral-black">
                    {metric.getValue(currentProject, metrics)}
                  </span>
                )}
              </div>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-mono bg-neutral-black text-neutral-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                {metric.tooltip}
              </div>
            </div>
          ))}
        </div>

        {!isPostsLoading && (
          <div className="mt-5 p-3 h-32 overflow-y-auto font-mono text-sm bg-neutral-white border border-card-border">
            <strong className="text-xs uppercase tracking-wider text-neutral-black/60">
              Announcement
            </strong>
            <p className="font-bold mt-1">
              {latestPost?.title || 'No public announcement yet'}
            </p>
            {latestPost && (
              <>
                <p className="text-xs mt-1">{latestPost.contents}</p>
                <span className="block text-xs text-neutral-black/50 mt-1">
                  {new Date(latestPost.createdAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        )}

        <div className="mt-3 font-mono font-bold text-xs text-neutral-black/60">
          Total tasks: {currentProject?.tasks?.length || 0}
        </div>
      </div>
    </StyledCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main combined component – ProjectControllers
// ─────────────────────────────────────────────────────────────────────────────
export const ProjectControllers = () => {
  const { currentProject } = useProject()

  if (!currentProject) {
    return (
      <div className="p-4 text-center font-mono text-neutral-black/60">
        No project selected.
      </div>
    )
  }

  return (
    <div className="project-controllers">
      <ToolbarSection project={currentProject} />
      <MetricsSection />
    </div>
  )
}

export default ProjectControllers