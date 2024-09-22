import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeTaskPhase } from '../../API/tasks'
import { useAuth } from '../../contexts/AuthContext'
import { User } from '../User/User.jsx'

export function TaskCard({ taskId, title, author, leadTime, cycleTime }) {
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ token, taskId, newPhase }) =>
      changeTaskPhase(token, taskId, newPhase),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', taskId])
    },
  })

  const handlePhaseChange = (newPhase) => {
    mutation.mutate({ token, taskId, newPhase })
  }

  return (
    <article style={{ margin: '1vw', width: '15vw', border: 'solid' }}>
      <h3>{title}</h3>
      <p>{taskId}</p>
      {author && (
        <em>
          <br />
          Written by <User id={author} />
        </em>
      )}
      <div>{leadTime}</div>
      <div>{cycleTime}</div>
      <button onClick={() => handlePhaseChange('inProgress')}>Forward</button>
    </article>
  )
}

TaskCard.propTypes = {
  taskId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  leadTime: PropTypes.number,
  cycleTime: PropTypes.number,
}
