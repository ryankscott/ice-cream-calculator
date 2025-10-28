import type { components } from "@/server/generated/openapi-types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

export type Recipe = components["schemas"]["Recipe"];
export type RecipeListResponse = components["schemas"]["RecipeListResponse"];
export type RecipeType = components["schemas"]["RecipeType"];

export interface RecipeListParams {
	type?: RecipeType;
}

export async function fetchRecipes(
	params: RecipeListParams = {},
): Promise<RecipeListResponse> {
	const url = new URL(`${API_BASE}/recipes`, window.location.origin);
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		url.searchParams.set(key, String(value));
	}

	const response = await fetch(url.toString(), {
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		const body = await response.json().catch(() => undefined);
		throw new Error(body?.message ?? "Failed to load recipes");
	}

	return (await response.json()) as RecipeListResponse;
}
