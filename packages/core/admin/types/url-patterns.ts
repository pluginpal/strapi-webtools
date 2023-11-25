export interface PatternEntity {
  id: number
  label: string
  pattern: string
  code: string
  contenttype: string
  languages: any[]
  createdAt: string
  updatedAt: string
}

export interface PatternFormValues {
  label: string,
  pattern: string,
  contenttype: string,
  languages: any[],
  code?: string,
}

export interface ValidatePatternResponse {
  message: string,
  valid: boolean,
}
