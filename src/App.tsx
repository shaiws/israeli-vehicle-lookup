import { useRef, useState } from 'react'
import { lookupVehicle } from './api/lookup'
import type { LookupResult } from './api/types'
import { DatasetSection } from './components/DatasetSection'
import { PlateInput } from './components/PlateInput'
import { StatusBanner } from './components/StatusBanner'
import { formatPlateDisplay } from './labels'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LookupResult | null>(null)
  const [searched, setSearched] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  async function handleSearch(raw: string) {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    setError(null)
    setResult(null)
    setSearched(true)
    try {
      const data = await lookupVehicle(raw, ac.signal)
      setResult(data)
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const visibleSections =
    result?.sections.filter((s) => s.records.length > 0 || s.error) ?? []

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="text-center">
        <p className="text-sm font-medium text-blue-700">משרד התחבורה · data.gov.il</p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          חיפוש רכב ישראלי
        </h1>
        <p className="mt-2 text-slate-600">
          הזינו מספר רישוי לקבלת נתונים טכניים ממאגרי המידע הפתוחים של משרד
          התחבורה.
        </p>
      </header>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <strong>פרטיות:</strong> מאגרי משרד התחבורה כוללים שדות טכניים של הרכב
        בלבד (יצרן, דגם, צבע, מנוע, בדיקות וכו׳).{' '}
        <strong>אין כאן פרטי בעלים פרטיים</strong> — האפליקציה אינה ממציאה ואינה
        מציגה מידע אישי שאינו קיים בנתונים הפתוחים.
      </div>

      <PlateInput onSearch={handleSearch} loading={loading} />

      <StatusBanner
        loading={loading}
        error={error}
        empty={searched && !loading && !error && !!result && !result.found}
        plate={result?.plate}
      />

      {result?.found && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-950">
          נמצא במאגר:{' '}
          <strong>{result.primaryTitle}</strong>
          {' · '}
          לוחית{' '}
          <span className="font-mono font-bold" dir="ltr">
            {formatPlateDisplay(result.plate)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {visibleSections.map((section) => (
          <DatasetSection
            key={section.key}
            section={section}
            plate={result?.plate ?? ''}
          />
        ))}
      </div>

      <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
        <p>
          מקור: API רשמי של{' '}
          <a
            className="text-blue-700 underline"
            href="https://data.gov.il"
            target="_blank"
            rel="noreferrer"
          >
            data.gov.il
          </a>{' '}
          (CKAN datastore_search) · הקוד ב־GitHub Pages
        </p>
        <p className="mt-1" dir="ltr">
          CORS: data.gov.il returns Access-Control-Allow-Origin: *
        </p>
      </footer>
    </div>
  )
}