import { type ReactNode } from 'react'
import Card from '../shared/ui/Card'

export default function AuthLayout({ children, badge = 'TT', title, subtitle }: {
  children: ReactNode
  badge?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container tt-container" style={{ maxWidth: 520 }}>
        <Card>
          <header className="mb-4 text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary mb-3" style={{ width:56, height:56 }}>
              <span className="fw-bold">{badge}</span>
            </div>
            <h2 className="h3 tt-page-title mb-1">{title}</h2>
            {subtitle && <p className="tt-subtitle mb-0">{subtitle}</p>}
          </header>
          {children}
        </Card>
        <p className="text-center text-muted small mt-3 mb-0">
          By continuing, you agree to the <a className="text-decoration-none" href="/terms">Terms</a> and <a className="text-decoration-none" href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
