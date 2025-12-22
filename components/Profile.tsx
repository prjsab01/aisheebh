import { Profile as ProfileType } from '@/types'

interface ProfileProps {
  profile: ProfileType
}

export default function Profile({ profile }: ProfileProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
      {profile.photoUrl ? (
        <div className="relative mb-4">
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-cyan-500/30 shadow-lg shadow-cyan-500/20"
          />
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-pulse"></div>
        </div>
      ) : (
        <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold border-4 border-cyan-400/50 shadow-lg shadow-cyan-500/20">
          {profile.name.charAt(0)}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-300/30 animate-pulse"></div>
        </div>
      )}
      <h1 className="text-2xl font-bold text-center text-white mb-2 drop-shadow-lg">{profile.name}</h1>
      <p className="text-center text-cyan-300 font-medium drop-shadow-sm">{profile.headline}</p>
    </div>
  )
}