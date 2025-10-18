import { useId, useState } from "react";
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
import { formatDateWithTime, hasContactInfo } from "./suppliers-table.utils";

interface SupplierDetailDialogProps {
	supplier: Supplier | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SupplierDetailDialog({
	supplier,
	open,
	onOpenChange,
}: SupplierDetailDialogProps) {
	const [editedName, setEditedName] = useState("");
	const [editedEmail, setEditedEmail] = useState("");
	const [editedPhone, setEditedPhone] = useState("");
	const [editedAddress, setEditedAddress] = useState("");
	const [editedWebsite, setEditedWebsite] = useState("");

	const updateMutation = useUpdateSupplier();
	const supplierNameId = useId();
	const supplierEmailId = useId();
	const supplierPhoneId = useId();
	const supplierAddressId = useId();
	const supplierWebsiteId = useId();

	if (!supplier) return null;

	const handleSave = async () => {
		if (editedName.trim() === "") {
			// Don't save if name is empty
			return;
		}

		try {
			await updateMutation.mutateAsync({
				supplierId: supplier.id,
				updates: {
					name: editedName,
					email: editedEmail || null,
					phone: editedPhone || null,
					address: editedAddress || null,
					website: editedWebsite || null,
				},
			});
			toast.success(`${editedName} updated successfully`);
			onOpenChange(false);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update supplier";
			toast.error(errorMessage);
			console.error("Failed to update supplier:", error);
		}
	};

	const handleCancel = () => {
		setEditedName("");
		setEditedEmail("");
		setEditedPhone("");
		setEditedAddress("");
		setEditedWebsite("");
		onOpenChange(false);
	};

	// Initialize edited fields when dialog opens
	if (open && !editedName) {
		setEditedName(supplier.name);
		setEditedEmail(supplier.email || "");
		setEditedPhone(supplier.phone || "");
		setEditedAddress(supplier.address || "");
		setEditedWebsite(supplier.website || "");
	}

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
							value={editedName}
							onChange={(e) => setEditedName(e.target.value)}
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
										value={editedEmail}
										onChange={(e) => setEditedEmail(e.target.value)}
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
										value={editedPhone}
										onChange={(e) => setEditedPhone(e.target.value)}
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
										value={editedAddress}
										onChange={(e) => setEditedAddress(e.target.value)}
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
										value={editedWebsite}
										onChange={(e) => setEditedWebsite(e.target.value)}
										placeholder="https://example.com"
									/>
								</div>
							</div>
						</Section>

						{/* Display Current Information */}
						{hasContactInfo(supplier) && (
							<Section title="Current Information">
								<InfoGrid>
									{supplier.email && (
										<InfoItem label="Email" value={supplier.email} />
									)}
									{supplier.phone && (
										<InfoItem label="Phone" value={supplier.phone} />
									)}
									{supplier.address && (
										<InfoItem label="Address" value={supplier.address} />
									)}
									{supplier.website && (
										<InfoItem label="Website" value={supplier.website} />
									)}
								</InfoGrid>
							</Section>
						)}

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
