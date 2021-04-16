import * as faker from "faker";
import { v4 as uuidv4 } from "uuid";
import { DateUtils } from "@libs/DateUtils";
import { UserRole } from "@type-utils";
import { AuthResponseObject } from "@app/auth/auth.controller";

export interface DummyUserAttributes extends AuthResponseObject {
	password: string;
}

export class DummyUser implements DummyUserAttributes {
	public email: string;
	public dateOfBirth: string;
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
			dateOfBirth: "1997-01-30",
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
