import { Entry } from '@/types'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import { convertToViewableUrl } from '@/lib/mediaUtils'
import RobustImage from './RobustImage'

interface PublicationsProps {
  publications: Entry[]
  onOpenModal?: (media: any, title: string) => void
}

export default function Publications({ publications, onOpenModal }: PublicationsProps) {
  const [activeTab, setActiveTab] = useState<string>('all')

  // Group publications by type and get custom labels
  const publicationTypes = ['all', ...Array.from(new Set(publications.map(p => p.publicationType).filter(Boolean)))] as string[]
  const publicationTypeLabels = new Map<string, string>()
  publications.forEach(p => {
    if (p.publicationType && p.publicationTypeLabel && !publicationTypeLabels.has(p.publicationType)) {
      publicationTypeLabels.set(p.publicationType, p.publicationTypeLabel)
    }
  })

  const getPublicationTypeLabel = (type: string) => {
    if (type === 'all') return 'All Publications'
    return publicationTypeLabels.get(type) || type.charAt(0).toUpperCase() + type.slice(1)
  }

  const filteredPublications = activeTab === 'all'
    ? publications
    : publications.filter(p => p.publicationType === activeTab)

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {publicationTypes.map(type => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === type
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
            }`}
          >
            {type === 'all' ? 'All Publications' : getPublicationTypeLabel(type)}
          </button>
        ))}
      </div>

      {/* Publications List */}
      <div className="max-h-96 overflow-y-auto space-y-4 publications-scroll">
        {filteredPublications.map(pub => (
          <div key={pub.id} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 w-full">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Publication Media */}
              {pub.mediaLinks && pub.mediaLinks.length > 0 && (() => {
                const media = pub.mediaLinks[0];
                return (
                  <div className="flex-shrink-0">
                    {media.type === 'image' && (
                      <button
                        onClick={() => onOpenModal?.(media, media.title || pub.title)}
                        className="w-full lg:w-48 h-48 rounded-lg overflow-hidden border-2 border-violet-500/30 shadow-lg shadow-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      >
                        <RobustImage
                          src={convertToViewableUrl(media.url)}
                          alt={pub.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </button>
                    )}
                    {media.type === 'video' && (
                      <button
                        onClick={() => onOpenModal?.(media, media.title || pub.title)}
                        className="w-full lg:w-48 h-48 rounded-lg overflow-hidden border-2 border-pink-500/30 bg-gray-800 flex items-center justify-center shadow-lg shadow-pink-500/10 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                      >
                        <span className="text-4xl">▶️</span>
                      </button>
                    )}
                    {(media.type === 'pdf' || media.type === 'ppt' || media.type === 'pptx') && (
                      <button
                        onClick={() => onOpenModal?.(media, media.title || `${pub.title} - ${media.type.toUpperCase()}`)}
                        className="w-full lg:w-48 h-48 rounded-lg border-2 border-purple-500/30 bg-gray-800 flex items-center justify-center shadow-lg shadow-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <span className="text-4xl">{media.type === 'pdf' ? '📄' : '📊'}</span>
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Publication Details */}
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-semibold text-white">{pub.title}</h3>

                {pub.publisher && (
                  <p className="text-violet-400 font-medium">{pub.publisher}</p>
                )}

                <div className="space-y-2 text-sm text-gray-400">
                  {pub.publicationDate && (
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-violet-500 rounded-full"></span>
                      {new Date(pub.publicationDate).toLocaleDateString()}
                    </div>
                  )}
                  {pub.coAuthors && pub.coAuthors.length > 0 && (
                    <div className="text-violet-300">
                      <span className="font-medium">Co-authors:</span> {pub.coAuthors.join(', ')}
                    </div>
                  )}
                </div>

                {pub.content && (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({children}) => <p className="text-gray-300 leading-relaxed">{children}</p>,
                        strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                        em: ({children}) => <em className="text-violet-400">{children}</em>,
                      }}
                    >
                      {pub.content.length > 150 ? `${pub.content.substring(0, 150)}...` : pub.content}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {pub.publicationUrl && (
                    <a
                      href={pub.publicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-violet-500/20 text-violet-300 text-sm rounded-lg hover:bg-violet-500/30 transition-colors duration-300 text-center border border-violet-500/30"
                    >
                      View Publication
                    </a>
                  )}
                  {pub.mediaLinks && pub.mediaLinks.length > 0 && (() => {
                    const media = pub.mediaLinks[0];
                    return (
                      <button
                        onClick={() => onOpenModal?.(media, media.title || pub.title)}
                        className="px-3 py-2 bg-pink-500/20 text-pink-300 text-sm rounded-lg hover:bg-pink-500/30 transition-colors duration-300 border border-pink-500/30"
                      >
                        View Media
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPublications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No publications found in this category.</p>
        </div>
      )}
    </div>
  )
}