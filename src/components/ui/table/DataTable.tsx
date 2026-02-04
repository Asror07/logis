import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Pagination } from "./Pagination";
import type { Column } from "./types";

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  getRowKey?: (row: T, index: number) => string | number;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  className?: string;
}

export function CustomTable<T>({
  data,
  columns,
  onRowClick,
  getRowKey = (_, index) => index,
  page,
  pageSize,
  total,
  onPageChange,
  emptyMessage = "No results found.",
  className,
}: CustomTableProps<T>) {
  const isClickable = Boolean(onRowClick);
  const hasPagination = page !== undefined && pageSize !== undefined && total !== undefined && onPageChange !== undefined;

  return (
    <div className={cn("space-y-4", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow
                key={getRowKey(row, idx)}
                onClick={() => onRowClick?.(row)}
                className={cn(isClickable && "cursor-pointer hover:bg-muted/50")}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {hasPagination && (
        <div className="px-4 pb-4">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
