import type { CkanRecord, DatastoreSearchResult } from './types'
import { CKAN_DATASTORE, CKAN_PACKAGE_SEARCH } from './resources'

export function digitsOnlyPlate(input: string): string {
  return input.replace(/\D/g, '')
}

export async function datastoreSearch(options: {
  resourceId: string
  filters: Record<string, string | number>
  limit?: number
  offset?: number
  signal?: AbortSignal
}): Promise<DatastoreSearchResult> {
  const params = new URLSearchParams({
    resource_id: options.resourceId,
    limit: String(options.limit ?? 100),
    offset: String(options.offset ?? 0),
    filters: JSON.stringify(options.filters),
  })
  const res = await fetch(`${CKAN_DATASTORE}?${params}`, {
    signal: options.signal,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} עבור משאב ${options.resourceId}`)
  }
  return (await res.json()) as DatastoreSearchResult
}

/** Try numeric then zero-padded string plate filters (legacy archives vary). */
export async function searchByPlate(
  resourceId: string,
  plateDigits: string,
  plateField = 'mispar_rechev',
  signal?: AbortSignal,
): Promise<{ records: CkanRecord[]; total: number }> {
  const numeric = Number(plateDigits)
  const variants: Array<string | number> = [numeric]
  if (plateDigits !== String(numeric)) {
    variants.push(plateDigits)
  }
  // Some older archives store zero-padded strings
  if (plateDigits.length < 8) {
    variants.push(plateDigits.padStart(7, '0'), plateDigits.padStart(8, '0'))
  }

  let lastError: unknown
  for (const value of variants) {
    try {
      const data = await datastoreSearch({
        resourceId,
        filters: { [plateField]: value },
        limit: 100,
        signal,
      })
      if (!data.success) {
        lastError = data.error?.message ?? 'CKAN error'
        continue
      }
      const records = data.result?.records ?? []
      const total = data.result?.total ?? records.length
      if (total > 0 || records.length > 0) {
        return { records, total }
      }
      // Empty but successful — keep trying other variants only for string archives
      if (typeof value === 'number') continue
      return { records, total }
    } catch (err) {
      lastError = err
    }
  }

  if (lastError) {
    throw lastError instanceof Error ? lastError : new Error(String(lastError))
  }
  return { records: [], total: 0 }
}

export async function searchRecallsPackage(signal?: AbortSignal): Promise<
  Array<{ id: string; name: string; title: string }>
> {
  const params = new URLSearchParams({
    q: 'ריקול',
    rows: '10',
  })
  const res = await fetch(`${CKAN_PACKAGE_SEARCH}?${params}`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return []
  const json = (await res.json()) as {
    success: boolean
    result?: {
      results?: Array<{
        name: string
        title: string
        resources?: Array<{ id: string; name: string }>
      }>
    }
  }
  if (!json.success) return []
  const out: Array<{ id: string; name: string; title: string }> = []
  for (const pkg of json.result?.results ?? []) {
    for (const r of pkg.resources ?? []) {
      out.push({ id: r.id, name: r.name, title: pkg.title })
    }
  }
  return out
}