import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { UpdateUserRequest, GetUserPostsParams } from '@/types/api'
import { User } from '@/types'

// Query keys for consistent caching
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  current: () => [...userKeys.all, 'current'] as const,
  posts: (userId: string) => [...userKeys.all, 'posts', userId] as const,
  stats: (userId: string) => [...userKeys.all, 'stats', userId] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
}

// Get user by ID
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get user by username
export function useUserByUsername(username: string) {
  return useQuery({
    queryKey: userKeys.detail(username),
    queryFn: () => usersApi.getUserByUsername(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get current authenticated user
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: () => usersApi.getCurrentUser(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get user's posts
export function useUserPosts(params: GetUserPostsParams) {
  return useQuery({
    queryKey: userKeys.posts(params.userId),
    queryFn: () => usersApi.getUserPosts(params),
    enabled: !!params.userId,
  })
}

// Get user statistics
export function useUserStats(userId: string) {
  return useQuery({
    queryKey: userKeys.stats(userId),
    queryFn: () => usersApi.getUserStats(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get current user statistics
export function useCurrentUserStats() {
  return useQuery({
    queryKey: [...userKeys.current(), 'stats'],
    queryFn: () => usersApi.getCurrentUserStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Search users
export function useSearchUsers(query: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => usersApi.searchUsers(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Update user profile mutation
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update the user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)

      // If it's the current user, update current user cache too
      queryClient.setQueryData(userKeys.current(), updatedUser)
    },
  })
}

// Update current user profile mutation
export function useUpdateCurrentUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersApi.updateCurrentUser(data),
    onSuccess: (updatedUser) => {
      // Update current user in cache
      queryClient.setQueryData(userKeys.current(), updatedUser)

      // Also update the user detail cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
    },
  })
}

// Delete user mutation
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) })

      // If it was the current user, clear current user cache
      queryClient.removeQueries({ queryKey: userKeys.current() })
    },
  })
}
