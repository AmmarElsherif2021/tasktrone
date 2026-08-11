/**
 * tasks.js  —  Supabase API layer for the Tasks domain
 * ─────────────────────────────────────────────────────────────
 * Schema alignment notes
 * ──────────────────────
 * Table: tasks
 *   Columns: id | project_id | board_id | column_id | title | description |
 *     task_number | task_category | phase | status | priority |
 *     estimated_hours | actual_hours | due_date | start_date |
 *     completion_date | lead_time | cycle_time | position |
 *     parent_task_id | created_by | assigned_to | created_at | updated_at
 *
 *   task_category → task_category_enum (NOT task_type — that column does not exist):
 *     cad_models | design_specifications | bom | change_requests |
 *     cnc_programming | tool_instructions | process_plans | production_layouts |
 *     improvement_reports | machined_parts | tool_logs | production_output |
 *     setup_documentation | production_schedules | performance_records |
 *     inspections | calibration_records | spc_charts | inventory_reports |
 *     order_processing | vendor_reports | capacity_planning | maintenance_logs |
 *     equipment_schedules | employee_records | shipment_schedules | logistics_reports
 *
 *   phase → manufacturing_phase enum  (Layer 3 / Product Line):
 *     concept_design | prototyping | pre_production_planning | production |
 *     quality_control | assembly_testing | packaging_shipping | maintenance_support
 *
 *   status → task_status enum  (Kanban column / abstract workflow phase):
 *     todo | in_progress | review | done
 *     Maps to abstract phases: Pending → Active → Inspection → Completed
 *
 *   priority → priority_level: low | medium | high | critical
 *
 * Table: task_members
 *   Columns: task_id | user_id | role | assigned_at
 *   role → task_assignment_role_enum:
 *     primary_assignee | reviewer | supporter | approver
 *
 * Table: task_requirements
 *   Columns: id | task_id | requirement_type | description |
 *     file_types | is_mandatory | is_completed | completed_at | created_at
 *   requirement_type → requirement_type_enum:
 *     input_file | output_file | specification | documentation |
 *     inspection_report | test_result
 *
 * Returned task shape (from listTasks / getTaskById):
 * ────────────────────────────────────────────────────
 * {
 *   id: string                         uuid
 *   project_id: string                 uuid → projects.id
 *   board_id: string | null            uuid → boards.id
 *   column_id: string | null           uuid → board_columns.id
 *   title: string
 *   description: string | null
 *   task_number: string                e.g. "TASK-00042"
 *   task_category: task_category_enum
 *   phase: manufacturing_phase         product line layer (Layer 3)
 *   status: task_status                kanban column (todo|in_progress|review|done)
 *   priority: priority_level
 *   estimated_hours: number | null
 *   actual_hours: number | null
 *   due_date: string | null
 *   start_date: string | null
 *   completion_date: string | null
 *   lead_time: number | null           days from creation to done
 *   cycle_time: number | null          days from in_progress to done
 *   position: number | null
 *   parent_task_id: string | null
 *   created_by: string                 uuid → users.id
 *   assigned_to: string | null         uuid → users.id
 *   created_at: string
 *   updated_at: string
 *   task_members: TaskMember[]
 *   task_requirements: TaskRequirement[]
 * }
 *
 * TaskMember {
 *   task_id: string
 *   user_id: string
 *   role: task_assignment_role_enum    primary_assignee | reviewer | supporter | approver
 *   assigned_at: string
 * }
 *
 * TaskRequirement {
 *   id: string
 *   task_id: string
 *   requirement_type: requirement_type_enum
 *   description: string
 *   file_types: string[] | null        accepted file extensions
 *   is_mandatory: boolean
 *   is_completed: boolean
 *   completed_at: string | null
 *   created_at: string
 * }
 */
import supabase from '../lib/supabaseClient'

// ─── Tasks ────────────────────────────────────────────────────────────────────

/**
 * Lists all tasks for a project, including members and requirements.
 * Results are ordered by most recently created first.
 *
 * @param {string} projectId  uuid of the project
 * Returns: TaskRow[]  (see full shape above)
 */
export const listTasks = async (projectId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      task_members (
        user_id,
        role,
        assigned_at
      ),
      task_requirements (
        id,
        requirement_type,
        description,
        file_types,
        is_mandatory,
        is_completed,
        completed_at,
        created_at
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Error fetching tasks: ${error.message}`)
  return data
}

/**
 * Fetches a single task by id, including members and requirements.
 * Returns: TaskRow (see full shape above)
 */
export const getTaskById = async (taskId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      task_members (
        user_id,
        role,
        assigned_at
      ),
      task_requirements (
        id,
        requirement_type,
        description,
        file_types,
        is_mandatory,
        is_completed,
        completed_at,
        created_at
      )
    `)
    .eq('id', taskId)
    .single()

  if (error) throw new Error(`Error retrieving task: ${error.message}`)
  return data
}

