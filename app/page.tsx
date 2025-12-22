'use client'

import { useState, useEffect } from 'react'
import Profile from '@/components/Profile'
import Section from '@/components/Section'
import Highlights from '@/components/Highlights'
import Featured from '@/components/Featured'
import Experience from '@/components/Experience'
import { Profile as ProfileType, Highlight, Featured as FeaturedType, Entry, Section as SectionType } from '@/types'
import { getProfile, getHighlights, getFeatured, getSections, getEntries } from '@/lib/data'
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [featured, setFeatured] = useState<FeaturedType[]>([])
  const [sections, setSections] = useState<SectionType[]>([])
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, highlightsData, featuredData, sectionsData, entriesData] = await Promise.all([
          getProfile(),
          getHighlights(),
          getFeatured(),
          getSections(),
          getEntries()
        ])
        setProfile(profileData)
        setHighlights(highlightsData)
        setFeatured(featuredData)
        setSections(sectionsData)
        setEntries(entriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>No profile data found.</p>
      </div>
    )
  }

  const visibleHighlights = highlights.filter(h => h.visibility)
  const visibleFeatured = featured.filter(f => f.visibility)
  const visibleSections = sections.filter(s => s.visibility)
  const visibleEntries = entries.filter(e => e.visibility)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {profile.bannerUrl && (
        <div className="w-full h-48 md:h-64 lg:h-80 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${profile.bannerUrl})` }} />
      )}
      {visibleFeatured.length > 0 && <Featured featured={visibleFeatured} />}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        <div className="md:col-span-1">
          <Profile profile={profile} />
        </div>
        <div className="md:col-span-2">
          <Section title="About">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{profile.about}</ReactMarkdown>
            </div>
          </Section>
          {visibleSections.map(section => {
            const sectionEntries = visibleEntries.filter(e => e.sectionId === section.id)
            if (sectionEntries.length === 0) return null
            return (
              <Section key={section.id} title={section.title}>
                {section.type === 'experience' ? (
                  <Experience experiences={sectionEntries} />
                ) : (
                  <div>
                    {sectionEntries.map(entry => (
                      <div key={entry.id} className="mb-4">
                        <div className="flex items-center mb-2">
                          {entry.logoUrl && (
                            <img src={entry.logoUrl} alt={entry.organization || 'Institution'} className="w-8 h-8 mr-2 rounded" />
                          )}
                          <div>
                            <h3 className="text-xl font-semibold">{entry.title}</h3>
                            {entry.organization && <p className="text-gray-300">{entry.organization}</p>}
                          </div>
                        </div>
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown>{entry.content}</ReactMarkdown>
                        </div>
                        {entry.dateRange && (
                          <p className="text-sm text-gray-400">
                            {entry.dateRange.start} - {entry.dateRange.end || 'Present'}
                            {entry.location && ` • ${entry.location}`}
                          </p>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <p className="text-sm text-gray-400">
                            {section.type === 'education' ? 'Major Courses' : 'Tags'}: {entry.tags.join(', ')}
                          </p>
                        )}
                        {entry.mediaLinks && entry.mediaLinks.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {entry.mediaLinks.map((media, index) => (
                              <a key={index} href={media.url} target="_blank" rel="noopener noreferrer" className="group">
                                {media.type === 'image' && (
                                  <div className="relative w-16 h-16 rounded overflow-hidden border border-gray-600">
                                    <img src={media.url} alt="Media" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                                      <span className="text-white opacity-0 group-hover:opacity-100">🔗</span>
                                    </div>
                                  </div>
                                )}
                                {media.type === 'video' && (
                                  <div className="relative w-16 h-16 rounded overflow-hidden border border-gray-600 bg-gray-700 flex items-center justify-center">
                                    <span className="text-2xl">▶️</span>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
                                  </div>
                                )}
                                {(media.type === 'pdf' || media.type === 'ppt' || media.type === 'pptx') && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded text-sm text-gray-300 hover:bg-gray-600 transition-colors">
                                    {media.type === 'pdf' && '📄'}
                                    {(media.type === 'ppt' || media.type === 'pptx') && '📊'}
                                    {media.type.toUpperCase()}
                                  </div>
                                )}
                                {!['image', 'video', 'pdf', 'ppt', 'pptx'].includes(media.type) && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded text-sm text-gray-300 hover:bg-gray-600 transition-colors">
                                    🔗 {media.type}
                                  </div>
                                )}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )
          })}
        </div>
      </div>
      {visibleHighlights.length > 0 && (
        <div className="max-w-6xl mx-auto p-8">
          <Highlights highlights={visibleHighlights} />
        </div>
      )}
    </div>
  )
}