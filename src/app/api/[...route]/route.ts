import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { handle } from 'hono/vercel'
import { ApiResponse, PrismaError } from '@/lib/type/response-type'

const prisma = new PrismaClient()
const app = new Hono().basePath('/api')

// Tipe untuk request body saat membuat atau mengupdate todo
type TodoInput = {
  title: string
  completed?: boolean
}


// Function untuk memeriksa apakah error adalah PrismaError
function isPrismaError(error: unknown): error is PrismaError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'clientVersion' in error
  )
}

// Helper function untuk membuat ApiResponse
function createApiResponse<T>(code: number, message: string, data: T): ApiResponse<T> {
  return {
    responseCode: code,
    responseMessage: message,
    responseDateTime: new Date(),
    result: data
  }
}

// Create: Membuat todo baru
app.post('/todos', async (c) => {
  const input: TodoInput = await c.req.json()
  const newTodo = await prisma.todo.create({
    data: input,
  })
  return c.json(createApiResponse(201, 'Todo created successfully', newTodo))
})

// Read: Mendapatkan semua todo
app.get('/todos', async (c) => {
  const todos = await prisma.todo.findMany()
  return c.json(createApiResponse(200, 'Todos retrieved successfully', todos))
})

// Read: Mendapatkan todo berdasarkan ID
app.get('/todos/:id', async (c) => {
  const id = c.req.param('id')
  const todo = await prisma.todo.findUnique({
    where: { id },
  })
  if (!todo) {
    return c.json(createApiResponse(404, 'Todo not found', null))
  }
  return c.json(createApiResponse(200, 'Todo retrieved successfully', todo))
})

// Update: Mengupdate todo berdasarkan ID
app.put('/todos/:id', async (c) => {
  const id = c.req.param('id')
  const input: TodoInput = await c.req.json()
  try {
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: input,
    })
    return c.json(createApiResponse(200, 'Todo updated successfully', updatedTodo))
  } catch (error: unknown) {
    if (isPrismaError(error) && error.code === 'P2025') {
      return c.json(createApiResponse(404, 'Todo not found', null))
    }
    console.error('Unexpected error:', error)
    return c.json(createApiResponse(500, 'An unexpected error occurred', null))
  }
})

// Delete: Menghapus todo berdasarkan ID
app.delete('/todos/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    })
    return c.json(createApiResponse(200, 'Todo deleted successfully', deletedTodo))
  } catch (error: unknown) {
    if (isPrismaError(error) && error.code === 'P2025') {
      return c.json(createApiResponse(404, 'Todo not found', null))
    }
    console.error('Unexpected error:', error)
    return c.json(createApiResponse(500, 'An unexpected error occurred', null))
  }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)