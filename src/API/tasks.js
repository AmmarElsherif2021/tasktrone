// Get tasks
export const listTasks = async (queryParams) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/tasks?` +
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

// Create new task
export const createTask = async (token, task) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    })
    if (!res.ok) {
      throw new Error(`Error creating task: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

// Update task phase
export const changeTaskPhase = async (token, taskId, phase) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}/phase`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phase }),
      },
    )
    if (!res.ok) {
      throw new Error(`Error patching task: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error patching task:', error)
    throw error
  }
}
