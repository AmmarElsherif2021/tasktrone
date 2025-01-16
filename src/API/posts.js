export const getPosts = async (token, projectId, queryParams = {}) => {
  const searchParams = new URLSearchParams(queryParams)

  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/projects/${projectId}/posts?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  console.log(`API ------------------------ ${JSON.stringify(res)}`)
  return await res.json()
}

// Get posts for a specific task
export const getTaskPosts = async (
  token,
  projectId,
  taskId,
  queryParams = {},
) => {
  const searchParams = new URLSearchParams(queryParams)

  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }projects/${projectId}/tasks/${taskId}/posts?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch task posts')
  }

  return await res.json()
}

// Get a specific post by ID
export const getPostById = async (token, projectId, postId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/posts/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch post')
  }

  return await res.json()
}

// Create a project-level post
export const createPost = async (token, projectId, postData) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/posts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    },
  )

  if (!res.ok) {
    throw new Error('Failed to create post')
  }

  return await res.json()
}

// Create a task-level post
export const createTaskPost = async (token, projectId, taskId, postData) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/posts/${taskId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    },
  )

  if (!res.ok) {
    throw new Error('Failed to create task post')
  }

  return await res.json()
}

// Update a post
export const updatePost = async (token, postId, postData) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    },
  )

  if (!res.ok) {
    throw new Error('Failed to update post')
  }

  return await res.json()
}

// Delete a post
export const deletePost = async (token, postId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to delete post')
  }

  return res
}
