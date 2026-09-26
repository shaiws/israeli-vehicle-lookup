import { useState, type FormEvent } from 'react'

interface Props {
  onSearch: (plate: string) => void
  loading: boolean
}

export function PlateInput({ onSearch, loading }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <label className="sr-only" htmlFor="plate">
        מספר רישוי
      </label>
      <input
        id="plate"
        inputMode="numeric"
        autoComplete="off"
        placeholder="מספר רישוי (לדוגמה 1013860)"
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/[^\d\-]/g, ''))}
        className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-2xl font-bold tracking-widest text-slate-900 shadow-sm outline-none ring-blue-500 focus:ring-2"
        dir="ltr"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="rounded-xl bg-blue-700 px-8 py-3 text-lg font-semibold text-white shadow hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'מחפש…' : 'חיפוש'}
      </button>
    </form>
  )
}