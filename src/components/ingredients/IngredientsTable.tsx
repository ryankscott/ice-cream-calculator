import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	AlertCircle,
	ArrowDown,
	ArrowUp,
	ChevronDown,
	Loader2,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";

// Type extension for Ingredient with supplier relation
interface IngredientWithSupplier extends Ingredient {
	supplier?: {
		id: string;
		name: string;
	};
}

// Helper component for dialog sections
function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div>
			<h3 className="text-sm font-semibold mb-3 text-foreground">{title}</h3>
			{children}
		</div>
	);
}

// Helper component for info grid layout
function InfoGrid({ children }: { children: ReactNode }) {
	return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

// Helper component for individual info items
interface InfoItemProps {
	label: string;
	value: string | null | undefined;
	badge?: "Active" | "Inactive" | string;
}

function InfoItem({ label, value, badge }: InfoItemProps) {
	return (
		<div className="space-y-1">
			<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
				{label}
			</p>
			{badge ? (
				<span
					className={cn(
						"inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
						badge === "Active"
							? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
							: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
					)}
				>
					{value}
				</span>
			) : (
				<p className="text-sm font-medium">
					{value && value !== "null" ? (
						value
					) : (
						<span className="text-muted-foreground">—</span>
					)}
				</p>
			)}
		</div>
	);
}

// Helper functions to check if sections have data
function hasNutritionalData(ingredient: Ingredient): boolean {
	return [
		ingredient.energyPer100g,
		ingredient.proteinPer100g,
		ingredient.totalFatPer100g,
		ingredient.saturatedFatPer100g,
		ingredient.totalCarbPer100g,
		ingredient.totalSugarsPer100g,
		ingredient.sodiumMgPer100g,
		ingredient.waterPer100g,
	].some((val) => val !== null && val !== undefined);
}

function hasCompositionData(ingredient: Ingredient): boolean {
	return [
		ingredient.totalSolidsPer100g,
		ingredient.msnfPer100g,
		ingredient.dryCocoaSolidsPer100g,
		ingredient.cocoaButterPer100g,
		ingredient.sucrosePer100g,
		ingredient.glucosePer100g,
		ingredient.fructosePer100g,
		ingredient.otherSugarsPer100g,
		ingredient.alcoholPer100g,
		ingredient.otherSolidsPer100g,
	].some((val) => val !== null && val !== undefined);
}

function hasAdditionalProperties(ingredient: Ingredient): boolean {
	return [
		ingredient.hf,
		ingredient.pac,
		ingredient.pod,
		ingredient.foodCompositionId,
	].some((val) => val !== null && val !== undefined);
}

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
	if (isSorted === "asc") {
		return <ArrowUp className="h-4 w-4" />;
	}
	if (isSorted === "desc") {
		return <ArrowDown className="h-4 w-4" />;
	}
	return null;
}

