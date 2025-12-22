import { useEffect } from 'react'

interface MediaModalProps {
  isOpen: boolean
  onClose: () => void
  media: {
    url: string
    type: string
  } | null
}

export default function MediaModal({ isOpen, onClose, media }: MediaModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !media) return null

  const renderMediaContent = () => {
    switch (media.type) {
      case 'image':
        return (
          <img
            src={media.url}
            alt="Media content"
            className="max-w-full max-h-full object-contain"
          />
        )
      case 'video':
        return (
          <video
            src={media.url}
            controls
            className="max-w-full max-h-full"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        )
      case 'pdf':
        return (
          <iframe
            src={media.url}
            className="w-full h-full min-h-[600px]"
            title="PDF Viewer"
          />
        )
      case 'ppt':
      case 'pptx':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-white text-lg mb-4">PowerPoint Presentation</p>
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-violet-500/25"
            >
              Open in New Tab
            </a>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-white text-lg mb-4">External Link</p>
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-violet-500/25"
            >
              Open Link
            </a>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="relative max-w-4xl max-h-[90vh] w-full mx-4 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white text-xl font-bold transition-colors duration-200 shadow-lg"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Media content */}
        <div className="flex items-center justify-center p-4 min-h-[400px]">
          {renderMediaContent()}
        </div>
      </div>
    </div>
  )
}