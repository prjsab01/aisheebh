import Section from './Section'
import { Highlight } from '@/types'

interface HighlightsProps {
  highlights: Highlight[]
}

export default function Highlights({ highlights }: HighlightsProps) {
  return (
    <Section title="Highlights">
      <ul className="list-disc list-inside">
        {highlights.map(h => <li key={h.id}>{h.text}</li>)}
      </ul>
    </Section>
  )
}