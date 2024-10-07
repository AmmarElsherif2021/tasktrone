// Get projects
export const listProjects = async (queryParams) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects?` +
        new URLSearchParams(queryParams),
    )
    if (!res.ok) {
      throw new Error(`Error fetching projects: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error listing projects:', error)
    throw error
  }
}

// Create new Project
export const createProject = async (token, Project) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Project),
    })
    if (!res.ok) {
      throw new Error(`Error creating Project: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error creating Project:', error)
    throw error
  }
}
//   export const changeProjectPhase = async (token, projectId, phase) => {
//     try {
//       // Log the token and projectId for debugging purposes
//       console.log('Token:', token)
//       console.log('Project ID:', projectId)

//       // Make the PATCH request to update the Project phase
//       const res = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/phase`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`, // Ensure the token is correctly formatted
//           },
//           body: JSON.stringify({ phase }),
//         },
//       )

//       // Check if the response is not OK and throw an error if so
//       if (!res.ok) {
//         throw new Error(`Error patching Project: ${res.statusText}`)
//       }

//       // Return the JSON response
//       return await res.json()
//     } catch (error) {
//       // Log the error for debugging purposes
//       console.error('Error patching Project:', error)
//       throw error
//     }
//   }
