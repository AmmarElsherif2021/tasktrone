import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Stack } from 'react-bootstrap'
import { Post } from './Post'

export function PostList({ posts = [] }) {
  return (
    <Stack style={{ backgroundColor: 'none' }} gap={3}>
      {posts.map((post) => (
        <Fragment key={post._id}>
          <Post {...post} />
        </Fragment>
      ))}
    </Stack>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}
