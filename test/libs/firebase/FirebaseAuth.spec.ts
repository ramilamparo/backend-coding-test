import { FirebaseAuthMock } from "@test-utils/mocks/FirebaseAuthMock";
import { DummyUser } from "@test-utils/dummy-generator/DummyUser";
import { FirebaseFactory } from "@libs/firebase/FirebaseFactory";

describe("FirebaseAuth", () => {
	const firebaseAuth = FirebaseFactory.getFirebaseAuth();
	afterEach(() => {
		FirebaseAuthMock.resetMocks();
	});

	it("Creates a new user", async () => {
		const dummyUser = DummyUser.createDummyData();

		const createdUser = await firebaseAuth.createUser(
			dummyUser.email,
			dummyUser.password
		);

		expect(createdUser.uid).toBeDefined();
		expect(createdUser.email).toEqual(dummyUser.email);
	});

	it("Reads users", async () => {
		const dummyUser = DummyUser.createDummyData();

		const createdUser = await firebaseAuth.createUser(
			dummyUser.email,
			dummyUser.password
		);

		const foundUser = await firebaseAuth.getUser(createdUser.uid);

		expect(foundUser.uid).toEqual(createdUser.uid);
		expect(foundUser.email).toEqual(createdUser.email);
	});

	it("Deletes a user", async () => {
		const dummyUser = DummyUser.createDummyData();

		const createdUser = await firebaseAuth.createUser(
			dummyUser.email,
			dummyUser.password
		);

		await firebaseAuth.deleteUser(createdUser.uid);

		const foundUser = await firebaseAuth.getUser(createdUser.uid);

		expect(foundUser).toBeUndefined();
	});
});
