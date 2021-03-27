import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export interface UserCreateAttributes {
	email: string;
	dateOfBirth: Date;
}

export interface UserAttributes extends UserCreateAttributes {
	id: number;
}

@Entity()
export class User extends BaseEntity implements UserAttributes {
	@PrimaryGeneratedColumn()
	public id!: number;
	@Column({ type: "varchar", length: 255, nullable: false, unique: true })
	public email!: string;
	@Column({ type: "datetime", nullable: false })
	public dateOfBirth!: Date;
}
