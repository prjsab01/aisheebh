'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>

  if (!user) {
    router.push('/admin/login')
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Redirecting...</div>
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/admin/login')
  }

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-4">Welcome, {user.email}</p>
      <button onClick={handleLogout} className="bg-red-600 p-2 rounded hover:bg-red-700 mb-8">Logout</button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/admin/profile" className="block bg-blue-600 p-4 rounded hover:bg-blue-700 text-center">
          Edit Profile
        </a>
        <a href="/admin/sections" className="block bg-blue-600 p-4 rounded hover:bg-blue-700 text-center">
          Manage Sections
        </a>
        <a href="/admin/content" className="block bg-blue-600 p-4 rounded hover:bg-blue-700 text-center">
          Manage Content
        </a>
        <a href="/admin/media" className="block bg-blue-600 p-4 rounded hover:bg-blue-700 text-center">
          Media Manager
        </a>
      </div>
    </div>
  )
}