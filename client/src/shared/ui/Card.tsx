import { type ReactNode } from 'react'

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`tt-card ${className ?? ''}`}>
      <div className="tt-card-body">{children}</div>
    </div>
  )
}
