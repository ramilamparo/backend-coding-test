import { UserRole } from "@type-utils*";
import { UserAttributes } from "../../db/User";
export declare class AuthService {
    createUser: (email: string, password: string, dateOfBirth: Date, role: UserRole) => Promise<UserAttributes>;
    signIn: (email: string, password: string) => Promise<{
        email: string;
        dateOfBirth: Date;
        role: UserRole;
        id: number;
        firebaseId: string;
        token: string;
    }>;
    private getUserByEmail;
}
