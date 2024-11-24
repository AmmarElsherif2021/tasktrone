export const signup = async ({ username, password, email, team, role }) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email, team, role }),
  })
  if (!res.ok) throw new Error('failed to sign up')
  return await res.json()
}

export const login = async ({ username, password }) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('failed to login')
  return await res.json()
}

export const getUserInfo = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  return await res.json()
}

export const getAllUsers = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to fetch users')
  const data = await res.json()

  if (Array.isArray(data)) {
    return data
  } else if (data.users && Array.isArray(data.users)) {
    return data.users
  } else if (
    typeof data === 'object' &&
    Object.values(data).every((item) => item?.username)
  ) {
    return Object.values(data)
  }

  console.error('Unexpected users data format:', data)
  return []
}
