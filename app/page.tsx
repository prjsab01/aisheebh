'use client'

import { useState, useEffect } from 'react'
import Profile from '@/components/Profile'
import Section from '@/components/Section'
import Highlights from '@/components/Highlights'
import Experience from '@/components/Experience'
import { Profile as ProfileType, Highlight, Entry, Section as SectionType } from '@/types'
import { getProfile, getHighlights, getSections, getEntries } from '@/lib/data'

export default function Home() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [sections, setSections] = useState<SectionType[]>([])
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, highlightsData, sectionsData, entriesData] = await Promise.all([
          getProfile(),
          getHighlights(),
          getSections(),
          getEntries()
        ])
        setProfile(profileData)
        setHighlights(highlightsData)
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
  const visibleSections = sections.filter(s => s.visibility)
  const visibleEntries = entries.filter(e => e.visibility)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {profile.bannerUrl && (
        <div className="w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url(${profile.bannerUrl})` }} />
      )}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        <div className="md:col-span-1">
          <Profile profile={profile} />
        </div>
        <div className="md:col-span-2">
          <Section title="About">
            <p>{profile.about}</p>
          </Section>
          {visibleHighlights.length > 0 && <Highlights highlights={visibleHighlights} />}
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
                        <h3 className="text-xl font-semibold">{entry.title}</h3>
                        <p>{entry.content}</p>
                        {entry.dateRange && (
                          <p className="text-sm text-gray-400">
                            {entry.dateRange.start} - {entry.dateRange.end || 'Present'}
                          </p>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <p className="text-sm text-gray-400">Tags: {entry.tags.join(', ')}</p>
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
    </div>
  )
}