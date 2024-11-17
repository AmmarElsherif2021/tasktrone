import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { createProject } from '../../API/projects'
import { useAuth } from '../../contexts/AuthContext'

export function CreateProject() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    members: [],
  })
  const [member, setMember] = useState({ user: '', role: 'worker' })
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const createProjectMutation = useMutation({
    mutationFn: () => {
      const { title, subtitle, members } = formData
      createProject(token, { title, subtitle, members })
    },
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMemberChange = (e) => {
    const { name, value } = e.target
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddMember = () => {
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, { ...member, id: prev.members.length }],
    }))
    setMember({ user: '', role: 'worker' })
  }

  const handleRemoveMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    createProjectMutation.mutate()
  }

  useEffect(() => {
    if (createProjectMutation.isSuccess) {
      setFormData({
        title: '',
        subtitle: '',
        members: [],
      })
    }
  }, [createProjectMutation.isSuccess])

  if (!token) return <div>Please log in to create new tasks.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='title'
          id='create-title'
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>
      <br />
      <label htmlFor='create-subtitle'>Subtitle: </label>
      <textarea
        name='subtitle'
        value={formData.subtitle}
        onChange={handleInputChange}
      />
      <br />

      <label htmlFor='add-member'>Member: </label>
      <div>
        <h3>Bullet List Input</h3>
        <input
          type='text'
          name='user'
          value={member.user}
          onChange={handleMemberChange}
          placeholder='User'
        />
        <select
          name='role'
          value={member.role}
          onChange={handleMemberChange}
          style={{ marginRight: '10px' }}
        >
          <option value='admin'>Admin</option>
          <option value='worker'>Worker</option>
          <option value='reviewer'>Reviewer</option>
        </select>

        {formData.members.map((member, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <span>•</span>
            {member.user} -- {member.role}
            <button
              className='btn-custom'
              type='button'
              onClick={() => handleRemoveMember(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button type='button' onClick={handleAddMember} className='btn-custom'>
          Add Member
        </button>
      </div>

      <br />
      <input
        type='submit'
        value={createProjectMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!formData.title || createProjectMutation.isPending}
      />
      {createProjectMutation.isSuccess && (
        <div>
          <br />
          Project created successfully!
        </div>
      )}
    </form>
  )
}
