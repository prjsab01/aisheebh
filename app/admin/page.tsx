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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/admin/profile" className="block bg-blue-600 p-4 rounded hover:bg-blue-700 text-center">
          Edit Profile
        </a>
        <a href="/admin/sections" className="block bg-blue-600 p-4 rounded hover:bg-blue-700 text-center">
          Manage Sections
        </a>
        <a href="/admin/content" className="block bg-blue-600 p-4 rounded hover:bg-blue-700 text-center">
          Manage Content
        </a>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Image Upload Options</h2>
        <p className="mb-4">Since you don&apos;t want to use Firebase Storage or GCP buckets, here are secure alternatives for uploading images and getting URLs:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-2">Google Drive</h3>
            <p className="text-sm mb-2">Upload image, right-click → Get shareable link → Change permissions to &quot;Anyone with the link can view&quot; → Copy the link and use it directly.</p>
            <p className="text-xs text-gray-400">Note: For direct image display, replace &quot;open?&quot; with &quot;uc?&quot; in the URL.</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-2">Imgur</h3>
            <p className="text-sm mb-2">Upload to imgur.com → Get direct link → Use the .jpg/.png URL in the admin forms.</p>
            <p className="text-xs text-gray-400">Free, anonymous uploads available.</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-2">Cloudinary</h3>
            <p className="text-sm mb-2">Free tier available → Upload images → Get secure HTTPS URLs → Use in admin dashboard.</p>
            <p className="text-xs text-gray-400">Provides optimization and CDN.</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-2">GitHub</h3>
            <p className="text-sm mb-2">Upload to your repo&apos;s images folder → Use raw.githubusercontent.com URL.</p>
            <p className="text-xs text-gray-400">Best for project-related images.</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-400">All these services provide HTTPS URLs that can be safely used in your portfolio. The images will load securely on your website.</p>
      </div>
    </div>
  )
}