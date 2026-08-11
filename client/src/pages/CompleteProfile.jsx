/**
 * CompleteProfile.jsx  (updated)
 * ──────────────────────────────────────────────────────────────
 * Rendered inside <AuthLayout>.
 *
 * REMOVED:
 *   ✕  `min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8`
 *   ✕  `max-w-md` wrapper  → AuthLayout provides it
 *
 * Loading state returns a small spinner card; AuthLayout centers it.
 * ──────────────────────────────────────────────────────────────
 */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import supabase from '../lib/supabaseClient'
import { completeOAuthProfile } from '../API/users'

const userRoles = [
  { value: 'design_engineer',        label: 'Design Engineer' },
  { value: 'cad_technician',         label: 'CAD Technician' },
  { value: 'cnc_programmer',         label: 'CNC Programmer' },
  { value: 'manufacturing_engineer', label: 'Manufacturing Engineer' },
  { value: 'machinist',              label: 'Machinist' },
  { value: 'machine_operator',       label: 'Machine Operator' },
  { value: 'production_supervisor',  label: 'Production Supervisor' },
  { value: 'qc_inspector',           label: 'QC Inspector' },
  { value: 'metrology_engineer',     label: 'Metrology Engineer' },
  { value: 'inventory_manager',      label: 'Inventory Manager' },
  { value: 'production_planner',     label: 'Production Planner' },
  { value: 'maintenance_technician', label: 'Maintenance Technician' },
  { value: 'hr_personnel',           label: 'HR Personnel' },
  { value: 'logistics_coordinator',  label: 'Logistics Coordinator' },
]

const teamTypes = [
  { value: 'design_team',         label: 'Design Team' },
  { value: 'manufacturing_team',  label: 'Manufacturing Team' },
  { value: 'quality_control_team',label: 'Quality Control Team' },
  { value: 'support_teams',       label: 'Support Teams' },
]

const inputClass =
  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'

const labelClass = 'block text-sm font-medium text-gray-700'

export function CompleteProfile() {
  const [loading,  setLoading]  = useState(false)
  const [user,     setUser]     = useState(null)
  const [formData, setFormData] = useState({
    full_name: '', username: '', role: '', team: '', department: '', phone: '',
  })

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) { navigate('/login'); return }
      setUser(user)
      setFormData((prev) => ({
        ...prev,
        full_name: user.user_metadata?.full_name || '',
        username:  user.email?.split('@')[0] || '',
      }))
    }
    getUser()
  }, [navigate])

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.role || !formData.team) { alert('Please select both a role and team'); return }
    try {
      setLoading(true)
      await completeOAuthProfile(formData)
      navigate(location.state?.from || '/')
    } catch (error) {
      alert('Failed to complete profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // AuthLayout centers this spinner card
  if (!user) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome to Tasktrone! Please provide some additional information to get started.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { id: 'full_name', label: 'Full Name',  type: 'text', placeholder: 'Enter your full name' },
            { id: 'username',  label: 'Username',   type: 'text', placeholder: 'Enter your username', required: true },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className={labelClass}>{field.label}</label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleInputChange}
                className={inputClass}
                placeholder={field.placeholder}
                required={field.required}
              />
            </div>
          ))}

          <div>
            <label htmlFor="role" className={labelClass}>Role *</label>
            <select id="role" name="role" value={formData.role} onChange={handleInputChange} required className={inputClass}>
              <option value="">Select your role</option>
              {userRoles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="team" className={labelClass}>Team *</label>
            <select id="team" name="team" value={formData.team} onChange={handleInputChange} required className={inputClass}>
              <option value="">Select your team</option>
              {teamTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="department" className={labelClass}>Department</label>
            <input type="text" id="department" name="department" value={formData.department}
              onChange={handleInputChange} className={inputClass} placeholder="Enter your department" />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone}
              onChange={handleInputChange} className={inputClass} placeholder="Enter your phone number" />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.role || !formData.team}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Profile…' : 'Complete Profile'}
          </button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p>* Required fields</p>
          <p className="mt-1">Email: {user.email}</p>
        </div>
      </div>
    </div>
  )
}