import { RESOURCES, type ResourceDef } from './resources'
import { digitsOnlyPlate, searchByPlate } from './ckan'
import type { DatasetHit, LookupResult } from './types'

const PRIMARY = RESOURCES.filter((r) => r.role === 'primary')
const FALLBACK = RESOURCES.filter((r) => r.role === 'fallback')
const HISTORY = RESOURCES.filter((r) => r.role === 'history')
const RECALL = RESOURCES.filter((r) => r.role === 'recall')

async function queryResource(
  def: ResourceDef,
  plate: string,
  signal?: AbortSignal,
): Promise<DatasetHit> {
  try {
    const { records, total } = await searchByPlate(
      def.resourceId,
      plate,
      def.plateField ?? 'mispar_rechev',
      signal,
    )
    return {
      key: def.key,
      title: def.title,
      resourceId: def.resourceId,
      records,
      total,
    }
  } catch (err) {
    return {
      key: def.key,
      title: def.title,
      resourceId: def.resourceId,
      records: [],
      total: 0,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

function firstRecord(hits: DatasetHit[]) {
  for (const hit of hits) {
    if (hit.records.length > 0) return hit
  }
  return undefined
}

export async function lookupVehicle(
  rawPlate: string,
  signal?: AbortSignal,
): Promise<LookupResult> {
  const plate = digitsOnlyPlate(rawPlate)
  if (!plate || plate.length < 5 || plate.length > 8) {
    throw new Error('יש להזין מספר רישוי בן 5–8 ספרות (ללא מקפים)')
  }

  const errors: string[] = []
  const sections: DatasetHit[] = []

  const primaryHits = await Promise.all(
    PRIMARY.map((d) => queryResource(d, plate, signal)),
  )
  for (const h of primaryHits) {
    sections.push(h)
    if (h.error) errors.push(`${h.title}: ${h.error}`)
  }

  let primaryHit = firstRecord(primaryHits)

  if (!primaryHit) {
    const fallbackHits = await Promise.all(
      FALLBACK.map((d) => queryResource(d, plate, signal)),
    )
    for (const h of fallbackHits) {
      sections.push(h)
      if (h.error) errors.push(`${h.title}: ${h.error}`)
    }
    primaryHit = firstRecord(fallbackHits)
  }

  // Always pull history + recalls when a plate record was found
  if (primaryHit) {
    const pending = [...HISTORY, ...RECALL].filter(
      (d) => !sections.some((s) => s.key === d.key),
    )
    const extraHits = await Promise.all(
      pending.map((d) => queryResource(d, plate, signal)),
    )
    for (const h of extraHits) {
      sections.push(h)
      if (h.error) errors.push(`${h.title}: ${h.error}`)
    }
  }

  const order = [...PRIMARY, ...FALLBACK, ...HISTORY, ...RECALL].map(
    (d) => d.key,
  )
  sections.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))

  return {
    plate,
    found: Boolean(primaryHit),
    primaryKey: primaryHit?.key,
    primaryTitle: primaryHit?.title,
    primary: primaryHit?.records[0],
    sections,
    errors,
  }
}