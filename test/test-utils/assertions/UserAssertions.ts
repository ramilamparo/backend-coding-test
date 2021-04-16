import { DateTypesToUnix } from "@type-utils";
import { UserAttributes } from "src/db/User";

export abstract class UserAssertions {
	public static expectIsUserAttributesEqualTo = (
		user1: Partial<DateTypesToUnix<UserAttributes>>,
		user2: Partial<DateTypesToUnix<UserAttributes>>
	) => {
		(Object.keys(user1) as Array<
			keyof Partial<DateTypesToUnix<UserAttributes>>
		>).forEach((key) => {
			expect(user1[key]).toStrictEqual(user2[key]);
		});
	};

	public static expectUserAttributesToNotHavePassword = (user: any) => {
		expect(user.password).toBeUndefined();
	};

	public static expectUserToHaveFirebaseId = (
		user: Partial<DateTypesToUnix<UserAttributes>>
	) => {
		expect(user.firebaseId).toBeDefined();
	};

	public static expectUserToHaveUniqueId = (
		user: Partial<DateTypesToUnix<UserAttributes>>
	) => {
		expect(user.id).toBeDefined();
	};
}
