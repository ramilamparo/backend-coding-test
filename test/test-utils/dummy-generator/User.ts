import * as faker from "faker";
import type { UserCreateAttributes } from "src/db/User";

export class User implements UserCreateAttributes {
	public email: string;
	public dateOfBirth: Date;

	constructor(attributes: UserCreateAttributes) {
		this.email = attributes.email;
		this.dateOfBirth = attributes.dateOfBirth;
	}

	public static createDummyData = (
		attributes?: Partial<UserCreateAttributes>
	) => {
		return new User({
			dateOfBirth: new Date(),
			email: faker.internet.email(),
			...attributes
		});
	};
}
