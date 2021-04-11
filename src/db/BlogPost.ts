import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface BlogPostCreateAttributes {
	title: string;
	docId: string;
}

export interface BlogPostAttributes extends BlogPostCreateAttributes {
	id: number;
}

@Entity()
export class BlogPost extends BaseEntity implements BlogPostAttributes {
	@PrimaryGeneratedColumn()
	public id!: number;
	@Column({ type: "varchar", length: 255, nullable: false })
	public docId!: string;
	@Column({ type: "varchar", length: 255, nullable: false })
	public title!: string;
}
