import type { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import type { RecipeType } from "@/lib/api/recipes";
import { getColumnDisplayName } from "./recipes-table.utils";

interface TableControlsProps<T> {
	table: Table<T>;
	globalFilter: string;
	onGlobalFilterChange: (value: string) => void;
	selectedType: RecipeType | "all";
	onTypeChange: (value: RecipeType | "all") => void;
	itemsCount: number;
}

const TYPE_OPTIONS: Array<{ value: RecipeType | "all"; label: string }> = [
	{ value: "all", label: "All types" },
	{ value: "MilkBased", label: "Milk based" },
	{ value: "FruitBased", label: "Fruit based" },
	{ value: "FruitWithFat", label: "Fruit with fat" },
];

export function TableControls<T>({
	table,
	globalFilter,
	onGlobalFilterChange,
	selectedType,
	onTypeChange,
	itemsCount,
}: TableControlsProps<T>) {
	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 className="text-lg font-semibold">Recipes</h2>
					<p className="text-sm text-muted-foreground">
						{itemsCount} total recipes.
					</p>
				</div>
				<div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
					<input
						value={globalFilter ?? ""}
						onChange={(event) => onGlobalFilterChange(event.target.value)}
						placeholder="Filter recipes"
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:w-64"
					/>
					<select
						value={selectedType}
						onChange={(event) =>
							onTypeChange(event.target.value as RecipeType | "all")
						}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-48"
					>
						{TYPE_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<ColumnVisibilityDropdown table={table} />
				</div>
			</div>
		</div>
	);
}

function ColumnVisibilityDropdown<T>({ table }: { table: Table<T> }) {
	return (
		<details className="relative inline-block">
			<summary className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
				Columns
				<ChevronDown className="h-4 w-4" />
			</summary>
			<div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-input bg-background p-2 shadow-md">
				{table.getAllLeafColumns().map((column) => (
					<label
						key={column.id}
						className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-accent"
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

export function PaginationControls<T>({ table }: { table: Table<T> }) {
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
