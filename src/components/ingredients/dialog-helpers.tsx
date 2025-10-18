import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Section container for dialog content
 */
export function Section({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<div>
			<h3 className="text-sm font-semibold mb-3 text-foreground">{title}</h3>
			{children}
		</div>
	);
}

/**
 * Grid layout for displaying information items
 */
export function InfoGrid({ children }: { children: ReactNode }) {
	return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

/**
 * Individual information item with label and value
 */
export interface InfoItemProps {
	label: string;
	value: string | null | undefined;
	badge?: "Active" | "Inactive" | string;
}

export function InfoItem({ label, value, badge }: InfoItemProps) {
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

/**
 * Allergen badge component for displaying allergen status
 */
export function AllergenBadge({ present }: { present: boolean }) {
	return (
		<span
			className={cn(
				"px-2 py-1 rounded text-xs font-medium",
				present
					? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
					: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
			)}
		>
			{present ? "Present" : "Not Present"}
		</span>
	);
}

/**
 * Status badge component for displaying ingredient status
 */
export function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
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
}
