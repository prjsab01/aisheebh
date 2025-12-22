import Section from './Section'
import { Featured as FeaturedType } from '@/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface FeaturedProps {
  featured: FeaturedType[]
}

export default function Featured({ featured }: FeaturedProps) {
  if (featured.length === 0) return null

  return (
    <Section title="Featured">
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
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full">
              <img
                src={f.imageUrl}
                alt={f.text}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-gray-300 mb-4">{f.text}</p>
                {f.buttonText && f.buttonUrl && (
                  <a
                    href={f.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    {f.buttonText}
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  )
}