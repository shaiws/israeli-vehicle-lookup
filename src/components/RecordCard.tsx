import type { CkanRecord } from '../api/types'
import { formatPlateDisplay, isEmptyValue, labelFor } from '../labels'

const HIDDEN = new Set(['_id'])

interface Props {
  record: CkanRecord
  highlightPlate?: string
}

export function RecordCard({ record, highlightPlate }: Props) {
  const entries = Object.entries(record).filter(
    ([k, v]) => !HIDDEN.has(k) && !isEmptyValue(v),
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      {highlightPlate && (
        <div
          className="mb-3 inline-block rounded-md border-2 border-slate-800 bg-yellow-300 px-3 py-1 font-mono text-xl font-bold tracking-wider text-slate-900"
          dir="ltr"
        >
          {formatPlateDisplay(highlightPlate)}
        </div>
      )}
      <dl className="grid gap-2 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100"
          >
            <dt className="text-xs font-medium text-slate-500">
              {labelFor(key)}
            </dt>
            <dd className="mt-0.5 break-words text-sm font-semibold text-slate-900">
              {String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}