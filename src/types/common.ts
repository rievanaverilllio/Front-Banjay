export type Id = string | number

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export type Nullable<T> = T | null
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
