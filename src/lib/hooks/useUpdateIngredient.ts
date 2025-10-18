import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Ingredient, updateIngredient } from "../api/ingredients";

export function useUpdateIngredient() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			ingredientId,
			updates,
		}: {
			ingredientId: string;
			updates: Partial<Ingredient>;
		}) => updateIngredient(ingredientId, updates),
		onSuccess: () => {
			// Invalidate the ingredients query to trigger a refetch
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
	});
}
