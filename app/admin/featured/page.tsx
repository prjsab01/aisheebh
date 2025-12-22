'use client'

import { useState, useEffect } from 'react'
import { Featured } from '@/types'
import { getFeatured, addFeatured, updateFeatured, deleteFeatured } from '@/lib/data'
import { useRouter } from 'next/navigation'

export default function FeaturedAdmin() {
  const router = useRouter()
  const [featured, setFeatured] = useState<Featured[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({ imageUrl: '', text: '', buttonText: '', buttonUrl: '', order: 1, visibility: true })

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeatured()
        setFeatured(data)
      } catch (error) {
        console.error('Error fetching featured:', error)
        setMessage('Error loading featured')
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updatedFeatured = { ...featured.find(f => f.id === editing)!, ...formData, updatedAt: new Date().toISOString() }
        await updateFeatured(updatedFeatured)
        setFeatured(featured.map(f => f.id === editing ? updatedFeatured : f))
        setMessage('Featured item updated successfully!')
      } else {
        const newFeatured = {
          ...formData,
          id: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await addFeatured(newFeatured)
        setFeatured([...featured, { ...newFeatured, id: 'temp' }]) // Refresh will happen
        setMessage('Featured item added successfully!')
      }
      setFormData({ imageUrl: '', text: '', buttonText: '', buttonUrl: '', order: featured.length + 1, visibility: true })
      setEditing(null)
      // Refresh data
      const data = await getFeatured()
      setFeatured(data)
    } catch (error) {
      console.error('Error saving featured:', error)
      setMessage('Error saving featured')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: Featured) => {
    setEditing(item.id)
    setFormData({
      imageUrl: item.imageUrl,
      text: item.text,
      buttonText: item.buttonText || '',
      buttonUrl: item.buttonUrl || '',
      order: item.order,
      visibility: item.visibility
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this featured item?')) return
    try {
      await deleteFeatured(id)
      setFeatured(featured.filter(f => f.id !== id))
      setMessage('Featured item deleted successfully!')
    } catch (error) {
      console.error('Error deleting featured:', error)
      setMessage('Error deleting featured')
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setFormData({ imageUrl: '', text: '', buttonText: '', buttonUrl: '', order: featured.length + 1, visibility: true })
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
      <h1 className="text-2xl font-bold mb-4">Manage Featured</h1>
      {message && <p className="mb-4 text-green-400">{message}</p>}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold">{editing ? 'Edit Featured Item' : 'Add New Featured Item'}</h2>
        <div>
          <label className="block mb-1">Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Text</label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Button Text (optional)</label>
          <input
            type="text"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="e.g., Learn More"
          />
        </div>
        <div>
          <label className="block mb-1">Button URL (optional)</label>
          <input
            type="url"
            value={formData.buttonUrl}
            onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="https://example.com"
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
            {saving ? 'Saving...' : editing ? 'Update Featured' : 'Add Featured'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Featured Items</h2>
        {featured.map(item => (
          <div key={item.id} className="bg-gray-800 p-4 rounded flex justify-between items-start">
            <div className="flex gap-4">
              <img src={item.imageUrl} alt={item.text} className="w-16 h-16 object-cover rounded" />
              <div>
                <p className="font-semibold">{item.text}</p>
                {item.buttonText && <p className="text-sm text-blue-400">Button: {item.buttonText}</p>}
                <p className="text-sm text-gray-400">Order: {item.order} | Visible: {item.visibility ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
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