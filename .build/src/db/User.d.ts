import { UserRole } from "@type-utils";
import { BaseEntity } from "typeorm";
export interface UserCreateAttributes {
    email: string;
    dateOfBirth: Date;
    firebaseId: string;
    role: UserRole;
}
export interface UserAttributes extends UserCreateAttributes {
    id: number;
}
export declare class User extends BaseEntity implements UserAttributes {
    id: number;
    firebaseId: string;
    email: string;
    role: UserRole;
    dateOfBirth: Date;
}
