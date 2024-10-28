'use client'

import { ApiResponse, ApiResponseArray } from '@/lib/type/response-type'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// Define types based on your schema
type Post = {
  id: string
  title: string
  content: string
  averageRating: number
  createdAt: string
  updatedAt: string
  authorId: string
  favouriteId: string | null
  author: {
    id: string
    name: string | null
    email: string
  }
  categories: Array<{
    id: string
    name: string
  }>
}

type PostInput = {
  title: string
  content: string
  averageRating?: number
}

export function usePosts() {
  const queryClient = useQueryClient()

  const { data: postsResponse, isLoading, error } = useQuery<ApiResponseArray<Post>, AxiosError>({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponseArray<Post>>('/posts')
      return data
    }
  })

  const createPostMutation = useMutation<ApiResponse<Post>, AxiosError, PostInput>({
    mutationFn: async (input) => {
      const { data } = await api.post<ApiResponse<Post>>('/posts', input)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.setQueryData<ApiResponseArray<Post>>(['posts'], (old) => {
        return old ? { ...old, result: [...old.result, data.result] } : undefined
      })
    }
  })

  const updatePostMutation = useMutation<ApiResponse<Post>, AxiosError, { id: string; input: PostInput }>({
    mutationFn: async ({ id, input }) => {
      const { data } = await api.put<ApiResponse<Post>>(`/posts/${id}`, input)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.setQueryData<ApiResponseArray<Post>>(['posts'], (old) => {
        return old ? {
          ...old,
          result: old.result.map(post => post.id === data.result.id ? data.result : post)
        } : undefined
      })
    }
  })

  const deletePostMutation = useMutation<ApiResponse<Post>, AxiosError, string>({
    mutationFn: async (id) => {
      const { data } = await api.delete<ApiResponse<Post>>(`/posts/${id}`)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.setQueryData<ApiResponseArray<Post>>(['posts'], (old) => {
        return old ? {
          ...old,
          result: old.result.filter(post => post.id !== data.result.id)
        } : undefined
      })
    }
  })

  return {
    posts: postsResponse?.result || [],
    isLoading,
    error,
    createPost: createPostMutation.mutate,
    updatePost: updatePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    createPostAsync: createPostMutation.mutateAsync,
    updatePostAsync: updatePostMutation.mutateAsync,
    deletePostAsync: deletePostMutation.mutateAsync,
  }
}