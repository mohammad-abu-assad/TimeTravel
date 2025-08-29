import { type ReactNode } from 'react'
//import Navbar from '../widgets/Navbar/Navbar'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      
      <main className="container tt-container py-4">
        {children}
      </main>
      <footer className="border-top mt-5 py-3">
        <div className="container tt-container d-flex justify-content-between small text-muted">
          <span>© {new Date().getFullYear()} TimeTravel</span>
          <span>
            <a className="text-decoration-none me-3" href="/privacy">Privacy</a>
            <a className="text-decoration-none" href="/terms">Terms</a>
          </span>
        </div>
      </footer>
    </>
  )
}
