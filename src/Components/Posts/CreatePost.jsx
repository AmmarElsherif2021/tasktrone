// CreatePost.jsx
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../../API/posts'
import { useAuth } from '../../contexts/AuthContext'
import { useProject } from '../../contexts/ProjectContext'
import { Modal } from '../../Ui/Modal'
import createPostIcon from '../../assets/create-post.svg'

export function CreatePost() {
  const [content, setContent] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { currentProjectId, refetchPosts } = useProject()

  const createPostMutation = useMutation({
    mutationFn: () => createPost(currentProjectId.toString(), user.id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      setContent('')
      setShowModal(false)
      refetchPosts()
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate()
  }

  if (!user?.id) {
    return (
      <div className="bg-warning-amber/20 border-l-4 border-warning-amber text-neutral-black p-3">
        Please log in to create new posts.
      </div>
    )
  }

  return (
    <div className="mx-1">
      <button
        type="button"
        className="phase-button flex items-center gap-2"
        onClick={() => setShowModal(true)}
      >
        <img src={createPostIcon} width={25} alt="Create Post" className="phase-button-icon" />
        <span>Create Post</span>
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Post">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Content</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="
                w-full px-3 py-2
                border border-card-border
                bg-neutral-white
                font-mono text-sm
                focus:outline-none focus:ring-1 focus:ring-primary
              "
            />
          </div>

          <button
            type="submit"
            disabled={!content || createPostMutation.isPending}
            className="btn-cold"
          >
            {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
          </button>

          {createPostMutation.isSuccess && (
            <div className="bg-primary/10 border-l-4 border-primary text-neutral-black p-3">
              Post created successfully!
            </div>
          )}
        </form>
      </Modal>
    </div>
  )
}