/**
 * projects.js  —  Supabase API layer for the Projects domain
 * ─────────────────────────────────────────────────────────────
 * Schema alignment notes
 * ──────────────────────
 * Table: projects
 *   Columns: id | title | description | customer | start_date |
 *     target_completion_date | actual_completion_date | current_phase |
 *     priority | status | budget | created_by | project_manager |
 *     created_at | updated_at
 *   NOTE: NO wip_limit column on projects — wip_limit lives on boards.
 *
 * Table: project_members
 *   Columns: project_id | user_id | role | joined_at
 *   role enum → project_member_role_enum:
 *     coordinator | lead | contributor | reviewer | observer
 *   Convention: creator is inserted as 'lead' (Project Owner in RBAC).
 *   Default for invited members: 'contributor' (Execution Worker).
 *
 * Table: boards
 *   Columns: id | project_id | name | description | phase |
 *     board_type | is_active | wip_limit | created_at | updated_at
 *   phase → manufacturing_phase enum
 *   wip_limit is the authoritative source for project-level WIP display.
 *
 * Table: users
 *   role → user_role enum (design_engineer | cad_technician | cnc_programmer |
 *     manufacturing_engineer | machinist | machine_operator |
 *     production_supervisor | qc_inspector | metrology_engineer |
 *     inventory_manager | production_planner | maintenance_technician |
 *     hr_personnel | logistics_coordinator)
 *
 * Returned project shape (enriched, from getProjectById):
 * ───────────────────────────────────────────────────────
 * {
 *   id: string                         uuid
 *   title: string
 *   description: string | null
 *   customer: string | null
 *   start_date: string | null          ISO date
 *   target_completion_date: string | null
 *   actual_completion_date: string | null
 *   current_phase: manufacturing_phase  (= the project's active phase gate)
 *   priority: priority_level           low | medium | high | critical
 *   status: project_status             active | completed | on_hold | cancelled
 *   budget: number | null
 *   created_by: string                 uuid → users.id
 *   project_manager: string            uuid → users.id
 *   created_at: string
 *   updated_at: string
 *   boards: Board[]                    all boards for this project
 *   wip_limit: number                  derived from active board (default 5)
 *   active_board_id: string | null     uuid of the is_active board
 *   members: ProjectMember[]
 * }
 *
 * Board {
 *   id: string
 *   name: string
 *   phase: manufacturing_phase
 *   board_type: board_type_enum        standard | multi_team | specialized
 *   is_active: boolean
 *   wip_limit: number
 * }
 *
 * ProjectMember {
 *   user_id: string
 *   role: project_member_role_enum     coordinator | lead | contributor | reviewer | observer
 *   username: string
 *   full_name: string
 *   team: team_type                    design_team | manufacturing_team |
 *                                      quality_control_team | support_teams
 *   user_role: user_role               design_engineer | qc_inspector | ...
 *   joined_at: string
 * }
 */
import supabase from '../lib/supabaseClient'

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * Lists all projects where the authenticated user is a member.
 * Covers both creator and invited-member cases via project_members.
 *
 * Returns: Array<project row + my_role + joined_at>
 */
export const listProjects = async (userId) => {
  const { data, error } = await supabase
    .from('project_members')
    .select(`
      role,
      joined_at,
      projects (*)
    `)
    .eq('user_id', userId)

  if (error) throw new Error(`Error fetching projects: ${error.message}`)

  return data.map(({ role, joined_at, projects }) => ({
    ...projects,
    my_role: role,     // project_member_role_enum
    joined_at,
  }))
}

/**
 * Fetches a single project with its members and all boards.
 * The caller (ProjectContext) derives wip_limit and active_board_id from boards[].
 *
 * Returns: raw Supabase row — see enriched shape in ProjectContext select transform.
 */
