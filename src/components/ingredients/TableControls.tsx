import type { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import type { Ingredient } from "@/lib/api/ingredients";
import { getColumnDisplayName } from "./ingredients-table.utils";

interface TableControlsProps {
	table: Table<Ingredient>;
	globalFilter: string;
	onGlobalFilterChange: (value: string) => void;
	ingredientsCount: number;
}

/**
 * Table controls component with search, column visibility, and pagination
 */
export function TableControls({
	table,
	globalFilter,
	onGlobalFilterChange,
	ingredientsCount,
}: TableControlsProps) {
	return (
		<div className="space-y-4">
			{/* Header and Filter Section */}
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div className="text-sm text-muted-foreground">
					<h2 className="text-lg font-semibold">Ingredients</h2>
					<p className="text-sm text-muted-foreground">
						{ingredientsCount} total ingredients in the catalog.
					</p>
				</div>
				<div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
					<input
						value={globalFilter ?? ""}
						onChange={(event) => onGlobalFilterChange(event.target.value)}
						placeholder="Filter by name, category, or supplier"
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:w-72"
					/>
					<ColumnVisibilityDropdown table={table} />
				</div>
			</div>
		</div>
	);
}

/**
 * Column visibility dropdown component
 */
function ColumnVisibilityDropdown({ table }: { table: Table<Ingredient> }) {
	return (
		<details className="inline-block">
			<summary className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium cursor-pointer hover:bg-accent">
				Columns
				<ChevronDown className="h-4 w-4" />
			</summary>
			<div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-input bg-background p-2 shadow-md">
				{table.getAllLeafColumns().map((column) => (
					<label
						key={column.id}
						className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-accent"
					>
						<input
							type="checkbox"
							checked={column.getIsVisible()}
							onChange={column.getToggleVisibilityHandler()}
							className="rounded border border-input"
						/>
						<span className="text-sm">{getColumnDisplayName(column.id)}</span>
					</label>
				))}
			</div>
		</details>
	);
}

/**
 * Pagination controls component
 */
export function PaginationControls({ table }: { table: Table<Ingredient> }) {
	const pageCount = table.getPageCount();
	const pageIndex = table.getState().pagination.pageIndex;
	const rowCount = table.getFilteredRowModel().rows.length;

	return (
		<div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
			<span>
				Page {pageIndex + 1} of {pageCount} ({rowCount} total items)
			</span>
			<div className="flex gap-2">
				<button
					type="button"
					className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</button>
				<button
					type="button"
					className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</button>
			</div>
		</div>
	);
}
