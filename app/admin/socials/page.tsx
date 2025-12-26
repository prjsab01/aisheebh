'use client'

import { useState, useEffect } from 'react'
import { Social } from '@/types'
import { getSocials, addSocial, updateSocial, deleteSocial } from '@/lib/data'
import { useRouter } from 'next/navigation'

export default function SocialsAdmin() {
  const router = useRouter()
  const [socials, setSocials] = useState<Social[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({ platform: '', url: '', icon: '', handle: '', logoUrl: '', order: 1, visibility: true })

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const data = await getSocials()
        setSocials(data)
      } catch (error) {
        console.error('Error fetching socials:', error)
        setMessage('Error loading socials')
      } finally {
        setLoading(false)
      }
    }
    fetchSocials()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updatedSocial = { ...socials.find(s => s.id === editing)!, ...formData, updatedAt: new Date().toISOString() }
        await updateSocial(updatedSocial)
        setSocials(socials.map(s => s.id === editing ? updatedSocial : s))
        setMessage('Social updated successfully!')
      } else {
        const newSocial = {
          ...formData,
          id: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await addSocial(newSocial)
        setSocials([...socials, { ...newSocial, id: 'temp' }]) // Refresh will happen
        setMessage('Social added successfully!')
      }
      setEditing(null)
      setFormData({ platform: '', url: '', icon: '', handle: '', logoUrl: '', order: socials.length + 1, visibility: true })
    } catch (error) {
      console.error('Error saving:', error)
      setMessage('Error saving social')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setFormData({ platform: '', url: '', icon: '', handle: '', logoUrl: '', order: socials.length + 1, visibility: true })
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <button onClick={() => router.push('/admin')} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        ← Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">Manage Social Links</h1>
      {message && <p className="mb-4 text-green-400">{message}</p>}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold">{editing ? 'Edit Social Link' : 'Add New Social Link'}</h2>
        <div>
          <label className="block mb-1">Platform</label>
          <input
            type="text"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="e.g., LinkedIn, GitHub, Twitter"
            required
          />
        </div>
        <div>
          <label className="block mb-1">URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="https://..."
            required
          />
        </div>
        <div>
          <label className="block mb-1">Handle</label>
          <input
            type="text"
            value={formData.handle}
            onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="e.g., @yourhandle"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Logo URL (optional)</label>
          <input
            type="url"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block mb-1">Icon (emoji or HTML entity)</label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="e.g., 🔗, 📧, 🐦"
          />
        </div>
        <div>
          <label className="block mb-1">Order</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            min="1"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.checked })}
              className="mr-2"
            />
            Visible
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-4">Current Social Links</h2>
        {socials.map(social => (
          <div key={social.id} className="p-4 bg-gray-800 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{social.icon}</span>
              <div>
                <p className="font-medium">{social.platform}</p>
                <p className="text-sm text-gray-400">{social.url}</p>
                <p className="text-sm text-gray-400">{social.handle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(social.id)
                  setFormData({
                    platform: social.platform,
                    url: social.url,
                    icon: social.icon,
                    handle: social.handle,
                    logoUrl: social.logoUrl || '',
                    order: social.order,
                    visibility: social.visibility
                  })
                }}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this social link?')) {
                    try {
                      console.log('Deleting social with ID:', social.id)
                      await deleteSocial(social.id)
                      setSocials(socials.filter(s => s.id !== social.id))
                      setMessage('Social link deleted successfully!')
                    } catch (error) {
                      console.error('Error deleting social:', error)
                      setMessage(`Error deleting social link: ${error instanceof Error ? error.message : 'Unknown error'}`)
                    }
                  }
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}