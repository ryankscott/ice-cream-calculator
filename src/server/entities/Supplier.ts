import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

import { Ingredient } from "./Ingredient";

@Entity({ name: "suppliers" })
export class Supplier {
	@PrimaryColumn("text")
	id!: string;

	@Column({ type: "text" })
	name!: string;

	@Column({ type: "text", nullable: true })
	email!: string | null;

	@Column({ type: "text", nullable: true })
	phone!: string | null;

	@Column({ type: "text", nullable: true })
	address!: string | null;

	@Column({ type: "text", nullable: true })
	website!: string | null;

	@Column({
		type: "text",
		name: "created_at",
		default: () => "datetime('now')",
	})
	createdAt!: string;

	@Column({
		type: "text",
		name: "last_modified_at",
		default: () => "datetime('now')",
	})
	lastModifiedAt!: string;

	@OneToMany(
		() => Ingredient,
		(ingredient) => ingredient.supplier,
	)
	ingredients!: Ingredient[];
}
