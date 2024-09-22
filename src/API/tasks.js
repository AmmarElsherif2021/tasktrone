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
export const changeTaskPhase = async (token, taskId, phase) => {
  try {
    // Log the token and taskId for debugging purposes
    console.log('Token:', token)
    console.log('Task ID:', taskId)

    // Make the PATCH request to update the task phase
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}/phase`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ensure the token is correctly formatted
        },
        body: JSON.stringify({ phase }),
      },
    )

    // Check if the response is not OK and throw an error if so
    if (!res.ok) {
      throw new Error(`Error patching task: ${res.statusText}`)
    }

    // Return the JSON response
    return await res.json()
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error patching task:', error)
    throw error
  }
}
