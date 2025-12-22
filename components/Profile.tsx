import { Profile as ProfileType, Highlight } from '@/types'
import { convertToViewableUrl } from '@/lib/mediaUtils'
import RobustImage from './RobustImage'

interface ProfileProps {
  profile: ProfileType
  highlights?: Highlight[]
}

export default function Profile({ profile, highlights = [] }: ProfileProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-violet-500/20 shadow-2xl shadow-violet-500/10 backdrop-blur-sm">
      {profile.photoUrl ? (
        <div className="relative mb-4">
          <RobustImage
            src={convertToViewableUrl(profile.photoUrl)}
            alt={profile.name}
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-violet-500/30 shadow-lg shadow-violet-500/20"
          />
          <div className="absolute inset-0 rounded-full border-2 border-violet-400/50 animate-pulse"></div>
        </div>
      ) : (
        <div className="relative w-32 h-32 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold border-4 border-violet-400/50 shadow-lg shadow-violet-500/20">
          {profile.name.charAt(0)}
          <div className="absolute inset-0 rounded-full border-2 border-violet-300/30 animate-pulse"></div>
        </div>
      )}
      <h1 className="text-2xl font-bold text-center text-white mb-2 drop-shadow-lg">{profile.name}</h1>
      <p className="text-center text-violet-300 font-medium drop-shadow-sm mb-4">{profile.headline}</p>
      
      {highlights.length > 0 && (
        <div className="space-y-2 mb-4">
          {highlights.map(h => (
            <div key={h.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20 backdrop-blur-sm">
              <span className="text-pink-400 text-lg mt-0.5">{h.icon || '✨'}</span>
              <p className="text-gray-300 leading-relaxed text-sm">{h.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}