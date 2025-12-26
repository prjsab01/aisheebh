import { ReactNode } from 'react'

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl mb-8 border border-purple-500/20 shadow-2xl shadow-purple-500/10 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-white border-b border-purple-500/30 pb-2 drop-shadow-lg">{title}</h2>
      <div className="max-h-96 overflow-y-auto scrollbar-custom">
        {children}
      </div>
    </div>
  )
}