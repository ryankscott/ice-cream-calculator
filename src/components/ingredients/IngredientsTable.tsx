import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { useIngredients } from '@/lib/hooks/useIngredients'
import type { Ingredient } from '@/lib/api/ingredients'

const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: 'name',
    header: 'Ingredient',
    cell: (info) => (
      <div className="font-medium text-slate-200">{info.getValue<string>()}</div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue<'Active' | 'Inactive'>()
      return (
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
            status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-300'
              : 'bg-amber-500/10 text-amber-300',
          )}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: 'supplier.name',
    header: 'Supplier',
    cell: (info) => info.getValue<string>() ?? '—',
  },
  {
    accessorKey: 'createdAt',
    header: 'Added',
    cell: (info) => {
      const value = info.getValue<string>()
      if (!value) return '—'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      return date.toLocaleDateString()
    },
  },
]

export function IngredientsTable() {
  const [globalFilter, setGlobalFilter] = useState('')
  const { data, isLoading, isError, error } = useIngredients()

  const ingredients = useMemo(() => data?.data ?? [], [data])

  const table = useReactTable({
    data: ingredients,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 text-slate-300">
        Loading ingredients…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-400/40 bg-red-900/20 p-6 text-red-200">
        {error instanceof Error ? error.message : 'Unable to load ingredients.'}
      </div>
    )
  }

  if (!ingredients.length) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 text-slate-300">
        No ingredients yet. Start by adding one from the backend API.
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/40 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">Ingredients</h2>
          <p className="text-sm text-slate-300">
            {data?.meta.totalItems ?? 0} total ingredients in the catalog.
          </p>
        </div>
        <input
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Filter by name, category, or supplier"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none md:w-72"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 bg-slate-950/40 text-slate-200">
          <thead className="bg-slate-900/60 text-left text-xs uppercase tracking-wide text-slate-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-900 text-sm">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-900/60">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
        <span>
          Showing {table.getRowModel().rows.length} of {data?.meta.totalItems ?? 0}{' '}
          items
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 disabled:opacity-40"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 disabled:opacity-40"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

