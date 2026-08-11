/**
 * users.js  —  Supabase API layer for the Users domain
 * ─────────────────────────────────────────────────────────────
 * Schema alignment notes
 * ──────────────────────
 * Table: users
 *   Columns: id | username | email | full_name | role | team |
 *     department | phone | is_active | created_at | updated_at
 *
 *   IMPORTANT: users table has NO `projects` array column.
 *   Project associations are stored in the project_members table.
 *   UserHomeContext fetches project membership via project_members separately.
 *
 *   role → user_role enum (maps to abstract RBAC roles):
 *     design_engineer      → abstract: Design Lead
 *     cad_technician       → abstract: Design Lead
 *     cnc_programmer       → abstract: Execution Worker
 *     manufacturing_engineer → abstract: Execution Worker
 *     machinist            → abstract: Execution Worker
 *     machine_operator     → abstract: Execution Worker
 *     production_supervisor → abstract: Planner / Scheduler
 *     qc_inspector         → abstract: Quality Gatekeeper
 *     metrology_engineer   → abstract: Quality Gatekeeper
 *     inventory_manager    → abstract: Logistics / Handoff
 *     production_planner   → abstract: Planner / Scheduler
 *     maintenance_technician → abstract: Maintenance
 *     hr_personnel         → abstract: Observer
 *     logistics_coordinator → abstract: Logistics / Handoff
 *
 *   team → team_type enum:
 *     design_team | manufacturing_team | quality_control_team | support_teams
 *
 * Returned user shape (from getUserInfo / getAllUsers):
 * ─────────────────────────────────────────────────────
 * {
 *   id: string           uuid (= auth.uid())
 *   username: string
 *   email: string
 *   full_name: string
 *   role: user_role      see enum above
 *   team: team_type
 *   department: string | null
 *   phone: string | null
 *   is_active: boolean
 *   created_at: string
 *   updated_at: string
 * }
 *
 * NOTE: getUserInfo does NOT return a `projects` field — projects must be
 * fetched via listProjects (project_members join). Any code reading
 * `user.projects` will receive undefined.
 */
import supabase from '../lib/supabaseClient'

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Signs up a new user with email/password.
 * Immediately signs in if the confirmation flow returns no session.
 * Returns: Supabase auth session data
 */
export const signup = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)

  if (!data.session) {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password })
    if (signInError) throw new Error(signInError.message)
    return signInData
  }

  return data
}

/**
 * Returns: Supabase auth session data { session, user }
 */
export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return data
}

/**
 * Initiates Google OAuth flow (redirects the browser).
 * @param {string} redirectTo  URL to return to after OAuth completes
 */
export const signInWithGoogle = async (redirectTo = window.location.origin) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: { access_type: 'offline', prompt: 'select_account' },
    },
  })
  if (error) throw new Error(error.message)
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

// ─── Profile ──────────────────────────────────────────────────────────────────

/**
 * Upserts the public.users row after OAuth sign-in.
 * Maps every NOT NULL column in the users table.
 *
 * Consumed shape (profileData):
 * {
 *   username?: string              auto-generated from email if omitted
 *   full_name?: string             falls back to OAuth user_metadata
 *   role?: user_role               defaults to 'machine_operator'
 *   team?: team_type               defaults to 'support_teams'
 *   department?: string | null
 *   phone?: string | null
 * }
 *
 * Returns: { success: true }
 */
export const completeOAuthProfile = async (profileData) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw new Error('Not authenticated')
  if (!user)    throw new Error('No user found')

  const username =
    profileData.username ??
    `${user.email.split('@')[0]}${Math.floor(Math.random() * 1000)}`

  const { error: profileError } = await supabase
    .from('users')
    .upsert(
      {
        id:         user.id,
        email:      user.email,
        username,
        full_name:
          profileData.full_name ??
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          '',
        role:       profileData.role ?? 'machine_operator',   // user_role enum
        team:       profileData.team ?? 'support_teams',      // team_type enum
        department: profileData.department ?? null,
        phone:      profileData.phone ?? user.user_metadata?.phone ?? null,
        is_active:  true,
      },
      { onConflict: 'id' }
    )

  if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`)
  return { success: true }
}

/**
 * Checks whether a user row exists in public.users and all required fields are filled.
 *
 * Returns: { needsCompletion: boolean, profile: UserRow | null }
 * profile shape: { id, username, role, team, full_name }
 */
export const checkUserProfileStatus = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, role, team, full_name')
      .eq('id', userId)
      .single()

    if (error?.code === 'PGRST116') return { needsCompletion: true, profile: null }
    if (error) throw error

    const needsCompletion = !data.username || !data.role || !data.team
    return { needsCompletion, profile: data }
  } catch (err) {
    console.error('Error checking profile status:', err)
    return { needsCompletion: true, profile: null }
  }
}

/**
 * Checks whether an OAuth user already has a public profile.
 * Returns: { needsCompletion: boolean, profile: { id, username, role, team } | null }
 */
export const createOAuthUserProfile = async (user) => {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, username, role, team')
      .eq('id', user.id)
      .single()

    if (existingUser) {
      const needsCompletion = !existingUser.username || !existingUser.role || !existingUser.team
      return { needsCompletion, profile: existingUser }
    }

    return { needsCompletion: true, profile: null }
  } catch (err) {
    console.error('Error in createOAuthUserProfile:', err)
    return { needsCompletion: true, profile: null }
  }
}

// ─── User queries ─────────────────────────────────────────────────────────────

/**
 * Returns a single user's profile by auth uuid.
 * NOTE: No `projects` field is returned — the users table has no such column.
 *       Project membership must be resolved via listProjects() (project_members join).
 *
 * Returns: UserRow | null
 * {
 *   id, username, email, full_name,
 *   role: user_role,
 *   team: team_type,
 *   department, phone, is_active, created_at, updated_at
 * }
 */
export const getUserInfo = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(
        'id, username, email, full_name, role, team, department, phone, is_active, created_at, updated_at'
      )
      .eq('id', userId)
      .single()

    if (error?.code === 'PGRST116') return null
    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('Error in getUserInfo:', err)
    return null
  }
}

/**
 * Returns all active users, ordered by full_name.
 * Used for member-picker dropdowns.
 *
 * Returns: Array<{
 *   id, username, email, full_name,
 *   role: user_role,
 *   team: team_type,
 *   department, is_active
 * }>
 */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, full_name, role, team, department, is_active')
    .eq('is_active', true)
    .order('full_name')

  if (error) throw new Error(error.message)
  return data
}

/**
 * Returns the public URL for a user's avatar from the 'avatars' storage bucket.
 * The file is expected at: avatars/{userId}/avatar.png
 * Returns: string (URL — may 404 if no avatar has been uploaded)
 */
export const getUserProfileImage = async (userId) => {
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}/avatar.png`)
  return data.publicUrl
}