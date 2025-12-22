'use client'

import { useState, useEffect } from 'react'
import Profile from '@/components/Profile'
import Section from '@/components/Section'
import Featured from '@/components/Featured'
import Experience from '@/components/Experience'
import MediaModal from '@/components/MediaModal'
import { Profile as ProfileType, Highlight, Featured as FeaturedType, Entry, Section as SectionType } from '@/types'
import { getProfile, getHighlights, getFeatured, getSections, getEntries } from '@/lib/data'
import ReactMarkdown from 'react-markdown'
import { convertToViewableUrl } from '@/lib/mediaUtils'
import RobustImage from '@/components/RobustImage'

export default function Home() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [featured, setFeatured] = useState<FeaturedType[]>([])
  const [sections, setSections] = useState<SectionType[]>([])
  const [entries, setEntries] = useState<Entry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<any>(null)
  const [modalTitle, setModalTitle] = useState('')
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

  const openModal = (media: any, title: string = '') => {
    setSelectedMedia(media)
    setModalTitle(title)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMedia(null)
    setModalTitle('')
  }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-violet-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="relative z-10">
        {profile.bannerUrl && (
          <div className="w-full h-48 md:h-64 lg:h-80 bg-cover bg-center bg-no-repeat relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-violet-500/20"></div>
            <div className="absolute inset-0" style={{ backgroundImage: `url(${convertToViewableUrl(profile.bannerUrl)})` }}></div>
          </div>
        )}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <div className="md:col-span-1">
            <Profile profile={profile} highlights={visibleHighlights} />
          </div>
          <div className="md:col-span-2">
            {visibleFeatured.length > 0 && <Featured featured={visibleFeatured} />}
            <Section title="About">
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({children}) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
                    strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                    em: ({children}) => <em className="text-violet-400">{children}</em>,
                    ul: ({children}) => <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>,
                    li: ({children}) => <li className="text-gray-300">{children}</li>,
                    h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4 border-b border-violet-500/30 pb-2">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-bold text-white mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-semibold text-violet-400 mb-2">{children}</h3>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-violet-500 pl-4 italic text-gray-400 my-4">{children}</blockquote>,
                    code: ({children}) => <code className="bg-gray-800 px-2 py-1 rounded text-sm text-violet-300">{children}</code>,
                    pre: ({children}) => <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto my-4 border border-gray-700">{children}</pre>,
                  }}
                >
                  {profile.about}
                </ReactMarkdown>
              </div>
            </Section>
            {visibleSections.map(section => {
              const sectionEntries = visibleEntries.filter(e => e.sectionId === section.id)
              if (sectionEntries.length === 0) return null
              return (
                <Section key={section.id} title={section.title}>
                  {section.type === 'experience' ? (
                    <Experience experiences={sectionEntries} onOpenModal={openModal} />
                  ) : (
                    <div>
                      {sectionEntries.map(entry => (
                        <div key={entry.id} className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                          <div className="flex items-center mb-3">
                            {entry.logoUrl && (
                              <RobustImage src={convertToViewableUrl(entry.logoUrl)} alt={entry.organization || 'Institution'} className="w-10 h-10 mr-3 rounded-lg border border-gray-600" />
                            )}
                            <div>
                              <h3 className="text-xl font-semibold text-white">{entry.title}</h3>
                              {entry.organization && <p className="text-violet-400 font-medium">{entry.organization}</p>}
                            </div>
                          </div>
                          <div className="prose prose-invert prose-sm max-w-none mb-3">
                            <ReactMarkdown
                              components={{
                                p: ({children}) => <p className="text-gray-300 leading-relaxed">{children}</p>,
                                strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                                em: ({children}) => <em className="text-violet-400">{children}</em>,
                                ul: ({children}) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
                                li: ({children}) => <li className="text-gray-300">{children}</li>,
                                code: ({children}) => <code className="bg-gray-800 px-1 py-0.5 rounded text-xs text-violet-300">{children}</code>,
                              }}
                            >
                              {entry.content}
                            </ReactMarkdown>
                          </div>
                          {entry.dateRange && (
                            <p className="text-sm text-gray-400 mb-2">
                              <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mr-2"></span>
                              {entry.dateRange.start} - {entry.dateRange.end || 'Present'}
                              {entry.location && <span className="text-violet-400"> • {entry.location}</span>}
                            </p>
                          )}
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {entry.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full border border-violet-500/30">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {entry.mediaLinks && entry.mediaLinks.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                              {entry.mediaLinks.map((media, index) => (
                                <div key={index} className="group transition-all duration-300 hover:scale-105">
                                  {media.type === 'image' && (
                                    <button
                                      onClick={() => openModal(media, entry.title)}
                                      className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-violet-500/30 shadow-lg shadow-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                    >
                                      <RobustImage src={convertToViewableUrl(media.url)} alt="Media" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-1">
                                        <span className="text-white text-xs font-medium">View</span>
                                      </div>
                                    </button>
                                  )}
                                  {media.type === 'video' && (
                                    (media.url.includes('youtube.com') || media.url.includes('youtu.be') || 
                                     media.url.includes('dailymotion.com') || media.url.includes('facebook.com') || 
                                     media.url.includes('instagram.com') || media.url.includes('drive.google.com') || 
                                     media.url.includes('vimeo.com') || media.url.includes('twitch.tv')) ? (
                                      <button
                                        onClick={() => openModal(media, entry.title)}
                                        className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-pink-500/30 bg-gray-800 flex items-center justify-center shadow-lg shadow-pink-500/10 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                      >
                                        <span className="text-2xl">▶️</span>
                                        <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                          <span className="text-white font-medium">Play</span>
                                        </div>
                                      </button>
                                    ) : (
                                      <a href={media.url} target="_blank" rel="noopener noreferrer" className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-pink-500/30 bg-gray-800 flex items-center justify-center shadow-lg shadow-pink-500/10">
                                        <span className="text-2xl">▶️</span>
                                        <div className="absolute inset-0 bg-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                          <span className="text-white font-medium">Play</span>
                                        </div>
                                      </a>
                                    )
                                  )}
                                  {(media.type === 'pdf' || media.type === 'ppt' || media.type === 'pptx') && (
                                    <button
                                      onClick={() => openModal(media, `${entry.title} - ${media.type.toUpperCase()}`)}
                                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg text-sm text-gray-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                      {media.type === 'pdf' && '📄'}
                                      {(media.type === 'ppt' || media.type === 'pptx') && '📊'}
                                      <span className="font-medium">{media.type.toUpperCase()}</span>
                                    </button>
                                  )}
                                  {!['image', 'video', 'pdf', 'ppt', 'pptx'].includes(media.type) && (
                                    <a href={media.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg text-sm text-gray-300 hover:from-violet-500/30 hover:to-purple-500/30 transition-all duration-300 border border-violet-500/30">
                                      🔗 <span className="font-medium">{media.type}</span>
                                    </a>
                                  )}
                                </div>
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
      </div>
      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        media={selectedMedia}
        title={modalTitle}
      />
    </div>
  )
}