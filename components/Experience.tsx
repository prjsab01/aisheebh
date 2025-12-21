import { Entry } from '@/types'

interface ExperienceProps {
  experiences: Entry[]
}

export default function Experience({ experiences }: ExperienceProps) {
  return (
    <div className="space-y-4">
      {experiences.map(exp => (
        <div key={exp.id} className="border-l-2 border-blue-500 pl-4">
          <h3 className="text-xl font-semibold">{exp.title}</h3>
          <p className="text-gray-300">{exp.content}</p>
          <p className="text-sm text-gray-400">
            {exp.dateRange?.start} - {exp.dateRange?.end || 'Present'}
          </p>
          {exp.tags && exp.tags.length > 0 && (
            <p className="text-sm text-gray-400">Tags: {exp.tags.join(', ')}</p>
          )}
        </div>
      ))}
    </div>
  )
}