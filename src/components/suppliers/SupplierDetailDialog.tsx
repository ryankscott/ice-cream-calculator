import { useEffect, useId, useReducer } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Supplier } from "@/lib/api/suppliers";
import { useUpdateSupplier } from "@/lib/hooks/useUpdateSupplier";
import { InfoGrid, InfoItem, Section } from "./dialog-helpers";
import { formatDateWithTime } from "./suppliers-table.utils";

interface SupplierDetailDialogProps {
	supplier: Supplier | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type SupplierFormState = {
	name: string;
	email: string;
	phone: string;
	address: string;
	website: string;
};

type SupplierFormAction =
	| { type: "setField"; field: keyof SupplierFormState; value: string }
	| { type: "reset"; supplier: Supplier | null };

const createStateFromSupplier = (
	supplier: Supplier | null,
): SupplierFormState => ({
	name: supplier?.name ?? "",
	email: supplier?.email ?? "",
	phone: supplier?.phone ?? "",
	address: supplier?.address ?? "",
	website: supplier?.website ?? "",
});

function supplierFormReducer(
	state: SupplierFormState,
	action: SupplierFormAction,
): SupplierFormState {
	switch (action.type) {
		case "setField":
			return { ...state, [action.field]: action.value };
		case "reset":
			return createStateFromSupplier(action.supplier);
		default:
			return state;
	}
}

export function SupplierDetailDialog({
	supplier,
	open,
	onOpenChange,
}: SupplierDetailDialogProps) {
	const [formState, dispatch] = useReducer(
		supplierFormReducer,
		supplier,
		createStateFromSupplier,
	);
	const { name, email, phone, address, website } = formState;

	const updateMutation = useUpdateSupplier();
	const supplierNameId = useId();
	const supplierEmailId = useId();
	const supplierPhoneId = useId();
	const supplierAddressId = useId();
	const supplierWebsiteId = useId();

	useEffect(() => {
		if (!open || !supplier) {
			return;
		}

		dispatch({ type: "reset", supplier });
	}, [open, supplier]);

	if (!supplier) return null;

	const handleSave = async () => {
		if (name.trim() === "") {
			// Don't save if name is empty
			return;
		}

		try {
			await updateMutation.mutateAsync({
				supplierId: supplier.id,
				updates: {
					name,
					email: email || null,
					phone: phone || null,
					address: address || null,
					website: website || null,
				},
			});
			toast.success(`${name} updated successfully`);
			onOpenChange(false);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update supplier";
			toast.error(errorMessage);
			console.error("Failed to update supplier:", error);
		}
	};

	const handleCancel = () => {
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Supplier</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 pb-20">
					<div>
						<label
							htmlFor={supplierNameId}
							className="text-sm font-medium mb-2 block"
						>
							Supplier Name
						</label>
						<Input
							id={supplierNameId}
							value={name}
							onChange={(event) =>
								dispatch({
									type: "setField",
									field: "name",
									value: event.target.value,
								})
							}
							autoFocus
							placeholder="Supplier name"
						/>
					</div>

					<div className="space-y-6">
						{/* Contact Information */}
						<Section title="Contact Information">
							<div className="space-y-4">
								<div>
									<label
										htmlFor={supplierEmailId}
										className="text-sm font-medium mb-2 block"
									>
										Email
									</label>
									<Input
										id={supplierEmailId}
										type="email"
										value={email}
										onChange={(event) =>
											dispatch({
												type: "setField",
												field: "email",
												value: event.target.value,
											})
										}
										placeholder="email@example.com"
									/>
								</div>

								<div>
									<label
										htmlFor={supplierPhoneId}
										className="text-sm font-medium mb-2 block"
									>
										Phone
									</label>
									<Input
										id={supplierPhoneId}
										value={phone}
										onChange={(event) =>
											dispatch({
												type: "setField",
												field: "phone",
												value: event.target.value,
											})
										}
										placeholder="+1 (555) 123-4567"
									/>
								</div>

								<div>
									<label
										htmlFor={supplierAddressId}
										className="text-sm font-medium mb-2 block"
									>
										Address
									</label>
									<Input
										id={supplierAddressId}
										value={address}
										onChange={(event) =>
											dispatch({
												type: "setField",
												field: "address",
												value: event.target.value,
											})
										}
										placeholder="123 Main St, City, State 12345"
									/>
								</div>

								<div>
									<label
										htmlFor={supplierWebsiteId}
										className="text-sm font-medium mb-2 block"
									>
										Website
									</label>
									<Input
										id={supplierWebsiteId}
										value={website}
										onChange={(event) =>
											dispatch({
												type: "setField",
												field: "website",
												value: event.target.value,
											})
										}
										placeholder="https://example.com"
									/>
								</div>
							</div>
						</Section>

						{/* Metadata */}
						<Section title="Metadata">
							<InfoGrid>
								<InfoItem
									label="Created"
									value={formatDateWithTime(supplier.createdAt)}
								/>
								<InfoItem
									label="Last Modified"
									value={formatDateWithTime(supplier.lastModifiedAt)}
								/>
								<InfoItem label="ID" value={supplier.id} />
							</InfoGrid>
						</Section>
					</div>
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={handleCancel}>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleSave}
						disabled={updateMutation.isPending}
					>
						{updateMutation.isPending ? "Saving..." : "Save changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
