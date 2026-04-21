import { useNavigate } from 'react-router-dom'
import dashboardIcon from '../../assets/dashboard-icon.svg'

export default function DashboardPortion() {
  const navigate = useNavigate()

  return (
    <div className="border-thick border-neutral-black bg-neutral-white rounded-card p-5 text-center">
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-3">Go to Dashboard</h3>
        <button
          onClick={() => navigate('/dashboard')}
          className="border-thick bg-[#1aaa8F] rounded-full h-20 w-20 flex items-center justify-center p-4 mb-1 hover:scale-105 transition-transform"
          aria-label="Dashboard"
        >
          <img src={dashboardIcon} alt="dashboard" className="w-16 cursor-pointer" />
        </button>
        <p className="mt-0 mb-4 text-[#666]">
          Access your project dashboard to manage tasks and progress.
        </p>
      </div>
    </div>
  )
}