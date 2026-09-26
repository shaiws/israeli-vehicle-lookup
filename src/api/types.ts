export type CkanRecord = Record<string, string | number | boolean | null | undefined>

export interface CkanField {
  id: string
  type: string
}

export interface DatastoreSearchResult {
  success: boolean
  result?: {
    resource_id: string
    fields: CkanField[]
    records: CkanRecord[]
    total: number
  }
  error?: { message?: string; __type?: string }
}

export interface DatasetHit {
  key: string
  title: string
  resourceId: string
  records: CkanRecord[]
  total: number
  error?: string
}

export interface LookupResult {
  plate: string
  found: boolean
  primaryKey?: string
  primaryTitle?: string
  primary?: CkanRecord
  sections: DatasetHit[]
  errors: string[]
}