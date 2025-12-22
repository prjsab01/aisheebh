import { Entry } from '@/types'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import MediaModal from './MediaModal'

interface ExperienceProps {
  experiences: Entry[]
}

export default function Experience({ experiences }: ExperienceProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: string} | null>(null)

  const openModal = (media: {url: string, type: string}) => {
    setSelectedMedia(media)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedMedia(null)
  }
  return (
    <>
      <div className="space-y-6">
        {experiences.map(exp => (
          <div key={exp.id} className="relative pl-8 border-l-4 border-violet-500/50">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-violet-500 rounded-full border-4 border-gray-900 shadow-lg shadow-violet-500/30"></div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                {exp.logoUrl && (
                  <img src={exp.logoUrl} alt={exp.organization || 'Organization'} className="w-10 h-10 mr-3 rounded-lg border border-gray-600" />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                  {exp.organization && <p className="text-violet-400 font-medium">{exp.organization}</p>}
                </div>
              </div>
              <div className="prose prose-invert prose-sm max-w-none mb-3">
                <ReactMarkdown
                  components={{
                    p: ({children}) => <p className="text-gray-300 leading-relaxed">{children}</p>,
                    strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                    em: ({children}) => <em className="text-violet-400">{children}</em>,
                    code: ({children}) => <code className="bg-gray-800 px-1 py-0.5 rounded text-xs text-violet-300">{children}</code>,
                  }}
                >
                  {exp.content}
                </ReactMarkdown>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mr-2"></span>
                {exp.dateRange?.start} - {exp.dateRange?.end || 'Present'}
                {exp.location && <span className="text-violet-400"> • {exp.location}</span>}
              </p>
              {exp.tags && exp.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {exp.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full border border-violet-500/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {exp.mediaLinks && exp.mediaLinks.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {exp.mediaLinks.map((media, index) => (
                    <div key={index} className="group transition-all duration-300 hover:scale-105">
                      {media.type === 'image' && (
                        <button
                          onClick={() => openModal(media)}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-violet-500/30 shadow-lg shadow-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        >
                          <img src={media.url} alt="Media" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-end justify-center pb-1">
                            <span className="text-white text-xs font-medium">View</span>
                          </div>
                        </button>
                      )}
                      {media.type === 'video' && (
                        <button
                          onClick={() => openModal(media)}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-pink-500/30 bg-gray-800 flex items-center justify-center shadow-lg shadow-pink-500/10 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <span className="text-2xl">▶️</span>
                          <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white font-medium">Play</span>
                          </div>
                        </button>
                      )}
                      {media.type === 'pdf' && (
                        <button
                          onClick={() => openModal(media)}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg text-sm text-gray-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          📄 <span className="font-medium">PDF</span>
                        </button>
                      )}
                      {(media.type === 'ppt' || media.type === 'pptx') && (
                        <a href={media.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg text-sm text-gray-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 border border-purple-500/30">
                          📊 <span className="font-medium">{media.type.toUpperCase()}</span>
                        </a>
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
          </div>
        ))}
      </div>
      <MediaModal
        isOpen={modalOpen}
        onClose={closeModal}
        media={selectedMedia}
      />
    </>
  )
}

