import { Highlight } from '@/types'

interface HighlightsProps {
  highlights: Highlight[]
}

export default function Highlights({ highlights }: HighlightsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-white border-b border-pink-500/30 pb-2">Highlights</h2>
      <div className="grid gap-3">
        {highlights.map(h => (
          <div key={h.id} className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20 backdrop-blur-sm">
            <span className="text-pink-400 text-xl mt-0.5">✨</span>
            <p className="text-gray-300 leading-relaxed">{h.icon && <span className="mr-2">{h.icon}</span>}{h.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}