import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Supplier } from "@/lib/api/suppliers";
import { formatDate } from "./suppliers-table.utils";

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
 * Create a simple text cell renderer
 */
function renderTextCell(value: string | null | undefined): string {
	return value ?? "—";
}

/**
 * Define all available columns for the suppliers table
 */
export const getSuppliersColumns = (): ColumnDef<Supplier>[] => [
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} label="Supplier" />,
		cell: (info) => (
			<button type="button" className="font-medium text-left">
				{info.getValue<string>()}
			</button>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }) => <SortableHeader column={column} label="Email" />,
		cell: (info) => renderTextCell(info.getValue<string | null>()),
	},
	{
		accessorKey: "phone",
		header: ({ column }) => <SortableHeader column={column} label="Phone" />,
		cell: (info) => renderTextCell(info.getValue<string | null>()),
	},
	{
		accessorKey: "address",
		header: ({ column }) => <SortableHeader column={column} label="Address" />,
		cell: (info) => renderTextCell(info.getValue<string | null>()),
	},
	{
		accessorKey: "website",
		header: ({ column }) => <SortableHeader column={column} label="Website" />,
		cell: (info) => {
			const value = info.getValue<string | null>();
			return value ? (
				<a
					href={value}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline"
				>
					{value}
				</a>
			) : (
				"—"
			);
		},
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
