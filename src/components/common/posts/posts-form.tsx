'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import * as z from 'zod'

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
import { Textarea } from '@/components/ui/textarea'
import { usePosts } from '@/hooks/api/use-posts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const postInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be 1000 characters or less'),
})

type PostInputValidationSchema = z.infer<typeof postInputSchema>

interface CreatePostFormProps {
  onSuccess: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { createPostAsync } = usePosts()
  const { toast } = useToast()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<PostInputValidationSchema>({
    resolver: zodResolver(postInputSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  async function onSubmit(values: PostInputValidationSchema) {
    setServerError(null)
    try {
      const response = await createPostAsync(values)
      if (response.responseCode === 201) {
        toast({
          title: "Success",
          description: "Post created successfully",
        })
        form.reset()
        onSuccess()
      } else {
        setServerError(response.responseMessage || 'An error occurred while creating the post')
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
        <CardDescription>Share your thoughts with the world</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the title of your post. Make it catchy!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Express your thoughts, ideas, or stories in the content of your post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverError && (
              <div className="text-red-500 text-sm">{serverError}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}