import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Blog } from './pages/Blog'
import { Signup } from './pages/Signup'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { Login } from './pages/Login.jsx'
const queryClient = new QueryClient()
export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Blog />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/login',
      element: <Login />,
    },
  ])
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
