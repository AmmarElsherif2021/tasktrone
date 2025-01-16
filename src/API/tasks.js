// Get tasks
export const listTasks = async (projectId, queryParams) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/tasks?` +
        new URLSearchParams(queryParams),
    )
    if (!res.ok) {
      throw new Error(`Error fetching tasks: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error listing tasks:', error)
    throw error
  }
}
//Get specific task by Id
export const getTaskById = async (taskId, projectId, token) => {
  try {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/projects/${projectId}/tasks/${taskId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!res.ok) {
      throw new Error(
        `Error retrieving task with id ${taskId}: ${res.statusText}`,
      )
    }
    return await res.json()
  } catch (err) {
    console.error(`Error retrieving task with id ${taskId}: ${err}`)
    throw err
  }
}
// Create new task
export const createTask = async (token, projectId, task) => {
  console.log(`task from api ${JSON.stringify(task)}`)
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/tasks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      },
    )
    if (!res.ok) {
      throw new Error(`Error creating task: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

//update task
export const updateTask = async (token, projectId, taskId, updates) => {
  try {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/projects/${projectId}/tasks/${taskId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      },
    )
    if (!res.ok) {
      throw new Error(`Error updating task: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const uploadTaskAttachment = async (token, taskId, file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/projects/tasks/${taskId}/attachments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    )

    if (!res.ok) {
      throw new Error(`Error uploading attachment: ${res.statusText}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error uploading attachment:', error)
    throw error
  }
}
// Delete a post
export const deleteTask = async (token, projectId, taskId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/tasks/${taskId}`,
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
