'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TodoForm } from './todo-form'
import { TodoValidationSchema } from '@/lib/type/type-safe'

interface AddEditTodoButtonProps {
  todo?: TodoValidationSchema;
  isOpenProps: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEditTodoButton({ todo, isOpenProps, onOpenChange }: AddEditTodoButtonProps) {
  // const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    onOpenChange(false)
  }

  const isEditing = !!todo

  return (
    <Dialog open={isOpenProps} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {isEditing ?
          <div>
            <p>Edit</p>
          </div>
          :
          <div>
            <Button className="mt-4">
              Add Todo
            </Button>
          </div>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit your todo item here.' : 'Create a new todo item here.'} Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <TodoForm onSuccess={handleSuccess} initialData={todo} />
      </DialogContent>
    </Dialog>
  )
}