//get tasks
export const listTasks = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/tasks?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}

// create new one
export const createTask = async (token, task) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  })
  return await res.json()
}
