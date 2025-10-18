import { useQuery } from "@tanstack/react-query";

import { fetchSuppliers, type SupplierListParams } from "../api/suppliers";

export function useSuppliers(params: SupplierListParams = {}) {
	return useQuery({
		queryKey: ["suppliers", params],
		queryFn: () => fetchSuppliers(params),
	});
}
