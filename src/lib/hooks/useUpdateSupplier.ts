import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Supplier, updateSupplier } from "../api/suppliers";

export function useUpdateSupplier() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			supplierId,
			updates,
		}: {
			supplierId: string;
			updates: Partial<Supplier>;
		}) => updateSupplier(supplierId, updates),
		onSuccess: () => {
			// Invalidate the suppliers query to trigger a refetch
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		},
	});
}
