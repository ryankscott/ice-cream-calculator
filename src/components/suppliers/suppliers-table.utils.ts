import type { Supplier } from "@/lib/api/suppliers";

/**
 * Column metadata mapping field names to human-friendly display names
 */
export const COLUMN_DISPLAY_NAMES: Record<string, string> = {
	name: "Supplier Name",
	email: "Email",
	phone: "Phone",
	address: "Address",
	website: "Website",
	createdAt: "Added",
	lastModifiedAt: "Last Modified",
	id: "ID",
};

/**
 * Get human-friendly display name for a column
 */
export function getColumnDisplayName(columnId: string): string {
	return COLUMN_DISPLAY_NAMES[columnId] || columnId;
}

/**
 * Format date to locale string
 */
export function formatDate(dateString: string): string {
	if (!dateString) return "—";
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return dateString;
	return date.toLocaleDateString();
}

/**
 * Format date with time to locale string
 */
export function formatDateWithTime(dateString: string): string {
	if (!dateString) return "—";
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return dateString;
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Check if a supplier has contact information
 */
export function hasContactInfo(supplier: Supplier): boolean {
	return [
		supplier.email,
		supplier.phone,
		supplier.address,
		supplier.website,
	].some((val) => val !== null && val !== undefined);
}

/**
 * Default column visibility configuration
 */
export const DEFAULT_COLUMN_VISIBILITY: Record<string, boolean> = {
	name: true,
	email: true,
	phone: true,
	address: false,
	website: false,
	createdAt: false,
	lastModifiedAt: false,
	id: false,
};
