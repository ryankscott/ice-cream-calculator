import { Input } from "@/components/ui/input";
import { InfoGrid, Section } from "./dialog-helpers";
import { NUTRITIONAL_FIELDS } from "./field-configs";
import { hasNutritionalData } from "./ingredients-table.utils";
import type {
	IngredientFormState,
	IngredientWithSupplier,
} from "./useIngredientForm";

interface NutritionalInfoSectionProps {
	ingredient: IngredientWithSupplier;
	state: IngredientFormState;
	setFieldValue: <K extends keyof IngredientFormState>(
		field: K,
		value: IngredientFormState[K],
	) => void;
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

export function NutritionalInfoSection({
	ingredient,
	state,
	setFieldValue,
}: NutritionalInfoSectionProps) {
	if (!hasNutritionalData(ingredient)) {
		return null;
	}

	return (
		<Section title="Nutritional Information (per 100g)">
			<InfoGrid>
				{NUTRITIONAL_FIELDS.map((field) => (
					<NumberField
						key={field.key}
						label={field.label}
						value={state[field.key]}
						onChange={(value) => setFieldValue(field.key, value)}
						placeholder={field.placeholder}
					/>
				))}
			</InfoGrid>
		</Section>
	);
}
