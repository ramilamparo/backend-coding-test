import * as faker from "faker";
import { v4 as uuidv4 } from "uuid";
import { DateUtils } from "@libs/DateUtils";
import { UserRole } from "@type-utils";
import { AuthControllerGetResponse } from "@app/auth/auth.controller";

export interface DummyUserAttributes extends AuthControllerGetResponse {
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
		const uniqueId = uuidv4();
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
