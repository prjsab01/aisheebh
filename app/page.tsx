'use client'

import Profile from '@/components/Profile'
import Section from '@/components/Section'
import Highlights from '@/components/Highlights'
import Experience from '@/components/Experience'
import { Profile as ProfileType, Highlight, Entry } from '@/types'

const profile: ProfileType = {
  id: '1',
  name: 'John Doe',
  headline: 'Software Engineer',
  photoUrl: '',
  about: 'Passionate about building great software.',
  order: 1,
  visibility: true,
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
}

const highlights: Highlight[] = [
  { id: '1', text: 'Award winner', order: 1, visibility: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
]

const experiences: Entry[] = [
  {
    id: '1',
    sectionId: 'experience',
    title: 'Software Engineer',
    content: 'Developed web applications using React and Node.js. Led a team of 3 developers.',
    dateRange: { start: 'Jan 2020', end: 'Present' },
    tags: ['React', 'Node.js', 'JavaScript'],
    order: 1,
    visibility: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '2',
    sectionId: 'experience',
    title: 'Junior Developer',
    content: 'Built responsive websites and maintained legacy codebases.',
    dateRange: { start: 'Jun 2018', end: 'Dec 2019' },
    tags: ['HTML', 'CSS', 'PHP'],
    order: 2,
    visibility: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  }
]

export default function Home() {
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
          <Highlights highlights={highlights} />
          <Experience experiences={experiences} />
        </div>
      </div>
    </div>
  )
}