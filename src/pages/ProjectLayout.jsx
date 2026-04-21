import { useState } from 'react'
import { Blog } from './Blog'
import { Board } from './Board'
import { Header } from '../Components/Header/Header'
import BlogIcon from '../assets/blogIcon.svg'
import BlogIconFlipped from '../assets/blogIconFlipped.svg'
//import toUp from '../assets/up.svg'
import IconButton from '../Ui/IconButton'
import { CreateTask } from '../Components/Tasks/CreateTask'
import { ProjectDashboard } from '../Components/Projects/ProjectDashboard'

export const ProjectLayout = () => {
  const [showBlog, setShowBlog] = useState(false)

  const toggleBlog = () => setShowBlog(!showBlog)

  return (
    <div className="h-screen flex flex-col mx-0 px-0 overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            relative flex flex-col items-center justify-evenly
            w-20 lg:w-24 flex-shrink-0
            bg-[#EEFBF4] border-r-2 border-black border-solid
            ${!showBlog ? 'border-r-2' : 'border-r-0'}
          `}
        >
          

          <IconButton
            src={showBlog ? BlogIconFlipped : BlogIcon}
            alt={showBlog ? 'Hide Blog' : 'Show Blog'}
            onClick={toggleBlog}
            iconWidthREM={6}
          />
          <CreateTask />
          <ProjectDashboard />
        </aside>

        {/* Blog Panel (conditionally rendered) */}
        {showBlog && (
          <aside
            className="
              w-80 lg:w-96 flex-shrink-0
              h-full overflow-y-auto
              bg-[#EEFBF4] border-r-2 border-black
            "
          >
            <Blog />
          </aside>
        )}

        {/* Main Content */}
        <main
          className="
            flex-1 h-full overflow-y-auto
            pt-20 px-4 lg:px-6 pb-4
          "
        >
          <Board />
        </main>
      </div>
    </div>
  )
}