'use client'

import { useState, useEffect } from 'react'
import Profile from '@/components/Profile'
import Section from '@/components/Section'
import Highlights from '@/components/Highlights'
import Experience from '@/components/Experience'
import { Profile as ProfileType, Highlight, Entry } from '@/types'
import { getProfile, getHighlights, getExperiences } from '@/lib/data'

export default function Home() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [experiences, setExperiences] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, highlightsData, experiencesData] = await Promise.all([
          getProfile(),
          getHighlights(),
          getExperiences()
        ])
        setProfile(profileData)
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center py-10">
        Welcome to Portfolio Platform
      </h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        <div className="md:col-span-1">
          <Profile profile={profile} />
        </div>
        <div className="md:col-span-2">
          <Section title="About">
            <p>{profile.about}</p>
          </Section>
          <Highlights highlights={highlights.filter(h => h.visibility)} />
          <Experience experiences={experiences.filter(e => e.visibility)} />
        </div>
      </div>
    </div>
  )
}