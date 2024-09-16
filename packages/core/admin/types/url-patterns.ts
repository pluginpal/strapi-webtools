export interface PatternEntity {
  id: number
  label: string
  pattern: string
  code: string
  contenttype: string
  languages: any[]
  primary?: boolean
  createdAt: string
  updatedAt: string
}

export interface PatternFormValues {
  label: string,
  pattern: string,
  contenttype: string,
  languages: any[],
  localized: boolean,
  code?: string,
  primary?: boolean,
}

export interface ValidatePatternResponse {
  message: string,
  valid: boolean,
}
