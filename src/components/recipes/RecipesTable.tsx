import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Recipe, RecipeType } from "@/lib/api/recipes";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { getRecipesColumns } from "./columns";
import { RecipeDetailDialog } from "./RecipeDetailDialog";
import { DEFAULT_COLUMN_VISIBILITY } from "./recipes-table.utils";
import { PaginationControls, TableControls } from "./TableControls";

export function RecipesTable() {
	const [globalFilter, setGlobalFilter] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		DEFAULT_COLUMN_VISIBILITY,
	);
	const [selectedType, setSelectedType] = useState<RecipeType | "all">("all");
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

	const queryParams = useMemo(
		() => (selectedType === "all" ? {} : { type: selectedType }),
		[selectedType],
	);

	const { data, isLoading, isError, error } = useRecipes(queryParams);

	const recipes = useMemo(() => data?.data ?? [], [data?.data]);

	const columns = useMemo(() => getRecipesColumns(), []);

	const table = useReactTable({
		data: recipes,
		columns,
		state: {
			globalFilter,
			sorting,
			columnVisibility,
		},
		onGlobalFilterChange: setGlobalFilter,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	if (isLoading) {
		return (
			<Alert>
				<Loader2 className="h-4 w-4 animate-spin" />
				<AlertTitle>Loading</AlertTitle>
				<AlertDescription>Fetching recipes…</AlertDescription>
			</Alert>
		);
	}

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					{error instanceof Error ? error.message : "Unable to load recipes."}
				</AlertDescription>
			</Alert>
		);
	}

	if (!recipes.length) {
		return (
			<div className="rounded-xl border p-6 text-sm text-muted-foreground">
				No recipes yet. Add one through the API to get started.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<TableControls
				table={table}
				globalFilter={globalFilter}
				onGlobalFilterChange={setGlobalFilter}
				selectedType={selectedType}
				onTypeChange={setSelectedType}
				itemsCount={recipes.length}
			/>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								onClick={() => setSelectedRecipe(row.original)}
								className="cursor-pointer hover:bg-accent"
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<PaginationControls table={table} />

			<RecipeDetailDialog
				recipe={selectedRecipe}
				open={!!selectedRecipe}
				onOpenChange={(open) => !open && setSelectedRecipe(null)}
			/>
		</div>
	);
}
