"use client";

import {
  type ColumnFiltersState,
  type ColumnDef,
  flexRender,
  getFilteredRowModel,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  LucideArrowDown,
  LucideArrowUp,
  LucideArrowUpDown,
} from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData, TValue> = {
  columns: Array<ColumnDef<TData, TValue>>;
  data: TData[];
  emptyMessage?: string;
  className?: string;
  getRowClassName?: (rowData: TData) => string | undefined;
  defaultSorting?: SortingState;
  singleColumnSort?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "Žádné záznamy.",
  className,
  getRowClassName,
  defaultSorting,
  singleColumnSort = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting ?? []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: (updater) => {
      setSorting((previousSorting) => {
        const nextSorting =
          typeof updater === "function" ? updater(previousSorting) : updater;

        if (singleColumnSort && nextSorting.length > 1) {
          const lastSorting = nextSorting[nextSorting.length - 1];
          return lastSorting ? [lastSorting] : [];
        }

        return nextSorting;
      });
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: !singleColumnSort,
  });

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : header.column.getCanSort() &&
                    !(header.column.columnDef.meta as { disableAutoSortTrigger?: boolean } | undefined)
                      ?.disableAutoSortTrigger ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-x-1 hover:opacity-80"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getIsSorted() === "asc" ? (
                        <LucideArrowUp size={14} />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <LucideArrowDown size={14} />
                      ) : (
                        <LucideArrowUpDown
                          size={14}
                          className="text-muted-foreground"
                        />
                      )}
                    </button>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={getRowClassName?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
