'use client'

import { useState, useEffect } from 'react'
import { Highlight } from '@/types'
import { getHighlights, addHighlight, updateHighlight, deleteHighlight } from '@/lib/data'
import { useRouter } from 'next/navigation'

export default function HighlightsAdmin() {
  const router = useRouter()
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({ text: '', icon: '', order: 1, visibility: true })

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const data = await getHighlights()
        setHighlights(data)
      } catch (error) {
        console.error('Error fetching highlights:', error)
        setMessage('Error loading highlights')
      } finally {
        setLoading(false)
      }
    }
    fetchHighlights()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updatedHighlight = { ...highlights.find(h => h.id === editing)!, ...formData, updatedAt: new Date().toISOString() }
        await updateHighlight(updatedHighlight)
        setHighlights(highlights.map(h => h.id === editing ? updatedHighlight : h))
        setMessage('Highlight updated successfully!')
      } else {
        const newHighlight = {
          ...formData,
          id: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await addHighlight(newHighlight)
        setHighlights([...highlights, { ...newHighlight, id: 'temp' }]) // Refresh will happen
        setMessage('Highlight added successfully!')
      }
      setFormData({ text: '', icon: '', order: highlights.length + 1, visibility: true })
      setEditing(null)
      // Refresh data
      const data = await getHighlights()
      setHighlights(data)
    } catch (error) {
      console.error('Error saving highlight:', error)
      setMessage('Error saving highlight')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (highlight: Highlight) => {
    setEditing(highlight.id)
    setFormData({ text: highlight.text, icon: highlight.icon || '', order: highlight.order, visibility: highlight.visibility })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this highlight?')) return
    try {
      await deleteHighlight(id)
      setHighlights(highlights.filter(h => h.id !== id))
      setMessage('Highlight deleted successfully!')
    } catch (error) {
      console.error('Error deleting highlight:', error)
      setMessage('Error deleting highlight')
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setFormData({ text: '', icon: '', order: highlights.length + 1, visibility: true })
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
      <h1 className="text-2xl font-bold mb-4">Manage Highlights</h1>
      {message && <p className="mb-4 text-green-400">{message}</p>}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold">{editing ? 'Edit Highlight' : 'Add New Highlight'}</h2>
        <div>
          <label className="block mb-1">Text</label>
          <input
            type="text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Icon (optional)</label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="e.g., ⭐"
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
            {saving ? 'Saving...' : editing ? 'Update Highlight' : 'Add Highlight'}
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
        <h2 className="text-xl font-semibold">Existing Highlights</h2>
        {highlights.map(highlight => (
          <div key={highlight.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{highlight.text}</p>
              <p className="text-sm text-gray-400">Order: {highlight.order} | Visible: {highlight.visibility ? 'Yes' : 'No'}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(highlight)}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(highlight.id)}
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