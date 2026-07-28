/**
 * Blog.jsx  (updated)
 * ──────────────────────────────────────────────────────────────
 * Rendered inside <ProjectShell>'s blog aside panel.
 *
 * The blog aside is already positioned below the fixed Header by
 * ProjectShell — it does NOT need its own top-padding offset.
 *
 * REMOVED:
 *   ✕  pt-20  (was compensating for the fixed Header height;
 *              ProjectShell now handles that with marginTop on the
 *              content row, so this panel starts exactly at the
 *              right vertical position)
 * ──────────────────────────────────────────────────────────────
 */
import { PostList }      from '../Components/Posts/PostList.jsx'
import { CreatePost }    from '../Components/Posts/CreatePost.jsx'
import { BlogControls }  from '../Components/Posts/BlogController.jsx'
import { useProject }    from '../contexts/ProjectContext.jsx'

export function Blog() {
  const {
    posts,
    postAuthorFilter,
    postSortBy,
    postSortOrder,
    updatePostFilters,
  } = useProject()

  return (
    /*
     * h-full + overflow-y-auto: this element scrolls within the
     * fixed-height aside in ProjectShell.
     * pt-4 replaces the old pt-20 — no header offset needed here.
     */
    <div className="h-full overflow-y-auto pl-4 pt-4 border-0 bg-[#EEFBF4]">
      <div className="p-4">
        <div className="container-fluid px-0">
          {/* Controls Row */}
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <div className="w-28">
              <CreatePost />
            </div>
            <div className="w-28">
              <BlogControls
                author={postAuthorFilter}
                onAuthorChange={(author)     => updatePostFilters({ author })}
                sortBy={postSortBy}
                onSortChange={(sortBy)       => updatePostFilters({ sortBy })}
                sortOrder={postSortOrder}
                onSortOrderChange={(sortOrder) => updatePostFilters({ sortOrder })}
                sortFields={['createdAt', 'updatedAt']}
              />
            </div>
          </div>

          {/* Posts List */}
          <div className="w-full">
            <PostList posts={posts} />
          </div>
        </div>
      </div>
    </div>
  )
}