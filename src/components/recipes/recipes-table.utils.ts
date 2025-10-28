import type { VisibilityState } from "@tanstack/react-table";

export const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {
	id: false,
};

const COLUMN_LABELS: Record<string, string> = {
	name: "Recipe",
	type: "Type",
	ingredientsCount: "Ingredients",
	lastModifiedAt: "Last Modified",
	createdAt: "Created",
	id: "ID",
};

export function getColumnDisplayName(columnId: string): string {
	return COLUMN_LABELS[columnId] ?? columnId;
}

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
	year: "numeric",
	month: "short",
	day: "2-digit",
	minute: "2-digit",
	hour: "2-digit",
});

export function formatDate(timestamp: string | null | undefined): string {
	if (!timestamp) {
		return "—";
	}

	try {
		return DATE_FORMATTER.format(new Date(timestamp));
	} catch {
		return timestamp;
	}
}

export function formatIngredientCount(count: number | undefined): string {
	if (typeof count !== "number") {
		return "—";
	}

	return `${count} item${count === 1 ? "" : "s"}`;
}
