import { useId } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { InfoGrid, Section } from "./dialog-helpers";
import type { IngredientFormState } from "./useIngredientForm";

interface BasicInfoSectionProps {
	state: IngredientFormState;
	setFieldValue: <K extends keyof IngredientFormState>(
		field: K,
		value: IngredientFormState[K],
	) => void;
	uniqueCategories: string[];
	uniqueTypes: string[];
}

export function BasicInfoSection({
	state,
	setFieldValue,
	uniqueCategories,
	uniqueTypes,
}: BasicInfoSectionProps) {
	const ingredientNameId = useId();

	return (
		<>
			<div>
				<label
					htmlFor={ingredientNameId}
					className="text-sm font-medium mb-2 block"
				>
					Ingredient Name
				</label>
				<Input
					id={ingredientNameId}
					value={state.name}
					onChange={(e) => setFieldValue("name", e.target.value)}
					autoFocus
					placeholder="Ingredient name"
				/>
			</div>

			<Section title="Basic Information">
				<InfoGrid>
					<div className="space-y-1">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Category
						</p>
						<Select
							value={state.category}
							onValueChange={(value) => setFieldValue("category", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								{uniqueCategories.map((cat) => (
									<SelectItem key={cat} value={cat}>
										{cat}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Type
						</p>
						<Select
							value={state.type}
							onValueChange={(value) => setFieldValue("type", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								{uniqueTypes.map((type) => (
									<SelectItem key={type} value={type}>
										{type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Status
						</p>
						<Select
							value={state.status}
							onValueChange={(value) =>
								setFieldValue("status", value as "Active" | "Inactive")
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Active">Active</SelectItem>
								<SelectItem value="Inactive">Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Brand
						</p>
						<Input
							value={state.brand}
							onChange={(e) => setFieldValue("brand", e.target.value)}
							placeholder="Brand (optional)"
						/>
					</div>
				</InfoGrid>
			</Section>
		</>
	);
}
