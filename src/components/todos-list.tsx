import { TodoTable } from '@/components/common/table/todo/todo-table'

export default function TodosList() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Todos</h1>
      <TodoTable />
    </div>
  )
}