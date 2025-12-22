import { useEffect } from 'react'
import { convertToViewableUrl } from '@/lib/mediaUtils'
import RobustImage from './RobustImage'

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
          <RobustImage
            src={convertToViewableUrl(media.url)}
            alt="Media content"
            className="max-w-full max-h-full object-contain"
          />
        )
      case 'video':
        if (media.url.includes('youtube.com') || media.url.includes('youtu.be')) {
          // Extract YouTube video ID
          let videoId = '';
          if (media.url.includes('youtube.com/watch?v=')) {
            videoId = media.url.split('v=')[1].split('&')[0];
          } else if (media.url.includes('youtu.be/')) {
            videoId = media.url.split('youtu.be/')[1].split('?')[0];
          }
          
          return (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full min-h-[400px]"
              title="YouTube Video"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          );
        } else if (media.url.includes('dailymotion.com')) {
          // Extract Dailymotion video ID
          const videoId = media.url.split('/video/')[1]?.split('_')[0] || media.url.split('/').pop()?.split('_')[0] || '';
          
          return (
            <iframe
              src={`https://www.dailymotion.com/embed/video/${videoId}`}
              className="w-full h-full min-h-[400px]"
              title="Dailymotion Video"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            />
          );
        } else if (media.url.includes('facebook.com')) {
          return (
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(media.url)}&show_text=false`}
              className="w-full h-full min-h-[400px]"
              title="Facebook Video"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          );
        } else if (media.url.includes('instagram.com')) {
          return (
            <iframe
              src={`https://www.instagram.com/p/${media.url.split('/p/')[1]?.split('/')[0] || media.url.split('/reel/')[1]?.split('/')[0]}/embed`}
              className="w-full h-full min-h-[400px]"
              title="Instagram Video"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          );
        } else if (media.url.includes('vimeo.com')) {
          const videoId = media.url.split('/').pop()?.split('?')[0] || '';
          
          return (
            <iframe
              src={`https://player.vimeo.com/video/${videoId}`}
              className="w-full h-full min-h-[400px]"
              title="Vimeo Video"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            />
          );
        } else if (media.url.includes('twitch.tv')) {
          const channel = media.url.split('/').pop()?.split('?')[0] || '';
          
          return (
            <iframe
              src={`https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`}
              className="w-full h-full min-h-[400px]"
              title="Twitch Stream"
              allowFullScreen
            />
          );
        } else if (media.url.includes('drive.google.com')) {
          // Google Drive video - use iframe preview
          let embedUrl = media.url;
          if (media.url.includes('/file/d/')) {
            const fileId = media.url.split('/file/d/')[1].split('/')[0];
            embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
          } else if (media.url.includes('id=')) {
            const fileId = media.url.split('id=')[1].split('&')[0];
            embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
          }
          
          return (
            <iframe
              src={embedUrl}
              className="w-full h-full min-h-[400px]"
              title="Google Drive Video"
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          );
        } else {
          // Direct video file
          return (
            <video
              src={media.url}
              controls
              className="max-w-full max-h-full"
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
          );
        }
      case 'pdf':
        if (media.url.includes('drive.google.com') || media.url.includes('docs.google.com')) {
          // Use Google Docs viewer for better compatibility with shared links
          const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(media.url)}&embedded=true`;
          
          return (
            <iframe
              src={viewerUrl}
              className="w-full h-full min-h-[600px]"
              title="PDF Viewer"
            />
          );
        } else {
          // This shouldn't happen since non-Google Drive PDFs open in new tab
          return (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-white text-lg mb-4">PDF Document</p>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-violet-500/25"
              >
                Open PDF
              </a>
            </div>
          );
        }
      case 'ppt':
      case 'pptx':
        if (media.url.includes('drive.google.com') || media.url.includes('docs.google.com')) {
          // Use Google Docs viewer for better compatibility with shared links
          const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(media.url)}&embedded=true`;
          
          return (
            <iframe
              src={viewerUrl}
              className="w-full h-full min-h-[600px]"
              title="PowerPoint Presentation"
              allowFullScreen
            />
          );
        } else {
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
          );
        }
      case 'doc':
      case 'docx':
        if (media.url.includes('drive.google.com') || media.url.includes('docs.google.com')) {
          // Use Google Docs viewer for better compatibility with shared links
          const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(media.url)}&embedded=true`;
          
          return (
            <iframe
              src={viewerUrl}
              className="w-full h-full min-h-[600px]"
              title="Word Document"
              allowFullScreen
            />
          );
        } else {
          return (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-white text-lg mb-4">Word Document</p>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-violet-500/25"
              >
                Open in New Tab
              </a>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-white text-lg mb-4">External Link</p>
            <a
              href={media!.url}
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