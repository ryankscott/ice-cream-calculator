import React from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type ColumnDef,
	type SortingState,
	type VisibilityState,
	useReactTable,
} from "@tanstack/react-table";
import type { Ingredient, IngredientCategory, IngredientPhysicalType, Status } from "@ice-cream-calculator/shared";
import { IngredientDialog } from "./ingredient-dialog";
import { useIngredients, useDeleteIngredient } from "../hooks/use-ingredients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
	Table, 
	TableBody, 
	TableCell, 
	TableHead, 
	TableHeader, 
	TableRow 
} from "@/components/ui/table";
import { 
	Select, 
	SelectContent, 
	SelectItem, 
	SelectTrigger, 
	SelectValue 
} from "@/components/ui/select";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type IngredientsTableProps = {
	/** Optional callback when a row is clicked */
	onRowClick?: (ingredient: Ingredient) => void;
	/** Optional className for the outer container */
	className?: string;
	/** Initial page size for pagination */
	initialPageSize?: number;
	/** Search term to filter ingredients */
	searchTerm?: string;
	/** Category filter */
	categoryFilter?: IngredientCategory;
	/** Status filter */
	statusFilter?: Status;
	/** Type filter */
	typeFilter?: IngredientPhysicalType;
};

function centsToCurrency(cents: number) {
	if (Number.isNaN(cents)) return "-";
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: "NZD",
		maximumFractionDigits: 2,
	}).format(cents / 100);
}

function titleCase(v: string) {

	return v?.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function IngredientsTable({ 
	onRowClick, 
	className, 
	initialPageSize = 10,
	searchTerm,
	categoryFilter,
	statusFilter,
	typeFilter,
}: IngredientsTableProps) {
	const [page, setPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(initialPageSize);
	const [globalFilter, setGlobalFilter] = React.useState(searchTerm || "");
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	
	// Dialog state
	const [selected, setSelected] = React.useState<Ingredient | null>(null);

	// Fetch ingredients from API
	const { 
		data: apiResponse, 
		isLoading, 
		isError, 
		error,
		refetch 
	} = useIngredients({
		page,
		limit: pageSize,
		search: globalFilter || undefined,
		category: categoryFilter,
		status: statusFilter,
		type: typeFilter as ("Wet" | "Dry" | undefined),
	});

	// Delete mutation
	const deleteMutation = useDeleteIngredient({
		onSuccess: () => {
			setSelected(null);
			refetch();
		},
	});

	// Extract data from API response
	const data = apiResponse?.data?.ingredients || [];
	const totalCount = apiResponse?.data?.pagination?.totalCount || 0;
	const totalPages = apiResponse?.data?.pagination?.totalPages || 1;

	const columns = React.useMemo<ColumnDef<Ingredient, unknown>[]>(
		() => [
			{
				header: "Name",
				accessorKey: "name",
				cell: ({ row }) => (
					<div className="font-medium text-foreground" title={row.original.name}>
						{row.original.name}
					</div>
				),
				enableSorting: true,
			},
			{
				header: "Brand",
				accessorKey: "brand",
				cell: ({ row }) => row.original.brand || "-",
			},
			{
				id: "supplierName",
				header: "Supplier",
				accessorFn: (row) => row.supplier?.name ?? "",
				cell: ({ row }) => row.original.supplier?.name ?? "-",
			},
			{
				header: "Status",
				accessorKey: "status",
				cell: ({ row }) => titleCase(row.original.status),
			},
			{
				header: "Category",
				accessorKey: "category",
				cell: ({ row }) => titleCase(row.original.category),
			},
			{
				header: "Type",
				accessorKey: "type",
				cell: ({ row }) => titleCase(row.original.type),
			},
			{
				header: "$ / kg (ex GST)",
				accessorKey: "costPer1000gInCentsExGST",
				cell: ({ row }) => (
					<div className="tabular-nums">
						{centsToCurrency(row.original.costPer1000gInCentsExGST)}
					</div>
				),
				enableSorting: true,
			},
			{
				header: "Energy (kJ/100g)",
				accessorKey: "energyPer100g",
				cell: ({ row }) => (
					<span className="tabular-nums">{row.original.energyPer100g ?? "-"}</span>
				),
			},
			{
				id: "createdAt",
				header: "Created",
				accessorFn: (row) => new Date(row.createdAt),
				cell: ({ getValue }) => {
					const d = getValue<Date>();
					if (!(d instanceof Date) || Number.isNaN(d?.getTime?.())) return "-";
					return d.toLocaleDateString();
				},
				sortingFn: (a, b, columnId) => {
					const da = (a.getValue(columnId) as Date | undefined)?.getTime?.() ?? 0;
					const db = (b.getValue(columnId) as Date | undefined)?.getTime?.() ?? 0;
					return da - db;
				},
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-1">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="destructive"
									size="sm"
									onClick={(e) => e.stopPropagation()}
									disabled={deleteMutation.isPending}
								>
									{deleteMutation.isPending ? "..." : "Delete"}
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to delete "{row.original.name}"? This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => deleteMutation.mutate(row.original.id)}
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				),
			},
		],
		[deleteMutation]
	);

	const table = useReactTable({
		data,
		columns,
		pageCount: totalPages,
		state: {
			sorting,
			globalFilter,
			columnVisibility,
			pagination: {
				pageIndex: page - 1,
				pageSize,
			},
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				const newState = updater({ pageIndex: page - 1, pageSize });
				setPage(newState.pageIndex + 1);
				setPageSize(newState.pageSize);
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true, // Server-side pagination
		initialState: {
			columnVisibility: {
				createdAt: false,
			},
		},
	});

	// Handle search debouncing
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setPage(1); // Reset to first page when searching
		}, 300);
		return () => clearTimeout(timer);
	}, [globalFilter]);

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-8">
				<div className="text-red-600 dark:text-red-400">
					Error loading ingredients: {error?.message || 'Unknown error'}
				</div>
				<Button
					onClick={() => refetch()}
				>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className={"flex flex-col gap-4 " + (className ?? "")}> 
			{/* Ingredient detail dialog */}
			<IngredientDialog 
				ingredient={selected}
				open={!!selected}
				onOpenChange={(open: boolean) => {
					if (!open) setSelected(null);
				}}
			/>

			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex flex-1 flex-wrap items-center gap-2">
					<Input
						className="h-9 w-full min-w-40 flex-1 sm:w-auto"
						placeholder="Search name, brand, supplier..."
						value={globalFilter ?? ""}
						onChange={(e) => setGlobalFilter(e.target.value)}
						disabled={isLoading}
					/>
					{isLoading && (
						<div className="text-sm text-muted-foreground">
							Loading...
						</div>
					)}
				</div>

				{/* Column visibility */}
				<ColumnVisibilityToggles table={table} />
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const canSort = header.column.getCanSort();
									const sortDir = header.column.getIsSorted();
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : (
												<Button
													variant="ghost"
													size="sm"
													className={
														"h-auto p-0 font-medium justify-start " +
														(canSort ? "hover:underline" : "cursor-default")
													}
													onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
													disabled={!canSort}
												>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{canSort && (
														<span className="ml-1 text-muted-foreground">
															{sortDir === "asc" && "▲"}
															{sortDir === "desc" && "▼"}
															{!sortDir && "↕"}
														</span>
													)}
												</Button>
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell colSpan={table.getAllLeafColumns().length} className="text-left text-muted-foreground h-24">
									{isLoading ? "Loading..." : "No results."}
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="cursor-pointer"
									onClick={() => {
										setSelected(row.original);
										onRowClick?.(row.original);
									}}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<APIPagination 
				currentPage={page}
				totalPages={totalPages}
				totalCount={totalCount}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(newSize) => {
					setPageSize(newSize);
					setPage(1);
				}}
				isLoading={isLoading}
			/>
		</div>
	);
}

