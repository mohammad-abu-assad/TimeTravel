export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="h3 tt-page-title mb-1">{title}</h1>
      {subtitle && <p className="tt-subtitle mb-0">{subtitle}</p>}
    </div>
  )
}
