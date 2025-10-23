import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { InfoGrid, Section } from "./dialog-helpers";
import { SUPPLIER_NUMBER_FIELDS } from "./field-configs";
import { formatCurrency } from "./ingredients-table.utils";
import type { IngredientFormState } from "./useIngredientForm";

interface SupplierInfoSectionProps {
	state: IngredientFormState;
	setFieldValue: <K extends keyof IngredientFormState>(
		field: K,
		value: IngredientFormState[K],
	) => void;
	supplierOptions: Array<{ value: string; label: string }>;
	calculatedCostPer1000gInCentsExGst: number | null;
}

function NumberField({
	label,
	value,
	onChange,
	placeholder = "0",
}: {
	label: string;
	value: number | null;
	onChange: (value: number | null) => void;
	placeholder?: string;
}) {
	return (
		<div className="space-y-1">
			<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
				{label}
			</p>
			<Input
				type="number"
				value={value ?? ""}
				onChange={(event) => {
					const inputValue = event.target.value;
					onChange(inputValue === "" ? null : Number.parseFloat(inputValue));
				}}
				placeholder={placeholder}
			/>
		</div>
	);
}

export function SupplierInfoSection({
	state,
	setFieldValue,
	supplierOptions,
	calculatedCostPer1000gInCentsExGst,
}: SupplierInfoSectionProps) {
	const formattedCostPer1000g =
		calculatedCostPer1000gInCentsExGst === null
			? ""
			: formatCurrency(calculatedCostPer1000gInCentsExGst);

	return (
		<Section title="Supplier">
			<InfoGrid>
				<div className="space-y-1">
					<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Supplier Name
					</p>
					<Combobox
						value={state.supplierId}
						onValueChange={(value) => setFieldValue("supplierId", value)}
						items={supplierOptions}
						placeholder="Select supplier..."
						searchPlaceholder="Search suppliers..."
					/>
				</div>
				<div className="space-y-1">
					<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Supplier Code
					</p>
					<Input
						value={state.supplierCode}
						onChange={(e) => setFieldValue("supplierCode", e.target.value)}
						placeholder="Supplier code (optional)"
					/>
				</div>
				{SUPPLIER_NUMBER_FIELDS.map((field) => (
					<NumberField
						key={field.key}
						label={field.label}
						value={state[field.key]}
						onChange={(value) => setFieldValue(field.key, value)}
						placeholder={field.placeholder}
					/>
				))}
				<div className="space-y-1">
					<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Cost per 1000g
					</p>
					<Input
						value={formattedCostPer1000g}
						readOnly
						placeholder="Enter pack details to calculate"
					/>
					<p className="text-xs text-muted-foreground">
						Calculated from pack cost, size, and useful product %.
					</p>
				</div>
			</InfoGrid>
		</Section>
	);
}
