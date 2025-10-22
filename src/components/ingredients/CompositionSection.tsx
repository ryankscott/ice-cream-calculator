import { Input } from "@/components/ui/input";
import { InfoGrid, Section } from "./dialog-helpers";
import { COMPOSITION_FIELDS } from "./field-configs";
import { hasCompositionData } from "./ingredients-table.utils";
import type {
	IngredientFormState,
	IngredientWithSupplier,
} from "./useIngredientForm";

interface CompositionSectionProps {
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

export function CompositionSection({
	ingredient,
	state,
	setFieldValue,
}: CompositionSectionProps) {
	if (!hasCompositionData(ingredient)) {
		return null;
	}

	return (
		<Section title="Composition Details">
			<InfoGrid>
				{COMPOSITION_FIELDS.map((field) => (
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
