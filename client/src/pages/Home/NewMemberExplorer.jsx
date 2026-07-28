import { Header } from '../../Components/Header/Header'
import MessangerPortion from './MessangerPortion'
import CreateProjectPortion from './CreateProjectPortion'
import { UserWelcome } from './UserWelcome'

const NewMemberExplorer = ({ userId }) => {
  return (
    <div className="bg-[#EEFBF4] min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <UserWelcome userId={userId} welcomeMessage="Welcome,">
          Create your first project, or notify other users that you are ready for work.
        </UserWelcome>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-full md:w-80 lg:w-72">
            <CreateProjectPortion />
          </div>
          <div className="w-full md:w-80 lg:w-72">
            <MessangerPortion />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewMemberExplorer