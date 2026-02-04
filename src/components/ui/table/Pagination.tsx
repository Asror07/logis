import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useCallback } from "react";
import type { PaginationConfig } from "./types";
import { usePagination } from "./usePagination";

interface PaginationProps extends PaginationConfig {
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  const { meta, pageItems } = usePagination({ page, pageSize, total });

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= meta.totalPages && newPage !== page) {
        onPageChange(newPage);
      }
    },
    [meta.totalPages, page, onPageChange],
  );

  if (meta.totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-between", className)}
    >
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-small text-foreground">{meta.startItem}</span>
        {" - "}
        <span className="font-small text-foreground">{meta.endItem}</span>
        {" of "}
        <span className="font-small text-foreground">{total}</span>
        {" results"}
      </p>

      <div className="flex items-center gap-1">
        <NavButton
          disabled={meta.isFirstPage}
          onClick={() => goToPage(1)}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </NavButton>

        <NavButton
          disabled={!meta.hasPrevious}
          onClick={() => goToPage(page - 1)}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </NavButton>

        <div className="flex items-center gap-1 mx-1">
          {pageItems.map((item) =>
            item.type === "ellipsis" ? (
              <Ellipsis key={item.id} />
            ) : (
              <PageButton
                key={item.value}
                page={item.value}
                isActive={page === item.value}
                onClick={() => goToPage(item.value)}
              />
            ),
          )}
        </div>

        <NavButton
          disabled={!meta.hasNext}
          onClick={() => goToPage(page + 1)}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </NavButton>

        <NavButton
          disabled={meta.isLastPage}
          onClick={() => goToPage(meta.totalPages)}
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </NavButton>
      </div>
    </nav>
  );
}

interface NavButtonProps {
  onClick: () => void;
  disabled: boolean;
  "aria-label": string;
  children: React.ReactNode;
}

function NavButton({ onClick, disabled, children, ...props }: NavButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
}

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      className={cn("h-8 w-8 font-medium", isActive && "pointer-events-none")}
      onClick={onClick}
      aria-label={`Go to page ${page}`}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </Button>
  );
}

function Ellipsis() {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center text-muted-foreground"
      aria-hidden="true"
    >
      ⋯
    </span>
  );
}
