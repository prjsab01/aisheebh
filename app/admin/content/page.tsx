'use client'

import { useState, useEffect } from 'react'
import { Entry, Section } from '@/types'
import { getSections, getEntries, addEntry, updateEntry, deleteEntry } from '@/lib/data'
import { useRouter } from 'next/navigation'
import MDEditor from '@uiw/react-md-editor'

export default function Content() {
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([])
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsData, entriesData] = await Promise.all([
          getSections(),
          getEntries()
        ])
        setSections(sectionsData)
        setEntries(entriesData)
        if (sectionsData.length > 0) {
          setSelectedSection(sectionsData[0].id)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAdd = () => {
    const section = sections.find(s => s.id === selectedSection)
    setFormData({
      sectionId: selectedSection,
      title: '',
      content: '',
      dateRange: { start: '', end: '' },
      tags: [],
      organization: '',
      logoUrl: '',
      location: '',
      mediaLinks: [],
      order: entries.filter(e => e.sectionId === selectedSection).length + 1,
      visibility: true
    })
    setEditing('new')
  }

  const handleEdit = (entry: Entry) => {
    setFormData(entry)
    setEditing(entry.id)
  }

  const handleSave = async () => {
    try {
      if (editing === 'new') {
        await addEntry({ ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
        setEntries([...entries, { ...formData, id: 'temp', createdAt: '', updatedAt: '' }])
      } else {
        await updateEntry({ ...formData, updatedAt: new Date().toISOString() })
        setEntries(entries.map(e => e.id === editing ? { ...formData, updatedAt: new Date().toISOString() } : e))
      }
      setEditing(null)
      setFormData({})
      // Refresh data
      const [sectionsData, entriesData] = await Promise.all([getSections(), getEntries()])
      setSections(sectionsData)
      setEntries(entriesData)
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id)
      setEntries(entries.filter(e => e.id !== id))
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

  const filteredEntries = entries.filter(e => e.sectionId === selectedSection)

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <button onClick={() => router.push('/admin')} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        ← Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">Manage Content</h1>
      <div className="mb-4">
        <label className="block mb-2">Select Section:</label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded"
        >
          {sections.map(section => (
            <option key={section.id} value={section.id}>{section.title}</option>
          ))}
        </select>
      </div>
      <button onClick={handleAdd} className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Add Entry
      </button>
      {editing && (
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <input
            type="text"
            placeholder="Title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
          />
          <input
            type="text"
            placeholder={sections.find(s => s.id === selectedSection)?.type === 'experience' ? 'Organization' : 'Institution'}
            value={formData.organization || ''}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
          />
          <input
            type="url"
            placeholder="Logo URL"
            value={formData.logoUrl || ''}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
          />
          <div className="mb-2">
            <label className="block mb-1 text-sm">Content (Markdown supported)</label>
            <MDEditor
              value={formData.content || ''}
              onChange={(value) => setFormData({ ...formData, content: value || '' })}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
              data-color-mode="dark"
            />
          </div>
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
            placeholder={sections.find(s => s.id === selectedSection)?.type === 'experience' ? 'Skills (comma separated)' : sections.find(s => s.id === selectedSection)?.type === 'education' ? 'Major Courses (comma separated)' : 'Tags (comma separated)'}
            value={formData.tags?.join(', ') || ''}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map((t: string) => t.trim()) })}
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
        {filteredEntries.map(entry => (
          <div key={entry.id} className="p-4 mb-2 bg-gray-800 rounded">
            <h3 className="font-bold">{entry.title}</h3>
            {entry.organization && <p>Organization: {entry.organization}</p>}
            {entry.location && <p>Location: {entry.location}</p>}
            <p>{entry.content}</p>
            <p>{entry.dateRange ? `${entry.dateRange.start} - ${entry.dateRange.end || 'Present'}` : ''}</p>
            <p>{sections.find(s => s.id === selectedSection)?.type === 'experience' ? 'Skills' : sections.find(s => s.id === selectedSection)?.type === 'education' ? 'Major Courses' : 'Tags'}: {entry.tags ? entry.tags.join(', ') : ''}</p>
            <p>Order: {entry.order}</p>
            <div className="mt-2">
              <button onClick={() => handleEdit(entry)} className="mr-2 px-3 py-1 bg-yellow-600 text-white rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(entry.id)} className="px-3 py-1 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}