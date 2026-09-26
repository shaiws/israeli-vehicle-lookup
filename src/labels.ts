/** Hebrew labels for MOT open-data field names (technical vehicle fields only). */
export const FIELD_LABELS: Record<string, string> = {
  _id: 'מזהה רשומה',
  mispar_rechev: 'מספר רכב',
  MISPAR_RECHEV: 'מספר רכב',
  tozeret_cd: 'קוד יצרן',
  tozeret_nm: 'שם יצרן',
  tozeret_eretz_nm: 'ארץ ייצור',
  sug_degem: 'סוג דגם',
  degem_cd: 'קוד דגם',
  degem_nm: 'שם דגם',
  kinuy_mishari: 'כינוי מסחרי',
  ramat_gimur: 'רמת גימור',
  ramat_eivzur_betihuty: 'רמת איבזור בטיחותי',
  kvutzat_zihum: 'קבוצת זיהום',
  shnat_yitzur: 'שנת ייצור',
  degem_manoa: 'דגם מנוע',
  mispar_manoa: 'מספר מנוע',
  tozar_manoa: 'יצרן מנוע',
  mivchan_acharon_dt: 'תאריך מבחן אחרון',
  tokef_dt: 'תוקף רישוי',
  baalut: 'סוג בעלות',
  baalut_dt: 'תאריך / תקופת בעלות',
  misgeret: 'מספר שלדה / מסגרת',
  mispar_shilda: 'מספר שלדה',
  tzeva_cd: 'קוד צבע',
  tzeva_rechev: 'צבע רכב',
  zmig_kidmi: 'צמיג קדמי',
  zmig_ahori: 'צמיג אחורי',
  mida_zmig_kidmi: 'מידת צמיג קדמי',
  mida_zmig_ahori: 'מידת צמיג אחורי',
  kod_omes_tzmig_kidmi: 'קוד עומס צמיג קדמי',
  kod_omes_tzmig_ahori: 'קוד עומס צמיג אחורי',
  kod_omes_zmig_kidmi: 'קוד עומס צמיג קדמי',
  kod_omes_zmig_ahori: 'קוד עומס צמיג אחורי',
  kod_mehirut_tzmig_kidmi: 'קוד מהירות צמיג קדמי',
  kod_mehirut_tzmig_ahori: 'קוד מהירות צמיג אחורי',
  kod_mehirut_zmig_kidmi: 'קוד מהירות צמיג קדמי',
  kod_mehirut_zmig_ahori: 'קוד מהירות צמיג אחורי',
  sug_delek_cd: 'קוד דלק',
  sug_delek_nm: 'סוג דלק',
  horaat_rishum: 'הוראת רישום',
  moed_aliya_lakvish: 'מועד עלייה לכביש',
  grira_nm: 'גרירה',
  kilometer_test_aharon: 'ק״מ במבחן אחרון',
  shinui_mivne_ind: 'שינוי מבנה',
  gapam_ind: 'גפ״מ',
  shnui_zeva_ind: 'שינוי צבע',
  shinui_zmig_ind: 'שינוי צמיגים',
  rishum_rishon_dt: 'רישום ראשון',
  mkoriut_nm: 'מקוריות',
  sug_rechev_cd: 'קוד סוג רכב',
  sug_rechev_nm: 'סוג רכב',
  sug_rechev_EU_cd: 'סיווג EU',
  sug_rechev_EU_nm: 'סיווג EU (שם)',
  bitul_dt: 'תאריך ביטול',
  bitul_cd: 'קוד ביטול',
  bitul_nm: 'סטטוס ביטול',
  mishkal_kolel: 'משקל כולל',
  mishkal_azmi: 'משקל עצמי',
  mishkal_mitan_harama: 'משקל מטען / הרמה',
  nefach_manoa: 'נפח מנוע',
  hespek: 'הספק',
  hanaa_cd: 'קוד הנעה',
  hanaa_nm: 'הנעה',
  tkina_EU: 'תקינה EU',
  mispar_mekomot: 'מספר מקומות',
  mispar_mekomot_leyd_nahag: 'מקומות ליד הנהג',
  kvutzat_sug_rechev: 'קבוצת סוג רכב',
  sranim: 'סרנים',
  tkina_EU_dup: 'תקינה EU',
  RECALL_ID: 'מזהה ריקול',
  SUG_RECALL: 'סוג ריקול',
  SUG_TAKALA: 'סוג תקלה',
  TEUR_TAKALA: 'תיאור תקלה',
  TAARICH_PTICHA: 'תאריך פתיחה',
  TOZAR_CD: 'קוד יצרן (ריקול)',
  TOZAR_TEUR: 'יצרן (ריקול)',
  DEGEM: 'דגם (ריקול)',
  SHNAT_RECALL: 'שנת ריקול',
  BUILD_BEGIN_A: 'תחילת ייצור',
  BUILD_END_A: 'סוף ייצור',
  OFEN_TIKUN: 'אופן תיקון',
  YEVUAN_TEUR: 'יבואן',
  TELEPHONE: 'טלפון',
  WEBSITE: 'אתר',
}

export function labelFor(field: string): string {
  return FIELD_LABELS[field] ?? field
}

export function formatPlateDisplay(digits: string): string {
  if (digits.length === 7) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
  }
  if (digits.length === 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
  }
  return digits
}

export function isEmptyValue(v: unknown): boolean {
  return v === null || v === undefined || v === ''
}