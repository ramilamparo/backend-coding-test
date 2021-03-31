import { DateUtils } from "../../../src/libs/DateUtils";
import * as faker from "faker";
import { UserControllerGetResponse } from "../../../src/app/users/user.controller";

export interface DummyUserAttributes extends UserControllerGetResponse {
	password: string;
}

export class DummyUser implements DummyUserAttributes {
	public email: string;
	public dateOfBirth: number;
	public firebaseId: string;
	public password: string;
	public id: number;

	constructor(attributes: DummyUserAttributes) {
		this.email = attributes.email;
		this.dateOfBirth = attributes.dateOfBirth;
		this.firebaseId = attributes.firebaseId;
		this.password = attributes.password;
		this.id = attributes.id;
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
			...attributes
		});
	};
}
