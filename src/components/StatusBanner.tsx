interface Props {
  loading: boolean
  error: string | null
  empty: boolean
  plate?: string
}

export function StatusBanner({ loading, error, empty, plate }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-6 text-center text-blue-900">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
        שולף נתונים מ־data.gov.il…
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-900">
        <strong>שגיאה:</strong> {error}
      </div>
    )
  }
  if (empty) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-slate-700">
        לא נמצאו נתונים למספר{' '}
        <span className="font-mono font-bold" dir="ltr">
          {plate}
        </span>
        .
        <div className="mt-2 text-sm text-slate-500">
          נבדקו מאגרי רישום פעיל, אופנועים, כבד, ציבורי, לא פעיל וביטולים.
        </div>
      </div>
    )
  }
  return null
}