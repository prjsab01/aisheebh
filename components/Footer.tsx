'use client'

import { useState, useEffect } from 'react'
import { Social } from '@/types'
import { getSocials } from '@/lib/data'
import { convertToViewableUrl } from '@/lib/mediaUtils'

export default function Footer() {
  const [socials, setSocials] = useState<Social[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const data = await getSocials()
        setSocials(data)
      } catch (error) {
        console.error('Error fetching socials:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSocials()
  }, [])

  const visibleSocials = socials.filter(s => s.visibility)

  if (loading || visibleSocials.length === 0) {
    return null
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 z-40">
      <div className="max-w-6xl mx-auto px-8 py-2">
        <div className="flex items-center justify-center gap-6">
          {visibleSocials.map(social => (
            <div key={social.id} className="flex items-center gap-2">
              {social.logoUrl ? (
                <img
                  src={convertToViewableUrl(social.logoUrl)}
                  alt={social.platform}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <span className="text-2xl">{social.icon}</span>
              )}
              <span className="text-gray-400">{social.platform}</span>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:underline"
              >
                ({social.handle})
              </a>
            </div>
          ))}
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}