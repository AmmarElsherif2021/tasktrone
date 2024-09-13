import { TaskCard } from '../Components/TaskCard/TaskCard'
import PropTypes from 'prop-types'

export function Board() {
  //column component
  const Column = (props) => {
    return (
      <div
        style={{
          alignItems: 'center',
          width: '25vw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2>{props.columnTitle}</h2>
        <div
          style={{
            background: 'wheat',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {props.tasks.map((x, index) => {
            const { title, author, content } = x
            return (
              <TaskCard
                key={index}
                title={title}
                content={content}
                author={author}
              />
            )
          })}
        </div>
      </div>
    )
  }
  Column.propTypes = {
    columnTitle: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        tasks: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            author: PropTypes.string,
            content: PropTypes.string,
          }),
        ),
      }),
    ),
  }

  //Filters State
  const tasks1 = [
    {
      title: 'A',
      author: 'a1',
      content: 'a a a a',
    },
    {
      title: 'B1',
      author: 'b1',
      content: 'b b b b',
    },
    {
      title: 'C1',
      author: 'c1',
      content: 'cc',
    },
  ]
  const tasks2 = [
    {
      title: 'A2',
      author: 'a2',
      content: 'a a a a',
    },
    {
      title: 'B2',
      author: 'b2',
      content: 'b b b b',
    },
    {
      title: 'C2',
      author: 'c2',
      content: 'cc',
    },
  ]
  const tasks3 = [
    {
      title: 'A3',
      author: 'a3',
      content: 'a a a a',
    },
    {
      title: 'B3',
      author: 'b3',
      content: 'b b b b',
    },
    {
      title: 'C3',
      author: 'c3',
      content: 'cc',
    },
  ]
  return (
    <div style={{ background: 'wheat', display: 'flex', flexDirection: 'row' }}>
      <Column columnTitle='story' tasks={tasks1} />
      <Column columnTitle='In progress' tasks={tasks2} />
      <Column columnTitle='Done' tasks={tasks3} />
    </div>
  )
}
