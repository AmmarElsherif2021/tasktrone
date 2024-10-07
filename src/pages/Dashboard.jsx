import { User } from '../Components/User/User'
import { CreateProject } from '../Components/Projects/CreateProject'
import { Fragment } from 'react'
import { ProjectCard } from '../Components/Projects/ProjectCard'
import { listProjects } from '../API/projects'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'

export function Dashboard() {
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token)
      const userId = decoded.sub // Assuming 'sub' contains the user ID
      const userName = decoded.name // Assuming 'name' contains the user name
      return { userId, userName }
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }
  const [token] = useAuth()
  const userData = decodeToken(token)
  const projectsQuery = useQuery({
    queryKey: ['projects', {}],
    queryFn: () => {
      listProjects({})
    },
  })
  const projects = projectsQuery.data ?? []
  return (
    <div>
      <h1>Personal information</h1>
      <User id={userData?.userId} />
      <h1>Create new project</h1>
      <CreateProject />
      {projects && projects.length ? (
        projects.map((project) => (
          <Fragment key={project._id}>
            <ProjectCard
              projectId={project._id}
              title={project.title}
              subtitle={project.subtitle}
              admin={project.admin}
              members={project.members}
            />
          </Fragment>
        ))
      ) : (
        <>none of projects</>
      )}
    </div>
  )
}
