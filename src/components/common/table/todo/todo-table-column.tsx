'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { TodoValidationSchema } from '@/lib/type/type-safe'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Hourglass, LucideSquareCheckBig, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AddEditTodoButton } from '@/components/common/table/todo/add-edit-todo-dialog'

// New component to handle the actions cell
const ActionCell = ({ todo }: { todo: TodoValidationSchema }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditClick = (event: Event) => {
    event.preventDefault()
    setIsEditDialogOpen(true)
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(todo.id)}
        >
          Copy todo ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleEditClick}>
          Edit todo
          <AddEditTodoButton
            todo={todo}
            isOpenProps={isEditDialogOpen}
            onOpenChange={(open) => {
              setIsEditDialogOpen(open)
              if (!open) setIsDropdownOpen(false)
            }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>Delete todo</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const todoColumns: ColumnDef<TodoValidationSchema>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'completed',
    header: 'Status',
    cell: ({ row }) => (
      <div>{row.getValue('completed') ?
        (
          <span className='flex space-x-2'>
            <LucideSquareCheckBig size={16} className='my-auto' />
            <h3>Completed</h3>
          </span>
        )
        :
        (
          <span className='flex space-x-2'>
            <Hourglass size={16} className='my-auto' />
            <h3>Pending</h3>
          </span>
        )
      }
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell todo={row.original} />,
  },
]