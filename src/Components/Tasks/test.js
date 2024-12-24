// // automatedUpdates.js
// import { Task } from '../db/models/task.js'

// export async function updateCycleTimes(projectId) {
//   try {
//     // Add projectId to query to only update tasks for specific project
//     const query = {
//       project: projectId,
//       phase: { $nin: ['story', 'done'] },
//       startDate: { $exists: true }
//     }

//     // Use updateMany for better performance instead of forEach
//     const bulkOps = await Task.find(query).map(task => ({
//       updateOne: {
//         filter: { _id: task._id },
//         update: {
//           $set: {
//             cycleTime: calculateCycleTime(task.startDate)
//           }
//         }
//       }
//     }))

//     if (bulkOps.length > 0) {
//       await Task.bulkWrite(bulkOps)
//       return {
//         success: true,
//         message: 'Cycle times updated successfully',
//         updatedCount: bulkOps.length
//       }
//     }

//     return {
//       success: true,
//       message: 'No tasks requiring updates were found',
//       updatedCount: 0
//     }

//   } catch (error) {
//     console.error('Error updating cycle times:', error)
//     throw new Error('Failed to update cycle times: ' + error.message)
//   }
// }

// // Helper function to calculate cycle time
// function calculateCycleTime(startDate) {
//   const currentDate = new Date()
//   const start = new Date(startDate)
//   return Number(((currentDate - start) / (1000 * 60 * 60 * 24)).toFixed(2))
// }

// // projects.js (API Routes)
// app.patch('/api/v1/projects/:projectId/tasks/cycle-times', requireAuth, async (req, res) => {
//   try {
//     const result = await updateCycleTimes(req.params.projectId)
//     return res.status(200).json(result)
//   } catch (error) {
//     console.error('Error updating cycle times:', error)
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to update cycle times',
//       message: error.message
//     })
//   }
// })

// // projects.js (Frontend API)
// export const updateTasksCycleTime = async (token, projectId) => {
//   try {
//     const res = await fetch(
//       `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/tasks/cycle-times`,
//       {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         }
//       }
//     )

//     if (!res.ok) {
//       const errorData = await res.json()
//       throw new Error(errorData.message || `Error updating tasks cycleTimes: ${res.statusText}`)
//     }

//     return await res.json()
//   } catch (error) {
//     console.error('Error updating tasks cycleTimes:', error)
//     throw error
//   }
// }

// // ProjectContext.jsx
// const cycleTimesMutation = useMutation({
//   mutationFn: () => updateTasksCycleTime(token, currentProjectId),
//   onSuccess: (data) => {
//     // Show success message if needed
//     console.log(`Successfully updated ${data.updatedCount} tasks`)
//     // Invalidate and refetch tasks
//     queryClient.invalidateQueries(['tasks', currentProjectId])
//   },
//   onError: (error) => {
//     console.error('Failed to update cycle times:', error)
//     // Handle error (e.g., show error message to user)
//   }
// })
