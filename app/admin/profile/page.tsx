'use client'

import { useState, useEffect } from 'react'
import { Profile as ProfileType } from '@/types'
import { getProfile, updateProfile } from '@/lib/data'

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile()
        if (data) {
          setProfile(data)
        } else {
          // Create default profile
          setProfile({
            id: 'default',
            name: '',
            headline: '',
            photoUrl: '',
            about: '',
            order: 1,
            visibility: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setMessage('Error loading profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    try {
      const updatedProfile = { ...profile, updatedAt: new Date().toISOString() }
      await updateProfile(updatedProfile)
      setProfile(updatedProfile)
      setMessage('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof ProfileType, value: string | boolean) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-8 bg-gray-900 text-white min-h-screen">
        <p>No profile found.</p>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      {message && <p className="mb-4 text-green-400">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Headline</label>
          <input
            type="text"
            value={profile.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Photo URL</label>
          <input
            type="url"
            value={profile.photoUrl}
            onChange={(e) => handleChange('photoUrl', e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>
        <div>
          <label className="block mb-1">About</label>
          <textarea
            value={profile.about}
            onChange={(e) => handleChange('about', e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={profile.visibility}
              onChange={(e) => handleChange('visibility', e.target.checked)}
              className="mr-2"
            />
            Visible
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}