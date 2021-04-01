import * as firebaseAdmin from "firebase-admin";
import * as faker from "faker";

jest.mock("firebase-admin");
const firebaseAuthCreateUser = jest.fn(({ email }) => {
	return Promise.resolve({
		uid: faker.unique(faker.git.commitSha),
		email
	});
});
const firebaseAuthDeleteUser = jest.fn(() => Promise.resolve());
const firebaseAuth = jest.fn(() => ({
	createUser: firebaseAuthCreateUser,
	deleteUser: firebaseAuthDeleteUser
}));
const firebaseApp = {
	auth: firebaseAuth
};
(firebaseAdmin as jest.Mocked<
	typeof firebaseAdmin
>).initializeApp.mockReturnValue(firebaseApp as any);

export class MockFireBaseAuth {
	public static mock = () => {
		return new MockFireBaseAuth();
	};
	private firebaseAuthCreateUser: jest.Mock;
	private firebaseAuthDeleteUser: jest.Mock;
	private constructor() {
		this.firebaseAuthCreateUser = firebaseAuthCreateUser;
		this.firebaseAuthDeleteUser = firebaseAuthDeleteUser;
	}

	public reset = () => {
		this.firebaseAuthCreateUser.mockClear();
		this.firebaseAuthDeleteUser.mockClear();
	};

	public hasCreatedUser = (email: string, password: string) => {
		return this.firebaseAuthCreateUser.mock.calls.some((parameters) => {
			const { email: emailParam, password: passwordParam } = parameters[0];
			return email === emailParam && password === passwordParam;
		});
	};

	public hasDeletedUser = (uid: string) => {
		return this.firebaseAuthCreateUser.mock.calls.some((parameters) => {
			const uidParam = parameters[0];
			return uidParam === uid;
		});
	};
}
