import { useMemo } from "react";
import type { PaginationConfig, PaginationMeta, PageItem } from "./types";

const SIBLING_COUNT = 1;
const BOUNDARY_COUNT = 1;

type UsePaginationInput = Omit<PaginationConfig, "onPageChange">;

export function usePagination({ page, pageSize, total }: UsePaginationInput) {
  const meta: PaginationMeta = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return {
      totalPages,
      startItem,
      endItem,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
      isFirstPage: page === 1,
      isLastPage: page === totalPages,
    };
  }, [page, pageSize, total]);

  const pageItems: PageItem[] = useMemo(() => {
    const { totalPages } = meta;

    const totalPageNumbers = BOUNDARY_COUNT * 2 + SIBLING_COUNT * 2 + 3;
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => ({
        type: "page" as const,
        value: i + 1,
      }));
    }

    const leftSiblingIndex = Math.max(page - SIBLING_COUNT, BOUNDARY_COUNT + 1);
    const rightSiblingIndex = Math.min(page + SIBLING_COUNT, totalPages - BOUNDARY_COUNT);

    const showLeftEllipsis = leftSiblingIndex > BOUNDARY_COUNT + 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - BOUNDARY_COUNT - 1;

    const items: PageItem[] = [];

    for (let i = 1; i <= BOUNDARY_COUNT; i++) {
      items.push({ type: "page", value: i });
    }

    if (showLeftEllipsis) {
      items.push({ type: "ellipsis", id: "left" });
    } else if (leftSiblingIndex === BOUNDARY_COUNT + 2) {
      items.push({ type: "page", value: BOUNDARY_COUNT + 1 });
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      items.push({ type: "page", value: i });
    }

    if (showRightEllipsis) {
      items.push({ type: "ellipsis", id: "right" });
    } else if (rightSiblingIndex === totalPages - BOUNDARY_COUNT - 1) {
      items.push({ type: "page", value: totalPages - BOUNDARY_COUNT });
    }

    for (let i = totalPages - BOUNDARY_COUNT + 1; i <= totalPages; i++) {
      items.push({ type: "page", value: i });
    }

    return items;
  }, [page, meta]);

  return { meta, pageItems };
}
