export interface Page<T> {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}
