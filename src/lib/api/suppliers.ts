import type { components } from "@/server/generated/openapi-types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

export type Supplier = components["schemas"]["Supplier"];
export type SupplierListResponse =
	components["schemas"]["SupplierListResponse"];

export interface SupplierListParams {
	page?: number;
	pageSize?: number;
}

export async function fetchSuppliers(
	params: SupplierListParams = {},
): Promise<SupplierListResponse> {
	const url = new URL(`${API_BASE}/suppliers`, window.location.origin);
	const { page = 1, pageSize = 10 } = params;
	url.searchParams.set("page", String(page));
	url.searchParams.set("pageSize", String(pageSize));

	const response = await fetch(url.toString(), {
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		const body = await response.json().catch(() => undefined);
		throw new Error(body?.message ?? "Failed to load suppliers");
	}

	const data = (await response.json()) as SupplierListResponse;
	return data;
}

export async function updateSupplier(
	supplierId: string,
	updates: Partial<Supplier>,
): Promise<Supplier> {
	const url = new URL(
		`${API_BASE}/suppliers/${supplierId}`,
		window.location.origin,
	);

	const response = await fetch(url.toString(), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(updates),
	});

	if (!response.ok) {
		const body = await response.json().catch(() => undefined);
		throw new Error(body?.message ?? "Failed to update supplier");
	}

	const data = (await response.json()) as Supplier;
	return data;
}
