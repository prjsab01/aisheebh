import { Entry } from '@/types'

interface ExperienceProps {
  experiences: Entry[]
}

export default function Experience({ experiences }: ExperienceProps) {
  return (
    <div className="space-y-4">
      {experiences.map(exp => (
        <div key={exp.id} className="border-l-2 border-blue-500 pl-4">
          <div className="flex items-center mb-2">
            {exp.logoUrl && (
              <img src={exp.logoUrl} alt={exp.organization || 'Organization'} className="w-8 h-8 mr-2 rounded" />
            )}
            <div>
              <h3 className="text-xl font-semibold">{exp.title}</h3>
              {exp.organization && <p className="text-gray-300">{exp.organization}</p>}
            </div>
          </div>
          <p className="text-gray-300">{exp.content}</p>
          <p className="text-sm text-gray-400">
            {exp.dateRange?.start} - {exp.dateRange?.end || 'Present'}
            {exp.location && ` • ${exp.location}`}
          </p>
          {exp.tags && exp.tags.length > 0 && (
            <p className="text-sm text-gray-400">Skills: {exp.tags.join(', ')}</p>
          )}
          {exp.mediaLinks && exp.mediaLinks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {exp.mediaLinks.map((media, index) => (
                <a key={index} href={media.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  {media.type === 'image' && '🖼️'}
                  {media.type === 'video' && '🎥'}
                  {media.type === 'pdf' && '📄'}
                  {media.type === 'ppt' && '📊'}
                  {media.type === 'pptx' && '📊'}
                  {media.type}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}