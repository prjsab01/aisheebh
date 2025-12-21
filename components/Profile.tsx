import { Profile as ProfileType } from '@/types'

interface ProfileProps {
  profile: ProfileType
}

export default function Profile({ profile }: ProfileProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
        {profile.name.charAt(0)}
      </div>
      <h1 className="text-2xl font-bold text-center mt-4">{profile.name}</h1>
      <p className="text-center text-gray-300">{profile.headline}</p>
      <p className="text-center mt-4 text-sm">{profile.about}</p>
    </div>
  )
}