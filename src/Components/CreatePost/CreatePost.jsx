import { useMutation, useQueryClient } from '@tanstack/react-query' // Import hooks from react-query
import { useState } from 'react' // Import useState hook from React
import { createPost } from '../../API/posts' // Import the createPost function from API file

export function CreatePost() {
  // State hooks to manage the form inputs
  const [title, setTitle] = useState('') // State for the post title
  const [author, setAuthor] = useState('') // State for the post author
  const [contents, setContents] = useState('') // State for the post contents

  // Initialize the query client
  const queryClient = useQueryClient()

  // Define the mutation for creating a post
  const createPostMutation = useMutation({
    mutationFn: () => createPost({ title, author, contents }), // Function to call the createPost API
    onSuccess: () => queryClient.invalidateQueries(['posts']), // Invalidate the 'posts' query on success to refetch the posts
  })

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault() // Prevent the default form submission behavior
    createPostMutation.mutate() // Trigger the mutation to create a post
  }

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
      <div>
        <label htmlFor='create-author'>Author: </label>
        <input
          type='text'
          name='create-author'
          id='create-author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <br />
      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)} // Update the contents state on textarea change
      />
      <br />
      <br />
      <input
        type='submit'
        value={createPostMutation.isPending ? 'Creating...' : 'Create'} // Change button text based on mutation state
        disabled={!title || createPostMutation.isPending} // Disable button if title is empty or mutation is pending
      />
      {createPostMutation.isSuccess ? (
        <>
          <br />
          Post created successfully! successful
        </>
      ) : null}
    </form>
  )
}
