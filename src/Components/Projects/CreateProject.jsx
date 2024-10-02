import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { createTask } from '../../API/tasks'
import { useAuth } from '../../contexts/AuthContext'

export function CreateTask() {
  // State hooks to manage the form inputs
  const [title, setTitle] = useState('') // State for the task title
  const [newReq, setNewReq] = useState('') // State for the new requirement
  const [requirements, setRequirements] = useState([]) // State for the task requirements
  const [leadTime, setLeadTime] = useState('') // State for the task lead time
  const [attachments, setAttachments] = useState([]) // State for the task attachments

  // Use auth
  const [token] = useAuth()
  // Initialize the query client
  const queryClient = useQueryClient()

  // Define the mutation for creating a task
  const createTaskMutation = useMutation({
    mutationFn: () => createTask(token, { title, requirements, leadTime }), // Function to call the createTask API
    onSuccess: () => queryClient.invalidateQueries(['tasks']), // Invalidate the 'tasks' query on success to refetch the tasks
  })

  // Handle click add requirement button
  const handleAddReq = async () => {
    try {
      setRequirements((prevRequirements) => {
        const updatedRequirements = [...prevRequirements, newReq]
        return updatedRequirements
      })
    } catch (error) {
      console.error('error adding new req' + error)
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault() // Prevent the default form submission behavior
    createTaskMutation.mutate() // Trigger the mutation to create a task
  }
  // Reset form fields on successful task creation
  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      setAttachments([])
      setRequirements([])
      setLeadTime(0)
      setTitle('')
    }
  }, [createTaskMutation.isSuccess])

  if (!token) return <div>Please log in to create new tasks.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update the title state on input change
        />
      </div>
      <br />
      <br />
      <textarea
        value={newReq}
        onChange={(e) => setNewReq(e.target.value)} // Update the new requirement state on textarea change
      />
      <button
        type='button'
        onClick={() => {
          handleAddReq()
            .then(() => setNewReq(''))
            .catch((error) => {
              console.log('Error adding new requirement to task: ' + error)
            })
        }}
      >
        +
      </button>
      <br />
      {requirements.map((req, index) => (
        <div key={index}>{req}</div>
      ))}
      <div>
        <label htmlFor='create-leadtime'>Lead time: </label>
        <input
          type='number'
          name='create-leadtime'
          id='create-leadtime'
          value={leadTime}
          onChange={(e) => setLeadTime(e.target.value)} // Update the lead time state on input change
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-attachment'>Attachment: </label>
        <input
          type='text'
          name='create-attachment'
          id='create-attachment'
          value={attachments}
          onChange={(e) => setAttachments([e.target.value])} // Update the attachments state on input change
        />
      </div>
      <br />
      <input
        type='submit'
        value={createTaskMutation.isPending ? 'Creating...' : 'Create'} // Change button text based on mutation state
        disabled={!title || createTaskMutation.isPending} // Disable button if title is empty or mutation is pending
      />
      {createTaskMutation.isSuccess ? (
        <div>
          <br />
          Task created successfully!
        </div>
      ) : null}
    </form>
  )
}
