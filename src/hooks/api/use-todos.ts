'use client'

import { ApiResponse, ApiResponseArray } from '@/lib/type/response-type'
import { TodoInputValidationSchema, TodoValidationSchema } from '@/lib/type/type-safe'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export function useTodos() {
  const queryClient = useQueryClient()

  const { data: todosResponse, isLoading, error } = useQuery<ApiResponseArray<TodoValidationSchema>, AxiosError>({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponseArray<TodoValidationSchema>>('/todos')
      return data
    }
  })

  const createTodoMutation = useMutation<ApiResponse<TodoValidationSchema>, AxiosError, TodoInputValidationSchema>({
    mutationFn: async (input) => {
      const { data } = await api.post<ApiResponse<TodoValidationSchema>>('/todos', input)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      // Optionally, you can update the cache directly
      queryClient.setQueryData<ApiResponseArray<TodoValidationSchema>>(['todos'], (old) => {
        return old ? { ...old, result: [...old.result, data.result] } : undefined
      })
    }
  })

  const updateTodoMutation = useMutation<ApiResponse<TodoValidationSchema>, AxiosError, { id: string; input: TodoInputValidationSchema }>({
    mutationFn: async ({ id, input }) => {
      const { data } = await api.put<ApiResponse<TodoValidationSchema>>(`/todos/${id}`, input)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      // Optionally, you can update the cache directly
      queryClient.setQueryData<ApiResponseArray<TodoValidationSchema>>(['todos'], (old) => {
        return old ? {
          ...old,
          result: old.result.map(todo => todo.id === data.result.id ? data.result : todo)
        } : undefined
      })
    }
  })

  const deleteTodoMutation = useMutation<ApiResponse<TodoValidationSchema>, AxiosError, string>({
    mutationFn: async (id) => {
      const { data } = await api.delete<ApiResponse<TodoValidationSchema>>(`/todos/${id}`)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      // Optionally, you can update the cache directly
      queryClient.setQueryData<ApiResponseArray<TodoValidationSchema>>(['todos'], (old) => {
        return old ? {
          ...old,
          result: old.result.filter(todo => todo.id !== data.result.id)
        } : undefined
      })
    }
  })

  return {
    todos: todosResponse?.result || [],
    isLoading,
    error,
    createTodo: createTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    createTodoAsync: createTodoMutation.mutateAsync,
    updateTodoAsync: updateTodoMutation.mutateAsync,
    deleteTodoAsync: deleteTodoMutation.mutateAsync,
  }
}