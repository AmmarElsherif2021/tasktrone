import { Header } from '../../Components/Header/Header'
import DashboardPortion from './DashboardPortion'
import DataVisualizationPortion from './DataVisualizationPortion'
import { UserWelcome } from './UserWelcome'

const OldMemberExplorer = ({ userId }) => {
  return (
    <div className="bg-[#EEFBF4] min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <UserWelcome userId={userId} welcomeMessage="Welcome back,">
          Explore your projects and visualize your data to stay on top of your tasks.
        </UserWelcome>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-full md:w-80 lg:w-72">
            <DashboardPortion />
          </div>
          <div className="w-full md:w-80 lg:w-72">
            <DataVisualizationPortion />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OldMemberExplorer