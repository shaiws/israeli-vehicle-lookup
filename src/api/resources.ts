export interface ResourceDef {
  key: string
  title: string
  resourceId: string
  /** Filter field name in datastore (defaults to mispar_rechev) */
  plateField?: string
  role: 'primary' | 'fallback' | 'history' | 'recall'
}

/** Official MOT / data.gov.il CKAN datastore resource_ids */
export const RESOURCES: ResourceDef[] = [
  {
    key: 'active',
    title: 'רישום פעיל — פרטי / מסחרי',
    resourceId: '053cea08-09bc-40ec-8f7a-156f0677aff3',
    role: 'primary',
  },
  {
    key: 'continuation',
    title: 'המשך רישום פעיל (צמיגים / גרירה)',
    resourceId: '0866573c-40cd-4ca8-91d2-9dd2d7a492e5',
    role: 'history',
  },
  {
    key: 'odometer',
    title: 'היסטוריה — קילומטרים ובדיקות',
    resourceId: '56063a99-8a3e-4ff4-912e-5966c0279bad',
    role: 'history',
  },
  {
    key: 'ownership',
    title: 'היסטוריית סוג בעלות',
    resourceId: 'bb2355dc-9ec7-4f06-9c3f-3344672171da',
    role: 'history',
  },
  {
    key: 'cancelled',
    title: 'ביטול סופי',
    resourceId: '851ecab1-0622-4dbe-a6c7-f950cf82abf9',
    role: 'fallback',
  },
  {
    key: 'cancelled_older_a',
    title: 'ביטול סופי (ארכיון ישן)',
    resourceId: '4e6b9724-4c1e-43f0-909a-154d4cc4e046',
    role: 'fallback',
  },
  {
    key: 'cancelled_older_b',
    title: 'ביטול סופי (ארכיון נוסף)',
    resourceId: 'ec8cbc34-72e1-4b69-9c48-22821ba0bd6c',
    role: 'fallback',
  },
  {
    key: 'inactive_no_model',
    title: 'לא פעיל — ללא דגם',
    resourceId: '6f6acd03-f351-4a8f-8ecf-df792f4f573a',
    role: 'fallback',
  },
  {
    key: 'inactive_with_model',
    title: 'לא פעיל — עם דגם',
    resourceId: 'f6efe89a-fb3d-43a4-bb61-9bf12a9b9099',
    role: 'fallback',
  },
  {
    key: 'heavy',
    title: 'רכב כבד',
    resourceId: 'cd3acc5c-03c3-4c89-9c54-d40f93c0d790',
    role: 'fallback',
  },
  {
    key: 'motorcycle',
    title: 'אופנועים',
    resourceId: 'bf9df4e2-d90d-4c0a-a400-19e15af8e95f',
    role: 'fallback',
  },
  {
    key: 'public',
    title: 'רכב ציבורי',
    resourceId: 'cf29862d-ca25-4691-84f6-1be60dcb4a1e',
    role: 'fallback',
  },
  {
    key: 'recall_by_plate',
    title: 'ריקול / הגבלת ריקול לפי מספר רכב',
    resourceId: '36bf1404-0be4-49d2-82dc-2f1ead4a8b93',
    plateField: 'MISPAR_RECHEV',
    role: 'recall',
  },
]

export const RECALL_BY_MODEL_RESOURCE =
  '2c33523f-87aa-44ec-a736-edbb0a82975e'

export const CKAN_DATASTORE =
  'https://data.gov.il/api/3/action/datastore_search'

export const CKAN_PACKAGE_SEARCH =
  'https://data.gov.il/api/3/action/package_search'