export function IngredientsTable() {
	const [globalFilter, setGlobalFilter] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [selectedIngredient, setSelectedIngredient] =
		useState<IngredientWithSupplier | null>(null);

	const { data, isLoading, isError, error } = useIngredients();

	const ingredients = useMemo(() => data?.data ?? [], [data?.data]);

	const columns = useMemo<ColumnDef<Ingredient>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<button
						type="button"
						onClick={() => column.toggleSorting()}
						className="inline-flex items-center gap-2 hover:text-foreground"
					>
						Ingredient
						<SortIcon isSorted={column.getIsSorted()} />
					</button>
				),
				cell: (info) => (
					<button type="button" className="font-medium">
						{info.getValue<string>()}
					</button>
				),
			},
			{
				accessorKey: "category",
				header: ({ column }) => (
					<button
						type="button"
						onClick={() => column.toggleSorting()}
						className="inline-flex items-center gap-2 hover:text-foreground"
					>
						Category
						<SortIcon isSorted={column.getIsSorted()} />
					</button>
				),
			},
			{
				accessorKey: "type",
				header: ({ column }) => (
					<button
						type="button"
						onClick={() => column.toggleSorting()}
						className="inline-flex items-center gap-2 hover:text-foreground"
					>
						Type
						<SortIcon isSorted={column.getIsSorted()} />
					</button>
				),
			},
			{
				accessorKey: "status",
				header: ({ column }) => (
					<button
						type="button"
						onClick={() => column.toggleSorting()}
						className="inline-flex items-center gap-2 hover:text-foreground"
					>
						Status
						<SortIcon isSorted={column.getIsSorted()} />
					</button>
				),
				cell: (info) => {
					const status = info.getValue<"Active" | "Inactive">();
					return (
						<span
							className={cn(
								"inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
								status === "Active"
									? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
									: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
							)}
						>
							{status}
						</span>
					);
				},
			},
			{
				accessorKey: "supplier.name",
				header: ({ column }) => (
					<button
						type="button"
						onClick={() => column.toggleSorting()}
						className="inline-flex items-center gap-2 hover:text-foreground"
					>
						Supplier
						<SortIcon isSorted={column.getIsSorted()} />
					</button>
				),
				cell: (info) => info.getValue<string>() ?? "—",
			},
			{
				accessorKey: "createdAt",
				header: ({ column }) => (
					<button
						type="button"
						onClick={() => column.toggleSorting()}
						className="inline-flex items-center gap-2 hover:text-foreground"
					>
						Added
						<SortIcon isSorted={column.getIsSorted()} />
					</button>
				),
				cell: (info) => {
					const value = info.getValue<string>();
					if (!value) return "—";
					const date = new Date(value);
					if (Number.isNaN(date.getTime())) return value;
					return date.toLocaleDateString();
				},
			},
		],
		[],
	);

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
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div className="text-sm text-muted-foreground">
					<h2 className="text-lg font-semibold">Ingredients</h2>
					<p className="text-sm text-muted-foreground">
						{ingredients.length} total ingredients in the catalog.
					</p>
				</div>
				<div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
					<input
						value={globalFilter ?? ""}
						onChange={(event) => setGlobalFilter(event.target.value)}
						placeholder="Filter by name, category, or supplier"
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:w-72"
					/>
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
									<span className="text-sm capitalize">{column.id}</span>
								</label>
							))}
						</div>
					</details>
				</div>
			</div>

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

			<div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
				<span>
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()} ({ingredients.length} total items)
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

			<Dialog
				open={!!selectedIngredient}
				onOpenChange={(open) => !open && setSelectedIngredient(null)}
			>
				<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{selectedIngredient?.name}</DialogTitle>
					</DialogHeader>
					{selectedIngredient && (
						<div className="space-y-6">
							{/* Basic Information */}
							<Section title="Basic Information">
								<InfoGrid>
									<InfoItem
										label="Category"
										value={selectedIngredient.category}
									/>
									<InfoItem label="Type" value={selectedIngredient.type} />
									<InfoItem
										label="Status"
										value={selectedIngredient.status}
										badge={selectedIngredient.status}
									/>
									{selectedIngredient.brand && (
										<InfoItem label="Brand" value={selectedIngredient.brand} />
									)}
									{selectedIngredient.supplierCode && (
										<InfoItem
											label="Supplier Code"
											value={selectedIngredient.supplierCode}
										/>
									)}
								</InfoGrid>
							</Section>

							{/* Nutritional Information */}
							{hasNutritionalData(selectedIngredient) && (
								<Section title="Nutritional Information (per 100g)">
									<InfoGrid>
										{selectedIngredient.energyPer100g !== null &&
											selectedIngredient.energyPer100g !== undefined && (
												<InfoItem
													label="Energy"
													value={`${selectedIngredient.energyPer100g} kcal`}
												/>
											)}
										{selectedIngredient.proteinPer100g !== null &&
											selectedIngredient.proteinPer100g !== undefined && (
												<InfoItem
													label="Protein"
													value={`${selectedIngredient.proteinPer100g}g`}
												/>
											)}
										{selectedIngredient.totalFatPer100g !== null &&
											selectedIngredient.totalFatPer100g !== undefined && (
												<InfoItem
													label="Total Fat"
													value={`${selectedIngredient.totalFatPer100g}g`}
												/>
											)}
										{selectedIngredient.saturatedFatPer100g !== null &&
											selectedIngredient.saturatedFatPer100g !== undefined && (
												<InfoItem
													label="Saturated Fat"
													value={`${selectedIngredient.saturatedFatPer100g}g`}
												/>
											)}
										{selectedIngredient.totalCarbPer100g !== null &&
											selectedIngredient.totalCarbPer100g !== undefined && (
												<InfoItem
													label="Total Carbohydrates"
													value={`${selectedIngredient.totalCarbPer100g}g`}
												/>
											)}
										{selectedIngredient.totalSugarsPer100g !== null &&
											selectedIngredient.totalSugarsPer100g !== undefined && (
												<InfoItem
													label="Total Sugars"
													value={`${selectedIngredient.totalSugarsPer100g}g`}
												/>
											)}
										{selectedIngredient.sodiumMgPer100g !== null &&
											selectedIngredient.sodiumMgPer100g !== undefined && (
												<InfoItem
													label="Sodium"
													value={`${selectedIngredient.sodiumMgPer100g}mg`}
												/>
											)}
									</InfoGrid>
								</Section>
							)}

							{/* Composition Details */}
							{hasCompositionData(selectedIngredient) && (
								<Section title="Composition Details">
									<InfoGrid>
										{selectedIngredient.waterPer100g !== null &&
											selectedIngredient.waterPer100g !== undefined && (
												<InfoItem
													label="Water"
													value={`${selectedIngredient.waterPer100g}g`}
												/>
											)}
										{selectedIngredient.totalSolidsPer100g !== null &&
											selectedIngredient.totalSolidsPer100g !== undefined && (
												<InfoItem
													label="Total Solids"
													value={`${selectedIngredient.totalSolidsPer100g}g`}
												/>
											)}
										{selectedIngredient.msnfPer100g !== null &&
											selectedIngredient.msnfPer100g !== undefined && (
												<InfoItem
													label="MSNF"
													value={`${selectedIngredient.msnfPer100g}g`}
												/>
											)}
										{selectedIngredient.dryCocoaSolidsPer100g !== null &&
											selectedIngredient.dryCocoaSolidsPer100g !==
												undefined && (
												<InfoItem
													label="Dry Cocoa Solids"
													value={`${selectedIngredient.dryCocoaSolidsPer100g}g`}
												/>
											)}
										{selectedIngredient.cocoaButterPer100g !== null &&
											selectedIngredient.cocoaButterPer100g !== undefined && (
												<InfoItem
													label="Cocoa Butter"
													value={`${selectedIngredient.cocoaButterPer100g}g`}
												/>
											)}
										{selectedIngredient.sucrosePer100g !== null &&
											selectedIngredient.sucrosePer100g !== undefined && (
												<InfoItem
													label="Sucrose"
													value={`${selectedIngredient.sucrosePer100g}g`}
												/>
											)}
										{selectedIngredient.glucosePer100g !== null &&
											selectedIngredient.glucosePer100g !== undefined && (
												<InfoItem
													label="Glucose"
													value={`${selectedIngredient.glucosePer100g}g`}
												/>
											)}
										{selectedIngredient.fructosePer100g !== null &&
											selectedIngredient.fructosePer100g !== undefined && (
												<InfoItem
													label="Fructose"
													value={`${selectedIngredient.fructosePer100g}g`}
												/>
											)}
										{selectedIngredient.otherSugarsPer100g !== null &&
											selectedIngredient.otherSugarsPer100g !== undefined && (
												<InfoItem
													label="Other Sugars"
													value={`${selectedIngredient.otherSugarsPer100g}g`}
												/>
											)}
										{selectedIngredient.alcoholPer100g !== null &&
											selectedIngredient.alcoholPer100g !== undefined && (
												<InfoItem
													label="Alcohol"
													value={`${selectedIngredient.alcoholPer100g}g`}
												/>
											)}
										{selectedIngredient.otherSolidsPer100g !== null &&
											selectedIngredient.otherSolidsPer100g !== undefined && (
												<InfoItem
													label="Other Solids"
													value={`${selectedIngredient.otherSolidsPer100g}g`}
												/>
											)}
									</InfoGrid>
								</Section>
							)}

							{/* Supplier Information */}
							<Section title="Supplier">
								<InfoGrid>
									{selectedIngredient.supplier && (
										<InfoItem
											label="Supplier Name"
											value={selectedIngredient.supplier.name}
										/>
									)}
									{selectedIngredient.costPerPackInCentsExGst !== null &&
										selectedIngredient.costPerPackInCentsExGst !==
											undefined && (
											<InfoItem
												label="Cost per Pack"
												value={`$${(selectedIngredient.costPerPackInCentsExGst / 100).toFixed(2)}`}
											/>
										)}
									{selectedIngredient.costPer1000gInCentsExGst !== null &&
										selectedIngredient.costPer1000gInCentsExGst !==
											undefined && (
											<InfoItem
												label="Cost per 1000g"
												value={`$${(selectedIngredient.costPer1000gInCentsExGst / 100).toFixed(2)}`}
											/>
										)}
									{selectedIngredient.packageSizeInGrams !== null &&
										selectedIngredient.packageSizeInGrams !== undefined && (
											<InfoItem
												label="Package Size"
												value={`${selectedIngredient.packageSizeInGrams}g`}
											/>
										)}
									{selectedIngredient.percentOfUsefulProduct !== null &&
										selectedIngredient.percentOfUsefulProduct !== undefined && (
											<InfoItem
												label="Useful Product %"
												value={`${selectedIngredient.percentOfUsefulProduct}%`}
											/>
										)}
								</InfoGrid>
							</Section>

							{/* Additional Properties */}
							{hasAdditionalProperties(selectedIngredient) && (
								<Section title="Additional Properties">
									<InfoGrid>
										{selectedIngredient.hf !== null &&
											selectedIngredient.hf !== undefined && (
												<InfoItem
													label="Hardness Factor"
													value={String(selectedIngredient.hf)}
												/>
											)}
										{selectedIngredient.pac !== null &&
											selectedIngredient.pac !== undefined && (
												<InfoItem
													label="PAC"
													value={String(selectedIngredient.pac)}
												/>
											)}
										{selectedIngredient.pod !== null &&
											selectedIngredient.pod !== undefined && (
												<InfoItem
													label="POD"
													value={String(selectedIngredient.pod)}
												/>
											)}
										{selectedIngredient.foodCompositionId && (
											<InfoItem
												label="Food Composition ID"
												value={selectedIngredient.foodCompositionId}
											/>
										)}
									</InfoGrid>
								</Section>
							)}

							{/* Allergens */}
							{selectedIngredient.allergens &&
								Object.keys(selectedIngredient.allergens).length > 0 && (
									<Section title="Allergens">
										<div className="space-y-2">
											{Object.entries(selectedIngredient.allergens).map(
												([allergen, value]) => (
													<div
														key={allergen}
														className="flex items-center justify-between text-sm"
													>
														<span className="capitalize">{allergen}</span>
														<span
															className={cn(
																"px-2 py-1 rounded text-xs font-medium",
																value
																	? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
																	: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
															)}
														>
															{value ? "Present" : "Not Present"}
														</span>
													</div>
												),
											)}
										</div>
									</Section>
								)}

							{/* Metadata */}
							<Section title="Metadata">
								<InfoGrid>
									<InfoItem
										label="Created"
										value={new Date(
											selectedIngredient.createdAt,
										).toLocaleDateString(undefined, {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									/>
									<InfoItem
										label="Last Modified"
										value={new Date(
											selectedIngredient.lastModifiedAt,
										).toLocaleDateString(undefined, {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									/>
									<InfoItem label="ID" value={selectedIngredient.id} />
								</InfoGrid>
							</Section>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
