// LifeOS API Client
// Uses Netlify Function proxy for authentication

const API_BASE = '/api/lifeos'

async function fetchLifeOS(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `LifeOS API error: ${response.status}`)
  }
  
  return response.json()
}

// Companies
export async function getCompanies(activeOnly = true) {
  return fetchLifeOS(`/getCompanies?activeOnly=${activeOnly}`)
}

// Tasks
export async function getTasks(params = {}) {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.companyId) query.set('companyId', params.companyId)
  if (params.projectId) query.set('projectId', params.projectId)
  if (params.includeCompleted) query.set('includeCompleted', 'true')
  if (params.limit) query.set('limit', params.limit)
  
  return fetchLifeOS(`/getTasks?${query}`)
}

export async function createTask(task) {
  return fetchLifeOS('/createTask', {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export async function updateTask(id, updates) {
  return fetchLifeOS(`/updateTask?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export async function completeTask(id) {
  return fetchLifeOS(`/completeTask?id=${id}`, {
    method: 'POST',
  })
}

export async function deleteTask(id) {
  return fetchLifeOS(`/deleteTask?id=${id}`, {
    method: 'DELETE',
  })
}

// Notes
export async function getNotes(params = {}) {
  const query = new URLSearchParams()
  if (params.companyId) query.set('companyId', params.companyId)
  if (params.projectId) query.set('projectId', params.projectId)
  if (params.limit) query.set('limit', params.limit)
  
  return fetchLifeOS(`/getNotes?${query}`)
}

export async function getNote(id) {
  return fetchLifeOS(`/getNote?id=${id}`)
}

export async function createNote(note) {
  return fetchLifeOS('/createNote', {
    method: 'POST',
    body: JSON.stringify(note),
  })
}

export async function updateNote(id, updates) {
  return fetchLifeOS(`/updateNote?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export async function deleteNote(id) {
  return fetchLifeOS(`/deleteNote?id=${id}`, {
    method: 'DELETE',
  })
}

// Projects
export async function getProjects(params = {}) {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.companyId) query.set('companyId', params.companyId)
  if (params.limit) query.set('limit', params.limit)
  
  return fetchLifeOS(`/getProjects?${query}`)
}

export async function createProject(project) {
  return fetchLifeOS('/createProject', {
    method: 'POST',
    body: JSON.stringify(project),
  })
}

export async function updateProject(id, updates) {
  return fetchLifeOS(`/updateProject?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

// Habits
export async function getHabits(activeOnly = true) {
  return fetchLifeOS(`/getHabits?activeOnly=${activeOnly}`)
}

export async function logHabit(habitId, date, completedCount = 1, note = '') {
  return fetchLifeOS('/logHabit', {
    method: 'POST',
    body: JSON.stringify({ habitId, date, completedCount, note }),
  })
}

// Life Areas
export async function getLifeAreas() {
  return fetchLifeOS('/getLifeAreas')
}
