import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi } from '@/lib/api'
import { GetCommentsParams, CreateCommentRequest, UpdateCommentRequest } from '@/types/api'
import { Comment } from '@/types'

// Query keys for consistent caching
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (filters: GetCommentsParams) => [...commentKeys.lists(), filters] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  replies: (commentId: string) => [...commentKeys.all, 'replies', commentId] as const,
  userComments: (userId: string) => [...commentKeys.all, 'user', userId] as const,
}

// Get comments for a post
export function useComments(params: GetCommentsParams) {
  return useQuery({
    queryKey: commentKeys.list(params),
    queryFn: () => commentsApi.getComments(params),
    enabled: !!params.postId,
  })
}

// Get a single comment by ID
export function useComment(id: string) {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: () => commentsApi.getCommentById(id),
    enabled: !!id,
  })
}

// Get replies to a comment
export function useCommentReplies(commentId: string, params?: Omit<GetCommentsParams, 'parentId'>) {
  return useQuery({
    queryKey: commentKeys.replies(commentId),
    queryFn: () => commentsApi.getReplies(commentId, params),
    enabled: !!commentId,
  })
}

// Get comments by user
export function useUserComments(userId: string, params?: Omit<GetCommentsParams, 'postId'>) {
  return useQuery({
    queryKey: commentKeys.userComments(userId),
    queryFn: () => commentsApi.getCommentsByUser(userId, params),
    enabled: !!userId,
  })
}

// Create comment mutation
export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentsApi.createComment(data),
    onSuccess: (newComment) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: commentKeys.list({ postId: newComment.postId }),
      })

      // If it's a reply, also invalidate replies
      if (newComment.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(newComment.parentId),
        })
      }

      // Invalidate user's comments
      queryClient.invalidateQueries({
        queryKey: commentKeys.userComments(newComment.authorId),
      })
    },
  })
}

// Update comment mutation
export function useUpdateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentRequest }) =>
      commentsApi.updateComment(id, data),
    onSuccess: (updatedComment) => {
      // Update the comment in cache
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment)

      // Invalidate comments list for the post
      queryClient.invalidateQueries({
        queryKey: commentKeys.list({ postId: updatedComment.postId }),
      })

      // If it's a reply, invalidate replies
      if (updatedComment.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(updatedComment.parentId),
        })
      }
    },
  })
}

// Delete comment mutation
export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => commentsApi.deleteComment(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: commentKeys.detail(deletedId) })

      // Note: We can't easily know which post this comment belonged to
      // without additional data, so we invalidate all comment lists
      // In a real app, you might want to store this information
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() })
    },
  })
}
