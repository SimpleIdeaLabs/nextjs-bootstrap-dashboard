export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalNumberOfPages: number;
}

export const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalNumberOfPages: 0,
};

export class PaginationParams {
  page!: number;
  limit!: number;
}
