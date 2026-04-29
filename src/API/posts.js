/**
 * posts.js  —  Supabase API layer for the Comments / Posts domain
 * ─────────────────────────────────────────────────────────────────
 * Schema alignment notes
 * ──────────────────────
 * Table: comments  (used as "posts" in the blog panel)
 *   Columns: id | task_id | project_id | author_id | content |
 *     is_system_generated | mentioned_users | created_at | updated_at
 *
 *   IMPORTANT field names — use these exactly when reading returned data:
 *     author_id  (NOT `author`)  — uuid → users.id
 *     content    (NOT `title` or `contents`) — the post body text
 *
 *   Distinction:
 *     task_id IS NULL   → project-level blog post  (fetched by getPosts)
 *     task_id IS NOT NULL → task comment           (fetched by getTaskPosts)
 *
 * Returned comment / post shape:
 * ───────────────────────────────
 * {
 *   id: string                        uuid
 *   task_id: string | null            null for project-level posts
 *   project_id: string                uuid → projects.id
 *   author_id: string                 uuid → users.id  (NOT `author`)
 *   content: string                   the post body  (NOT `title` or `contents`)
 *   is_system_generated: boolean
 *   mentioned_users: string[] | null  array of user uuids
 *   created_at: string                ISO timestamp
 *   updated_at: string
 * }
 *
 * Usage note for consumers:
 *   ✅  post.author_id       — correct author reference
 *   ✅  post.content         — correct body field
 *   ❌  post.author          — does not exist in schema
 *   ❌  post.title / post.contents — do not exist in schema
 *
 * ProjectControllers MetricsSection example (correct usage):
 *   const latestPost = posts
 *     ?.filter(p => p.author_id === currentProject?.created_by)
 *     ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))?.[0]
 *   → latestPost.content      (not latestPost.title or latestPost.contents)
 */
import supabase from '../../supabaseClient'

// ─── Project-level posts (blog panel) ─────────────────────────────────────────

/**
 * Fetches project-level posts (task_id IS NULL).
 *
 * @param {string} projectId
 * @param {object} opts
 * @param {string} [opts.author]     filter by author_id (uuid)
 * @param {string} [opts.sortBy]     DB column to sort by (default: 'created_at')
 * @param {string} [opts.sortOrder]  'asc' | 'desc' (default: 'desc')
 *
 * Returns: CommentRow[]  (see shape above — no title, use `content`)
 */
export const getPosts = async (
  projectId,
  { author, sortBy = 'created_at', sortOrder = 'desc' } = {}
) => {
  let query = supabase
    .from('comments')
    .select('*')
    .eq('project_id', projectId)
    .is('task_id', null)            // project-level posts have task_id = NULL

  if (author) query = query.eq('author_id', author)   // column is author_id

  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query
  if (error) throw new Error('Failed to fetch posts')
  return data
}

/**
 * Fetches all comments for a specific task, ordered oldest-first (thread view).
 * Returns: CommentRow[]
 */
export const getTaskPosts = async (projectId, taskId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('project_id', projectId)
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })

  if (error) throw new Error('Failed to fetch task posts')
  return data
}

/**
 * Fetches a single comment/post by id.
 * Returns: CommentRow | null
 */
export const getPostById = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('id', postId)
    .single()

  if (error) throw new Error('Failed to fetch post')
  return data
}

/**
 * Creates a project-level post (blog entry, announcement).
 * Sets task_id to NULL so it appears in the blog panel, not on a task.
 *
 * Consumed shape (postData):
 * {
 *   content: string               required — the post body
 *   mentioned_users?: string[]    optional array of user uuids to @mention
 *   is_system_generated?: boolean defaults to false
 * }
 *
 * @param {string} projectId  uuid of the project
 * @param {string} authorId   uuid of the authenticated user (author_id NOT NULL)
 * @param {object} postData   see shape above
 *
 * Returns: created CommentRow (see shape at top of file)
 */
export const createPost = async (projectId, authorId, postData) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      content:              postData.content,
      mentioned_users:      postData.mentioned_users ?? null,
      is_system_generated:  postData.is_system_generated ?? false,
      author_id:            authorId,      // column is author_id, not author
      project_id:           projectId,
      task_id:              null,          // null = project-level post
    })
    .select()
    .single()

  if (error) throw new Error('Failed to create post')
  return data
}

/**
 * Creates a comment on a specific task.
 *
 * @param {string} projectId  uuid
 * @param {string} taskId     uuid of the parent task
 * @param {string} authorId   uuid of the authenticated user
 * @param {object} postData   { content, mentioned_users? }
 * Returns: created CommentRow
 */
export const createTaskPost = async (projectId, taskId, authorId, postData) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      content:              postData.content,
      mentioned_users:      postData.mentioned_users ?? null,
      is_system_generated:  postData.is_system_generated ?? false,
      author_id:            authorId,
      project_id:           projectId,
      task_id:              taskId,
    })
    .select()
    .single()

  if (error) throw new Error('Failed to create task post')
  return data
}

/**
 * Updates a comment's content and/or mentioned_users.
 * Returns: updated CommentRow
 */
export const updatePost = async (postId, postData) => {
  const { data, error } = await supabase
    .from('comments')
    .update({
      content:         postData.content,
      mentioned_users: postData.mentioned_users ?? undefined,
    })
    .eq('id', postId)
    .select()
    .single()

  if (error) throw new Error('Failed to update post')
  return data
}

export const deletePost = async (postId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', postId)

  if (error) throw new Error('Failed to delete post')
}

/**
 * Fetches the most recent project-level post by a specific author.
 * Useful for displaying the PM's latest announcement in the metrics panel.
 * NOTE: filter uses author_id (not `author`) — projects use created_by (not `createdBy`).
 *
 * @param {string} projectId  uuid
 * @param {string} authorId   uuid of the user (typically currentProject.created_by)
 * Returns: CommentRow | null
 */
export const getLastPostByAuthor = async (projectId, authorId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('project_id', projectId)
    .eq('author_id', authorId)          // column is author_id, not author
    .is('task_id', null)                // project-level posts only
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) throw new Error('Failed to fetch latest post')
  return data[0] ?? null
}