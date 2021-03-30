import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export interface UserCreateAttributes {
	email: string;
	password: string;
	dateOfBirth: Date;
	firebaseId: string;
}

export interface UserAttributes extends UserCreateAttributes {
	id: number;
}

@Entity()
export class User extends BaseEntity implements UserAttributes {
	@PrimaryGeneratedColumn()
	public id!: number;
	@Column({ type: "varchar", length: 255, nullable: false, unique: true })
	public firebaseId!: string;
	@Column({ type: "varchar", length: 255, nullable: false, unique: true })
	public email!: string;
	@Column({ type: "varchar", length: 255, nullable: false })
	public password!: string;
	@Column({ type: "datetime", nullable: false })
	public dateOfBirth!: Date;
}
