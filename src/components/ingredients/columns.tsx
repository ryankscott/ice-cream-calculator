import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Ingredient } from "@/lib/api/ingredients";
import { StatusBadge } from "./dialog-helpers";
import {
	formatCurrency,
	formatDate,
	formatNumber,
} from "./ingredients-table.utils";

/**
 * Sort icon component for column headers
 */
export function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
	if (isSorted === "asc") {
		return <ArrowUp className="h-4 w-4" />;
	}
	if (isSorted === "desc") {
		return <ArrowDown className="h-4 w-4" />;
	}
	return null;
}

/**
 * Sortable header button component
 */
export function SortableHeader({
	column,
	label,
}: {
	column: {
		toggleSorting: () => void;
		getIsSorted: () => false | "asc" | "desc";
	};
	label: string;
}) {
	return (
		<button
			type="button"
			onClick={() => column.toggleSorting()}
			className="inline-flex items-center gap-2 hover:text-foreground"
		>
			{label}
			<SortIcon isSorted={column.getIsSorted()} />
		</button>
	);
}

/**
 * Create a simple number cell renderer
 */
function renderNumberCell(value: number | null): string {
	return value !== null ? `${value}` : "—";
}

/**
 * Create a simple text cell renderer
 */
function renderTextCell(value: string | null | undefined): string {
	return value ?? "—";
}

/**
 * Define all available columns for the ingredients table
 */
export const getIngredientsColumns = (): ColumnDef<Ingredient>[] => [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<SortableHeader column={column} label="Ingredient" />
		),
		cell: (info) => (
			<button type="button" className="font-medium text-left">
				{info.getValue<string>()}
			</button>
		),
	},
	{
		accessorKey: "category",
		header: ({ column }) => <SortableHeader column={column} label="Category" />,
	},
	{
		accessorKey: "type",
		header: ({ column }) => <SortableHeader column={column} label="Type" />,
	},
	{
		accessorKey: "status",
		header: ({ column }) => <SortableHeader column={column} label="Status" />,
		cell: (info) => (
			<StatusBadge status={info.getValue<"Active" | "Inactive">()} />
		),
	},
	{
		accessorKey: "brand",
		header: ({ column }) => <SortableHeader column={column} label="Brand" />,
		cell: (info) => renderTextCell(info.getValue<string | null>()),
	},
	{
		accessorKey: "supplier.name",
		header: ({ column }) => <SortableHeader column={column} label="Supplier" />,
		cell: (info) => renderTextCell(info.getValue<string>()),
	},
	{
		accessorKey: "supplierCode",
		header: ({ column }) => (
			<SortableHeader column={column} label="Supplier Code" />
		),
		cell: (info) => renderTextCell(info.getValue<string | null>()),
	},
	{
		accessorKey: "energyPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Energy (kcal)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "proteinPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Protein (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "totalFatPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Total Fat (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "saturatedFatPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Saturated Fat (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "totalCarbPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Total Carbs (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "totalSugarsPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Total Sugars (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "sodiumMgPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Sodium (mg)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "waterPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Water (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "totalSolidsPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Total Solids (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "otherSolidsPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Other Solids (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "msnfPer100g",
		header: ({ column }) => <SortableHeader column={column} label="MSNF (g)" />,
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "sucrosePer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Sucrose (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "fructosePer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Fructose (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "glucosePer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Glucose (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "dextrosePer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Dextrose (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "alcoholPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Alcohol (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "otherSugarsPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Other Sugars (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "dryCocoaSolidsPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Dry Cocoa Solids (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "cocoaButterPer100g",
		header: ({ column }) => (
			<SortableHeader column={column} label="Cocoa Butter (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "packageSizeInGrams",
		header: ({ column }) => (
			<SortableHeader column={column} label="Package Size (g)" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "costPerPackInCentsExGst",
		header: ({ column }) => (
			<SortableHeader column={column} label="Cost per Pack" />
		),
		cell: (info) => formatCurrency(info.getValue<number | null>()),
	},
	{
		accessorKey: "costPer1000gInCentsExGst",
		header: ({ column }) => (
			<SortableHeader column={column} label="Cost per 1000g" />
		),
		cell: (info) => formatCurrency(info.getValue<number | null>()),
	},
	{
		accessorKey: "percentOfUsefulProduct",
		header: ({ column }) => (
			<SortableHeader column={column} label="Useful Product %" />
		),
		cell: (info) => formatNumber(info.getValue<number | null>(), "%"),
	},
	{
		accessorKey: "pac",
		header: ({ column }) => <SortableHeader column={column} label="PAC" />,
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "pod",
		header: ({ column }) => <SortableHeader column={column} label="POD" />,
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "hf",
		header: ({ column }) => (
			<SortableHeader column={column} label="Hardness Factor" />
		),
		cell: (info) => renderNumberCell(info.getValue<number | null>()),
	},
	{
		accessorKey: "foodCompositionId",
		header: ({ column }) => (
			<SortableHeader column={column} label="Food Composition ID" />
		),
		cell: (info) => renderTextCell(info.getValue<string | null>()),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <SortableHeader column={column} label="Added" />,
		cell: (info) => formatDate(info.getValue<string>()),
	},
	{
		accessorKey: "lastModifiedAt",
		header: ({ column }) => (
			<SortableHeader column={column} label="Last Modified" />
		),
		cell: (info) => formatDate(info.getValue<string>()),
	},
	{
		accessorKey: "id",
		header: ({ column }) => <SortableHeader column={column} label="ID" />,
		cell: (info) => {
			const value = info.getValue<string>();
			return value ? value.slice(0, 8) : "—";
		},
	},
];
