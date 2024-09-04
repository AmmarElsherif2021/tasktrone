//import { useState } from 'react'
//tanstack
import { useQuery } from '@tanstack/react-query'
//import './App.css'
import { PostList } from '../Components/PostList/PostList.jsx'
import { CreatePost } from '../Components/CreatePost/CreatePost.jsx'
import { PostFilter } from '../Components/PostFilter/PostFilter.jsx'
import { PostSorting } from '../Components/PostSorting/PostSorting.jsx'
//Api
import { getPosts } from '../API/posts.js'
//use state
import { useState } from 'react'

import { Header } from '../Components/Header/Header.jsx'

export function Blog() {
  //Filters State
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })

  const posts = postsQuery.data ?? []
  return (
    <div style={{ padding: 8 }}>
      <Header />
      <CreatePost />
      <br />
      <hr />
      Filter by:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}
