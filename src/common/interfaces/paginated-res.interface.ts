export interface PaginatedRes<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}