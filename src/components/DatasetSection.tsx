import type { DatasetHit } from '../api/types'
import { RecordCard } from './RecordCard'

interface Props {
  section: DatasetHit
  plate: string
}

export function DatasetSection({ section, plate }: Props) {
  if (section.error) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-lg font-bold text-amber-900">{section.title}</h2>
        <p className="mt-1 text-sm text-amber-800">שגיאה: {section.error}</p>
      </section>
    )
  }

  if (section.records.length === 0) return null

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
        <span className="text-xs text-slate-500">
          {section.total} רשומות ·{' '}
          <code className="rounded bg-slate-100 px-1" dir="ltr">
            {section.resourceId.slice(0, 8)}…
          </code>
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {section.records.map((rec, i) => (
          <RecordCard
            key={`${section.key}-${i}`}
            record={rec}
            highlightPlate={i === 0 ? plate : undefined}
          />
        ))}
      </div>
    </section>
  )
}