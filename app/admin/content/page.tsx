'use client'

import { useState, useEffect } from 'react'
import { Highlight, Entry } from '@/types'
import { getHighlights, addHighlight, updateHighlight, deleteHighlight, getExperiences, addExperience, updateExperience, deleteExperience } from '@/lib/data'

export default function Content() {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [experiences, setExperiences] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'highlights' | 'experiences'>('highlights')
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [highlightsData, experiencesData] = await Promise.all([
          getHighlights(),
          getExperiences()
        ])
        setHighlights(highlightsData)
        setExperiences(experiencesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAdd = () => {
    if (activeTab === 'highlights') {
      setFormData({ text: '', order: highlights.length + 1, visibility: true })
    } else {
      setFormData({
        sectionId: 'experience',
        title: '',
        content: '',
        dateRange: { start: '', end: '' },
        tags: [],
        order: experiences.length + 1,
        visibility: true
      })
    }
    setEditing('new')
  }

  const handleEdit = (item: Highlight | Entry) => {
    setFormData(item)
    setEditing(item.id)
  }

  const handleSave = async () => {
    try {
      if (activeTab === 'highlights') {
        if (editing === 'new') {
          await addHighlight({ ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
          setHighlights([...highlights, { ...formData, id: 'temp', createdAt: '', updatedAt: '' }])
        } else {
          await updateHighlight({ ...formData, updatedAt: new Date().toISOString() })
          setHighlights(highlights.map(h => h.id === editing ? { ...formData, updatedAt: new Date().toISOString() } : h))
        }
      } else {
        if (editing === 'new') {
          await addExperience({ ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
          setExperiences([...experiences, { ...formData, id: 'temp', createdAt: '', updatedAt: '' }])
        } else {
          await updateExperience({ ...formData, updatedAt: new Date().toISOString() })
          setExperiences(experiences.map(e => e.id === editing ? { ...formData, updatedAt: new Date().toISOString() } : e))
        }
      }
      setEditing(null)
      setFormData({})
      // Refresh data
      const [highlightsData, experiencesData] = await Promise.all([getHighlights(), getExperiences()])
      setHighlights(highlightsData)
      setExperiences(experiencesData)
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (activeTab === 'highlights') {
        await deleteHighlight(id)
        setHighlights(highlights.filter(h => h.id !== id))
      } else {
        await deleteExperience(id)
        setExperiences(experiences.filter(e => e.id !== id))
      }
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
      <h1 className="text-2xl font-bold mb-4">Manage Content</h1>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('highlights')}
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'highlights' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Highlights
        </button>
        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-4 py-2 rounded ${activeTab === 'experiences' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Experiences
        </button>
      </div>
      <button onClick={handleAdd} className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Add {activeTab.slice(0, -1)}
      </button>
      {editing && (
        <div className="mb-4 p-4 bg-gray-800 rounded">
          {activeTab === 'highlights' ? (
            <div>
              <input
                type="text"
                placeholder="Highlight text"
                value={formData.text || ''}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
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
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
              />
              <textarea
                placeholder="Content"
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                rows={3}
              />
              <div className="flex mb-2">
                <input
                  type="text"
                  placeholder="Start Date"
                  value={formData.dateRange?.start || ''}
                  onChange={(e) => setFormData({ ...formData, dateRange: { ...formData.dateRange, start: e.target.value } })}
                  className="flex-1 p-2 mr-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={formData.dateRange?.end || ''}
                  onChange={(e) => setFormData({ ...formData, dateRange: { ...formData.dateRange, end: e.target.value } })}
                  className="flex-1 p-2 bg-gray-700 text-white rounded"
                />
              </div>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map((t: string) => t.trim()) })}
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
            </div>
          )}
          <button onClick={handleSave} className="mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
          <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Cancel
          </button>
        </div>
      )}
      <div>
        {activeTab === 'highlights' ? (
          highlights.map(highlight => (
            <div key={highlight.id} className="p-4 mb-2 bg-gray-800 rounded flex justify-between items-center">
              <span>{highlight.text}</span>
              <div>
                <button onClick={() => handleEdit(highlight)} className="mr-2 px-3 py-1 bg-yellow-600 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(highlight.id)} className="px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          experiences.map(experience => (
            <div key={experience.id} className="p-4 mb-2 bg-gray-800 rounded">
              <h3 className="font-bold">{experience.title}</h3>
              <p>{experience.content}</p>
              <p>{experience.dateRange ? `${experience.dateRange.start} - ${experience.dateRange.end || 'Present'}` : ''}</p>
              <p>Tags: {experience.tags ? experience.tags.join(', ') : ''}</p>
              <div className="mt-2">
                <button onClick={() => handleEdit(experience)} className="mr-2 px-3 py-1 bg-yellow-600 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(experience.id)} className="px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}