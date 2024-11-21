// Get projects
export const listProjects = async (queryParams = {}, token) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects?` +
        new URLSearchParams(queryParams),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Error fetching projects: ${errorText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error listing projects:', error)
    throw error
  }
}

// Create new Project
export const createProject = async (token, projectData) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    })
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Error creating Project: ${errorText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error creating Project:', error)
    throw error
  }
}

// Get project by ID
export const getProjectById = async (projectId, token) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Error fetching project: ${errorText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error fetching project:', error)
    throw error
  }
}

// Update project
export const updateProject = async (projectId, token, projectData) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      },
    )
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Error updating project: ${errorText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

// Delete project
export const deleteProject = async (projectId, token) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Error deleting project: ${errorText}`)
    }
    return null
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}
