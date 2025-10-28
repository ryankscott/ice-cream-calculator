import { useQuery } from "@tanstack/react-query";

import { fetchRecipes, type RecipeListParams } from "../api/recipes";

export function useRecipes(params: RecipeListParams = {}) {
	return useQuery({
		queryKey: ["recipes", params],
		queryFn: () => fetchRecipes(params),
	});
}
