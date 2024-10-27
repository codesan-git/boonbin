'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useTodos } from '@/hooks/api/use-todos'
import { todoInputSchema, TodoInputValidationSchema, TodoValidationSchema } from '@/lib/type/type-safe'

interface TodoFormProps {
  onSuccess: () => void;
  initialData?: TodoValidationSchema;
}

export function TodoForm({ onSuccess, initialData }: TodoFormProps) {
  const { createTodoAsync, updateTodoAsync } = useTodos()
  const { toast } = useToast()

  const form = useForm<TodoInputValidationSchema>({
    resolver: zodResolver(todoInputSchema),
    defaultValues: {
      title: initialData?.title || '',
      completed: initialData?.completed || false,
    },
  })

  async function onSubmit(values: TodoInputValidationSchema) {
    try {
      if (initialData) {
        await updateTodoAsync({ id: initialData.id, input: values })
        toast({
          title: "Success",
          description: "Todo updated successfully",
        })
      } else {
        await createTodoAsync(values)
        toast({
          title: "Success",
          description: "Todo created successfully",
        })
      }
      form.reset()
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save todo",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter todo title" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of your todo item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="completed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Completed
                </FormLabel>
                <FormDescription>
                  Mark this todo as completed
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            initialData ? 'Update' : 'Submit'
          )}
        </Button>
      </form>
    </Form>
  )
}