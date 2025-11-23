'use client'

import { useState, useEffect } from 'react'
import { FollowButton } from '@/components/shared/FollowButton'
import { User } from '@/types'

export default function TestUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users/suggested')
      .then(res => res.json())
      .then(data => {
        console.log('Users from API:', data)
        setUsers(data.users || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching users:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8">Loading users...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Users for Following</h1>
      
      {users.length === 0 ? (
        <div className="text-gray-500">
          <p>No users found in database.</p>
          <p>You need to create additional user accounts to test the follow functionality.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{user.name || 'No name'}</p>
                <p className="text-sm text-gray-600">@{user.username || 'no-username'}</p>
                <p className="text-xs text-gray-500">ID: {user.id}</p>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}