export const getProjectById = async (projectId) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_members (
        role,
        joined_at,
        user:users (
          id,
          username,
          full_name,
          email,
          team,
          role
        )
      ),
      boards (
        id,
        name,
        phase,
        board_type,
        is_active,
        wip_limit,
        created_at,
        updated_at
      )
    `)
    .eq('id', projectId)
    .single()

  if (error) throw new Error(`Error fetching project: ${error.message}`)
  return data
}

/**
 * Creates a project, its default board, and inserts project_members.
 *
 * Consumed shape (projectData):
 * {
 *   title: string                       required
 *   description?: string
 *   customer?: string
 *   start_date?: string | null          ISO date
 *   target_completion_date?: string | null
 *   current_phase?: manufacturing_phase  defaults to 'concept_design'
 *   priority?: priority_level            defaults to 'medium'
 *   budget?: number | null
 *   wip_limit?: number                   applied to the default board, defaults to 5
 *   created_by: string                   required — uuid of the creating user
 *   project_manager?: string             defaults to created_by
 *   members?: Array<{
 *     user_id: string
 *     role: project_member_role_enum     coordinator | lead | contributor | reviewer | observer
 *   }>
 * }
 *
 * Returns: project row + board_id (uuid of the created default board)
 */
// ── date strings from <input type="date"> arrive as "YYYY-MM-DD"
// Supabase/Postgres accepts ISO 8601 directly, but to be explicit:
const toISO = (d) => (d ? new Date(d).toISOString() : null)

export const createProject = async (projectData) => {
  const { data, error } = await supabase.rpc('create_project_with_board', {
    p_title:                  projectData.title,
    p_description:            projectData.description ?? null,
    p_customer:               projectData.customer ?? null,
    p_start_date:             projectData.start_date ? new Date(projectData.start_date).toISOString() : null,
    p_target_completion_date: projectData.target_completion_date ? new Date(projectData.target_completion_date).toISOString() : null,
    p_current_phase:          projectData.current_phase ?? 'concept_design',
    p_priority:               projectData.priority ?? 'medium',
    p_budget:                 projectData.budget ?? null,
    p_wip_limit:              projectData.wip_limit ?? 5,
    p_created_by:             projectData.created_by,
    p_project_manager:        projectData.project_manager ?? null,
    p_members:                projectData.members ?? [],
  });

  if (error) throw new Error(`Error creating project: ${error.message}`);

  return {
    ...data.project,        // project row
    board_id: data.board_id // uuid of the newly created board
  };
};
/**
 * Partial update of a project row.
 * Only pass the fields you want to change.
 * NOTE: wip_limit is NOT a column on projects — use updateBoardWipLimit() for that.
 *
 * Accepted updates: title | description | customer | start_date |
 *   target_completion_date | actual_completion_date | current_phase |
 *   priority | status | budget | project_manager
 *
 * Returns: updated project row
 */
export const updateProject = async (projectId, updates) => {
  // Guard: silently strip wip_limit so we don't confuse the Supabase error
  // with a schema issue. Use updateBoardWipLimit() to change WIP.
  const { wip_limit: _ignored, ...safeUpdates } = updates

  if (_ignored !== undefined) {
    console.warn(
      'updateProject: wip_limit is not a projects column — use updateBoardWipLimit() instead.'
    )
  }

  const { data, error } = await supabase
    .from('projects')
    .update(safeUpdates)
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw new Error(`Error updating project: ${error.message}`)
  return data
}

export const deleteProject = async (projectId) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) throw new Error(`Error deleting project: ${error.message}`)
}

// ─── Boards ───────────────────────────────────────────────────────────────────

/**
 * Returns all boards for a project.
 * Boards shape: { id, name, phase, board_type, is_active, wip_limit, ... }
 */
export const getProjectBoards = async (projectId) => {
  const { data, error } = await supabase
    .from('boards')
    .select('id, name, phase, board_type, is_active, wip_limit, created_at, updated_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Error fetching boards: ${error.message}`)
  return data
}

/**
 * Updates the wip_limit on a specific board.
 * This is the correct mutation for WIP changes — not updateProject().
 *
 * @param {string} boardId  uuid of the target board
 * @param {number} wip      new WIP limit (>= 1)
 * Returns: updated board row
 */
export const updateBoardWipLimit = async (boardId, wip) => {
  const { data, error } = await supabase
    .from('boards')
    .update({ wip_limit: wip })
    .eq('id', boardId)
    .select()
    .single()

  if (error) throw new Error(`Error updating WIP limit: ${error.message}`)
  return data
}

// ─── Project Members ──────────────────────────────────────────────────────────

/**
 * Adds a member to a project.
 * @param {string} role  project_member_role_enum:
 *                       coordinator | lead | contributor | reviewer | observer
 */
export const addProjectMember = async (projectId, userId, role = 'contributor') => {
  const { data, error } = await supabase
    .from('project_members')
    .insert({ project_id: projectId, user_id: userId, role })
    .select()
    .single()

  if (error) throw new Error(`Error adding project member: ${error.message}`)
  return data
}

export const removeProjectMember = async (projectId, userId) => {
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId)

  if (error) throw new Error(`Error removing project member: ${error.message}`)
}

/**
 * @param {string} role  project_member_role_enum value
 */
export const updateProjectMemberRole = async (projectId, userId, role) => {
  const { data, error } = await supabase
    .from('project_members')
    .update({ role })
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(`Error updating member role: ${error.message}`)
  return data
}

// Kept for backward-compat — cycle time is computed via DB triggers/derived metrics
export const updateTasksCycleTime = async () => {
  console.warn('Cycle time updates are handled via database triggers')
  return []
}