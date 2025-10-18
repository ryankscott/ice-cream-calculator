import type { ReactNode } from "react";

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
}

export function InfoItem({ label, value }: InfoItemProps) {
	return (
		<div className="space-y-1">
			<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
				{label}
			</p>
			<p className="text-sm font-medium">
				{value && value !== "null" ? (
					value
				) : (
					<span className="text-muted-foreground">—</span>
				)}
			</p>
		</div>
	);
}
