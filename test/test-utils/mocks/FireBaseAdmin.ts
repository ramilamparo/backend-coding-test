import * as firebaseAdmin from "firebase-admin";
import * as faker from "faker";

export class MockFireBaseAuth {
	public static mock = () => {
		return new MockFireBaseAuth();
	};
	private firebaseAuthCreateUser: jest.Mock;
	private firebaseAuthDeleteUser: jest.Mock;
	private constructor() {
		jest.mock("firebase-admin");
		const firebaseAuthCreateUser = jest.fn(({ email }) => {
			return Promise.resolve({
				uid: faker.unique(faker.git.commitSha),
				email
			});
		});
		const firebaseAuthDeleteUser = jest.fn(() => Promise.resolve());
		const firebaseApp = {
			createUser: firebaseAuthCreateUser,
			deleteUser: firebaseAuthDeleteUser
		};
		(firebaseAdmin as jest.Mocked<
			typeof firebaseAdmin
		>).initializeApp.mockReturnValue(firebaseApp as any);

		this.firebaseAuthCreateUser = firebaseAuthCreateUser;
		this.firebaseAuthDeleteUser = firebaseAuthDeleteUser;
	}

	public reset = () => {
		this.firebaseAuthCreateUser.mockClear();
		this.firebaseAuthDeleteUser.mockClear();
	};

	public hasCreatedUser = (username: string, password: string) => {
		return this.firebaseAuthCreateUser.mock.calls.some((parameters) => {
			const {
				username: usernameParam,
				password: passwordParam
			} = parameters[0];
			return username === usernameParam && password === passwordParam;
		});
	};

	public hasDeletedUser = (uid: string) => {
		return this.firebaseAuthCreateUser.mock.calls.some((parameters) => {
			const uidParam = parameters[0];
			return uidParam === uid;
		});
	};
}
