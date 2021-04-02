import * as faker from "faker";
import { DateUtils } from "@libs/DateUtils";
import { UserRole } from "@type-utils";
import { UserControllerGetResponse } from "@app/users/user.controller";

export interface DummyUserAttributes extends UserControllerGetResponse {
	password: string;
}

export class DummyUser implements DummyUserAttributes {
	public email: string;
	public dateOfBirth: number;
	public firebaseId: string;
	public password: string;
	public role: UserRole;
	public id: number;

	constructor(attributes: DummyUserAttributes) {
		this.email = attributes.email;
		this.dateOfBirth = attributes.dateOfBirth;
		this.firebaseId = attributes.firebaseId;
		this.password = attributes.password;
		this.id = attributes.id;
		this.role = attributes.role;
	}

	public static createDummyData = (
		attributes?: Partial<DummyUserAttributes>
	) => {
		const email = faker.unique(faker.internet.email).toLowerCase();
		const uniqueId = faker.unique(faker.git.commitSha);
		return new DummyUser({
			dateOfBirth: DateUtils.dateToUnix(new Date()),
			id: DateUtils.dateToUnix(new Date()),
			password: uniqueId,
			email: email,
			firebaseId: uniqueId,
			role: DummyUser.getRandomRole(),
			...attributes
		});
	};

	private static getRandomRole = () => {
		return faker.random.arrayElement<UserRole>(["admin", "standard"]);
	};
}
