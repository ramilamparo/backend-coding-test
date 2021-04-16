import { UserRole } from "@type-utils";
import { AuthResponseObject } from "@app/auth/auth.controller";
export interface DummyUserAttributes extends AuthResponseObject {
    password: string;
}
export declare class DummyUser implements DummyUserAttributes {
    email: string;
    dateOfBirth: number;
    firebaseId: string;
    password: string;
    role: UserRole;
    id: number;
    constructor(attributes: DummyUserAttributes);
    static createDummyData: (attributes?: Partial<DummyUserAttributes> | undefined) => DummyUser;
    private static getRandomRole;
}
