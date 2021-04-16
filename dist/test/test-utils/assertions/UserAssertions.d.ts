import { DateTypesToUnix } from "@type-utils*";
import { UserAttributes } from "src/db/User";
export declare abstract class UserAssertions {
    static expectIsUserAttributesEqualTo: (user1: Partial<DateTypesToUnix<UserAttributes>>, user2: Partial<DateTypesToUnix<UserAttributes>>) => void;
    static expectUserAttributesToNotHavePassword: (user: any) => void;
    static expectUserToHaveFirebaseId: (user: Partial<DateTypesToUnix<UserAttributes>>) => void;
    static expectUserToHaveUniqueId: (user: Partial<DateTypesToUnix<UserAttributes>>) => void;
}
