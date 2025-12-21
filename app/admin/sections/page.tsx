'use client'

import { useState, useEffect } from 'react'
import { Section } from '@/types'
import { getSections, addSection, updateSection, deleteSection } from '@/lib/data'
import { useRouter } from 'next/navigation'

export default function Sections() {
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getSections()
        setSections(data)
      } catch (error) {
        console.error('Error fetching sections:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSections()
  }, [])

  const handleAdd = () => {
    setFormData({ type: '', title: '', layout: 'inline', order: sections.length + 1, visibility: true })
    setEditing('new')
  }

  const handleEdit = (section: Section) => {
    setFormData(section)
    setEditing(section.id)
  }

  const handleSave = async () => {
    try {
      if (editing === 'new') {
        await addSection({ ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
        setSections([...sections, { ...formData, id: 'temp', createdAt: '', updatedAt: '' }])
      } else {
        await updateSection({ ...formData, updatedAt: new Date().toISOString() })
        setSections(sections.map(s => s.id === editing ? { ...formData, updatedAt: new Date().toISOString() } : s))
      }
      setEditing(null)
      setFormData({})
      // Refresh data
      const data = await getSections()
      setSections(data)
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSection(id)
      setSections(sections.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting:', error)
    }
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
      <h1 className="text-2xl font-bold mb-4">Manage Sections</h1>
      <button onClick={handleAdd} className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Add Section
      </button>
      {editing && (
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <input
            type="text"
            placeholder="Type (e.g., experience, education)"
            value={formData.type || ''}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
          />
          <input
            type="text"
            placeholder="Title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
          />
          <input
            type="number"
            placeholder="Order"
            value={formData.order || 1}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
          />
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.checked })}
              className="mr-2"
            />
            Visible
          </label>
          <button onClick={handleSave} className="mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
          <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Cancel
          </button>
        </div>
      )}
      <div>
        {sections.map(section => (
          <div key={section.id} className="p-4 mb-2 bg-gray-800 rounded flex justify-between items-center">
            <div>
              <h3 className="font-bold">{section.title}</h3>
              <p>Type: {section.type}, Order: {section.order}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(section)} className="mr-2 px-3 py-1 bg-yellow-600 text-white rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(section.id)} className="px-3 py-1 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}