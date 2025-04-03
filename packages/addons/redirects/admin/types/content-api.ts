interface DocumentData {
  documentId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface Meta {
  pagination?: Pagination;
}

export interface GenericResponse<T> {
  data: T;
  meta: Meta;
}

export interface GenericContentManagerResponse<T> {
  results: T;
  pagination: Pagination;
}

export type GenericDocumentResponse = GenericResponse<DocumentData>;
export type GenericMultiDocumentResponse = GenericResponse<DocumentData[]>;