/**
 * Creates a task row, then inserts task_members rows in sequence.
 *
 * Required fields (NOT NULL without DB defaults):
 *   board_id:      uuid of the target board  (use active board from ProjectContext)
 *   task_number:   unique string, e.g. "TASK-00042"
 *   task_category: task_category_enum value  (NOT task_type — column does not exist)
 *   phase:         manufacturing_phase enum  (product-line context, e.g. 'production')
 *   status:        task_status enum          defaults to 'todo' on new tasks
 *   created_by:    uuid of the authenticated user
 *
 * Optional fields:
 *   title, description, priority (default 'medium'), estimated_hours,
 *   actual_hours, due_date, start_date, lead_time, cycle_time,
 *   position, parent_task_id, assigned_to
 *
 * @param {string} projectId  uuid of the project
 * @param {object} task       task fields (required + optional, see above)
 * @param {Array}  members    [{ user_id: string, role: task_assignment_role_enum }]
 *                            role values: primary_assignee | reviewer | supporter | approver
 *
 * Returns: created task row (without joined relations)
 */
export const createTask = async (projectId, task, members = []) => {
  // 1 ── Insert the task
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...task, project_id: projectId })
    .select()
    .single()

  if (error) throw new Error(`Error creating task: ${error.message}`)

  // 2 ── Insert task_members if any
  //      role must be task_assignment_role_enum: primary_assignee | reviewer | supporter | approver
  if (members.length > 0) {
    const memberRows = members.map(({ user_id, role }) => ({
      task_id: data.id,
      user_id,
      role,
    }))

    const { error: membersError } = await supabase
      .from('task_members')
      .insert(memberRows)

    if (membersError) {
      console.warn('Task created but members could not be saved:', membersError.message)
    }
  }

  return data
}

/**
 * Partially updates a task row.
 * Only pass the fields you want to change.
 * NOTE: task_category is the correct column name — task_type does not exist.
 *
 * Returns: updated task row (without joined relations)
 */
export const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw new Error(`Error updating task: ${error.message}`)
  return data
}

export const deleteTask = async (taskId) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw new Error('Failed to delete task')
}

// ─── Task Members ─────────────────────────────────────────────────────────────

/**
 * @param {string} role  task_assignment_role_enum:
 *                       primary_assignee | reviewer | supporter | approver
 */
export const addTaskMember = async (taskId, userId, role) => {
  const { data, error } = await supabase
    .from('task_members')
    .insert({ task_id: taskId, user_id: userId, role })
    .select()
    .single()

  if (error) throw new Error(`Error adding task member: ${error.message}`)
  return data
}

export const removeTaskMember = async (taskId, userId) => {
  const { error } = await supabase
    .from('task_members')
    .delete()
    .eq('task_id', taskId)
    .eq('user_id', userId)

  if (error) throw new Error(`Error removing task member: ${error.message}`)
}

/**
 * @param {string} role  task_assignment_role_enum value
 */
export const updateTaskMemberRole = async (taskId, userId, role) => {
  const { data, error } = await supabase
    .from('task_members')
    .update({ role })
    .eq('task_id', taskId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(`Error updating task member role: ${error.message}`)
  return data
}

// ─── Task Requirements ────────────────────────────────────────────────────────

/**
 * Marks a requirement as completed.
 * Returns: updated requirement row
 */
export const completeTaskRequirement = async (requirementId) => {
  const { data, error } = await supabase
    .from('task_requirements')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('id', requirementId)
    .select()
    .single()

  if (error) throw new Error(`Error completing requirement: ${error.message}`)
  return data
}

// ─── Attachments ──────────────────────────────────────────────────────────────

/**
 * Uploads a file to storage and inserts an attachments row.
 *
 * file_type → file_type_enum: cad | cnc | pdf | spreadsheet | document | image | other
 * file_category → file_category_enum: design | manufacturing | quality_control |
 *   specification | process | instruction | report | inventory | logistics
 *
 * @param {string} taskId     uuid of the parent task
 * @param {File}   file       browser File object
 * @param {string} uploadedBy uuid of the authenticated user (NOT NULL constraint)
 * Returns: inserted attachments row
 */
export const uploadTaskAttachment = async (taskId, file, uploadedBy) => {
  const fileExt  = file.name.split('.').pop()
  const fileName = `${taskId}-${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('task-attachments')
    .upload(fileName, file)

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

  const FILE_TYPE_MAP = {
    'application/pdf':    'pdf',
    'image/png':          'image',
    'image/jpeg':         'image',
    'image/webp':         'image',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
    'application/vnd.ms-excel': 'spreadsheet',
  }
  const mappedType = FILE_TYPE_MAP[file.type] ?? 'other'

  const { data, error } = await supabase
    .from('attachments')
    .insert({
      task_id:       taskId,
      file_name:     fileName,
      original_name: file.name,
      file_type:     mappedType,       // file_type_enum
      file_category: 'design',         // file_category_enum — default; caller can override
      file_size:     file.size,
      storage_path:  fileName,
      uploaded_by:   uploadedBy,       // NOT NULL — must be an authenticated user uuid
      version:       1,
      is_latest:     true,
    })
    .select()
    .single()

  if (error) throw new Error(`Attachment record failed: ${error.message}`)
  return data
}