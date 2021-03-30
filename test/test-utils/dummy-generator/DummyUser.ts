import * as faker from "faker";
import type { UserCreateAttributes } from "src/db/User";

export class DummyUser implements UserCreateAttributes {
	public email: string;
	public dateOfBirth: Date;
	public firebaseId: string;
	public password: string;

	constructor(attributes: UserCreateAttributes) {
		this.email = attributes.email;
		this.dateOfBirth = attributes.dateOfBirth;
		this.firebaseId = attributes.firebaseId;
		this.password = attributes.password;
	}

	public static createDummyData = (
		attributes?: Partial<UserCreateAttributes>
	) => {
		return new DummyUser({
			dateOfBirth: new Date(),
			email: faker.unique(faker.internet.email),
			firebaseId: faker.git.commitSha(),
			password: faker.internet.password(),
			...attributes
		});
	};
}
