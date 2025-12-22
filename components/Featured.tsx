import { Featured as FeaturedType } from '@/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import ReactMarkdown from 'react-markdown'

interface FeaturedProps {
  featured: FeaturedType[]
}

export default function Featured({ featured }: FeaturedProps) {
  if (featured.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-white border-b border-cyan-500/30 pb-2">Featured</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="featured-swiper"
      >
        {featured.map(f => (
          <SwiperSlide key={f.id}>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-gray-700/50 h-full backdrop-blur-sm">
              <div className="relative">
                <img
                  src={f.imageUrl}
                  alt={f.text}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="prose prose-invert prose-sm max-w-none mb-4">
                  <ReactMarkdown
                    components={{
                      p: ({children}) => <p className="text-gray-300 leading-relaxed">{children}</p>,
                      strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                      em: ({children}) => <em className="text-cyan-400">{children}</em>,
                      code: ({children}) => <code className="bg-gray-800 px-1 py-0.5 rounded text-xs text-cyan-300">{children}</code>,
                    }}
                  >
                    {f.text}
                  </ReactMarkdown>
                </div>
                {f.buttonText && f.buttonUrl && (
                  <div className="flex justify-center">
                    <a
                      href={f.buttonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5"
                    >
                      {f.buttonText}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}