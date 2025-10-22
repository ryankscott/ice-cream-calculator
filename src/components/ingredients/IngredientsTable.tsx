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
import type { Ingredient } from "@/lib/api/ingredients";
import { useIngredients } from "@/lib/hooks/useIngredients";
import { getIngredientsColumns } from "./columns";
import { IngredientDetailDialog } from "./IngredientDetailDialog";
import { DEFAULT_COLUMN_VISIBILITY } from "./ingredients-table.utils";
import { PaginationControls, TableControls } from "./TableControls";

interface IngredientWithSupplier extends Ingredient {
	supplier?: {
		id: string;
		name: string;
	};
}

export function IngredientsTable() {
	const [globalFilter, setGlobalFilter] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		DEFAULT_COLUMN_VISIBILITY,
	);
	const [selectedIngredient, setSelectedIngredient] =
		useState<IngredientWithSupplier | null>(null);

	const { data, isLoading, isError, error } = useIngredients();

	const ingredients = useMemo(() => data?.data ?? [], [data?.data]);

	const columns = useMemo(() => getIngredientsColumns(), []);

	const table = useReactTable({
		data: ingredients,
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
			<Alert className="">
				<Loader2 className="" />
				<AlertTitle className="">Loading</AlertTitle>
				<AlertDescription className="">Fetching ingredients…</AlertDescription>
			</Alert>
		);
	}

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					{error instanceof Error
						? error.message
						: "Unable to load ingredients."}
				</AlertDescription>
			</Alert>
		);
	}

	if (!ingredients.length) {
		return (
			<div className="rounded-xl border">
				No ingredients yet. Start by adding one from the backend API.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<TableControls
				table={table}
				globalFilter={globalFilter}
				onGlobalFilterChange={setGlobalFilter}
				ingredientsCount={ingredients.length}
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
								onClick={() => setSelectedIngredient(row.original)}
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

			<IngredientDetailDialog
				ingredient={selectedIngredient}
				open={!!selectedIngredient}
				onOpenChange={(open) => !open && setSelectedIngredient(null)}
				allIngredients={ingredients}
			/>
		</div>
	);
}
