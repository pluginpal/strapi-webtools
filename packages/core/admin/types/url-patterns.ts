export interface PatternEntity {
  id: number
  documentId: string;
  pattern: string
  contenttype: string
  languages: any[]
  createdAt: string
  updatedAt: string
}

export interface PatternFormValues {
  pattern: string,
  contenttype: string,
  languages: any[],
  localized: boolean,
}

export interface ValidatePatternResponse {
  message: string,
  valid: boolean,
}
