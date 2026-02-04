export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface PaginationMeta {
  totalPages: number;
  startItem: number;
  endItem: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export type PageItem =
  | { type: "page"; value: number }
  | { type: "ellipsis"; id: string };
