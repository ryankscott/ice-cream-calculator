import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Recipe } from "@/lib/api/recipes";
import { formatDate, formatIngredientCount } from "./recipes-table.utils";

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
	if (isSorted === "asc") {
		return <ArrowUp className="h-4 w-4" />;
	}
	if (isSorted === "desc") {
		return <ArrowDown className="h-4 w-4" />;
	}
	return null;
}

function SortableHeader({
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

export const getRecipesColumns = (): ColumnDef<Recipe>[] => [
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} label="Recipe" />,
		cell: (info) => (
			<button type="button" className="text-left font-medium">
				{info.getValue<string>()}
			</button>
		),
	},
	{
		accessorKey: "type",
		header: ({ column }) => <SortableHeader column={column} label="Type" />,
		cell: (info) => info.getValue<string>(),
	},
	{
		id: "ingredientsCount",
		accessorFn: (row) => row.ingredients?.length ?? 0,
		header: ({ column }) => (
			<SortableHeader column={column} label="Ingredients" />
		),
		cell: (info) => formatIngredientCount(info.getValue<number>()),
		sortingFn: "alphanumeric",
	},
	{
		accessorKey: "lastModifiedAt",
		header: ({ column }) => (
			<SortableHeader column={column} label="Last Modified" />
		),
		cell: (info) => formatDate(info.getValue<string>()),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <SortableHeader column={column} label="Created" />,
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
