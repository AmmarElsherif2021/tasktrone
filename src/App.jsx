import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Home } from './pages/Home.jsx'
import { Signup } from './pages/Signup'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { UserHomeProvider } from './contexts/UserHomeContext.jsx'
import { Login } from './pages/Login.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { ProjectProvider } from './contexts/ProjectContext.jsx'
import { Board } from './pages/Board.jsx'
const queryClient = new QueryClient()
export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      children: [
        {
          path: '/board',
          element: <Board />,
        },
      ],
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
  ])
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <UserHomeProvider>
          <ProjectProvider>
            <RouterProvider router={router} />
          </ProjectProvider>
        </UserHomeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
