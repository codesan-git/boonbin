'use client'
import { useState } from 'react'
import { usePosts } from '@/hooks/api/use-posts'
import { CreatePostForm } from './posts-form'
import { Button } from '@/components/ui/button'

const PostsList = () => {
  const { posts, isLoading, error, updatePost, deletePost } = usePosts()
  const [showCreateForm, setShowCreateForm] = useState(false)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <div className="space-y-8 p-4">
      {showCreateForm ? (
        <CreatePostForm onSuccess={() => setShowCreateForm(false)} />
      ) : (
        <Button onClick={() => setShowCreateForm(true)}>Create New Post</Button>
      )}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map(post => (
            post && (
              <div key={post.id} className="border p-4 rounded-lg">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="mt-2">{post.content}</p>
                <div className="mt-4 space-x-2">
                  <Button
                    onClick={() => updatePost({ id: post.id, input: { title: 'Updated Title', content: post.content } })}
                    variant="outline"
                  >
                    Update Title
                  </Button>
                  <Button
                    onClick={() => deletePost(post.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )
          ))
        ) : (
          <div>No posts available</div>
        )}
      </div>
    </div>
  )
}

export default PostsList