import { Input } from "@/components/ui/input";
import { InfoGrid, Section } from "./dialog-helpers";
import { ADDITIONAL_NUMBER_FIELDS } from "./field-configs";
import { hasAdditionalProperties } from "./ingredients-table.utils";
import type {
	IngredientFormState,
	IngredientWithSupplier,
} from "./useIngredientForm";

interface AdditionalPropertiesSectionProps {
	ingredient: IngredientWithSupplier;
	state: IngredientFormState;
	setFieldValue: <K extends keyof IngredientFormState>(
		field: K,
		value: IngredientFormState[K],
	) => void;
	calculatedPac: number;
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

export function AdditionalPropertiesSection({
	ingredient,
	state,
	setFieldValue,
	calculatedPac,
}: AdditionalPropertiesSectionProps) {
	if (!hasAdditionalProperties(ingredient)) {
		return null;
	}

	return (
		<Section title="Additional Properties">
			<InfoGrid>
				{ADDITIONAL_NUMBER_FIELDS.map((field) => (
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
						PAC
					</p>
					<div className="text-sm text-muted-foreground">
						{calculatedPac}
						<span className="text-xs text-gray-400 ml-1">
							(auto-calculated)
						</span>
					</div>
				</div>
				<div className="space-y-1">
					<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Food Composition ID
					</p>
					<Input
						value={state.foodCompositionId}
						onChange={(e) => setFieldValue("foodCompositionId", e.target.value)}
						placeholder="Food composition ID (optional)"
					/>
				</div>
			</InfoGrid>
		</Section>
	);
}