function ColumnVisibilityToggles({
	table,
}: {
	table: ReturnType<typeof useReactTable<Ingredient>>;
}) {
	const allLeaf = table.getAllLeafColumns();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					Columns
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				{allLeaf.map((col) => (
					<DropdownMenuCheckboxItem
						key={col.id}
						checked={col.getIsVisible()}
						onCheckedChange={(checked: boolean) => col.toggleVisibility(checked)}
					>
						{String(col.columnDef.header)}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function APIPagination({
	currentPage,
	totalPages,
	totalCount,
	pageSize,
	onPageChange,
	onPageSizeChange,
	isLoading,
}: {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	isLoading: boolean;
}) {
	return (
		<div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span>
					Page {currentPage} of {totalPages || 1}
				</span>
				<span className="hidden sm:inline">•</span>
				<span>{totalCount} total results</span>
				{isLoading && <span>• Loading...</span>}
			</div>
			<div className="flex items-center gap-2">
				<Select
					value={pageSize.toString()}
					onValueChange={(value) => onPageSizeChange(Number(value))}
					disabled={isLoading}
				>
					<SelectTrigger className="w-auto">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{[10, 20, 50].map((size) => (
							<SelectItem key={size} value={size.toString()}>
								{size} / page
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(1)}
						disabled={currentPage <= 1 || isLoading}
					>
						«
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage <= 1 || isLoading}
					>
						Prev
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage >= totalPages || isLoading}
					>
						Next
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(totalPages)}
						disabled={currentPage >= totalPages || isLoading}
					>
						»
					</Button>
				</div>
			</div>
		</div>
	);
}

export default IngredientsTable
